// AI Integration Module
// Centralized exports for all AI-related functionality

// Types
export type {
  ChatMessage,
  ChatContext,
  ChatResponse,
  AIQuotaStatus,
  AIError
} from './types'

// Vertex AI client
export {
  createChatSession,
  generateStreamingResponse,
  generateResponse,
  testConnection,
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