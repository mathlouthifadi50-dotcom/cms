#!/bin/bash
set -e

# Database initialization script for PostgreSQL
# This script runs when the PostgreSQL container starts for the first time

echo "Initializing PostgreSQL database..."

# Wait for PostgreSQL to be ready
wait_for_postgres() {
    echo "Waiting for PostgreSQL to be ready..."
    until PGPASSWORD=$POSTGRES_PASSWORD psql -h "localhost" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
        echo "PostgreSQL is unavailable - sleeping"
        sleep 1
    done
    echo "PostgreSQL is up!"
}

# Execute the function
wait_for_postgres

# Create additional users if needed
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create read-only user for reporting
    CREATE USER app_readonly WITH PASSWORD 'readonly_password';
    GRANT CONNECT ON DATABASE $POSTGRES_DB TO app_readonly;
    GRANT USAGE ON SCHEMA public TO app_readonly;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO app_readonly;

    -- Create application user with full privileges
    CREATE USER app_user WITH PASSWORD 'app_password';
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO app_user;
    GRANT ALL ON SCHEMA public TO app_user;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO app_user;

    -- Set up proper encoding and timezone
    -- Note: Locale settings are skipped for Alpine Linux compatibility
    ALTER DATABASE $POSTGRES_DB SET timezone TO 'UTC';
    ALTER DATABASE $POSTGRES_DB SET default_text_search_config TO 'pg_catalog.english';

    -- Enable necessary extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";

EOSQL

echo "PostgreSQL initialization completed successfully!"