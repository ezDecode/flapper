# Flapr

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
