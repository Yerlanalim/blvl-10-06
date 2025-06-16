# Email Notifications System - BizLevel

## Overview

BizLevel email notification system provides automated educational emails to enhance user engagement and learning experience. The system includes 4 types of notifications:

1. **Welcome Email** - Sent after email verification
2. **Level Complete Email** - Sent when user completes a level
3. **AI Quota Reminder** - Sent when AI messages drop below 5
4. **Weekly Progress** - Sent weekly with learning summary

## Architecture

```
Email Templates (src/lib/email/templates/)
├── welcome.ts
├── level-complete.ts
├── ai-quota-reminder.ts
└── weekly-progress.ts

Email Core (src/lib/email/)
└── send.ts - Main sending functions

API Routes (src/app/api/email/)
├── send/route.ts - General email sending
├── unsubscribe/route.ts - Opt-out handling
└── weekly-progress/route.ts - Cron job endpoint

Integration Points
├── Auth Callback - Welcome email
├── CompletionScreen - Level complete
├── useAIQuota - Quota reminder
└── Weekly Cron - Progress summary
```

## Configuration

### Environment Variables

```bash
# Required for email sending
RESEND_API_KEY=re_[your_resend_api_key]

# Required for cron job authentication
CRON_SECRET=bizlevel_cron_secret_2025

# App URL for links in emails
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Schema

The system uses these columns in `user_profiles`:

```sql
-- Email preferences
email_notifications BOOLEAN DEFAULT TRUE

-- Email tracking
welcome_email_sent BOOLEAN DEFAULT FALSE
ai_quota_reminder_sent BOOLEAN DEFAULT FALSE
```

## Email Types

### 1. Welcome Email

**Trigger**: After successful email verification
**Location**: `src/app/api/auth/callback/route.ts`
**Content**: 
- Welcome message
- Platform overview
- Free tier benefits
- Call-to-action to start Level 1

**Test**: 
```bash
# Manual trigger via auth flow
# OR test via API
curl "http://localhost:3000/api/email/send?type=welcome&email=test@example.com&firstName=Test"
```

### 2. Level Complete Email

**Trigger**: When CompletionScreen component loads
**Location**: `src/components/lesson/CompletionScreen.tsx`
**Content**:
- Congratulations message
- Level summary
- Progress statistics
- Next level preview
- Artifacts unlocked
- Upgrade CTA (if needed)

**Test**:
```bash
curl "http://localhost:3000/api/email/send?type=level-complete&email=test@example.com&firstName=Test"
```

### 3. AI Quota Reminder

**Trigger**: When remaining AI messages ≤ 5
**Location**: `src/lib/hooks/useAIQuota.ts`
**Content**:
- Messages remaining count
- Reset information (daily for paid, none for free)
- Usage tips
- Upgrade CTA (for free users)

**Test**:
```bash
# Free user
curl "http://localhost:3000/api/email/send?type=ai-quota-reminder&email=test@example.com&firstName=Test&tier=free"

# Paid user
curl "http://localhost:3000/api/email/send?type=ai-quota-reminder&email=test@example.com&firstName=Test&tier=paid"
```

### 4. Weekly Progress

**Trigger**: Weekly cron job
**Location**: `src/app/api/email/weekly-progress/route.ts`
**Content**:
- Weekly activity summary
- Total progress overview
- Current level status
- AI usage statistics
- Encouragement messages
- Continue learning CTA

**Test**:
```bash
# Test single email
curl "http://localhost:3000/api/email/weekly-progress?email=test@example.com"

# Production cron job
curl -X POST "http://localhost:3000/api/email/weekly-progress" \
  -H "Authorization: Bearer bizlevel_cron_secret_2025"
```

## Testing Guide

### 1. Local Development Testing

Start the development server:
```bash
npm run dev
```

Test each email type using the GET endpoints:

```bash
# Welcome email
curl "http://localhost:3000/api/email/send?type=welcome&email=your-email@example.com&firstName=YourName"

# Level complete email
curl "http://localhost:3000/api/email/send?type=level-complete&email=your-email@example.com&firstName=YourName"

# AI quota reminder (free user)
curl "http://localhost:3000/api/email/send?type=ai-quota-reminder&email=your-email@example.com&firstName=YourName&tier=free"

# AI quota reminder (paid user)
curl "http://localhost:3000/api/email/send?type=ai-quota-reminder&email=your-email@example.com&firstName=YourName&tier=paid"

# Weekly progress
curl "http://localhost:3000/api/email/weekly-progress?email=your-email@example.com"
```

### 2. Integration Testing

**Welcome Email Flow**:
1. Register new account
2. Verify email via link
3. Should receive welcome email automatically

**Level Complete Flow**:
1. Complete a lesson (reach CompletionScreen)
2. Should receive level complete email automatically

**AI Quota Reminder Flow**:
1. Use AI chat until remaining messages ≤ 5
2. Should receive quota reminder email automatically
3. Reminder won't send again until quota resets

### 3. Production Testing

Use Vercel environment or production deployment:

```bash
# Replace with your production URL
export PROD_URL="https://bizlevel.vercel.app"

# Test welcome email
curl "$PROD_URL/api/email/send?type=welcome&email=test@example.com&firstName=Test"
```

## Cron Job Setup

### Vercel Cron

Create `vercel.json` in project root:

```json
{
  "crons": [
    {
      "path": "/api/email/weekly-progress",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

This runs every Monday at 9 AM UTC.

### External Cron Services

You can use services like:
- **Cron-job.org**
- **EasyCron**
- **GitHub Actions**

Example with cron-job.org:
- URL: `https://your-domain.com/api/email/weekly-progress`
- Method: POST
- Headers: `Authorization: Bearer bizlevel_cron_secret_2025`
- Schedule: `0 9 * * 1` (Monday 9 AM)

### GitHub Actions Cron

Create `.github/workflows/weekly-email.yml`:

```yaml
name: Weekly Progress Emails
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 9 AM UTC
  workflow_dispatch:

jobs:
  send-emails:
    runs-on: ubuntu-latest
    steps:
      - name: Send Weekly Progress Emails
        run: |
          curl -X POST "${{ secrets.APP_URL }}/api/email/weekly-progress" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Monitoring and Debugging

### Console Logs

The system logs all email operations:

```bash
# Success logs
[AUTH_CALLBACK] Welcome email sent to user@example.com
[COMPLETION] Level complete email sent for level 2
[AI_QUOTA] Quota reminder email sent (3 remaining)
[WEEKLY_PROGRESS] Email sent to user@example.com

# Error logs
[EMAIL_SEND] Failed to send email: API key invalid
[WEEKLY_PROGRESS] Error processing user 123: Profile not found
```

### Error Handling

- **Invalid API Key**: Check `RESEND_API_KEY` in environment
- **User Opted Out**: Email skipped, logged as "User has opted out"
- **Missing User Data**: Gracefully handled, uses email prefix as name
- **Rate Limiting**: 100ms delay between emails in cron job

### Opt-out Handling

Users can unsubscribe via:
1. **Unsubscribe link** in emails
2. **GET**: `/api/email/unsubscribe?email=user@example.com`
3. **POST**: `/api/email/unsubscribe` with `{email: "user@example.com"}`

Sets `email_notifications = false` in user profile.

## Performance Considerations

### Email Volume Limits

- **Free Resend**: 3,000 emails/month
- **Paid Resend**: 50,000+ emails/month
- **Rate Limiting**: 100ms delay between sends

### Database Optimization

- Indexes on email notification flags
- Efficient queries with SELECT specific columns
- Batch processing for weekly emails

### Caching

- User context cached for 5 minutes
- Email templates are static (compiled)
- Unsubscribe status checked per send

## Security

### Authentication

- **API Routes**: Check user profile opt-in status
- **Cron Jobs**: Require `CRON_SECRET` bearer token
- **Unsubscribe**: No auth needed (public endpoint)

### Data Privacy

- Email addresses never logged in plain text
- User data minimized (only required fields)
- Immediate opt-out honored
- GDPR compliant unsubscribe

## Customization

### Adding New Email Types

1. **Create Template**: `src/lib/email/templates/your-email.ts`
2. **Update Types**: Add to `EmailType` union in `send.ts`
3. **Add Generator**: Function in `generateEmailHTML()`
4. **Add Helper**: Convenience function like `sendYourEmail()`
5. **Integrate**: Call from appropriate component/hook

### Template Styling

Templates use inline CSS for maximum email client compatibility:

- **Colors**: Primary blue (#2563eb), success green (#10b981)
- **Layout**: Single column, max-width 600px
- **Typography**: System fonts for reliability
- **Responsive**: Mobile-friendly design

### Content Customization

Edit template files to customize:
- **Copy**: Welcome messages, CTAs, descriptions
- **Branding**: Colors, logos, styling
- **Links**: Deep links to specific app sections
- **Localization**: Multi-language support

## Troubleshooting

### Common Issues

**Emails not sending**:
1. Check `RESEND_API_KEY` is valid
2. Verify environment variables loaded
3. Check console logs for errors
4. Test with simple curl command

**User not receiving emails**:
1. Check spam folder
2. Verify email address is correct
3. Check if user opted out (`email_notifications = false`)
4. Test with known working email

**Cron job not running**:
1. Verify cron expression is correct
2. Check `CRON_SECRET` matches
3. Test endpoint manually with curl
4. Check service provider logs

**Template rendering issues**:
1. Email clients have limited CSS support
2. Use inline styles only
3. Test with multiple clients
4. Avoid complex layouts

### Debug Commands

```bash
# Check user email preferences
curl "http://localhost:3000/api/email/send" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"type":"welcome","to":"user@example.com","firstName":"Test"}'

# Test unsubscribe
curl "http://localhost:3000/api/email/unsubscribe?email=user@example.com"

# Manual weekly progress
curl -X POST "http://localhost:3000/api/email/weekly-progress" \
  -H "Authorization: Bearer bizlevel_cron_secret_2025"
```

## Production Checklist

- [ ] `RESEND_API_KEY` configured with valid key
- [ ] `CRON_SECRET` set to secure random string
- [ ] `NEXT_PUBLIC_APP_URL` points to production domain
- [ ] Database columns `email_notifications`, `welcome_email_sent`, `ai_quota_reminder_sent` exist
- [ ] Cron job scheduled for weekly progress emails
- [ ] Test all 4 email types manually
- [ ] Verify unsubscribe flow works
- [ ] Monitor email delivery rates
- [ ] Set up error alerting for cron failures

## Future Enhancements

- **Email Analytics**: Track open rates, click rates
- **Advanced Personalization**: Dynamic content based on progress
- **Drip Campaigns**: Onboarding email sequences
- **A/B Testing**: Subject line and content variants
- **Multi-language**: Localized email templates
- **Push Notifications**: Mobile app notifications
- **SMS Notifications**: Alternative to email 