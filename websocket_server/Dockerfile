FROM node:20-slim AS base
RUN apt-get update && apt-get install -y openssl
WORKDIR /websocket_server
RUN npm install -g pnpm

FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY ./packages ./packages

COPY ./websocket_server ./websocket_server

RUN pnpm install --filter websocket_server

WORKDIR /packages/db

RUN pnpm --filter @repo/db build

WORKDIR /websocket_server

RUN pnpm --filter websocket_server build

RUN pnpm --filter websocket_server deploy /prod


FROM base AS runner
ENV NODE_ENV production
COPY --from=builder /prod .
CMD ["node", "dist/server.js"]
