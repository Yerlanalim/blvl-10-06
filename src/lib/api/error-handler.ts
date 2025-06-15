import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export interface APIError {
  error: string;
  type?: 'validation' | 'authentication' | 'authorization' | 'rate_limit' | 'server_error' | 'network' | 'not_found';
  message?: string;
  requestId?: string;
  timestamp?: string;
  details?: Record<string, any>;
}

export interface APISuccess<T = any> {
  success: true;
  data: T;
  requestId?: string;
  timestamp?: string;
}

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Rate limiting for errors (prevent spam)
const errorRateLimit = new Map<string, { count: number; firstSeen: number }>();

function checkErrorRateLimit(identifier: string): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxErrors = 10; // Max 10 errors per minute per identifier

  const existing = errorRateLimit.get(identifier);
  
  if (!existing) {
    errorRateLimit.set(identifier, { count: 1, firstSeen: now });
    return true;
  }

  // Reset if window expired
  if (now - existing.firstSeen > windowMs) {
    errorRateLimit.set(identifier, { count: 1, firstSeen: now });
    return true;
  }

  // Check if within limit
  if (existing.count >= maxErrors) {
    return false;
  }

  existing.count++;
  return true;
}

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  const windowMs = 60000;
  
  for (const [key, value] of errorRateLimit.entries()) {
    if (now - value.firstSeen > windowMs) {
      errorRateLimit.delete(key);
    }
  }
}, 60000); // Clean every minute

export class APIErrorHandler {
  private requestId: string;
  private timestamp: string;

  constructor() {
    this.requestId = generateRequestId();
    this.timestamp = new Date().toISOString();
  }

  // Success response
  success<T>(data: T, status: number = 200): NextResponse<APISuccess<T>> {
    return NextResponse.json({
      success: true,
      data,
      requestId: this.requestId,
      timestamp: this.timestamp,
    }, { status });
  }

  // Error response
  error(
    error: string,
    status: number = 500,
    type?: APIError['type'],
    details?: Record<string, any>
  ): NextResponse<APIError> {
    // Get client identifier for rate limiting
    const identifier = `unknown_${Date.now()}`; // Simplified for now

    // Check rate limit
    if (!checkErrorRateLimit(identifier)) {
      return NextResponse.json({
        error: 'Too many errors',
        type: 'rate_limit',
        message: 'Rate limit exceeded for error responses. Please try again later.',
        requestId: this.requestId,
        timestamp: this.timestamp,
      }, { status: 429 });
    }

    // Log error (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API Error ${this.requestId}]`, {
        error,
        type,
        status,
        details,
        identifier: identifier.substring(0, 20) + '...',
      });
    }

    // Create error response
    const errorResponse: APIError = {
      error,
      type,
      requestId: this.requestId,
      timestamp: this.timestamp,
    };

    // Add user-friendly message based on error type
    switch (type) {
      case 'validation':
        errorResponse.message = 'The request contains invalid data. Please check your input and try again.';
        break;
      case 'authentication':
        errorResponse.message = 'Authentication required. Please log in and try again.';
        break;
      case 'authorization':
        errorResponse.message = 'You do not have permission to perform this action.';
        break;
      case 'rate_limit':
        errorResponse.message = 'Too many requests. Please wait before trying again.';
        break;
      case 'network':
        errorResponse.message = 'Network error occurred. Please check your connection and try again.';
        break;
      case 'not_found':
        errorResponse.message = 'The requested resource was not found.';
        break;
      case 'server_error':
      default:
        errorResponse.message = 'An internal server error occurred. Our team has been notified.';
        break;
    }

    // Add details in development
    if (process.env.NODE_ENV === 'development' && details) {
      errorResponse.details = details;
    }

    return NextResponse.json(errorResponse, { status });
  }

  // Validation error
  validation(message: string, details?: Record<string, any>): NextResponse<APIError> {
    return this.error(message, 400, 'validation', details);
  }

  // Authentication error
  unauthorized(message: string = 'Unauthorized'): NextResponse<APIError> {
    return this.error(message, 401, 'authentication');
  }

  // Authorization error
  forbidden(message: string = 'Forbidden'): NextResponse<APIError> {
    return this.error(message, 403, 'authorization');
  }

  // Not found error
  notFound(message: string = 'Not found'): NextResponse<APIError> {
    return this.error(message, 404, 'not_found');
  }

  // Rate limit error
  rateLimit(message: string = 'Rate limit exceeded'): NextResponse<APIError> {
    return this.error(message, 429, 'rate_limit');
  }

  // Internal server error
  internal(message: string = 'Internal server error', details?: Record<string, any>): NextResponse<APIError> {
    return this.error(message, 500, 'server_error', details);
  }

  // Network error
  network(message: string = 'Network error'): NextResponse<APIError> {
    return this.error(message, 502, 'network');
  }
}

// Helper function to create error handler instance
export function createErrorHandler(): APIErrorHandler {
  return new APIErrorHandler();
}

// Global error wrapper for API routes
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse<any>>
): (...args: T) => Promise<NextResponse<any>> {
  return async (...args: T): Promise<NextResponse<any>> => {
    const errorHandler = createErrorHandler();
    
    try {
      return await handler(...args);
    } catch (error) {
      console.error(`[API Error] Unhandled error:`, error);
      
      // Handle different error types
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          return errorHandler.network(`Network error: ${error.message}`);
        }
        if (error.message.includes('rate limit')) {
          return errorHandler.rateLimit(error.message);
        }
        if (error.message.includes('unauthorized') || error.message.includes('auth')) {
          return errorHandler.unauthorized(error.message);
        }
        
        return errorHandler.internal(error.message, {
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
      
      return errorHandler.internal('An unexpected error occurred');
    }
  };
}

// Graceful degradation helper
export function withGracefulDegradation<T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  operationName: string = 'operation'
): Promise<T> {
  return operation().catch((error) => {
    console.warn(`[Graceful Degradation] ${operationName} failed, using fallback:`, error.message);
    return fallbackValue;
  });
} 