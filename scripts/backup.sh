#!/bin/bash
set -e

# Database backup and restore script
# Usage: ./backup.sh {backup|restore} [backup_name]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
POSTGRES_CONTAINER="app_postgres"
STRAPI_CONTAINER="app_strapi"

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to create backup
create_backup() {
    local backup_name=${1:-$(date +%Y%m%d_%H%M%S)}
    local backup_path="$BACKUP_DIR/$backup_name"
    
    log_info "Creating backup: $backup_name"
    
    mkdir -p "$backup_path"
    cd "$backup_path"
    
    # Backup PostgreSQL database
    log_info "Backing up PostgreSQL database..."
    docker exec "$POSTGRES_CONTAINER" pg_dump -U postgres app > database_backup.sql
    gzip database_backup.sql
    
    # Backup Strapi uploads and data
    log_info "Backing up Strapi uploads..."
    docker cp "$STRAPI_CONTAINER:/app/uploads" uploads || log_warn "No uploads found"
    
    log_info "Backing up Strapi data..."
    docker cp "$STRAPI_CONTAINER:/app/.strapi" strapi_data || log_warn "No Strapi data found"
    
    # Create metadata file
    cat > backup_info.json << EOF
{
  "name": "$backup_name",
  "created_at": "$(date -Iseconds)",
  "database": "postgresql",
  "strapi_version": "$(docker exec "$STRAPI_CONTAINER" npm list @strapi/strapi | grep @strapi/strapi | cut -d@ -f3)",
  "node_version": "$(docker exec "$STRAPI_CONTAINER" node --version)",
  "docker_images": {
    "postgres": "$(docker inspect --format='{{.Config.Image}}' "$POSTGRES_CONTAINER")",
    "strapi": "$(docker inspect --format='{{.Config.Image}}' "$STRAPI_CONTAINER")"
  }
}
EOF
    
    # Create compressed archive
    cd ..
    tar -czf "${backup_name}.tar.gz" "$backup_name"
    rm -rf "$backup_name"
    
    log_info "Backup completed: $backup_path/${backup_name}.tar.gz"
}

# Function to restore backup
restore_backup() {
    local backup_name=$1
    
    if [[ -z "$backup_name" ]]; then
        log_error "Backup name required for restore"
        exit 1
    fi
    
    local backup_file="$BACKUP_DIR/${backup_name}.tar.gz"
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log_info "Restoring backup: $backup_name"
    
    # Create temporary restore directory
    local restore_dir="/tmp/restore_$(date +%s)"
    mkdir -p "$restore_dir"
    cd "$restore_dir"
    
    # Extract backup
    tar -xzf "$backup_file"
    local backup_data=$(find . -name "backup_info.json" -exec dirname {} \; | head -1)
    
    if [[ -z "$backup_data" ]]; then
        log_error "Invalid backup format"
        exit 1
    fi
    
    # Stop services
    log_info "Stopping services..."
    docker-compose down
    
    # Restore database
    if [[ -f "$backup_data/database_backup.sql.gz" ]]; then
        log_info "Restoring PostgreSQL database..."
        zcat "$backup_data/database_backup.sql.gz" | docker exec -i app_postgres psql -U postgres app
    fi
    
    # Restore Strapi uploads
    if [[ -d "$backup_data/uploads" ]]; then
        log_info "Restoring Strapi uploads..."
        docker cp "$backup_data/uploads" "$STRAPI_CONTAINER:/app/"
    fi
    
    # Restore Strapi data
    if [[ -d "$backup_data/strapi_data" ]]; then
        log_info "Restoring Strapi data..."
        docker cp "$backup_data/strapi_data/.strapi" "$STRAPI_CONTAINER:/app/"
    fi
    
    # Start services
    log_info "Starting services..."
    docker-compose up -d
    
    # Cleanup
    rm -rf "$restore_dir"
    
    log_info "Restore completed: $backup_name"
}

# Function to list backups
list_backups() {
    log_info "Available backups:"
    
    if [[ ! -d "$BACKUP_DIR" ]] || [[ -z "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]]; then
        log_warn "No backups found"
        return
    fi
    
    for backup in "$BACKUP_DIR"/*.tar.gz; do
        if [[ -f "$backup" ]]; then
            local filename=$(basename "$backup")
            local size=$(du -h "$backup" | cut -f1)
            local date=$(tar -tzf "$backup" | head -1 | sed 's|.*/||' | sed 's|\.tar\.gz$||')
            echo "  - $filename (Size: $size, Date: $date)"
        fi
    done
}

# Function to delete backup
delete_backup() {
    local backup_name=$1
    
    if [[ -z "$backup_name" ]]; then
        log_error "Backup name required for deletion"
        exit 1
    fi
    
    local backup_file="$BACKUP_DIR/${backup_name}.tar.gz"
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    read -p "Are you sure you want to delete backup '$backup_name'? (y/N): " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        rm -f "$backup_file"
        log_info "Backup deleted: $backup_name"
    else
        log_info "Deletion cancelled"
    fi
}

# Function to validate backup
validate_backup() {
    local backup_name=$1
    
    if [[ -z "$backup_name" ]]; then
        log_error "Backup name required for validation"
        exit 1
    fi
    
    local backup_file="$BACKUP_DIR/${backup_name}.tar.gz"
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log_info "Validating backup: $backup_name"
    
    # Test archive integrity
    if tar -tzf "$backup_file" >/dev/null 2>&1; then
        log_info "Archive integrity: OK"
    else
        log_error "Archive integrity: FAILED"
        exit 1
    fi
    
    # Extract and check contents
    local test_dir="/tmp/validate_$(date +%s)"
    mkdir -p "$test_dir"
    cd "$test_dir"
    
    if tar -xzf "$backup_file" 2>/dev/null; then
        local backup_data=$(find . -name "backup_info.json" -exec dirname {} \; | head -1)
        
        if [[ -f "$backup_data/backup_info.json" ]]; then
            log_info "Backup metadata: OK"
            cat "$backup_data/backup_info.json"
        else
            log_error "Backup metadata: MISSING"
        fi
        
        if [[ -f "$backup_data/database_backup.sql.gz" ]]; then
            log_info "Database backup: OK"
        else
            log_error "Database backup: MISSING"
        fi
    else
        log_error "Backup extraction: FAILED"
    fi
    
    # Cleanup
    rm -rf "$test_dir"
    
    log_info "Backup validation completed"
}

# Main script logic
case "${1:-help}" in
    "backup")
        create_backup "$2"
        ;;
    "restore")
        restore_backup "$2"
        ;;
    "list")
        list_backups
        ;;
    "delete")
        delete_backup "$2"
        ;;
    "validate")
        validate_backup "$2"
        ;;
    "help"|*)
        echo "Database Backup/Restore Script"
        echo ""
        echo "Usage: $0 {backup|restore|list|delete|validate} [options]"
        echo ""
        echo "Commands:"
        echo "  backup [name]     Create a new backup (default: timestamp)"
        echo "  restore <name>    Restore from backup"
        echo "  list              List all available backups"
        echo "  delete <name>     Delete a backup"
        echo "  validate <name>   Validate backup integrity"
        echo ""
        echo "Examples:"
        echo "  $0 backup"
        echo "  $0 backup my-backup-$(date +%Y%m%d)"
        echo "  $0 restore my-backup-$(date +%Y%m%d)"
        echo "  $0 validate my-backup-$(date +%Y%m%d)"
        ;;
esac