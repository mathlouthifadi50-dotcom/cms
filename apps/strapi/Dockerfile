# Multi-stage build for Strapi CMS
# Stage 1: Dependencies and build
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 2: Build Strapi admin panel and plugins
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Strapi admin panel and plugins
RUN npm run build

# Stage 3: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV STRAPI_DISABLE_UPDATE_NOTIFICATION=true

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create Strapi user
RUN addgroup --system --gid 1001 strapi && \
    adduser --system --uid 1001 strapi

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built Strapi application (excluding dev dependencies)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.strapi ./strapi
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Copy server files
COPY --chown=strapi:strapi config ./config
COPY --chown=strapi:strapi public ./public
COPY --chown=strapi:strapi scripts ./scripts

# Create directories for uploads and database
RUN mkdir -p /app/uploads && chown -R strapi:strapi /app/uploads
RUN mkdir -p /app/.tmp && chown -R strapi:strapi /app/.tmp

USER strapi

EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:1337/api/health-check').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["dumb-init", "node", "_modules/@strapi/strapi/bin/strapi.js", "start"]