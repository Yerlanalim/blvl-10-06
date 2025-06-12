# BizLevel - Educational Platform

BizLevel is an educational platform with 10 sequential business levels designed to help users master essential business skills. Built with [Next.js](https://nextjs.org) and Supabase.

## Features

- **10 Progressive Levels**: Sequential learning path from basics to advanced business concepts
- **Interactive Content**: Text lessons, video content, quizzes, and downloadable artifacts
- **AI Assistant "Leo"**: Get personalized help throughout your learning journey
- **Free & Paid Tiers**: 3 free levels with 30 total AI messages, or full access with daily limits
- **Progress Tracking**: Monitor your advancement through each level
- **Secure Authentication**: Complete user management with Supabase Auth

## Test Accounts

For development and testing purposes, you can use these pre-configured accounts:

### Free Tier Account
- **Email**: `test-free@bizlevel.com`
- **Password**: `TestPass123!`
- **Access**: Levels 1-3, 30 AI messages total
- **Features**: Basic content, community access

### Premium Tier Account  
- **Email**: `test-premium@bizlevel.com`
- **Password**: `TestPass123!`
- **Access**: All 10 levels, 30 AI messages daily
- **Features**: All content, AI assistant, certificates

### Development Account
- **Email**: `deus2111@gmail.com` 
- **Access**: Premium tier for development testing
- **Note**: Auto-upgrades in development mode

> **Note**: Test accounts automatically get their tier assigned. Payment flows are stubbed in development mode for easy testing.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Supabase Auth with MFA support
- **AI Integration**: Vertex AI for educational assistance
- **Deployment**: Vercel Platform

## Project Structure

This project follows a structured approach:
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components organized by feature
- `src/lib/` - Utilities, hooks, and configurations
- `docs/` - Project documentation and development notes

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase features
- [Tailwind CSS](https://tailwindcss.com) - utility-first CSS framework

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
