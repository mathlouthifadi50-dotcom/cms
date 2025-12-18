# Multi-stage build for Strapi CMS

# Stage 1: Install dependencies
FROM node:20 AS deps

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ build-essential libvips-dev pkg-config \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@latest

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy workspace packages
COPY apps/strapi/package.json apps/strapi/
COPY apps/web/package.json apps/web/
COPY packages packages/

# Install dependencies
RUN pnpm install

# Stage 2: Build Strapi admin panel
FROM node:20 AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ build-essential libvips-dev pkg-config \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@latest

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy workspace packages
COPY apps/strapi/package.json apps/strapi/
COPY apps/web/package.json apps/web/
COPY packages packages/

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy app source
COPY apps/strapi/src ./apps/strapi/src
COPY apps/strapi/public ./apps/strapi/public
COPY apps/strapi/config ./apps/strapi/config
COPY apps/strapi/scripts ./apps/strapi/scripts
COPY apps/strapi/tsconfig.json ./apps/strapi/
COPY apps/strapi/eslint.config.js ./apps/strapi/

RUN mkdir -p ./config ./public ./scripts

# Build using workspace filter
ENV NODE_ENV=production
RUN pnpm run build --filter strapi

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
