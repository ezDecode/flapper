FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/utils/package.json packages/utils/package.json

RUN pnpm install --filter @omniplug/api... --frozen-lockfile=false

COPY . .

RUN pnpm --filter @omniplug/api build

WORKDIR /app/apps/api
CMD ["node", "dist/index.js"]

