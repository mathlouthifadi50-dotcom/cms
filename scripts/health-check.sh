#!/bin/bash
set -e

# Health check script for all services
# Usage: ./health-check.sh [service]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WEB_PORT=${WEB_PORT:-3000}
STRAPI_PORT=${STRAPI_PORT:-1337}
POSTGRES_PORT=${POSTGRES_PORT:-5432}

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_header() {
    echo -e "${BLUE}[HEALTH]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running!"
        return 1
    fi
    log_info "Docker is running"
    return 0
}

# Check if services are running
check_services_running() {
    log_header "Checking if services are running..."
    
    local services=("web" "strapi" "postgres")
    local all_running=true
    
    for service in "${services[@]}"; do
        if docker ps --format "table {{.Names}}" | grep -q "app_${service}"; then
            if docker ps --format "table {{.Names}}\t{{.Status}}" | grep "app_${service}" | grep -q "Up"; then
                log_info "✓ $service container is running"
            else
                log_error "✗ $service container is not healthy"
                all_running=false
            fi
        else
            log_error "✗ $service container is not running"
            all_running=false
        fi
    done
    
    if [ "$all_running" = true ]; then
        log_info "All containers are running"
        return 0
    else
        log_error "Some containers are not running"
        return 1
    fi
}

# Check database health
check_database() {
    log_header "Checking database health..."
    
    # Check if PostgreSQL container is responding
    if docker exec app_postgres pg_isready -U postgres >/dev/null 2>&1; then
        log_info "✓ PostgreSQL is accepting connections"
    else
        log_error "✗ PostgreSQL is not responding"
        return 1
    fi
    
    # Check database connectivity from web app
    if docker exec app_web nc -zv postgres 5432 >/dev/null 2>&1; then
        log_info "✓ Web app can connect to database"
    else
        log_error "✗ Web app cannot connect to database"
        return 1
    fi
    
    # Check database connectivity from strapi
    if docker exec app_strapi nc -zv postgres 5432 >/dev/null 2>&1; then
        log_info "✓ Strapi can connect to database"
    else
        log_error "✗ Strapi cannot connect to database"
        return 1
    fi
    
    return 0
}

# Check web application health
check_web_app() {
    log_header "Checking web application health..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "http://localhost:${WEB_PORT}" >/dev/null 2>&1; then
            log_info "✓ Web application is responding on port ${WEB_PORT}"
            
            # Check if it's actually serving content
            local response=$(curl -s "http://localhost:${WEB_PORT}")
            if [ -n "$response" ]; then
                log_info "✓ Web application is serving content"
                return 0
            else
                log_error "✗ Web application is not serving content"
                return 1
            fi
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    log_error "✗ Web application failed to respond within $((max_attempts * 2)) seconds"
    return 1
}

# Check Strapi health
check_strapi() {
    log_header "Checking Strapi health..."
    
    local max_attempts=60
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "http://localhost:${STRAPI_PORT}/api/health-check" >/dev/null 2>&1; then
            log_info "✓ Strapi API is responding on port ${STRAPI_PORT}"
            return 0
        fi
        
        # Also try the root endpoint
        if curl -f -s "http://localhost:${STRAPI_PORT}" >/dev/null 2>&1; then
            log_info "✓ Strapi is responding on port ${STRAPI_PORT}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    log_error "✗ Strapi failed to respond within $((max_attempts * 2)) seconds"
    return 1
}

# Check Docker Compose configuration
check_compose_config() {
    log_header "Checking Docker Compose configuration..."
    
    if docker-compose config >/dev/null 2>&1; then
        log_info "✓ Docker Compose configuration is valid"
        return 0
    else
        log_error "✗ Docker Compose configuration is invalid"
        return 1
    fi
}

# Check disk space
check_disk_space() {
    log_header "Checking disk space..."
    
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$disk_usage" -lt 80 ]; then
        log_info "✓ Disk usage is healthy: ${disk_usage}%"
        return 0
    elif [ "$disk_usage" -lt 90 ]; then
        log_warn "⚠ Disk usage is high: ${disk_usage}%"
        return 0
    else
        log_error "✗ Disk usage is critical: ${disk_usage}%"
        return 1
    fi
}

# Check memory usage
check_memory() {
    log_header "Checking memory usage..."
    
    local memory_usage=$(free | awk 'FNR==2{printf "%.0f", $3/($3+$4)*100}')
    
    if [ "$memory_usage" -lt 80 ]; then
        log_info "✓ Memory usage is healthy: ${memory_usage}%"
        return 0
    elif [ "$memory_usage" -lt 90 ]; then
        log_warn "⚠ Memory usage is high: ${memory_usage}%"
        return 0
    else
        log_error "✗ Memory usage is critical: ${memory_usage}%"
        return 1
    fi
}

# Check container logs for errors
check_container_logs() {
    log_header "Checking container logs for errors..."
    
    local services=("web" "strapi" "postgres")
    local has_errors=false
    
    for service in "${services[@]}"; do
        local error_count=$(docker logs "app_${service}" 2>&1 | grep -i -E "(error|fatal|critical)" | wc -l)
        
        if [ "$error_count" -eq 0 ]; then
            log_info "✓ $service logs contain no errors"
        else
            log_warn "⚠ $service logs contain $error_count error messages"
            has_errors=true
        fi
    done
    
    if [ "$has_errors" = false ]; then
        return 0
    else
        return 1
    fi
}

# Generate health report
generate_report() {
    log_header "Generating health report..."
    
    local report_file="/tmp/health-report-$(date +%Y%m%d_%H%M%S).txt"
    
    cat > "$report_file" << EOF
Health Check Report
Generated: $(date)
====================

Docker Status:
$(docker --version 2>/dev/null || echo "Docker not running")

Container Status:
$(docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep app || echo "No app containers running")

Resource Usage:
$(docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" | grep app || echo "No app containers stats")

Disk Usage:
$(df -h /)

Memory Usage:
$(free -h)

Recent Logs (last 10 lines):
Web App:
$(docker logs --tail 10 app_web 2>/dev/null || echo "Web container not available")

Strapi:
$(docker logs --tail 10 app_strapi 2>/dev/null || echo "Strapi container not available")

PostgreSQL:
$(docker logs --tail 10 app_postgres 2>/dev/null || echo "PostgreSQL container not available")
EOF
    
    log_info "Health report saved to: $report_file"
    echo "$report_file"
}

# Main health check function
main_health_check() {
    local service=${1:-"all"}
    local exit_code=0
    
    log_info "Starting health check for: $service"
    
    # Always check Docker first
    if ! check_docker; then
        exit_code=1
        return $exit_code
    fi
    
    case "$service" in
        "web")
            check_services_running && check_web_app || exit_code=1
            ;;
        "strapi")
            check_services_running && check_strapi || exit_code=1
            ;;
        "postgres"|"database")
            check_services_running && check_database || exit_code=1
            ;;
        "system")
            check_disk_space && check_memory && check_container_logs || exit_code=1
            ;;
        "all")
            check_services_running || exit_code=1
            check_database || exit_code=1
            check_web_app || exit_code=1
            check_strapi || exit_code=1
            check_disk_space && check_memory && check_container_logs || exit_code=1
            ;;
        *)
            log_error "Unknown service: $service"
            echo "Usage: $0 {all|web|strapi|postgres|database|system}"
            exit 1
            ;;
    esac
    
    # Generate report for all or failed checks
    if [ "$service" = "all" ] || [ $exit_code -ne 0 ]; then
        generate_report
    fi
    
    return $exit_code
}

# Interactive health check
interactive_health_check() {
    echo "Choose health check type:"
    echo "1) All services"
    echo "2) Web application only"
    echo "3) Strapi only"
    echo "4) Database only"
    echo "5) System resources only"
    echo "6) Generate report only"
    
    read -p "Enter choice (1-6): " choice
    
    case $choice in
        1) main_health_check "all" ;;
        2) main_health_check "web" ;;
        3) main_health_check "strapi" ;;
        4) main_health_check "postgres" ;;
        5) main_health_check "system" ;;
        6) generate_report ;;
        *) log_error "Invalid choice"; exit 1 ;;
    esac
}

# Main script logic
if [ "$1" = "interactive" ]; then
    interactive_health_check
else
    main_health_check "$@"
fi