# BizLevel Architecture

## Core Principle
Minimal adaptation of existing SaaS template for educational platform. No overengineering, maximum reuse.

## System Overview

### What We Keep (90%)
- **Authentication**: Complete Supabase Auth system with MFA
- **User Management**: Existing profiles, extended with learning data
- **File Storage**: Renamed to "Artifacts" but same functionality
- **UI Framework**: All shadcn/ui components unchanged
- **Navigation**: AppLayout with minor menu changes
- **Database**: Supabase with additional tables

### What We Add (10%)
- **Levels System**: Sequential unlocking of content
- **Lesson Flow**: Text → Video → Test → Artifact
- **AI Chat**: Simple integration with Vertex AI
- **Progress Tracking**: User advancement through levels

## Data Architecture

### Extended Tables
```
user_profiles (EXISTING + NEW COLUMNS)
├── existing columns...
├── current_level (integer, default: 1)
├── tier_type (text: 'free' | 'paid')
├── ai_messages_count (integer, default: 0)
├── ai_daily_reset_at (timestamp)
└── completed_lessons (integer[])
```

### New Tables
```
levels (Static content)
├── id (integer)
├── title (text)
├── description (text)
├── order_index (integer)
└── required_level (integer)

lesson_steps
├── id (uuid)
├── level_id (integer)
├── step_type (text: 'text' | 'video' | 'test')
├── content (text)
├── order_index (integer)
└── created_at (timestamp)

test_questions
├── id (uuid)
├── lesson_step_id (uuid)
├── question (text)
├── options (text[])
├── correct_answer (integer)
└── skill_category (text)

user_progress
├── id (uuid)
├── user_id (uuid)
├── level_id (integer)
├── current_step (integer)
├── test_scores (jsonb)
├── completed_at (timestamp)
└── updated_at (timestamp)

user_artifacts (Links storage to levels)
├── id (uuid)
├── user_id (uuid)
├── level_id (integer)
├── file_id (uuid) → storage.objects
└── unlocked_at (timestamp)
```

### Data Flow
1. User completes lesson steps sequentially
2. Progress saved to user_progress table
3. On completion, level increments in user_profiles
4. Artifact unlocked in user_artifacts
5. Next level becomes available

## Component Architecture

### Page Structure
```
app/
├── (app)/              # Authenticated area
│   ├── levels/         # Level selection grid
│   ├── lesson/[id]/    # Lesson player
│   ├── chat/           # AI assistant
│   ├── storage/        # Artifacts (renamed)
│   └── user-settings/  # Extended profile
├── api/
│   └── chat/           # AI endpoint
└── (existing auth pages...)
```

### Component Hierarchy
```
LevelPage
└── LevelGrid
    └── LevelCard (reuses Card component)
        └── Shows: locked/available/completed

LessonPage
└── LessonContainer
    ├── TextContent (uses existing markdown)
    ├── VideoPlayer (simple YouTube embed)
    ├── TestWidget (uses existing forms)
    └── ArtifactUnlock (triggers download)

ChatPage
└── ChatInterface
    ├── MessageList (reuses existing list)
    ├── MessageInput (reuses existing input)
    └── QuotaDisplay (shows remaining messages)
```

## State Management

### Simple Hierarchy
1. **URL**: Current lesson, current step
2. **Database**: All persistent data
3. **React Query**: Caching (already configured)
4. **Local State**: UI only (form inputs, modals)

### No Complex State
- No Redux/Zustand needed
- No client-side progress tracking
- No offline sync
- No complex caching logic

## AI Integration

### Minimal Context Approach
```
System Prompt includes only:
- User's current level
- Current lesson step
- Tier type (free/paid)
- Pre-trained on course content

Message includes:
- User's question
- No conversation history
- No complex context building
```

### Rate Limiting
- Stored in database (ai_messages_count)
- Checked on API route
- Reset daily for paid users
- Simple counter increment

## Security Model

### Simple RLS Policies
```
user_profiles: Users see/edit own row
levels: Public read
lesson_steps: Public read
user_progress: Users see/edit own rows
user_artifacts: Users see own + level check
storage.objects: Existing policies + level check
```

### Access Control
- Free tier: levels 1-3
- Paid tier: all levels
- Checked at component level
- Enforced by RLS

## Performance Strategy

### Built-in Optimizations
- Next.js 15 automatic optimizations
- React Query caching (configured)
- Vercel Edge caching
- Image optimization (Next.js Image)

### Simple Improvements
- Lazy load lesson content
- Prefetch next lesson
- Static generation for levels
- CDN for video content

## Deployment Architecture

### Standard Vercel Deploy
- Automatic CI/CD
- Preview deployments
- Environment variables
- Edge functions for API

### Monitoring
- Vercel Analytics (included)
- Custom events for progress
- Error tracking (browser console)
- No complex APM needed

## Key Design Decisions

### Why These Choices

1. **No Version Control for Content**
   - Content changes are rare
   - Simplifies database schema
   - Can add later if needed

2. **No Offline Support**
   - Educational content needs internet
   - Reduces complexity significantly
   - PWA manifest still included

3. **Simple AI Context**
   - Pre-trained model knows content
   - Minimal runtime context needed
   - Reduces token usage

4. **Reuse File Storage**
   - Works perfectly for artifacts
   - No need for custom solution
   - Includes access control

5. **Keep Payment System**
   - Paddle already integrated
   - Just update pricing tiers
   - Handles all edge cases

## Migration Path

### From Template to BizLevel
1. Keep all existing functionality
2. Hide unused features (tasks)
3. Add educational tables
4. Extend user profiles
5. Add new pages
6. Update navigation

### Future Expansions
- Add more levels (same pattern)
- Add certificates (use storage)
- Add discussion forums (new feature)
- Add live sessions (separate system)

## Anti-Patterns to Avoid

### DON'T
- Build custom auth system
- Create new file storage
- Implement complex state management
- Design new UI component library
- Write custom form handling

### DO
- Use existing Supabase Auth
- Adapt existing storage system
- Use React Query + database
- Extend shadcn/ui components
- Reuse form patterns

## Success Metrics

### Technical
- Page load < 3 seconds
- API response < 500ms
- 99% uptime
- Zero critical errors

### Business
- User can complete level
- Progress saves reliably
- AI responds helpfully
- Payments process correctly
- Artifacts download successfully

This architecture prioritizes simplicity, reliability, and quick development over complex features that may never be needed.