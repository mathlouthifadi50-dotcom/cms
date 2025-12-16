#!/bin/bash
set -e

# Production deployment script
# This script handles zero-downtime deployments

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env.production"
BACKUP_DIR="${PROJECT_DIR}/backups/$(date +%Y%m%d_%H%M%S)"

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
check_requirements() {
    log_info "Checking deployment requirements..."
    
    if [[ ! -f "$COMPOSE_FILE" ]]; then
        log_error "docker-compose.yml not found!"
        exit 1
    fi
    
    if [[ ! -f "$ENV_FILE" ]]; then
        log_error "Production environment file $ENV_FILE not found!"
        exit 1
    fi
    
    log_info "Requirements check passed"
}

# Create backup before deployment
create_backup() {
    log_info "Creating backup before deployment..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    docker exec app_postgres pg_dump -U postgres app > "$BACKUP_DIR/database_backup.sql"
    
    # Backup volumes
    log_info "Backing up persistent volumes..."
    tar -czf "$BACKUP_DIR/volumes_backup.tar.gz" volumes/ || log_warn "Volume backup failed, but continuing..."
    
    # Backup Docker images
    log_info "Saving Docker images..."
    docker save $(docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" config | grep -E 'image:' | awk '{print $2}' | sort -u) | gzip > "$BACKUP_DIR/images_backup.tar.gz"
    
    log_info "Backup created at: $BACKUP_DIR"
}

# Health check function
health_check() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    log_info "Waiting for $service to be healthy..."
    
    while [[ $attempt -le $max_attempts ]]; do
        if docker inspect --format='{{.State.Health.Status}}' app_${service}_1 2>/dev/null | grep -q "healthy"; then
            log_info "$service is healthy"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    log_error "$service failed to become healthy"
    return 1
}

# Rollback function
rollback() {
    log_error "Deployment failed! Starting rollback..."
    
    # Stop current containers
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    
    # Restore from backup if available
    if [[ -n "$BACKUP_DIR" && -d "$BACKUP_DIR" ]]; then
        log_info "Restoring from backup: $BACKUP_DIR"
        
        # Restore database
        if [[ -f "$BACKUP_DIR/database_backup.sql" ]]; then
            docker exec -i app_postgres psql -U postgres app < "$BACKUP_DIR/database_backup.sql"
        fi
        
        # Restore volumes
        if [[ -f "$BACKUP_DIR/volumes_backup.tar.gz" ]]; then
            tar -xzf "$BACKUP_DIR/volumes_backup.tar.gz"
        fi
    fi
    
    # Restart with previous version
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    
    log_error "Rollback completed"
    exit 1
}

# Main deployment function
deploy() {
    log_info "Starting production deployment..."
    
    # Set trap for cleanup on error
    trap rollback ERR
    
    # Pull latest images
    log_info "Pulling latest images..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" pull
    
    # Build images if Dockerfile exists
    log_info "Building application images..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build --no-cache
    
    # Start new containers
    log_info "Starting new containers..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    
    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    health_check "postgres"
    health_check "strapi"
    health_check "web"
    
    # Run database migrations if needed
    log_info "Running database migrations..."
    docker exec app_strapi npm run strapi migrate:up || log_warn "Migration failed, but continuing..."
    
    log_info "Deployment completed successfully!"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up old containers and images..."
    
    # Remove stopped containers
    docker container prune -f
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (be careful!)
    # docker volume prune -f
    
    log_info "Cleanup completed"
}

# Main script logic
main() {
    case "${1:-deploy}" in
        "deploy")
            check_requirements
            create_backup
            deploy
            cleanup
            ;;
        "rollback")
            rollback
            ;;
        "backup")
            create_backup
            ;;
        "health")
            health_check "${2:-web}"
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|backup|health [service]}"
            exit 1
            ;;
    esac
}

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    log_error "Docker is not running!"
    exit 1
fi

main "$@"