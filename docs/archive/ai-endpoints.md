# AI Endpoints Documentation - Stage 4

## Overview
BizLevel AI integration provides a conversational assistant "Leo" to help users with business learning. The system uses Vertex AI with minimal context and efficient rate limiting.

## API Endpoints

### POST /api/chat

**Purpose**: Send message to AI assistant and receive streaming response

**Authentication**: Required (Supabase Auth)

**Rate Limiting**: 
- Free users: 30 total messages
- Paid users: 30 messages per day (resets every 24 hours)

**Request Format**:
```json
{
  "message": "How do I create a business plan?"
}
```

**Response Format**: Streaming text/plain
```
Hello! I'd be happy to help you with creating a business plan...
```

**Status Codes**:
- `200`: Success (streaming response)
- `400`: Invalid message format
- `401`: Unauthorized (not logged in)
- `404`: User profile not found
- `429`: Rate limit exceeded
- `500`: Internal server error

**Error Response Format**:
```json
{
  "error": "Rate limit exceeded",
  "type": "rate_limit", 
  "message": "You have reached your 30 message limit..."
}
```

## Context Formation

### Minimal Context Approach
The AI receives minimal context to optimize performance and token usage:

```javascript
{
  currentLevel: 3,
  currentLevelTitle: "Financial Planning",
  currentStep: "video", // 'text' | 'video' | 'test'
  completedLevels: [1, 2],
  tierType: "paid" // 'free' | 'paid'
}
```

### Context Caching
- 5-minute TTL to avoid repeated database queries
- Automatically clears when user progress changes
- Per-user cache keys to prevent conflicts

### Data Sources
Context is built from:
- `user_profiles`: current_level, tier_type, completed_lessons
- `levels`: level title
- `user_progress`: current step within level

## Rate Limiting Implementation

### Free Users
- Maximum 30 messages total
- No automatic reset
- Counter stored in `user_profiles.ai_messages_count`
- Must upgrade to paid plan to continue

### Paid Users  
- Maximum 30 messages per day
- Automatic reset every 24 hours
- Reset time stored in `user_profiles.ai_daily_reset_at`
- Counter resets to 0 when reset time passes

### Enforcement
1. Check current message count vs limit
2. For paid users, check if reset is needed
3. Perform atomic database update
4. Increment counter only after successful AI response

## Streaming Implementation

### Technology Stack
- **AI Provider**: Google Vertex AI (gemini-2.0-flash-001)
- **Streaming**: ReadableStream with TextEncoder
- **Client**: Fetch API with ReadableStream.getReader()

### Flow
1. User sends message via POST request
2. Server validates authentication and rate limits
3. Server builds minimal user context
4. Server calls Vertex AI with streaming enabled
5. Server forwards chunks to client via ReadableStream
6. Client assembles chunks and displays in real-time
7. Server updates message count after completion

### Error Handling
- Network errors: Retry with exponential backoff
- Stream interruption: Graceful cleanup and error message
- Rate limit exceeded: Clear error message with upgrade path
- Authentication failure: Redirect to login

## Performance Optimizations

### Database Queries
- Parallel queries for level title and progress
- Single query for user profile data
- 5-minute context caching to reduce DB load
- Atomic updates for message counting

### Frontend Optimizations
- useCallback for all event handlers
- useMemo for expensive calculations (quota display)
- Proper cleanup of streaming connections
- Efficient re-renders with dependency arrays

### Memory Management
- Automatic cleanup of streaming connections
- Cache eviction after TTL
- No conversation history stored client-side
- Minimal state management

## Security Considerations

### Authentication
- All requests require valid Supabase session
- User ID extracted from authenticated session
- No API keys exposed to client

### Rate Limiting
- Server-side enforcement only
- Database-backed counters (not memory)
- Atomic operations to prevent race conditions
- Clear error messages without sensitive info

### Context Privacy
- Only user's own progress included in context
- No access to other users' data
- Minimal context to reduce data exposure
- Context cached per-user only

## Monitoring and Logging

### Success Metrics
- Message response time < 2 seconds
- Streaming start time < 1 second
- Rate limit accuracy 100%
- Error rate < 1%

### Logged Events
- All API requests (anonymized)
- Rate limit violations
- Context building failures
- Streaming errors
- Authentication failures

### Error Tracking
- Vertex AI API errors
- Database connection issues
- Streaming interruptions
- Client-side JavaScript errors

## Usage Examples

### Basic Chat Interaction
```javascript
// Send message
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: 'What is a SWOT analysis?' 
  })
});

// Read streaming response
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value, { stream: true });
  displayChunk(chunk);
}
```

### Check User Quota
```javascript
import { useAIQuota } from '@/lib/hooks/useAIQuota';

function ChatComponent({ userId }) {
  const { used, remaining, canSend, tierType } = useAIQuota(userId);
  
  return (
    <div>
      <p>{remaining}/{30} messages remaining</p>
      <button disabled={!canSend}>Send Message</button>
    </div>
  );
}
```

### Handle Rate Limiting
```javascript
try {
  const response = await sendMessage(userMessage);
  // Handle success
} catch (error) {
  if (error.status === 429) {
    showUpgradePrompt();
  } else {
    showGenericError();
  }
}
```

## Testing

### Manual Testing Checklist
- [ ] Free user can send 30 messages then gets blocked
- [ ] Paid user gets daily reset at 24-hour mark
- [ ] Context includes correct user progress
- [ ] Streaming displays smoothly without lag
- [ ] Error messages are user-friendly
- [ ] Rate limit UI updates in real-time
- [ ] AI responses are relevant to user's level
- [ ] Authentication required for all requests

### Automated Tests
- Unit tests for rate limiting logic
- Integration tests for context formation
- E2E tests for complete chat workflow
- Performance tests for streaming response time
- Load tests for concurrent users

## Troubleshooting

### Common Issues

**"Rate limit exceeded" for new users**
- Check `ai_messages_count` in database
- Verify tier_type is set correctly
- Ensure user_profiles record exists

**Streaming stops mid-response**
- Check Vertex AI API quota
- Verify network connection stability
- Look for client-side JavaScript errors

**Context missing user progress**
- Verify user has completed levels
- Check user_progress table data
- Ensure context cache is not stale

**Authentication failures**
- Verify Supabase session is valid
- Check middleware is allowing the request
- Ensure user_id is correctly extracted

### Debug Mode
Set environment variable `AI_DEBUG=true` for verbose logging:
- All API requests and responses
- Context building steps
- Rate limiting calculations
- Streaming chunk details

---

*This documentation covers the complete AI integration as implemented in Stage 4 (Task 4.6). For development setup, see the main README.* 