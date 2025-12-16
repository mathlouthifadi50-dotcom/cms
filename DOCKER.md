# Docker & Containerization Setup

This guide helps you get started with the containerized development and deployment setup for the Next.js + Strapi application.

## Quick Start

### Prerequisites

- [Docker](https://www.docker.com/get-started) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+
- Git

### Development Setup

1. **Clone and setup environment**
   ```bash
   git clone <repository-url>
   cd <repository>
   cp .env.example .env
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access applications**
   - Web App: http://localhost:3000
   - Strapi Admin: http://localhost:1337/admin
   - Database Admin: http://localhost:8081 (if using override)
   - Mail Testing: http://localhost:8025 (if using override)

4. **View logs**
   ```bash
   docker-compose logs -f
   ```

### Production Deployment

1. **Setup production environment**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

2. **Deploy to production**
   ```bash
   ./scripts/deploy.sh deploy
   ```

## Docker Services

### Core Services

- **web**: Next.js application (Node.js/React)
- **strapi**: Strapi CMS backend
- **postgres**: PostgreSQL database

### Development Services (docker-compose.override.yml)

- **adminer**: Database administration interface
- **mailhog**: Email testing interface

## Common Commands

### Development
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d web

# View logs
docker-compose logs -f web

# Restart service
docker-compose restart web

# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v
```

### Production
```bash
# Deploy
./scripts/deploy.sh deploy

# Health check
./scripts/deploy.sh health web

# Rollback
./scripts/deploy.sh rollback

# Create backup
./scripts/backup.sh backup daily-backup

# Restore from backup
./scripts/backup.sh restore daily-backup
```

### Database Management
```bash
# Access PostgreSQL
docker exec -it app_postgres psql -U postgres app

# Create database backup
./scripts/backup.sh backup my-backup

# Restore database
./scripts/backup.sh restore my-backup

# Run migrations
docker exec app_strapi npm run strapi migrate:up
```

### Container Management
```bash
# Check container status
docker-compose ps

# Check resource usage
docker stats

# Access container shell
docker exec -it app_web sh
docker exec -it app_strapi sh

# Remove stopped containers
docker container prune -f

# Clean up unused images
docker image prune -f
```

## Environment Configuration

### Development
- Uses `docker-compose.override.yml`
- Hot reload enabled
- SQLite database (easier setup)
- Mail catcher for development emails

### Production
- Uses `docker-compose.yml`
- Optimized multi-stage builds
- PostgreSQL database
- Health checks enabled
- Resource limits configured

## File Structure

```
├── docker-compose.yml           # Production configuration
├── docker-compose.override.yml  # Development overrides
├── apps/
│   ├── web/
│   │   ├── Dockerfile           # Multi-stage build for Next.js
│   │   └── .dockerignore
│   └── strapi/
│       ├── Dockerfile           # Multi-stage build for Strapi
│       └── .dockerignore
├── scripts/
│   ├── deploy.sh               # Deployment automation
│   ├── backup.sh               # Backup/restore utilities
│   └── health-check.sh         # Health monitoring
├── volumes/                    # Persistent data storage
│   ├── postgres/
│   └── strapi/
└── docs/
    └── DEPLOYMENT.md           # Comprehensive deployment guide
```

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs service_name

# Check configuration
docker-compose config

# Rebuild container
docker-compose build --no-cache service_name
```

### Database Connection Issues
```bash
# Test database connectivity
docker exec app_web nc -zv postgres 5432

# Check database status
docker exec app_postgres pg_isready -U postgres
```

### Port Conflicts
```bash
# Check what's using a port
lsof -i :3000

# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Maps host port 3001 to container port 3000
```

### Performance Issues
```bash
# Monitor resource usage
docker stats

# Check disk usage
docker system df
df -h

# Clean up unused resources
docker system prune -a
```

## Security Considerations

### Production Security
- Change default passwords
- Use environment variables for secrets
- Enable SSL/TLS
- Configure firewall rules
- Regular security updates

### Secrets Management
- Use strong passwords for all accounts
- Rotate secrets regularly
- Never commit secrets to version control
- Use Docker secrets in swarm mode
- Consider using external secret management (AWS Secrets Manager, etc.)

## Performance Optimization

### Resource Limits
Docker Compose includes resource limits for production:
- Web: 1GB RAM limit
- Strapi: 1GB RAM limit  
- PostgreSQL: 2GB RAM limit

### Caching
- Multi-stage Docker builds
- Docker layer caching
- npm/pnpm caching in builds
- CDN for static assets (production)

### Monitoring
- Built-in health checks
- Log aggregation
- Resource monitoring
- Performance metrics

## Development Workflow

### Local Development
1. Make code changes
2. Hot reload automatically updates containers
3. Test changes locally
4. Commit and push to Git

### Staging Deployment
1. Push to staging branch
2. CI/CD pipeline builds and deploys
3. Run integration tests
4. Test on staging environment

### Production Deployment
1. Merge to main branch
2. CI/CD builds production images
3. Automated deployment with zero-downtime
4. Health checks verify deployment
5. Monitoring alerts if issues detected

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment)
- [Strapi Deployment Guide](https://docs.strapi.io/developer-docs/latest/update-migration-guides/deployment.html)
- [PostgreSQL Docker Documentation](https://hub.docker.com/_/postgres)
- [Complete Deployment Guide](./docs/DEPLOYMENT.md)

## Getting Help

- Check application logs: `docker-compose logs`
- Run health checks: `./scripts/health-check.sh`
- Review deployment guide: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- Check container status: `docker-compose ps`

For issues or questions:
1. Check this README
2. Review the deployment guide
3. Check container logs
4. Run health checks
5. Contact the development team