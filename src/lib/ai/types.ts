// AI Integration Types
// Using type aliases instead of empty interfaces (Stage 3 lesson)

/**
 * Chat message structure
 */
export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

/**
 * Minimal context for AI assistant
 * Based on user's current progress and tier
 */
export type ChatContext = {
  currentLevel: number
  currentLevelTitle: string
  currentStep: 'text' | 'video' | 'test'
  completedLevels: number[]
  tierType: 'free' | 'paid'
}

/**
 * AI response structure
 */
export type ChatResponse = {
  content: string
  finishReason?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * Rate limiting status
 */
export type AIQuotaStatus = {
  used: number
  remaining: number
  canSend: boolean
  resetAt?: Date
}

/**
 * Error types for AI operations
 */
export type AIError = {
  type: 'rate_limit' | 'api_error' | 'network_error' | 'invalid_input'
  message: string
  code?: string
} 