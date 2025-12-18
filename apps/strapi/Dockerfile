# Multi-stage build for Strapi CMS

# Stage 1: Build
FROM node:20-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    libvips-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@8.15.4

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./

# Copy workspace app packages
COPY apps/web/package.json apps/web/
COPY apps/strapi/package.json apps/strapi/
COPY packages packages/

# Install dependencies (frozen lockfile)
RUN pnpm install --frozen-lockfile

# Copy app source
COPY apps/strapi ./apps/strapi/

# Build Strapi
ENV NODE_ENV=production
RUN pnpm run build --filter strapi

# Stage 2: Production runtime
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV STRAPI_DISABLE_UPDATE_NOTIFICATION=true

RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    curl \
    python3 \
    make \
    g++ \
    build-essential \
    libvips-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 strapi && \
    adduser --system --uid 1001 strapi

RUN npm install -g pnpm@8.15.4

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY apps/strapi/package.json apps/strapi/
COPY apps/web/package.json apps/web/
COPY packages packages/

# Install ONLY production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built artifacts from builder
COPY --from=builder /app/apps/strapi/dist ./apps/strapi/dist
COPY --from=builder /app/apps/strapi/config ./apps/strapi/config
COPY --from=builder /app/apps/strapi/src ./apps/strapi/src
COPY --from=builder /app/apps/strapi/scripts ./apps/strapi/scripts

# Try to copy public if it exists in builder (it might be generated)
# Since we can't conditionally copy easily, we assume strapi build generates it or it's not critical if missing for start
# But if it fails, we know why.
# Strapi build usually generates admin in .strapi/ or build/
# Strapi public folder is for assets. If source didn't have it, maybe build doesn't create it (unless admin panel is put there?)
# Strapi 4 admin panel is usually served from build/ (or .strapi/client).
# COPY --from=builder /app/apps/strapi/build ./apps/strapi/build
# I should verify if `build` exists.

# Create necessary directories
RUN mkdir -p /app/apps/strapi/.tmp /app/apps/strapi/.cache /app/apps/strapi/public/uploads && \
    chown -R strapi:strapi /app/apps/strapi/.tmp /app/apps/strapi/.cache /app/apps/strapi/public/uploads

USER strapi

EXPOSE 1337

WORKDIR /app/apps/strapi

CMD ["dumb-init", "node", "../../node_modules/@strapi/strapi/bin/strapi.js", "start"]
