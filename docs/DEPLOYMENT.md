# Production Deployment Guide

This guide covers the complete deployment workflow for the Next.js + Strapi application using Docker containerization and orchestration.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Staging Environment](#staging-environment)
- [Production Environment](#production-environment)
- [Database Management](#database-management)
- [SSL/TLS Configuration](#ssltls-configuration)
- [Cloud Provider Setup](#cloud-provider-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## Overview

The application consists of three main services:

- **Next.js Web Application** (Node.js/React)
- **Strapi CMS** (Node.js/PostgreSQL)
- **PostgreSQL Database** (Primary data store)

### Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Web App   │    │   Strapi    │    │ PostgreSQL  │
│   :3000     │    │   :1337     │    │   :5432     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌─────────────┐
                    │    Nginx    │
                    │ (Reverse    │
                    │   Proxy)    │
                    └─────────────┘
```

### Deployment Strategy

- **Zero-downtime deployments** using rolling updates
- **Multi-stage Docker builds** for optimized image sizes
- **Health checks** and automatic restart policies
- **Persistent volumes** for data durability
- **Backup and restore** procedures
- **SSL termination** at load balancer/reverse proxy

## Prerequisites

### System Requirements

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Node.js** 18+ (for local development)
- **pnpm** (recommended package manager)

### Required Tools

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Security Prerequisites

- **SSL Certificates** (Let's Encrypt recommended)
- **Domain names** configured with DNS
- **Firewall** configured (ports 22, 80, 443, 3000, 1337, 5432)

## Local Development

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd <repository-directory>

# Copy environment files
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/strapi/.env.example apps/strapi/.env.local

# Generate secure secrets
openssl rand -base64 32  # For STRAPI_APP_KEYS, STRAPI_JWT_SECRET, etc.
```

### 2. Development Workflow

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services if needed
docker-compose up -d --scale web=2

# Stop all services
docker-compose down

# Clean restart (removes volumes)
docker-compose down -v
docker-compose up -d
```

### 3. Development Commands

```bash
# Access containers
docker exec -it app_web sh
docker exec -it app_strapi sh
docker exec -it app_postgres psql -U postgres app

# Run database migrations
docker exec app_strapi npm run strapi migrate:up

# Reset database
docker-compose down -v
docker-compose up -d postgres
sleep 10
docker exec app_strapi npm run strapi build
docker exec app_strapi npm run strapi develop
```

## Staging Environment

### 1. Configuration

Create `staging.env`:

```bash
# Domain configuration
DOMAIN=staging.yourapp.com
WEB_PORT=3000
STRAPI_PORT=1337

# Security
NODE_ENV=production
STRAPI_ENV=staging

# Database (use separate database for staging)
DATABASE_NAME=app_staging

# SSL Configuration
SSL_EMAIL=admin@yourapp.com

# Backup configuration
BACKUP_SCHEDULE=0 2 * * *
```

### 2. Staging Deployment

```bash
# Deploy to staging
./scripts/deploy.sh deploy

# Monitor deployment
docker-compose logs -f web strapi

# Run health checks
./scripts/deploy.sh health web
./scripts/deploy.sh health strapi
./scripts/deploy.sh health postgres
```

### 3. Staging to Production Testing

1. **Smoke Tests**
   ```bash
   curl -f https://staging.yourapp.com/health
   curl -f https://staging.yourapp.com/api/health-check
   ```

2. **Database Migration Testing**
   ```bash
   # Test migrations
   docker exec app_strapi npm run strapi migrate:up
   ```

3. **Backup/Restore Testing**
   ```bash
   # Create backup
   ./scripts/backup.sh backup staging-test-$(date +%Y%m%d)
   
   # Test restore
   ./scripts/backup.sh restore staging-test-$(date +%Y%m%d)
   ```

## Production Environment

### 1. Production Configuration

Create `production.env`:

```bash
# Domain configuration
DOMAIN=yourapp.com
WEB_PORT=3000
STRAPI_PORT=1337

# Security
NODE_ENV=production
STRAPI_ENV=production

# Database (production settings)
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true

# SSL Configuration
SSL_EMAIL=admin@yourapp.com

# Monitoring
LOG_LEVEL=warn
SENTRY_DSN=your-sentry-dsn

# Backup Configuration
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
BACKUP_S3_BUCKET=your-production-backups

# Resource Limits
WEB_MEMORY_LIMIT=1g
STRAPI_MEMORY_LIMIT=1g
POSTGRES_MEMORY_LIMIT=2g
```

### 2. Production Deployment

```bash
# Pre-deployment checks
./scripts/pre-deploy-check.sh

# Create backup
./scripts/backup.sh backup pre-deploy-$(date +%Y%m%d_%H%M%S)

# Deploy to production
./scripts/deploy.sh deploy

# Verify deployment
./scripts/post-deploy-healthcheck.sh
```

### 3. Zero-Downtime Deployment Process

```bash
# Blue-Green Deployment
1. Build new version of containers
2. Start new containers alongside old ones
3. Health check new containers
4. Switch traffic (update load balancer)
5. Stop old containers
6. Cleanup old images
```

### 4. Rollback Procedure

```bash
# Automatic rollback on failure
./scripts/deploy.sh rollback

# Manual rollback
./scripts/backup.sh restore <backup-name>
docker-compose up -d
```

## Database Management

### 1. Migrations

```bash
# Run migrations
docker exec app_strapi npm run strapi migrate:up

# Create migration
docker exec app_strapi npm run strapi migrate:create migration_name

# Check migration status
docker exec app_strapi npm run strapi migrate:status
```

### 2. Backup Strategy

#### Automated Backups

```bash
# Set up cron job for daily backups
# Add to crontab: 0 2 * * * /path/to/scripts/backup.sh backup auto-backup-$(date +\%Y\%m\%d)

# Weekly full backups
# Add to crontab: 0 3 * * 0 /path/to/scripts/backup.sh backup full-backup-$(date +\%Y\%W)
```

#### Backup Storage

- **Local storage** (fast, limited space)
- **S3-compatible storage** (scalable, offsite)
- **Multiple regions** (disaster recovery)

```bash
# Upload to S3 after backup
aws s3 cp backups/ s3://your-backup-bucket/ --recursive
```

### 3. Restore Procedures

```bash
# Point-in-time restore
./scripts/backup.sh restore backup-$(date +%Y%m%d)

# Cross-environment restore
./scripts/backup.sh restore backup-name
docker exec app_postgres psql -U postgres app < database_backup.sql
```

### 4. Database Monitoring

```bash
# Monitor database size
docker exec app_postgres psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('app'));"

# Monitor connections
docker exec app_postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Monitor slow queries
docker exec app_postgres psql -U postgres -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

## SSL/TLS Configuration

### 1. Let's Encrypt with Traefik

Add to `docker-compose.yml`:

```yaml
services:
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"  # Dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_certificates:/certificates
    command:
      - --api.insecure=false
      - --api.dashboard=true
      - --certificatesresolvers.letsencrypt.acme.email=admin@yourapp.com
      - --certificatesresolvers.letsencrypt.acme.storage=/certificates/acme.json
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false

volumes:
  traefik_certificates:
```

### 2. Custom SSL Certificates

```bash
# Generate self-signed certificate (development only)
mkdir -p ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes

# Production: Use CA-signed certificates
# Copy to ./ssl/certs/ and ./ssl/private/
```

### 3. SSL Monitoring

```bash
# Check certificate expiry
curl -k https://yourapp.com -I | grep -i "expire"

# Auto-renewal with certbot
certbot renew --dry-run
```

## Cloud Provider Setup

### 1. DigitalOcean Droplet

#### Provisioning Script

```bash
#!/bin/bash
# setup-do-droplet.sh

# Create DigitalOcean Droplet (4GB RAM, 2 vCPU minimum)
# Ubuntu 22.04 LTS x64

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Configure firewall
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8080/tcp  # Traefik dashboard
ufw enable

# Create app user
useradd -m -s /bin/bash app
usermod -aG docker app

# Setup swap
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Install fail2ban
apt install fail2ban -y

# Clone repository
cd /opt
git clone <repository-url>
chown -R app:app /opt/<repository>
```

#### Security Configuration

```bash
# SSH Configuration
# /etc/ssh/sshd_config
Port 2222
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# UFW Firewall Rules
ufw allow 2222/tcp  # Custom SSH port
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 22/tcp     # Block default SSH port
```

### 2. Linode VPS

#### Provisioning Script

```bash
#!/bin/bash
# setup-linode-vps.sh

# Create Linode (Nanode 1GB minimum, Linode 2GB recommended)
# Ubuntu 22.04 LTS

# Update and upgrade
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Configure firewalld
systemctl enable firewalld
systemctl start firewalld
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=8080/tcp  # Traefik dashboard
firewall-cmd --reload

# Install monitoring
apt install htop iotop netstat-nat -y

# Setup monitoring user
useradd -m -s /bin/bash app
usermod -aG docker app
```

#### Linode-specific Optimizations

```bash
# Enable Cloud Firewall
# Create Cloud Firewall in Linode Dashboard:
# - SSH (TCP) 22 from your IP only
# - HTTP (TCP) 80 from anywhere
# - HTTPS (TCP) 443 from anywhere
# - Custom TCP 8080 from your IP only (Traefik dashboard)

# Setup Longview monitoring
curl -o setup.sh https:// linode.com/longview/setup.sh
sh setup.sh
```

### 3. AWS EC2

#### Provisioning Script

```bash
#!/bin/bash
# setup-aws-ec2.sh

# Launch EC2 instance (t3.small minimum, t3.medium recommended)
# Ubuntu Server 22.04 LTS

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configure Security Groups
# - SSH (TCP) 22 from your IP only
# - HTTP (TCP) 80 from anywhere
# - HTTPS (TCP) 443 from anywhere

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Setup CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

## CI/CD Pipeline

### 1. GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run tests
        run: npm test

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha
      
      - name: Build and push Docker images
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd /opt/app
            git pull origin main
            docker-compose pull
            docker-compose up -d
            ./scripts/backup.sh backup auto-backup-$(date +%Y%m%d_%H%M%S)
            ./scripts/deploy.sh health web
            ./scripts/deploy.sh health strapi
```

### 2. GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

services:
  - docker:20.10-dind

test:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm run lint
    - npm run type-check
    - npm test

build:
  stage: build
  image: docker:latest
  services:
    - docker:20.10-dind
  variables:
    IMAGE_NAME: $CI_REGISTRY_IMAGE
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $IMAGE_NAME:$CI_COMMIT_SHA .
    - docker push $IMAGE_NAME:$CI_COMMIT_SHA
  only:
    - main

deploy_production:
  stage: deploy
  image: alpine:latest
  variables:
    DOCKER_HOST: tcp://docker:2376
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - apk add --no-cache docker-cli openssh-client
    - eval $(ssh-agent -s)
    - echo "$PRODUCTION_SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $PRODUCTION_USER@$PRODUCTION_HOST "cd /opt/app && git pull && docker-compose pull && docker-compose up -d"
    - ssh $PRODUCTION_USER@$PRODUCTION_HOST "cd /opt/app && ./scripts/backup.sh backup auto-backup-$(date +%Y%m%d_%H%M%S)"
    - ssh $PRODUCTION_USER@$PRODUCTION_HOST "cd /opt/app && ./scripts/deploy.sh health web && ./scripts/deploy.sh health strapi"
  only:
    - main
  when: manual
```

### 3. Jenkins Pipeline

Create `Jenkinsfile`:

```groovy
pipeline {
    agent any
    
    environment {
        REGISTRY = credentials('registry-url')
        DOCKER_REGISTRY = 'your-registry.com'
    }
    
    stages {
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npm run lint'
                sh 'npm run type-check'
                sh 'npm test'
            }
        }
        
        stage('Build') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_REGISTRY}/app:${env.BUILD_ID}")
                }
            }
        }
        
        stage('Push') {
            steps {
                script {
                    docker.withRegistry('https://' + DOCKER_REGISTRY, 'docker-registry') {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sshagent(['production-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no user@prod-server "
                            cd /opt/app &&
                            git pull &&
                            docker-compose pull &&
                            docker-compose up -d &&
                            ./scripts/backup.sh backup auto-backup-$(date +%Y%m%d_%H%M%S) &&
                            ./scripts/deploy.sh health web &&
                            ./scripts/deploy.sh health strapi
                        "
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            // Notify team of deployment failure
            mail to: 'devops@company.com',
                 subject: 'Deployment Failed: ' + env.JOB_NAME + ' - ' + env.BUILD_NUMBER,
                 body: 'The deployment has failed. Please check the logs.'
        }
    }
}
```

## Monitoring & Maintenance

### 1. Health Checks

```bash
# Application health checks
curl -f https://yourapp.com/health || exit 1
curl -f https://yourapp.com/api/health-check || exit 1

# Database health checks
docker exec app_postgres pg_isready -U postgres || exit 1

# Container health checks
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(Up| unhealthy)"
```

### 2. Resource Monitoring

```bash
# Docker resource usage
docker stats

# Disk usage
docker system df
df -h

# Memory usage
free -h

# CPU usage
top
```

### 3. Log Management

```bash
# View application logs
docker-compose logs -f web strapi

# Log rotation
docker system prune -f
docker volume prune -f

# Centralized logging (optional)
# Configure ELK stack or similar
```

### 4. Performance Monitoring

```bash
# Monitor database performance
docker exec app_postgres psql -U postgres -c "
    SELECT query, mean_time, calls 
    FROM pg_stat_statements 
    ORDER BY mean_time DESC 
    LIMIT 10;
"

# Monitor Next.js performance
curl -s -o /dev/null -w "Time: %{time_total}s\n" https://yourapp.com

# Monitor API performance
curl -s -o /dev/null -w "Time: %{time_total}s\n" https://yourapp.com/api/health-check
```

### 5. Automated Maintenance

Create maintenance script `scripts/maintenance.sh`:

```bash
#!/bin/bash
# Automated maintenance tasks

# Daily tasks
./scripts/backup.sh backup daily-$(date +%Y%m%d)

# Weekly tasks (run on Sundays)
if [ $(date +%w) -eq 0 ]; then
    # Clean old Docker images
    docker image prune -f
    
    # Clean old backups (keep 30 days)
    find backups/ -name "*.tar.gz" -mtime +30 -delete
    
    # Update system packages
    apt update && apt upgrade -y
fi

# Monthly tasks (run on 1st of month)
if [ $(date +%d) -eq 01 ]; then
    # Full system backup
    tar -czf "/backup/full-backup-$(date +%Y%m).tar.gz" /opt/app /etc/nginx /etc/ssl
    
    # Security audit
    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
        aquasec/trivy fs /opt/app
fi
```

## Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check logs
docker-compose logs service_name

# Check resource usage
docker stats

# Restart specific service
docker-compose restart service_name
```

#### 2. Database Connection Issues

```bash
# Test database connectivity
docker exec app_web nc -zv postgres 5432

# Check database logs
docker logs app_postgres

# Verify environment variables
docker exec app_web env | grep DATABASE
```

#### 3. SSL Certificate Issues

```bash
# Check certificate status
curl -v https://yourapp.com 2>&1 | grep -E "(SSL|certificate)"

# Renew Let's Encrypt certificate
docker-compose exec traefik certbot renew

# Check certificate expiry
openssl s_client -connect yourapp.com:443 -servername yourapp.com < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

#### 4. Performance Issues

```bash
# Check resource usage
docker stats --no-stream

# Check database performance
docker exec app_postgres psql -U postgres -c "
    SELECT state, count(*) 
    FROM pg_stat_activity 
    GROUP BY state;
"

# Monitor real-time performance
htop
iotop
```

#### 5. Application Errors

```bash
# Check application logs
docker-compose logs --tail=100 web
docker-compose logs --tail=100 strapi

# Enable debug logging
echo "LOG_LEVEL=debug" >> .env
docker-compose up -d
```

### Emergency Procedures

#### Complete Service Outage

```bash
# 1. Check service status
docker-compose ps

# 2. Restart all services
docker-compose restart

# 3. If that fails, recreate containers
docker-compose down
docker-compose up -d

# 4. If database is down, restore from backup
./scripts/backup.sh restore <latest-backup>
docker-compose up -d
```

#### Data Corruption

```bash
# 1. Stop all services
docker-compose down

# 2. Restore from last known good backup
./scripts/backup.sh restore <backup-name>

# 3. Verify data integrity
docker exec app_postgres pg_dump -U postgres app > test.sql

# 4. Start services
docker-compose up -d
```

#### Security Breach

```bash
# 1. Immediately stop all services
docker-compose down

# 2. Rotate all secrets and passwords
# 3. Update SSL certificates
# 4. Restore from clean backup
./scripts/backup.sh restore <pre-breach-backup>

# 5. Implement additional security measures
# 6. Monitor for further suspicious activity
```

### Getting Help

- **Documentation**: Check this guide and official docs
- **Logs**: Always check logs first when troubleshooting
- **Community**: Docker, Next.js, and Strapi communities
- **Monitoring**: Set up proper monitoring to catch issues early
- **Backups**: Always have tested backup and restore procedures

---

## Summary

This deployment guide provides a comprehensive approach to deploying and maintaining the Next.js + Strapi application in production. Key points:

- **Zero-downtime deployments** using blue-green strategy
- **Automated backups** with testing procedures
- **Security-first approach** with SSL, firewall, and secret management
- **Cloud-provider agnostic** deployment options
- **CI/CD integration** for automated deployments
- **Comprehensive monitoring** and maintenance procedures

For additional support or questions, refer to the troubleshooting section or contact the development team.