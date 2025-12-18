# Simple direct approach for Next.js
FROM node:20-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 make g++ build-essential libvips-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable

# Copy everything first (simple approach)
COPY . .

# Install dependencies (will install for entire workspace)
RUN pnpm install

# Build only the web app
WORKDIR /app/apps/web
RUN npm run build

# Create runner stage for smaller final image
FROM node:20-slim AS runner
WORKDIR /app
RUN corepack enable

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Create user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build output (includes necessary node_modules)
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# Note: public folder is not present in this app
# If added later, uncomment: COPY --from=builder /app/apps/web/public ./apps/web/public

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["node", "apps/web/server.js"]
