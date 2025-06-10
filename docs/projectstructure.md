# BizLevel Project Structure

## Overview
BizLevel is built on top of existing SaaS template. This document shows what we modify, what we add, and what stays unchanged.

## Legend
- 🔵 **Unchanged** - Keep as is from template
- 🟡 **Modified** - Existing file with changes
- 🟢 **New** - Added for BizLevel
- 🔴 **Hidden** - Kept but hidden from users

---

## Root Structure

```
bizlevel-10-06/
├── 🔵 .git/                    # Version control
├── 🔵 .next/                   # Build output
├── 🔵 node_modules/            # Dependencies
├── 🟢 docs/                    # Project documentation
│   ├── 🟢 status.md            # Development log (auto-updated)
│   ├── 🟢 architecture.md      # This architecture
│   ├── 🟢 dev-plan.md          # Development plan
│   └── 🟢 structure.md         # This document
├── 🔵 public/                  # Static assets
│   ├── 🟡 favicon.ico          # BizLevel favicon
│   ├── 🟡 terms/               # Updated legal docs
│   └── 🔵 (other assets)       # Keep existing
├── 🔵 src/                     # Source code (detailed below)
├── 🟡 .env.local               # Add AI credentials
├── 🟢 .cursorrules             # Cursor AI rules
├── 🟡 package.json             # Update name & deps
├── 🟡 README.md                # BizLevel readme
└── 🔵 (config files)           # All unchanged
```

---

## `/src/` Structure

### `/src/app/` - Pages & Routes

```
src/app/
├── 🟡 layout.tsx               # Update metadata for BizLevel
├── 🟡 page.tsx                 # Landing page (update content)
├── 🔵 globals.css              # Keep all styles
├── 🟡 favicon.ico              # BizLevel icon
│
├── api/                        # API routes
│   ├── 🔵 auth/callback/       # Keep auth endpoints
│   └── 🟢 chat/                # New AI endpoint
│       └── 🟢 route.ts         # Vertex AI integration
│
├── (auth)/                     # Public pages
│   └── 🔵 (all auth pages)     # Keep unchanged
│
├── (app)/                      # Authenticated area
│   ├── 🟡 layout.tsx           # Update navigation items
│   ├── 🟡 page.tsx             # Dashboard (show progress)
│   │
│   ├── 🟢 levels/              # Level selection
│   │   └── 🟢 page.tsx         # Grid of 10 levels
│   │
│   ├── 🟢 lesson/              # Lesson player
│   │   └── 🟢 [id]/
│   │       └── 🟢 page.tsx     # Dynamic lesson page
│   │
│   ├── 🟢 chat/                # AI Assistant
│   │   └── 🟢 page.tsx         # Chat with Leo
│   │
│   ├── 🟡 storage/             # Artifacts (renamed)
│   │   └── 🟡 page.tsx         # Update UI text only
│   │
│   ├── 🔴 table/               # Hide from menu
│   │   └── 🔵 page.tsx         # Keep for admin later
│   │
│   └── 🟡 user-settings/       # Extended profile
│       ├── 🟡 page.tsx         # Add learning stats
│       └── 🔵 (subpages)       # Keep existing
│
└── legal/                      # Legal pages
    └── 🟡 [document]/          # Update content
```

### `/src/components/` - React Components

```
src/components/
├── ui/                         # shadcn/ui components
│   └── 🔵 (all components)     # Keep ALL unchanged
│
├── 🟢 level/                   # Level components
│   ├── 🟢 LevelCard.tsx        # Single level display
│   ├── 🟢 LevelGrid.tsx        # Grid container
│   └── 🟢 LevelProgress.tsx    # Progress indicator
│
├── 🟢 lesson/                  # Lesson components
│   ├── 🟢 LessonContainer.tsx  # Main wrapper
│   ├── 🟢 TextContent.tsx      # Text display
│   ├── 🟢 VideoPlayer.tsx      # YouTube embed
│   ├── 🟢 TestWidget.tsx       # Quiz component
│   ├── 🟢 ArtifactUnlock.tsx   # Download trigger
│   └── 🟢 NavigationButtons.tsx # Next/Previous
│
├── 🟢 chat/                    # Chat components
│   ├── 🟢 ChatInterface.tsx    # Main chat UI
│   ├── 🟢 MessageList.tsx      # Message display
│   ├── 🟢 MessageInput.tsx     # Input field
│   └── 🟢 QuotaIndicator.tsx   # Messages left
│
├── 🟢 profile/                 # Profile additions
│   ├── 🟢 SkillsChart.tsx      # Progress visualization
│   ├── 🟢 ArtifactsList.tsx    # Downloaded materials
│   └── 🟢 LearningStats.tsx    # Statistics
│
├── 🟡 AppLayout.tsx            # Update navigation
├── 🟡 HomePricing.tsx          # Update pricing tiers
├── 🔵 AuthAwareButtons.tsx     # Keep unchanged
├── 🔵 Confetti.tsx             # Keep for celebrations
├── 🔵 Cookies.tsx              # Keep unchanged
├── 🔵 ErrorBoundary.tsx        # Keep unchanged
├── 🔵 LegalDocument.tsx        # Keep unchanged
├── 🔵 LegalDocuments.tsx       # Keep unchanged
├── 🔵 MFASetup.tsx             # Keep unchanged
├── 🔵 MFAVerification.tsx      # Keep unchanged
└── 🔵 SSOButtons.tsx           # Keep unchanged
```

### `/src/lib/` - Utilities & Configuration

```
src/lib/
├── supabase/                   # Database client
│   ├── 🔵 client.ts            # Keep unchanged
│   ├── 🔵 server.ts            # Keep unchanged
│   ├── 🔵 serverAdminClient.ts # Keep unchanged
│   ├── 🔵 middleware.ts        # Keep unchanged
│   └── 🔵 unified.ts           # Keep unchanged
│
├── 🟢 ai/                      # AI utilities
│   ├── 🟢 vertex.ts            # Vertex AI setup
│   ├── 🟢 context.ts           # User context builder
│   └── 🟢 prompts.ts           # System prompts
│
├── 🟢 hooks/                   # Custom hooks
│   ├── 🟢 useUserProgress.ts   # Progress tracking
│   ├── 🟢 useAIQuota.ts        # Message limits
│   ├── 🟢 useLessonContent.ts  # Content fetching
│   └── 🔵 (existing hooks)     # Keep all
│
├── context/                    # React contexts
│   └── 🔵 (all contexts)       # Keep unchanged
│
├── 🟡 types.ts                 # Extend with new types
├── 🟡 pricing.ts               # Update tier details
├── 🔵 utils.ts                 # Keep unchanged
├── 🟢 constants.ts             # App constants
└── 🟢 analytics.ts             # Custom events
```

### `/src/middleware.ts`
- 🟡 **Modified** - Add lesson access checks

---

## Database Schema Changes

### Modified Tables
```sql
-- user_profiles (EXTEND existing)
ALTER TABLE user_profiles ADD COLUMN current_level INTEGER DEFAULT 1;
ALTER TABLE user_profiles ADD COLUMN tier_type TEXT DEFAULT 'free';
ALTER TABLE user_profiles ADD COLUMN ai_messages_count INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN ai_daily_reset_at TIMESTAMPTZ;
ALTER TABLE user_profiles ADD COLUMN completed_lessons INTEGER[];
```

### New Tables
```sql
-- All created via Supabase MCP
CREATE TABLE levels (...);
CREATE TABLE lesson_steps (...);
CREATE TABLE test_questions (...);
CREATE TABLE user_progress (...);
CREATE TABLE user_artifacts (...);
```

---

## Configuration Files

### Modified Files
- 🟡 `package.json` - Name, description, new dependencies
- 🟡 `.env.local` - Add Vertex AI credentials
- 🟡 `README.md` - BizLevel documentation

### Unchanged Files
- 🔵 `next.config.ts` - Keep all optimizations
- 🔵 `tailwind.config.ts` - Keep theme system
- 🔵 `tsconfig.json` - Keep TypeScript config
- 🔵 `eslint.config.mjs` - Keep linting rules
- 🔵 `postcss.config.mjs` - Keep PostCSS
- 🔵 `components.json` - Keep shadcn/ui config

---

## File Naming Conventions

### Pages
- `app/(app)/feature-name/page.tsx`
- Dynamic routes: `[id]` folders

### Components
- PascalCase: `LevelCard.tsx`
- Grouped in feature folders
- One component per file

### Utilities
- camelCase: `useUserProgress.ts`
- Descriptive names
- Grouped by type

### Database
- Tables: snake_case
- Columns: snake_case
- Follow Supabase conventions

---

## Import Paths

### Use existing aliases
- `@/components/ui/button`
- `@/lib/supabase/client`
- `@/lib/utils`

### New imports follow pattern
- `@/components/level/LevelCard`
- `@/lib/ai/vertex`
- `@/lib/hooks/useUserProgress`

---

## Environment Variables

### Existing (keep all)
```
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
(... all auth providers)
```

### New additions
```
# Vertex AI
GOOGLE_APPLICATION_CREDENTIALS=
VERTEX_AI_PROJECT_ID=
VERTEX_AI_LOCATION=

# Updated
NEXT_PUBLIC_PRODUCTNAME=BizLevel
```

---

## Development Workflow

### Working with existing code
1. Always check if component exists
2. Extend rather than replace
3. Keep existing patterns
4. Reuse styles and utilities

### Adding new features
1. Place in logical location
2. Follow existing conventions
3. Use established patterns
4. Import from template first

### Modifying template
1. Minimal changes only
2. Keep functionality intact
3. Update rather than rewrite
4. Document all changes

---

## Hidden Features

These remain in codebase but hidden from users:
- 🔴 Task Management (`/table`)
- 🔴 Advanced admin features
- 🔴 Unused auth providers

Keep for potential future use.

---

## Key Takeaways

1. **90% of files remain unchanged**
2. **Auth system completely reused**
3. **UI components 100% reused**
4. **Storage renamed but unchanged**
5. **New features follow template patterns**

This structure ensures maximum code reuse while adding educational features seamlessly.