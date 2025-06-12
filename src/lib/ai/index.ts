// AI Integration Module
// Centralized exports for all AI-related functionality

// Types (optimized for fix6.5.2 tree shaking)
export type {
  ChatMessage,
  ChatContext,
  AIQuotaStatus,
  AIError
} from './types'

// Vertex AI client (optimized for fix6.5.2 tree shaking)
export {
  createChatSession,
  generateStreamingResponse,
  configuredModel
} from './vertex'

// Context management
export {
  buildUserContext,
  formatContextForPrompt,
  getUserContextForAI,
  clearUserContextCache,
  clearAllContextCache
} from './context'

// System prompts
export {
  BASE_SYSTEM_PROMPT,
  createSystemPrompt,
  FALLBACK_PROMPT,
  RATE_LIMIT_MESSAGE,
  ERROR_MESSAGE,
  WELCOME_MESSAGE
} from './prompts' 