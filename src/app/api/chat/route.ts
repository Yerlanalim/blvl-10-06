import { createSSRClient } from '@/lib/supabase/server'
import { getUserContextForAI } from '@/lib/ai/context'
import { createSystemPrompt } from '@/lib/ai/prompts'
import { generateStreamingResponse } from '@/lib/ai/vertex'
import type { AIError } from '@/lib/ai/types'
import { createErrorHandler, withGracefulDegradation } from '@/lib/api/error-handler'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const errorHandler = createErrorHandler();
  
  try {
    // 1. Проверка авторизации
    const supabase = await createSSRClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return errorHandler.unauthorized('Authentication required to access AI assistant');
    }

    // 2. Получение user_profile для проверки лимитов
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('ai_messages_count, tier_type, ai_daily_reset_at')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return errorHandler.notFound('User profile not found');
    }

    // 3. Rate limiting logic
    const now = new Date()
    let currentCount = profile.ai_messages_count
    let needsReset = false

    if (profile.tier_type === 'paid') {
      // Для paid users: проверяем нужен ли сброс (каждые 24 часа)
      const resetAt = new Date(profile.ai_daily_reset_at)
      if (now > resetAt) {
        needsReset = true
        currentCount = 0
      }
    }

    // Проверка лимитов
    const maxMessages = 30
    if (currentCount >= maxMessages) {
      const message = profile.tier_type === 'free' 
        ? 'You have reached your 30 message limit. Upgrade to paid plan for daily refresh.'
        : 'You have reached your daily limit of 30 messages. Try again tomorrow.';
      return errorHandler.rateLimit(message);
    }

    // 4. Извлечение сообщения пользователя
    const { message } = await req.json()
    
    if (!message || typeof message !== 'string') {
      return errorHandler.validation('Message is required and must be a string', {
        received: typeof message,
        messageLength: message?.length || 0
      });
    }

    // 5. Построение контекста пользователя с graceful degradation
    const userContext = await withGracefulDegradation(
      () => getUserContextForAI(user.id),
      undefined, // fallback to undefined context
      'getUserContextForAI'
    );
    const systemPrompt = createSystemPrompt(userContext || undefined)

    // 6. Обновление счетчика перед ответом (транзакция)
    const updateData: {
      ai_messages_count: number
      updated_at: string
      ai_daily_reset_at?: string
    } = {
      ai_messages_count: needsReset ? 1 : currentCount + 1,
      updated_at: now.toISOString()
    }

    if (needsReset) {
      // Устанавливаем новое время сброса (через 24 часа)
      const nextReset = new Date(now)
      nextReset.setDate(nextReset.getDate() + 1)
      updateData.ai_daily_reset_at = nextReset.toISOString()
    }

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating message count:', updateError)
      return errorHandler.internal('Failed to update message count', {
        supabaseError: updateError.message,
        userId: user.id
      });
    }

    // 7. Создание streaming ответа
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const encoder = new TextEncoder()
          
          for await (const chunk of generateStreamingResponse(message, systemPrompt)) {
            controller.enqueue(encoder.encode(chunk))
          }
          
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('API route error:', error)
    
    // Определяем тип ошибки
    const aiError = error as AIError
    
    if (aiError.type === 'rate_limit') {
      return errorHandler.rateLimit(aiError.message || 'AI service rate limit exceeded');
    }
    
    if (aiError.type === 'network') {
      return errorHandler.network(aiError.message || 'AI service network error');
    }
    
    // Generic error with details
    return errorHandler.internal('Unexpected error occurred', {
      errorType: aiError.type,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 