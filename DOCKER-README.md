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
6. Check dependencies in the container
7. Provide a summary of the test results

### Additional Testing Scripts

We've also provided specialized scripts for more detailed testing:

#### Check API Health

The `check-api-health.js` script tests the API health endpoint:

```bash
# Test local API
node check-api-health.js http://localhost:3000/api/health

# Test deployed API
node check-api-health.js https://your-render-app.onrender.com/api/health
```

#### Check Dependencies

The `check-dependencies.sh` script verifies that all required dependencies are installed in the Docker container:

```bash
# Copy to container and run
docker cp check-dependencies.sh your-container-id:/app/
docker exec your-container-id chmod +x /app/check-dependencies.sh
docker exec your-container-id /app/check-dependencies.sh
```

This script is automatically run as part of the `test-docker-locally.sh` script.

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

### Recent Improvements

We've made several improvements to the Docker setup to address common issues:

1. **Enhanced Dependency Management**:
   - Server dependencies are now installed separately to ensure they're available
   - Added fallback mechanisms to install missing dependencies
   - Added scripts to verify dependency installation

2. **Improved Directory Handling**:
   - Added scripts to try multiple possible directory locations
   - Created symbolic links to persistent storage when available
   - Enhanced permissions management for directories

3. **Better Error Recovery**:
   - Added fallback mechanisms to ensure the server can start even if setup steps fail
   - Created scripts to check for and fix missing server files
   - Added detailed logging for better troubleshooting

4. **Render-Specific Optimizations**:
   - Created minimal setup scripts for Render deployment
   - Added support for Render's persistent disk
   - Improved error handling for Render's environment

### Common Issues

#### Docker Build Fails with "can't cd to server: No such file or directory"

This error occurs during the Docker build process when the `npm run docker-install` script tries to access the `server` directory before it exists. The fix is to create the necessary directories before running the installation scripts:

```dockerfile
# Create directories if they don't exist
RUN mkdir -p server client

# Install dependencies
RUN npm run docker-install
```

This ensures that the directories exist before the npm scripts try to access them.

#### Infinite Loop in npm Scripts

If you see an infinite loop of npm scripts during the Docker build process, with output like this:

```
> analytical-testing-lab@1.0.0 install
> npm run install-server && npm run install-client && npm run install-functions

> analytical-testing-lab@1.0.0 install-server
> cd server && npm install

> analytical-testing-lab@1.0.0 install
> npm run install-server && npm run install-client && npm run install-functions
```

This is caused by a circular dependency in the npm scripts. The solution is to rename the `install` script to something else (like `setup`) to avoid triggering the npm lifecycle script:

```json
"scripts": {
  "setup": "npm run install-server && npm run install-client && npm run install-functions",
  "docker-install": "npm run install-server && npm run install-client"
}
```

This breaks the circular dependency and prevents the infinite loop.

#### Missing Bash in Alpine Docker Image

If you see an error like this during deployment:

```
/bin/sh: bash: not found
==> Exited with status 127
```

This occurs because the Alpine Linux image used in the Dockerfile doesn't include bash by default. There are two ways to solve this:

**Option 1: Add bash to the Docker image**

```dockerfile
# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling and bash for scripts
RUN apk add --no-cache dumb-init bash
```

**Option 2: Make your scripts compatible with sh instead of bash**

1. Change the shebang in your scripts from `#!/bin/bash` to `#!/bin/sh`
2. Modify any bash-specific features to be sh-compatible
3. Update the CMD in your Dockerfile to use sh instead of bash:

```dockerfile
CMD ["/bin/sh", "-c", "sh render-setup.sh && node server/index.js"]
```

Option 2 is more lightweight as it doesn't require installing additional packages in your Docker image.

#### Missing Dependencies

If you see errors like this:

```
Error: Cannot find module 'express'
```

This indicates that Node.js dependencies aren't installed correctly. We've added several fixes for this:

1. **Check if dependencies are installed**:
   ```bash
   docker exec your-container-id /app/check-dependencies.sh
   ```

2. **Install missing dependencies manually**:
   ```bash
   docker exec your-container-id npm install express cors dotenv
   ```

3. **Use the ensure-server-files.sh script**:
   ```bash
   docker exec your-container-id sh /app/ensure-server-files.sh
   ```

This script will check for missing dependencies and install them if needed.

#### Other Docker Build Failures

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
