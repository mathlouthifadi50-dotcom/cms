# Multi-stage build for Strapi CMS

# Stage 1: Install dependencies
FROM node:20 AS deps

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ build-essential \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY apps/strapi/package.json ./package.json

RUN pnpm install

# Stage 2: Build Strapi admin panel
FROM node:20 AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY apps/strapi/ .

RUN mkdir -p ./config ./public ./scripts

RUN pnpm run build

# Stage 3: Production runtime
FROM node:20 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV STRAPI_DISABLE_UPDATE_NOTIFICATION=true

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init curl && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 strapi && \
    adduser --system --uid 1001 strapi

COPY --from=builder /app ./

RUN mkdir -p /app/uploads /app/.tmp /app/.strapi /app/.cache && \
    chown -R strapi:strapi /app/uploads /app/.tmp /app/.strapi /app/.cache

USER strapi

EXPOSE 1337

CMD ["dumb-init", "node", "node_modules/@strapi/strapi/bin/strapi.js", "start"]
