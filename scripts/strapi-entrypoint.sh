#!/bin/bash
set -e

# Wait for PostgreSQL to be ready before starting Strapi
echo "Waiting for PostgreSQL to be ready..."

# Use environment variables with defaults
DB_HOST="${DATABASE_HOST:-postgres}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_USER="${DATABASE_USERNAME:-postgres}"
DB_PASSWORD="${DATABASE_PASSWORD:-postgres}"
DB_NAME="${DATABASE_NAME:-app}"

# Wait for PostgreSQL
/usr/local/bin/wait-for-postgres.sh "$DB_HOST" "$DB_PORT" "$DB_USER" "$DB_PASSWORD" "$DB_NAME" 60

echo "PostgreSQL is ready! Starting Strapi..."

# Change to Strapi directory
cd /app/apps/strapi

# Start Strapi using npx to properly resolve the binary in pnpm workspace
# npx will find strapi in node_modules/.bin or in the workspace node_modules
exec npx strapi start
