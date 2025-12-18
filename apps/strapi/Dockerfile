# Multi-stage build for Strapi CMS
# Stage 1: Dependencies and build
FROM node:20 AS deps
# Install build dependencies for Strapi compilation
RUN apt-get update && apt-get install -y python3 make g++ build-essential && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install pnpm directly
RUN npm install -g pnpm@8.15.4

# Copy package files from monorepo
COPY apps/strapi/package.json pnpm-lock.yaml* ./

# Install dependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 2: Build Strapi admin panel and plugins
FROM node:20 AS builder
WORKDIR /app

# Install pnpm directly
RUN npm install -g pnpm@8.15.4

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY apps/strapi/ .

# Build Strapi admin panel and plugins
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 3: Production runtime
FROM node:20 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV STRAPI_DISABLE_UPDATE_NOTIFICATION=true

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*

# Create Strapi user
RUN addgroup --system --gid 1001 strapi && \
    adduser --system --uid 1001 strapi

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built Strapi application (excluding dev dependencies)
COPY --from=builder /app/apps/strapi/package.json ./package.json
COPY --from=builder /app/apps/strapi/.strapi ./strapi
COPY --from=builder /app/apps/strapi/dist ./dist
COPY --from=builder /app/apps/strapi/src ./src

# Create required directories in runtime stage
RUN mkdir -p ./config ./public ./scripts

# Copy server files from builder stage (remove chown to handle missing directories)
COPY --from=builder /app/apps/strapi/config ./config
COPY --from=builder /app/apps/strapi/public ./public
COPY --from=builder /app/apps/strapi/scripts ./scripts

# Set proper ownership
RUN chown -R strapi:strapi ./config ./public ./scripts 2>/dev/null || true

# Create directories for uploads and database
RUN mkdir -p /app/uploads && chown -R strapi:strapi /app/uploads
RUN mkdir -p /app/.tmp && chown -R strapi:strapi /app/.tmp

USER strapi

EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:1337/api/health-check').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["dumb-init", "node", "_modules/@strapi/strapi/bin/strapi.js", "start"]