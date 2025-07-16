# Docker and Deployment Guide for Analytical Testing Laboratory

This guide provides comprehensive information about the Docker setup for the Analytical Testing Laboratory application and various deployment options.

## Table of Contents

- [Docker Configuration](#docker-configuration)
- [Local Development with Docker](#local-development-with-docker)
- [Testing Docker Setup](#testing-docker-setup)
- [Deployment Options](#deployment-options)
  - [Render Deployment](#render-deployment)
  - [GitHub Actions Integration](#github-actions-integration)
- [Environment Variables](#environment-variables)
- [Database Management](#database-management)
- [File Storage](#file-storage)
- [Troubleshooting](#troubleshooting)

## Docker Configuration

The application is containerized using Docker with the following key files:

- **Dockerfile**: Multi-stage build process optimized for production
- **docker-compose.yml**: Local development setup with PostgreSQL database
- **.dockerignore**: Excludes unnecessary files from the Docker image
- **test-docker-locally.bat**: Windows script to test the Docker setup locally
- **test-docker-locally.sh**: Unix/Linux script to test the Docker setup locally

### Key Features of the Docker Setup

- **Multi-stage build**: Optimizes image size and security
- **Alpine Linux base**: Minimizes image size
- **Non-root user**: Enhances security
- **Health checks**: Monitors container health
- **Volume mounts**: Persists data between container restarts
- **Production optimizations**: Includes only production dependencies

## Local Development with Docker

To run the application locally using Docker:

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

This will start:
- PostgreSQL database on port 5432
- Web application on port 3000

### Accessing Local Services

- **Frontend & Backend**: http://localhost:3000
- **Database**: localhost:5432 (postgres/password123)
- **Health Check**: http://localhost:3000/api/health

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Access database
docker exec -it analytical-lab-db psql -U postgres -d analytical_lab

# Access app container
docker exec -it analytical-lab-app sh
```

## Testing Docker Setup

We've provided scripts to test your Docker setup before deployment:

### For Windows Users

Run the `test-docker-locally.bat` script:

```
test-docker-locally.bat
```

### For Unix/Linux/Mac Users

Run the `test-docker-locally.sh` script:

```bash
# Make the script executable first
chmod +x test-docker-locally.sh
./test-docker-locally.sh
```

These scripts will:
1. Check if Docker and Docker Compose are installed
2. Build the Docker images
3. Start the containers
4. Verify the application is running
5. Check the health endpoint
6. Provide a summary of the test results

## Deployment Options

### Render Deployment

Render is a cloud platform that makes it easy to deploy Docker applications. We've provided a `render.yaml` file that defines the services needed for deployment.

For detailed instructions on deploying to Render, see the [RENDER-DEPLOYMENT-GUIDE.md](RENDER-DEPLOYMENT-GUIDE.md) file.

Key steps:
1. Create a Render account
2. Connect your GitHub repository
3. Use the Blueprint (render.yaml) to deploy
4. Configure environment variables
5. Monitor the deployment

### GitHub Actions Integration

We've set up GitHub Actions to automatically deploy your application to Render whenever you push changes to your main branch.

For detailed instructions on setting up GitHub Actions, see the [GITHUB-ACTIONS-SETUP.md](GITHUB-ACTIONS-SETUP.md) file.

Key steps:
1. Get your Render API key
2. Get your Render service ID
3. Add secrets to your GitHub repository
4. Push changes to trigger automatic deployment

## Environment Variables

The application requires several environment variables to function properly. These can be set in your deployment platform or locally in a `.env` file.

### Required Variables

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-admin-password
```

### Optional Variables

```
FRONTEND_URL=https://your-domain.com
ALLOWED_ORIGINS=https://your-domain.com
```

See the `.env.example` file for a complete list of environment variables.

## Database Management

The application uses PostgreSQL for data storage. The database is automatically provisioned when deploying to Render.

### Database Migrations

The application will automatically run migrations on startup. If you need to run migrations manually:

```bash
# Access your container
docker exec -it analytical-lab-app sh

# Run migrations
cd server
npm run migrate
```

### Database Backup and Restore

To backup your database:

```bash
# For local development
docker exec -it analytical-lab-db pg_dump -U postgres -d analytical_lab > backup.sql

# For Render
# Use the Render dashboard to create a backup
```

To restore your database:

```bash
# For local development
cat backup.sql | docker exec -i analytical-lab-db psql -U postgres -d analytical_lab

# For Render
# Use the Render dashboard to restore a backup
```

## File Storage

The application stores uploaded files in the `/app/server/uploads` directory inside the container. This directory is mounted as a volume in the `docker-compose.yml` file to persist data between container restarts.

When deploying to Render, you'll need to configure a disk to persist uploaded files. See the [RENDER-DEPLOYMENT-GUIDE.md](RENDER-DEPLOYMENT-GUIDE.md) file for instructions.

## Troubleshooting

### Common Issues

#### Docker Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### Database Connection Fails

- Check the `DATABASE_URL` environment variable
- Ensure the database service is running
- Verify network connectivity

#### Container Exits Immediately

- Check the container logs: `docker-compose logs app`
- Verify environment variables are set correctly
- Check for syntax errors in your code

#### Health Check Fails

- Check the application logs: `docker-compose logs app`
- Verify the application is running: `curl http://localhost:3000/api/health`
- Check for errors in the startup process

### Getting Help

If you encounter issues not covered in this guide:

1. Check the container logs: `docker-compose logs`
2. Verify environment variables are set correctly
3. Test the application locally without Docker
4. Check the Render documentation for platform-specific issues
