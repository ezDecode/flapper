# Flapr

A smart social media scheduling tool for Twitter/X.

## Prerequisites

- **Node.js** (v18+)
- **Docker Desktop** (Required for local Supabase development)
- **Supabase CLI** (`npm install -g supabase`)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Backend:**
   - **Option A: Local (Preferred)**
     - Requires Docker Desktop
     - Run `npx supabase start`
   - **Option B: Remote (No Docker)**
     - Run `npx supabase login`
     - Run `npx supabase link --project-ref okmointqzxuizsqnqzqm`
     - Use `npm run gen:types:remote` instead of local scripts.

3. **Start frontend:**

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run typecheck` - Run TypeScript validation
- `npm run db:push` - push schema changes to remote database
- `npm run gen:types` - Generate TypeScript types from local database (requires
  Docker)

Flapr is a web-only auto-plug engine for creators and indie hackers.

## Stack

- Next.js 14 App Router
- Supabase (Auth, Postgres, Storage, Edge Functions, Cron)
- Dodo Payments billing
- Resend transactional email

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm typecheck`
- `pnpm db:push`
- `pnpm fn:serve`

## Setup

1. Copy `.env.example` to `.env.local` and fill values.
2. Start Supabase locally and run migrations.
3. Run `pnpm dev`.

Master implementation reference: `FLAPR_MASTER_BUILD.txt`.
