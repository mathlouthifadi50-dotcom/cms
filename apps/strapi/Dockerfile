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

# Install runtime dependencies
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

RUN corepack enable

# Create user for security
RUN addgroup --system --gid 1001 strapi && \
    adduser --system --uid 1001 strapi

# Copy workspace configuration
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Copy package.json files for workspace
COPY --from=builder /app/apps/strapi/package.json ./apps/strapi/
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/packages ./packages

# Install production deps only
RUN pnpm install --prod --frozen-lockfile

# Copy built artifacts
COPY --from=builder /app/apps/strapi/dist ./apps/strapi/dist
COPY --from=builder /app/apps/strapi/config ./apps/strapi/config
COPY --from=builder /app/apps/strapi/src ./apps/strapi/src
COPY --from=builder /app/apps/strapi/scripts ./apps/strapi/scripts

# Create necessary directories
RUN mkdir -p /app/apps/strapi/.tmp /app/apps/strapi/.cache /app/apps/strapi/public/uploads && \
    chown -R strapi:strapi /app

USER strapi

EXPOSE 1337

ENV NODE_ENV=production
ENV STRAPI_DISABLE_UPDATE_NOTIFICATION=true

WORKDIR /app/apps/strapi

CMD ["dumb-init", "node", "../../node_modules/@strapi/strapi/bin/strapi.js", "start"]
