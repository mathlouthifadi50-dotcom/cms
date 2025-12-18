# Multi-stage build for Next.js application

# Stage 1: Install dependencies
FROM node:20-slim AS deps

# Install build dependencies for sharp and other native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    libvips-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Use official pnpm image with pre-installed pnpm
RUN npm install -g pnpm@8.15.4

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy workspace app packages
COPY apps/web/package.json apps/web/
COPY apps/strapi/package.json apps/strapi/
COPY packages packages/

# Install dependencies
RUN pnpm install

# Stage 2: Build application
FROM node:20-slim AS builder

# Install build dependencies for sharp and other native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    libvips-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Use pnpm installed globally
RUN npm install -g pnpm@8.15.4

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy workspace packages
COPY apps/web/package.json apps/web/
COPY apps/strapi/package.json apps/strapi/
COPY packages packages/

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy app source
COPY apps/web/app ./apps/web/app
COPY apps/web/components ./apps/web/components
COPY apps/web/lib ./apps/web/lib
COPY apps/web/actions ./apps/web/actions
COPY apps/web/i18n ./apps/web/i18n
COPY apps/web/public ./apps/web/public
COPY apps/web/next.config.ts ./apps/web/
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/eslint.config.js ./apps/web/
COPY apps/web/middleware.ts ./apps/web/
COPY apps/web/next-env.d.ts ./apps/web/
COPY apps/web/postcss.config.mjs ./apps/web/

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NODE_ENV=production

# Build using workspace filter
RUN pnpm run build --filter web

# Stage 3: Production runtime
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
