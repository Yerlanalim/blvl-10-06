# Payment Stub System Guide

## Overview

BizLevel currently uses a **payment stub system** for development and testing. This allows us to simulate payment processing without integrating with a real payment provider like Stripe or Paddle.

## How It Works

### 1. Payment Interface (`/src/lib/payments/interface.ts`)
- Abstract interface that any payment provider can implement
- Defines methods: `createCheckout()`, `cancelSubscription()`, `getSubscriptionStatus()`
- Type-safe with TypeScript interfaces

### 2. Stub Implementation (`/src/lib/payments/stub.ts`)
- Mock implementation for development
- In dev mode: instantly "completes" payments and updates user tier
- Logs all operations to console for debugging
- Updates user tier directly in Supabase database

### 3. Upgrade Page (`/app/upgrade`)
- Beautiful tier comparison UI
- Shows current plan status
- Handles both upgrade and downgrade flows
- Clear messaging about development mode

## Tier Configuration

### Free Tier
- Access to first 3 business levels (1-3)
- 30 AI assistant messages **total**
- Basic learning materials
- Community support

### Premium Tier ($29/month)
- Access to all 10 business levels
- 30 AI assistant messages **per day** (resets daily)
- Premium learning materials & templates
- Completion certificates
- Priority support

## Testing Instructions

### Test Account Available
- **Email**: `deus2111@gmail.com`
- **Current Status**: Premium tier (for testing downgrade)
- **Level**: 5
- **AI Messages Used**: 12/30 today

### Testing Upgrade Flow
1. Downgrade account to free tier first (use upgrade page)
2. Navigate to `/app/upgrade`
3. Click "Upgrade to Premium"
4. Should see success message and redirect to levels

### Testing Downgrade Flow
1. Ensure account is on premium tier
2. Navigate to `/app/upgrade`
3. Click "Downgrade to Free"
4. Should see success message and redirect to levels

### Verification Steps
- Check `/app/levels` - free users see only 3 levels, premium see all 10
- Check AI quota in `/app/chat` - different limits based on tier
- Check navigation - Crown icons should reflect tier status

## API Usage

```typescript
import { paymentProvider } from '@/lib/payments/stub';

// Create checkout (upgrade user)
const checkout = await paymentProvider.createCheckout(userId, 'paid');

// Cancel subscription (downgrade user)
await paymentProvider.cancelSubscription(userId);

// Get subscription status
const status = await paymentProvider.getSubscriptionStatus(userId);
```

## Database Updates

The stub automatically updates these fields in `user_profiles`:
- `tier_type`: 'free' | 'paid'
- `ai_messages_count`: Reset to 0 on tier change
- `ai_daily_reset_at`: Set to current time for paid users

## Future Migration

### Adding Real Payment Provider
1. Create new implementation of `PaymentProvider` interface
2. Replace `paymentProvider` import in components
3. Add webhook handlers for real payment events
4. Update environment variables

### Supported Providers (planned)
- **Stripe**: Full subscription management
- **Paddle**: European-friendly payments
- **LemonSqueezy**: Simple setup for digital products

## Development Notes

### Logging
All payment operations are logged to console:
```
[PaymentStub] Creating checkout for user xxx, tier: paid
[PaymentStub] Successfully updated user xxx to paid tier
```

### Error Handling
- Database errors are caught and logged
- User sees friendly error messages
- Failed operations don't leave user in inconsistent state

### Environment Variables
No payment-specific environment variables needed for stub.
Future providers will require:
- API keys
- Webhook secrets
- Product IDs

## Security Considerations

### Current (Stub)
- Only updates tier_type in database
- No real money handling
- Safe for development/staging

### Future (Real Payments)
- Webhook signature verification required
- Idempotency for payment events
- Secure API key management
- PCI compliance considerations

## Troubleshooting

### Common Issues

**"Payment system coming soon" message**
- Expected in production mode
- Stub only auto-completes in development

**User tier not updating**
- Check browser console for error logs
- Verify user_id exists in database
- Check Supabase RLS policies

**Navigation not reflecting tier**
- Hard refresh page after tier change
- Check useTierAccess hook for caching issues

### Debug Commands

```sql
-- Check user tier
SELECT user_id, tier_type, ai_messages_count 
FROM user_profiles 
WHERE user_id = 'USER_ID';

-- Reset to free tier
UPDATE user_profiles 
SET tier_type = 'free', ai_messages_count = 0 
WHERE user_id = 'USER_ID';

-- Reset to paid tier  
UPDATE user_profiles 
SET tier_type = 'paid', ai_messages_count = 0, ai_daily_reset_at = NOW() 
WHERE user_id = 'USER_ID';
``` 