# useAIQuota Testing Guide

## Manual Testing Checklist

### 1. Free User Testing
```bash
# In browser console after login as free user:
const quotaHook = useAIQuota(userId);
console.log('Free user quota:', quotaHook);

Expected:
- tierType: 'free'
- remaining: 30 (or 30 - current usage)
- resetAt: null
- canSend: true (if usage < 30)
```

### 2. Paid User Testing
```bash
# In browser console after login as paid user:
const quotaHook = useAIQuota(userId);
console.log('Paid user quota:', quotaHook);

Expected:
- tierType: 'paid'
- remaining: 30 (or 30 - current usage)
- resetAt: future ISO date string
- canSend: true (if usage < 30)
```

### 3. Reset Logic Testing (Paid Users)
```sql
-- In Supabase SQL editor, set reset time to past:
UPDATE user_profiles 
SET ai_daily_reset_at = NOW() - INTERVAL '1 hour',
    ai_messages_count = 25
WHERE user_id = 'your-user-id';
```

Then refresh the hook - should automatically:
- Reset ai_messages_count to 0
- Set new ai_daily_reset_at to NOW() + 24 hours
- Update quota display

### 4. Realtime Updates Testing
1. Open two browser tabs with same user
2. In tab 1, increment message count manually:
   ```sql
   UPDATE user_profiles 
   SET ai_messages_count = ai_messages_count + 1
   WHERE user_id = 'your-user-id';
   ```
3. Tab 2 should automatically update quota display

### 5. Error Handling Testing
```sql
-- Test with invalid user_id
SELECT * FROM user_profiles WHERE user_id = 'non-existent';
```

Expected: Hook should return error state gracefully

## Performance Benchmarks

### Expected Response Times
- Initial load: < 500ms
- Realtime update: < 100ms
- Reset operation: < 200ms

### Database Queries
- Should use single query to user_profiles
- No N+1 query problems
- Proper indexing on user_id column

## Integration Test Script

```typescript
// Run in browser console for full integration test
async function testAIQuota(userId: string) {
  console.log('Starting AI Quota integration test...');
  
  // Test 1: Basic load
  const { used, remaining, canSend, tierType } = useAIQuota(userId);
  console.log('✓ Basic load:', { used, remaining, canSend, tierType });
  
  // Test 2: Manual refresh
  refreshQuota();
  console.log('✓ Manual refresh triggered');
  
  // Test 3: Validate calculations
  const expectedRemaining = tierType === 'free' ? 30 - used : 30 - used;
  const calculationCorrect = remaining === expectedRemaining;
  console.log('✓ Calculation correct:', calculationCorrect);
  
  console.log('AI Quota integration test completed');
}
```

## Common Issues & Solutions

### Issue: Quota doesn't reset for paid users
**Solution**: Check ai_daily_reset_at is properly set and in UTC

### Issue: Realtime updates not working
**Solution**: Verify unique channel names and proper cleanup

### Issue: Performance slow
**Solution**: Check database indexes and query optimization

### Issue: Race conditions in reset
**Solution**: Verify atomic transaction operations

## Production Monitoring

### Metrics to Track
- Average quota usage per tier
- Reset operation success rate
- Realtime subscription health
- Query performance times

### Alerts to Set
- Failed reset operations
- Quota calculation errors
- Realtime disconnections
- Performance degradation 