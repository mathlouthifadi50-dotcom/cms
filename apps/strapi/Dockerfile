# Simple direct approach for Strapi
FROM node:20 AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 make g++ build-essential libvips-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Enable corepack
RUN corepack enable

# Copy everything
COPY . .

# Install workspace dependencies
RUN pnpm install

# Build Strapi
WORKDIR /app/apps/strapi
RUN npm run build

# Runtime stage
FROM node:20 AS runner
WORKDIR /app

# Install runtime dependencies (no pnpm install in this stage)
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create user for security
RUN addgroup --system --gid 1001 strapi && \
    adduser --system --uid 1001 strapi

# Copy workspace + dependencies from builder.
# We intentionally skip `pnpm install --prod` here to avoid rebuilding native deps like sharp.
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/strapi ./apps/strapi

# Create necessary directories
RUN mkdir -p /app/apps/strapi/.tmp /app/apps/strapi/.cache /app/apps/strapi/public/uploads && \
    chown -R strapi:strapi /app

USER strapi

EXPOSE 1337

ENV NODE_ENV=production
ENV STRAPI_DISABLE_UPDATE_NOTIFICATION=true
ENV HOME=/app

WORKDIR /app/apps/strapi

CMD ["dumb-init", "node", "./node_modules/@strapi/strapi/bin/strapi.js", "start"]
