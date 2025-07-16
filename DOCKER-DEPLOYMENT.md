# Docker Deployment Guide

This guide covers deploying your Analytical Testing Laboratory application using Docker, both locally and to cloud platforms.

## 🐳 Docker Setup Overview

Your application is now containerized with:
- **Multi-stage Dockerfile** - Optimized for production
- **docker-compose.yml** - Local development with PostgreSQL
- **Health checks** - Container monitoring
- **Security** - Non-root user, minimal attack surface

## 📋 Prerequisites

- Docker installed on your system
- Docker Compose installed
- Git repository access

## 🚀 Local Development

### 1. Build and Run with Docker Compose

```bash
# Clone the repository (if not already done)
git clone https://github.com/jokoss/newwebsite.git
cd newwebsite

# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 2. Access Your Application

- **Frontend & Backend**: http://localhost:3000
- **Database**: localhost:5432 (postgres/password123)
- **Health Check**: http://localhost:3000/api/health

### 3. Useful Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up --build

# Access database
docker exec -it analytical-lab-db psql -U postgres -d analytical_lab

# Access app container
docker exec -it analytical-lab-app sh
```

## ☁️ Cloud Deployment Options

### Option 1: Railway (Recommended)

**Why Railway?**
- ✅ Free tier available
- ✅ Automatic Docker deployment
- ✅ Built-in PostgreSQL
- ✅ GitHub integration
- ✅ Custom domains

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Docker and deploys
6. Add PostgreSQL service from Railway dashboard
7. Set environment variables (see below)

### Option 2: Render

**Steps:**
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create new "Web Service"
4. Select "Docker" as environment
5. Add PostgreSQL database service
6. Configure environment variables

### Option 3: DigitalOcean App Platform

**Steps:**
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app from GitHub
3. Select "Dockerfile" as source
4. Add managed PostgreSQL database
5. Configure environment variables

## 🔧 Environment Variables

Set these variables in your deployment platform:

### Required Variables
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-admin-password
```

### Optional Variables
```bash
FRONTEND_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
```

## 🗄️ Database Setup

### Railway Database Setup
1. In Railway dashboard, click "New" → "Database" → "PostgreSQL"
2. Copy the connection string
3. Set as `DATABASE_URL` environment variable
4. Your app will automatically run migrations on startup

### Manual Database Migration
If you need to run migrations manually:

```bash
# Access your deployed container
docker exec -it your-container-name sh

# Run migrations
cd server
npm run migrate
```

## 🔍 Health Monitoring

Your application includes health checks:

- **Endpoint**: `/api/health`
- **Docker Health Check**: Built into container
- **Response**: JSON with status, timestamp, uptime

Example health check response:
```json
{
  "status": "healthy",
  "timestamp": "2025-07-16T22:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

## 🚨 Troubleshooting

### Build Issues

**Problem**: Docker build fails
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

**Problem**: Permission denied
```bash
# Fix file permissions
chmod +x scripts/*
```

### Runtime Issues

**Problem**: Database connection fails
- Check `DATABASE_URL` environment variable
- Ensure database service is running
- Verify network connectivity

**Problem**: Static files not served
- Ensure React build completed successfully
- Check file paths in Dockerfile
- Verify CORS configuration

### Performance Issues

**Problem**: Slow startup
- Use multi-stage build (already implemented)
- Optimize Docker layers
- Use `.dockerignore` (already included)

## 📊 Production Optimizations

Your Docker setup includes:

### Security
- ✅ Non-root user (nodejs)
- ✅ Minimal base image (Alpine Linux)
- ✅ No unnecessary packages
- ✅ Proper file permissions

### Performance
- ✅ Multi-stage build
- ✅ Layer caching optimization
- ✅ Production dependencies only
- ✅ Compressed image size

### Reliability
- ✅ Health checks
- ✅ Graceful shutdown handling
- ✅ Restart policies
- ✅ Error handling

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Railway
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: railway-app/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

## 📝 Next Steps

1. **Test Locally**: Run `docker-compose up` and test all features
2. **Choose Platform**: Select Railway, Render, or DigitalOcean
3. **Deploy**: Follow platform-specific steps above
4. **Configure Domain**: Set up custom domain (optional)
5. **Monitor**: Set up logging and monitoring
6. **Scale**: Configure auto-scaling if needed

## 🆘 Support

If you encounter issues:

1. Check container logs: `docker-compose logs`
2. Verify environment variables
3. Test health endpoint: `/api/health`
4. Check database connectivity
5. Review platform-specific documentation

---

**Created**: July 16, 2025  
**Docker Version**: 24.0+  
**Node.js Version**: 18 LTS
