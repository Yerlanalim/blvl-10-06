import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai'
import type { ChatResponse, AIError } from './types'

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

// Initialize Vertex AI client with Service Account
const vertexAI = new VertexAI({
  project: projectId,
  location: location,
  // Service account credentials will be loaded from GOOGLE_APPLICATION_CREDENTIALS
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

/**
 * Generate single response from Vertex AI
 * Returns complete response at once
 */
export async function generateResponse(
  message: string,
  systemPrompt?: string
): Promise<ChatResponse> {
  try {
    const model = createChatSession()
    
    // Prepare the full message with system instruction
    const fullMessage = systemPrompt 
      ? `${systemPrompt}\n\nUser: ${message}`
      : message

    const chat = model.startChat({
      history: [],
    })

    const result = await chat.sendMessage(fullMessage)
    const response = await result.response

    // Extract text from response
    let content = ''
    const candidates = response.candidates
    if (candidates && candidates.length > 0) {
      const candidate = candidates[0]
      if (candidate.content && candidate.content.parts) {
        content = candidate.content.parts
          .map(part => part.text || '')
          .join('')
      }
    }

    return {
      content,
      finishReason: candidates?.[0]?.finishReason,
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount || 0,
        completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata?.totalTokenCount || 0
      }
    }
  } catch (error) {
    console.error('Error in response generation:', error)
    throw createAIError(error)
  }
}

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

/**
 * Test Vertex AI connection
 * Verifies that the service is accessible and working
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await generateResponse('Test message for connection verification')
    return response.content.length > 0
  } catch (error) {
    console.error('Vertex AI connection test failed:', error)
    return false
  }
}

// Export the configured model name for reference
export const configuredModel = modelName 