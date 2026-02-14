# OmniPlug

TypeScript-first monorepo scaffold for a multi-platform scheduler and auto-plug engine.

## Workspace Layout

- `apps/web`: Next.js 14 App Router frontend
- `apps/api`: Fastify REST API
- `apps/worker`: BullMQ worker + cron service
- `packages/db`: Prisma schema + shared client
- `packages/types`: shared TypeScript interfaces
- `packages/utils`: shared constants/utilities

## Quick Start

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm db:generate
pnpm dev
```

## Notes

- The scaffold follows the architecture and naming in `Ideation.txt`.
- Most endpoints/services are wired as typed stubs so implementation can proceed section-by-section.
