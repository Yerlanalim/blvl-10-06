import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai'
import type { AIError } from './types'

// Vertex AI Configuration from environment
const projectId = process.env.VERTEX_AI_PROJECT_ID
const location = process.env.VERTEX_AI_LOCATION || 'us-central1'
const modelName = process.env.VERTEX_AI_MODEL || 'gemini-2.0-flash-001'

// Model parameters from environment or defaults
const temperature = parseFloat(process.env.AI_TEMPERATURE || '0.7')
const maxTokens = parseInt(process.env.AI_MAX_TOKENS || '1024')
const topP = parseFloat(process.env.AI_TOP_P || '0.8')
const topK = parseInt(process.env.AI_TOP_K || '40')

if (!projectId) {
  throw new Error('VERTEX_AI_PROJECT_ID is required in environment variables')
}

// Initialize Vertex AI client with Service Account from environment variables
// Optimized configuration for fix6.5 - faster response times
const vertexAI = new VertexAI({
  project: projectId,
  location: location,
  // Use environment variables instead of JSON file for credentials
  googleAuthOptions: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
      client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
      type: 'service_account',
      project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    }
  },
  // Add timeout configuration for faster responses
  apiEndpoint: `${location}-aiplatform.googleapis.com`
})

/**
 * Create a Vertex AI chat session
 * Uses the configured model with optimal settings for BizLevel
 */
export function createChatSession() {
  try {
    const model = vertexAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        topP,
        topK,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    })

    return model
  } catch (error) {
    console.error('Error creating Vertex AI chat session:', error)
    throw new Error('Failed to initialize AI chat session')
  }
}

/**
 * Generate streaming response from Vertex AI
 * Yields text chunks as they become available
 */
export async function* generateStreamingResponse(
  message: string,
  systemPrompt?: string
): AsyncGenerator<string, void, unknown> {
  try {
    const model = createChatSession()
    
    // Prepare the full message with system instruction
    const fullMessage = systemPrompt 
      ? `${systemPrompt}\n\nUser: ${message}`
      : message

    const chat = model.startChat({
      history: [],
    })

    const result = await chat.sendMessageStream(fullMessage)

    // Process streaming response
    for await (const response of result.stream) {
      const candidates = response.candidates
      if (candidates && candidates.length > 0) {
        const content = candidates[0].content
        if (content && content.parts) {
          for (const part of content.parts) {
            if (part.text) {
              yield part.text
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in streaming response:', error)
    throw createAIError(error)
  }
}

// generateResponse removed for fix6.5.2 tree shaking - only streaming is used

/**
 * Create standardized AI error with proper categorization
 */
function createAIError(error: unknown): AIError {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  
  // Check for common Vertex AI error patterns
  if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
    return {
      type: 'rate_limit',
      message: 'API rate limit exceeded. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }
  
  if (errorMessage.includes('authentication') || errorMessage.includes('permission')) {
    return {
      type: 'api_error',
      message: 'Authentication failed. Please check API configuration.',
      code: 'AUTH_ERROR'
    }
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return {
      type: 'network_error',
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR'
    }
  }

  if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
    return {
      type: 'invalid_input',
      message: 'Content was blocked by safety filters. Please rephrase your message.',
      code: 'SAFETY_FILTER'
    }
  }
  
  return {
    type: 'api_error',
    message: errorMessage,
    code: 'UNKNOWN_ERROR'
  }
}

// testConnection removed for fix6.5.2 tree shaking - not used in production

// Export the configured model name for reference
export const configuredModel = modelName 