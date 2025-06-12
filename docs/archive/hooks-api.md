# BizLevel Hooks API Documentation

## useUserProgress

Hook for tracking user progress through levels and lessons.

### Usage
```typescript
const { progressData, loading, error, refreshProgress } = useUserProgress(userId);
```

### Returns
- `progressData`: Current progress information
- `loading`: Boolean loading state
- `error`: Error message if any
- `refreshProgress`: Function to reload progress data

### Optimizations
- Uses single query with JOIN to avoid N+1 problems
- Implements realtime subscriptions with unique channel names
- Proper cleanup on unmount

## useUserArtifacts

Hook for managing user's unlocked learning materials artifacts.

### Usage
```typescript
const { artifactsData, loading, error, refreshArtifacts } = useUserArtifacts(userId);
```

### Parameters
- `userId` (string, optional): User ID to fetch artifacts for

### Returns
- `artifactsData`: Object containing:
  - `artifacts`: Array of LevelArtifacts sorted by level order
  - `artifactsByLevel`: Record mapping level ID to artifacts
  - `totalCount`: Total number of unlocked artifacts
- `loading`: Boolean indicating data fetching state
- `error`: Error message string if fetch fails
- `refreshArtifacts`: Function to manually reload artifacts

### Data Structure
```typescript
interface LevelArtifacts {
  level_id: number;
  level_title: string;
  level_order: number;
  artifact: ArtifactFile | null; // One artifact per level
}

interface ArtifactFile {
  id: string;
  file_id: string | null;
  file_name: string;
  file_path: string;
  unlocked_at: string;
  level_id: number;
}
```

### Features
- **Single query optimization**: Uses JOIN with levels table to get all data in one request
- **Realtime updates**: Subscribes to user_artifacts table changes with unique channel names
- **Error handling**: Comprehensive error catching with user-friendly messages
- **Performance**: Sorted results cached until data changes
- **SSR compatible**: Handles server-side rendering gracefully

## useAIQuota

Hook for tracking AI message limits and quota management with automatic reset logic for paid users.

### Usage
```typescript
const { used, remaining, canSend, resetAt, tierType, loading, error, refreshQuota } = useAIQuota(userId);
```

### Parameters
- `userId` (string, optional): User ID to fetch quota information for

### Returns
- `used`: Number of messages used in current period
- `remaining`: Number of messages remaining
- `canSend`: Boolean indicating if user can send more messages
- `resetAt`: ISO string of next reset time (null for free tier)
- `tierType`: User's tier ('free' | 'paid')
- `loading`: Boolean indicating data fetching state
- `error`: Error message string if fetch fails
- `refreshQuota`: Function to manually reload quota data

### Tier Logic
- **Free tier**: 30 total messages (no reset, permanent limit)
- **Paid tier**: 30 messages per day (resets every 24 hours automatically)

### Features
- **Automatic reset**: Paid users get daily quota reset without manual intervention
- **Realtime updates**: Subscribes to user_profiles changes for live quota updates
- **Transaction safety**: Uses atomic operations for quota reset to prevent race conditions
- **Timezone handling**: All reset times calculated in UTC for consistency
- **Error resilience**: Graceful fallback if reset operations fail

### Example Usage in Components
```typescript
// In storage page
const { artifactsData, loading, error } = useUserArtifacts(user?.id);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;

return (
  <div>
    {artifactsData?.artifacts.map(levelArtifact => (
      <LevelArtifactCard key={levelArtifact.level_id} data={levelArtifact} />
    ))}
  </div>
);
```

### Optimizations Applied
1. **useCallback** for all async functions to prevent unnecessary re-renders
2. **Unique channel names** with timestamp to avoid realtime subscription conflicts
3. **Single database query** with JOIN instead of multiple queries
4. **Proper cleanup** with unsubscribe on component unmount
5. **Error boundaries** with graceful fallbacks

## useLevelAccess

Hook for checking user access to specific levels based on tier and progress.

### Usage
```typescript
const { hasAccess, loading, error } = useLevelAccess(userId, levelId);
```

### Returns
- `hasAccess`: Boolean indicating if user can access the level
- `loading`: Boolean loading state
- `error`: Error message if any

### Access Rules
- Free tier: Levels 1-3 only
- Paid tier: All levels 1-10
- Sequential unlock: Previous level must be completed

## Performance Notes

All hooks are optimized for:
- Minimal re-renders using useCallback and proper dependencies
- Single database queries where possible
- Realtime subscriptions with proper cleanup
- SSR compatibility with window checks
- Error handling with graceful degradation

## Testing

Use test utilities from `src/lib/test-utils.ts`:
```typescript
import { validateArtifactStructure, checkPerformanceMetrics } from '@/lib/test-utils';

// Test data structure
const isValid = validateArtifactStructure(artifactsData);

// Test performance
const startTime = Date.now();
await loadArtifacts();
const performanceOK = checkPerformanceMetrics(startTime, 'artifacts-query');
``` 