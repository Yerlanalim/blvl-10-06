import { createSSRClient } from '@/lib/supabase/server'
import { getUserContextForAI } from '@/lib/ai/context'
import { createSystemPrompt } from '@/lib/ai/prompts'
import { generateStreamingResponse } from '@/lib/ai/vertex'
import type { AIError } from '@/lib/ai/types'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // 1. Проверка авторизации
    const supabase = await createSSRClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // 2. Получение user_profile для проверки лимитов
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('ai_messages_count, tier_type, ai_daily_reset_at')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return Response.json(
        { error: 'Profile not found' }, 
        { status: 404 }
      )
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
      return Response.json(
        { 
          error: 'Rate limit exceeded',
          type: 'rate_limit',
          message: profile.tier_type === 'free' 
            ? 'You have reached your 30 message limit. Upgrade to paid plan for daily refresh.'
            : 'You have reached your daily limit of 30 messages. Try again tomorrow.'
        }, 
        { status: 429 }
      )
    }

    // 4. Извлечение сообщения пользователя
    const { message } = await req.json()
    
    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'Message is required' }, 
        { status: 400 }
      )
    }

    // 5. Построение контекста пользователя
    const userContext = await getUserContextForAI(user.id)
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
      return Response.json(
        { error: 'Internal server error' }, 
        { status: 500 }
      )
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
      return Response.json(
        { error: aiError.message }, 
        { status: 429 }
      )
    }
    
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
} 