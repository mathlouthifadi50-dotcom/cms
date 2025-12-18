#!/bin/bash
set -e

# Wait for PostgreSQL to be ready to accept connections
# Usage: wait-for-postgres.sh [host] [port] [user] [password] [database] [max_attempts]

HOST=${1:-postgres}
PORT=${2:-5432}
USER=${3:-postgres}
PASSWORD=${4:-postgres}
DATABASE=${5:-postgres}
MAX_ATTEMPTS=${6:-30}

echo "Waiting for PostgreSQL to be ready..."
echo "Host: $HOST, Port: $PORT, User: $USER, Database: $DATABASE"

attempt=1
while [ $attempt -le $MAX_ATTEMPTS ]; do
  if PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DATABASE" -c '\q' 2>/dev/null; then
    echo "PostgreSQL is ready!"
    exit 0
  fi
  
  echo "Attempt $attempt/$MAX_ATTEMPTS: PostgreSQL is not ready yet, waiting..."
  sleep 2
  attempt=$((attempt + 1))
done

echo "PostgreSQL failed to become ready after $MAX_ATTEMPTS attempts"
exit 1
