FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/worker/package.json apps/worker/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/utils/package.json packages/utils/package.json

RUN pnpm install --filter @omniplug/worker... --frozen-lockfile=false

COPY . .

RUN pnpm --filter @omniplug/worker build

WORKDIR /app/apps/worker
CMD ["node", "dist/index.js"]

