# BizLevel Development Plan

## Overview
Single developer adaptation of SaaS template to educational platform using Cursor Agent (Claude 4 Sonnet).

**Timeline**: 14-16 days
**Approach**: Incremental adaptation with testing
**Principle**: Modify minimal, reuse maximal

---

## Stage 1: Foundation (Day 1-2)

### Task 1.1: Environment Setup (2 hours)
**Goal**: Configure project for BizLevel
**Actions**:
- Update package.json name and metadata
- Configure Supabase connection
- Update environment variables
- Test authentication flow
**Files**: package.json, .env.local, README.md
**Dependencies**: None
**Result**: Working auth with Supabase

### Task 1.2: Branding Update (1 hour)
**Goal**: Replace SaaS branding with BizLevel
**Actions**:
- Update layout.tsx metadata
- Change favicon and logos
- Update color theme if needed
**Files**: app/layout.tsx, public/*, styles/globals.css
**Dependencies**: Task 1.1
**Result**: BizLevel branding applied

### Task 1.3: Navigation Adaptation (2 hours)
**Goal**: Adjust navigation for educational platform
**Actions**:
- Hide Task Management from menu
- Rename Storage to "My Materials"
- Add "Levels" and "AI Assistant" menu items
- Keep existing navigation component
**Files**: components/AppLayout.tsx, navigation config files
**Dependencies**: Task 1.2
**Result**: Navigation reflects BizLevel features

### Task 1.4: Database Schema - Core Tables (3 hours)
**Goal**: Create educational data structure
**Actions**:
- Via Supabase MCP create: levels, lesson_steps, test_questions
- Extend user_profiles with: current_level, ai_messages_count, tier_type
- Create RLS policies
- Generate TypeScript types
**Files**: SQL via MCP, types/database.ts
**Dependencies**: Task 1.1
**Result**: Database ready for content

### Task 1.5: Legal Documents Update (1 hour)
**Goal**: Update terms for educational service
**Actions**:
- Update privacy policy for educational context
- Modify terms of service
- Keep document rendering system
**Files**: public/legal/*, app/legal/[document]/page.tsx
**Dependencies**: None
**Result**: Legal compliance ready

### Task 1.6: Stage 1 Testing & Refactor (3 hours)
**Goal**: Ensure foundation is solid
**Actions**:
- Test auth flows (login, register, password reset)
- Verify database connections
- Write integration tests for new tables
- Refactor any issues found
- Update docs/status.md
**Files**: tests/*, all modified files
**Dependencies**: All Stage 1 tasks
**Result**: Stable foundation

---

## Stage 2: Content Structure (Day 3-4)

### Task 2.1: Levels Page Creation (3 hours)
**Goal**: Main page showing 10 levels
**Actions**:
- Create app/(app)/levels/page.tsx
- Adapt existing card components for level display
- Implement level locking logic
- Use existing grid layout patterns
**Files**: app/(app)/levels/*, components/level/LevelCard.tsx
**Dependencies**: Stage 1 complete
**Result**: Visual level map

### Task 2.2: User Progress Tracking (3 hours)
**Goal**: Track user advancement
**Actions**:
- Create user_progress table via MCP
- Implement useUserProgress hook
- Add progress checking to level cards
- Use existing React Query patterns
**Files**: hooks/useUserProgress.ts, database via MCP
**Dependencies**: Task 2.1
**Result**: Progress tracking active

### Task 2.3: Lesson Container Setup (4 hours)
**Goal**: Create lesson flow structure
**Actions**:
- Create app/(app)/lesson/[id]/page.tsx
- Build step navigation component
- Implement progress saving
- Reuse existing layout patterns
**Files**: app/(app)/lesson/*, components/lesson/LessonContainer.tsx
**Dependencies**: Task 2.2
**Result**: Lesson framework ready

### Task 2.4: Content Display Components (3 hours)
**Goal**: Show different content types
**Actions**:
- TextContent component (reuse existing markdown viewer)
- VideoPlayer wrapper for YouTube
- TestQuestion component (adapt form components)
- Navigation between steps
**Files**: components/lesson/*, existing UI components
**Dependencies**: Task 2.3
**Result**: All content types displayable

### Task 2.5: Seed Content Data (2 hours)
**Goal**: Add sample content for testing
**Actions**:
- Via MCP add 3 levels with full content
- Include text, video links, test questions
- Create sample artifacts data
**Files**: SQL via MCP
**Dependencies**: Task 2.4
**Result**: Testable content available

### Task 2.6: Stage 2 Testing & Refactor (3 hours)
**Goal**: Validate content flow
**Actions**:
- Test complete lesson flow
- Verify progress saves correctly
- Write E2E tests for lesson completion
- Fix any issues
- Update docs/status.md
**Files**: tests/*, all Stage 2 files
**Dependencies**: All Stage 2 tasks
**Result**: Working lesson system

---

## Stage 3: File Management → Artifacts (Day 5-6)

### Task 3.1: Rename File Management (2 hours)
**Goal**: Adapt existing system for artifacts
**Actions**:
- Rename UI labels to "Artifacts"
- Update navigation text
- Keep all existing functionality
- Update any related types
**Files**: app/(app)/storage/*, components/storage/*
**Dependencies**: Stage 2 complete
**Result**: Artifacts section ready

### Task 3.2: Link Artifacts to Levels (3 hours)
**Goal**: Connect artifacts to lesson completion
**Actions**:
- Create user_artifacts table via MCP
- Modify storage queries to filter by level
- Add level_id to file metadata
- Implement unlock on lesson completion
**Files**: lib/storage/*, database via MCP
**Dependencies**: Task 3.1
**Result**: Artifacts tied to progress

### Task 3.3: Artifact Download Component (2 hours)
**Goal**: Show artifact at lesson end
**Actions**:
- Create ArtifactUnlock component
- Integrate with existing file download
- Add to lesson completion flow
- Track download count
**Files**: components/lesson/ArtifactUnlock.tsx
**Dependencies**: Task 3.2
**Result**: Smooth artifact delivery

### Task 3.4: Profile Integration (2 hours)
**Goal**: Show artifacts in user profile
**Actions**:
- Extend existing profile page
- Add "My Artifacts" section
- Reuse existing file list component
- Group by level
**Files**: app/(app)/user-settings/*, components/profile/*
**Dependencies**: Task 3.3
**Result**: Artifacts visible in profile

### Task 3.5: Stage 3 Testing & Refactor (3 hours)
**Goal**: Ensure artifact system works
**Actions**:
- Test artifact unlock flow
- Verify file access control
- Test download functionality
- Update docs/status.md
**Files**: tests/*, all Stage 3 files
**Dependencies**: All Stage 3 tasks
**Result**: Artifact system complete

---

## Stage 4: AI Integration (Day 7-8)

### Task 4.1: Vertex AI Setup (2 hours)
**Goal**: Configure AI provider
**Actions**:
- Install Google Cloud SDK
- Configure credentials
- Create vertex AI utility
- Test basic connection
**Files**: lib/ai/vertex.ts, .env.local
**Dependencies**: None
**Result**: AI provider ready

### Task 4.2: Chat API Route (3 hours)
**Goal**: Create streaming endpoint
**Actions**:
- Create app/api/chat/route.ts
- Use Vercel AI SDK patterns
- Add user context (level, step)
- Implement rate limiting
**Files**: app/api/chat/route.ts
**Dependencies**: Task 4.1
**Result**: Working chat endpoint

### Task 4.3: Message Counter (2 hours)
**Goal**: Track AI usage limits
**Actions**:
- Add ai_message_count to user_profiles
- Add daily_reset_at for paid users
- Create useAIQuota hook
- Implement quota checking
**Files**: database via MCP, hooks/useAIQuota.ts
**Dependencies**: Task 4.2
**Result**: Usage tracking active

### Task 4.4: Chat UI Creation (4 hours)
**Goal**: Build chat interface
**Actions**:
- Create app/(app)/chat/page.tsx
- Adapt existing form/list components
- Add streaming message display
- Include "Leo typing..." indicator
**Files**: app/(app)/chat/*, components/chat/*
**Dependencies**: Task 4.3
**Result**: Functional chat UI

### Task 4.5: Context Integration (2 hours)
**Goal**: Pass user progress to AI
**Actions**:
- Create context builder function
- Include current level/step/tier
- Add to system prompt
- Keep context minimal
**Files**: lib/ai/context.ts
**Dependencies**: Task 4.4
**Result**: AI knows user status

### Task 4.6: Stage 4 Testing & Refactor (3 hours)
**Goal**: Validate AI system
**Actions**:
- Test message limits
- Verify streaming works
- Test context accuracy
- Load test API route
- Update docs/status.md
**Files**: tests/*, all Stage 4 files
**Dependencies**: All Stage 4 tasks
**Result**: AI assistant complete

---

## Stage 5: Subscription & Access Control (Day 9-10)

### Task 5.1: Tier System Setup (3 hours)
**Goal**: Implement free/paid tiers
**Actions**:
- Add tier_type to user_profiles
- Create tier checking utilities
- Update RLS policies for tier access
- Add tier constants
**Files**: database via MCP, lib/tiers.ts
**Dependencies**: None
**Result**: Tier system ready

### Task 5.2: Level Access Control (2 hours)
**Goal**: Limit free tier to 3 levels
**Actions**:
- Update level card component
- Add tier check to lesson access
- Show upgrade prompts
- Use existing auth patterns
**Files**: components/level/*, app/(app)/lesson/*
**Dependencies**: Task 5.1
**Result**: Access control active

### Task 5.3: Payment Integration (4 hours)
**Goal**: Enable tier upgrades
**Actions**:
- Adapt existing Paddle integration
- Create "Upgrade" page
- Modify pricing component
- Handle successful payment
**Files**: app/(app)/upgrade/*, lib/pricing.ts
**Dependencies**: Task 5.2
**Result**: Payment flow working

### Task 5.4: Email Notifications (3 hours)
**Goal**: User engagement emails
**Actions**:
- Setup email templates
- Create notification triggers
- Welcome email on signup
- Level completion emails
**Files**: lib/email/*, Supabase functions
**Dependencies**: Task 5.3
**Result**: Email system active

### Task 5.5: Stage 5 Testing & Refactor (3 hours)
**Goal**: Verify access control
**Actions**:
- Test tier restrictions
- Test payment flow
- Verify email sending
- Security audit
- Update docs/status.md
**Files**: tests/*, all Stage 5 files
**Dependencies**: All Stage 5 tasks
**Result**: Monetization ready

---

## Stage 6: Polish & Optimization (Day 11-12)

### Task 6.1: Performance Optimization (3 hours)
**Goal**: Improve load times
**Actions**:
- Add React Query prefetching
- Optimize images
- Enable static generation where possible
- Setup CDN caching headers
**Files**: Various components, next.config.js
**Dependencies**: All previous stages
**Result**: Faster load times

### Task 6.2: Error Handling (2 hours)
**Goal**: Graceful error states
**Actions**:
- Add error boundaries to new features
- Create fallback UI components
- Improve error messages
- Add retry mechanisms
**Files**: components/ErrorBoundary.tsx, various
**Dependencies**: None
**Result**: Better error UX

### Task 6.3: Analytics Integration (2 hours)
**Goal**: Track user behavior
**Actions**:
- Add custom events for progress
- Track lesson completion
- Monitor AI usage
- Setup conversion tracking
**Files**: lib/analytics.ts, various components
**Dependencies**: None
**Result**: Full analytics

### Task 6.4: Mobile Optimization (3 hours)
**Goal**: Perfect mobile experience
**Actions**:
- Test all breakpoints
- Optimize touch targets
- Fix any mobile-specific issues
- Improve bottom navigation
**Files**: Various components, styles
**Dependencies**: None
**Result**: Great mobile UX

### Task 6.5: Documentation (2 hours)
**Goal**: Complete project docs
**Actions**:
- Update README
- Document API endpoints
- Create user guide
- Developer setup guide
**Files**: docs/*, README.md
**Dependencies**: None
**Result**: Full documentation

### Task 6.6: Final Testing & Deploy (4 hours)
**Goal**: Production ready
**Actions**:
- Full E2E test suite run
- Load testing
- Security audit
- Deploy to Vercel
- Monitor initial traffic
**Files**: tests/*, deployment configs
**Dependencies**: All tasks
**Result**: Live production app

---

## Stage 7: Post-Launch (Day 13-14)

### Task 7.1: Monitoring Setup (2 hours)
**Goal**: Track app health
**Actions**:
- Configure Vercel Analytics
- Setup error tracking
- Create performance dashboards
- Set up alerts
**Files**: Monitoring configs
**Dependencies**: Stage 6 complete
**Result**: Full visibility

### Task 7.2: Content Completion (4 hours)
**Goal**: Add remaining 7 levels
**Actions**:
- Create content for levels 4-10
- Add all videos and tests
- Upload all artifacts
- Test each level
**Files**: Database via MCP
**Dependencies**: None
**Result**: All content live

### Task 7.3: Bug Fixes (3 hours)
**Goal**: Address early user feedback
**Actions**:
- Monitor error logs
- Fix reported issues
- Improve based on analytics
- Deploy fixes
**Files**: Various based on issues
**Dependencies**: Task 7.1
**Result**: Stable application

### Task 7.4: Final Polish (3 hours)
**Goal**: Perfect the experience
**Actions**:
- Animation improvements
- Loading state polish
- Copy improvements
- Final testing
**Files**: Various components
**Dependencies**: Task 7.3
**Result**: Polished product

---

## Testing Strategy

### After each stage:
1. Run existing test suite
2. Add new tests for features
3. Manual testing checklist
4. Update status.md
5. Git commit with summary

### Test types by stage:
- Stage 1: Auth flows, database connections
- Stage 2: Lesson flows, progress tracking
- Stage 3: File access, artifact unlocking
- Stage 4: AI limits, streaming
- Stage 5: Access control, payments
- Stage 6: Performance, mobile
- Stage 7: Production monitoring

## Risk Mitigation

### Common issues:
- **Database migrations**: Always backup first
- **Auth breaking**: Test in incognito
- **Type errors**: Regenerate after schema changes
- **Performance**: Profile before optimizing
- **Mobile issues**: Test on real devices

### Rollback strategy:
- Git commits after each task
- Database backups before migrations
- Feature flags for risky changes
- Staging environment testing

## Success Metrics

- All auth flows working
- 10 levels fully playable
- AI assistant responds correctly
- Payment processing works
- Mobile experience smooth
- Page load under 3s
- Zero critical bugs

## Daily Routine

1. Review previous day's status.md
2. Pick next task from plan
3. Implement with Cursor Agent
4. Test thoroughly
5. Update status.md
6. Commit and push
7. Plan next day

This plan ensures systematic progress with continuous testing and documentation.