import type { ChatContext } from './types'
import { createSSRClient } from '@/lib/supabase/server'

// Simple in-memory cache for context to avoid repeated DB queries within same session
const contextCache = new Map<string, { context: ChatContext; timestamp: number }>()
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes cache (increased from 5min for fix6.5)

/**
 * Build minimal context for AI assistant
 * Based on user's current progress and tier
 * Optimized to reduce database queries with caching
 */
export async function buildUserContext(userId: string): Promise<ChatContext | null> {
  // Input validation
  if (!userId || typeof userId !== 'string') {
    console.error('Invalid userId provided to buildUserContext')
    return null
  }

  // Check cache first
  const cached = contextCache.get(userId)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.context
  }

  try {
    const supabase = await createSSRClient()
    
    // First get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('current_level, tier_type, completed_lessons')
      .eq('user_id', userId)
      .single()
    
    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError)
      return null
    }
    
    // Validate profile data
    if (!profile.current_level || !profile.tier_type) {
      console.error('Invalid profile data for user:', userId)
      return null
    }
    
    // Get level title and current progress in parallel queries
    const [levelResult, progressResult] = await Promise.all([
      supabase
        .from('levels')
        .select('title')
        .eq('id', profile.current_level)
        .single(),
      supabase
        .from('user_progress')
        .select('current_step')
        .eq('user_id', userId)
        .eq('level_id', profile.current_level)
        .single()
    ])
    
    // Extract level title with fallback
    const levelTitle = levelResult.data?.title || `Level ${profile.current_level}`
    
    // Determine current step type
    let currentStep: 'text' | 'video' | 'test' = 'text'
    if (progressResult.data && progressResult.data.current_step) {
      // Step 1 = text, Step 2 = video, Step 3 = test
      if (progressResult.data.current_step === 2) currentStep = 'video'
      else if (progressResult.data.current_step === 3) currentStep = 'test'
    }
    
    const context: ChatContext = {
      currentLevel: profile.current_level,
      currentLevelTitle: levelTitle,
      currentStep,
      completedLevels: profile.completed_lessons || [],
      tierType: profile.tier_type as 'free' | 'paid'
    }

    // Cache the result
    contextCache.set(userId, { context, timestamp: Date.now() })
    
    return context
  } catch (error) {
    console.error('Error building user context:', error)
    return null
  }
}

/**
 * Clear context cache for a user (useful when progress changes)
 */
export function clearUserContextCache(userId: string): void {
  if (userId) {
    contextCache.delete(userId)
  }
}

/**
 * Clear all context cache (useful for cleanup)
 */
export function clearAllContextCache(): void {
  contextCache.clear()
}

/**
 * Format context for AI prompt
 * Creates a minimal context string for the system prompt (optimized for fix6.5)
 */
export function formatContextForPrompt(context: ChatContext): string {
  // Minimal context to reduce token usage and improve response time
  const stepText = {
    text: 'reading',
    video: 'watching', 
    test: 'testing'
  }[context.currentStep]
  
  // Compact format to reduce token count
  return `Context: L${context.currentLevel}(${context.currentLevelTitle}) ${stepText}, ${context.tierType}, completed: ${context.completedLevels.length}`
}

/**
 * Get user context and format for AI
 * One-step function to get formatted context
 */
export async function getUserContextForAI(userId: string): Promise<string | null> {
  try {
    const context = await buildUserContext(userId)
    if (!context) return null
    
    return formatContextForPrompt(context)
  } catch (error) {
    console.error('Error getting user context for AI:', error)
    return null
  }
} 