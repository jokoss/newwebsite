# Minimal API Server Deployment Guide

This guide provides instructions for deploying the minimal API server to various platforms.

## Table of Contents

1. [Local Deployment](#local-deployment)
2. [Docker Deployment](#docker-deployment)
3. [Render Deployment](#render-deployment)
4. [GitHub Actions Automated Deployment](#github-actions-automated-deployment)
5. [Troubleshooting](#troubleshooting)

## Local Deployment

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Steps

#### Windows

1. Run the minimal API server:
   ```
   run-minimal-api-server.bat
   ```

2. The server will start on port 5000. Access it at http://localhost:5000

#### Linux/macOS

1. Make the script executable:
   ```
   chmod +x run-minimal-api-server.sh
   ```

2. Run the minimal API server:
   ```
   ./run-minimal-api-server.sh
   ```

3. The server will start on port 5000. Access it at http://localhost:5000

## Docker Deployment

### Prerequisites

- Docker (v20 or higher)
- Client build files (in client/build directory)

### Steps

#### Windows

1. Build and run the Docker container:
   ```
   build-and-run-docker-minimal.bat
   ```

2. The server will start on port 5000. Access it at http://localhost:5000

#### Linux/macOS

1. Make the script executable:
   ```
   chmod +x build-and-run-docker-minimal.sh
   ```

2. Build and run the Docker container:
   ```
   ./build-and-run-docker-minimal.sh
   ```

3. The server will start on port 5000. Access it at http://localhost:5000

### Manual Docker Commands

If you prefer to run Docker commands manually:

1. Build the Docker image:
   ```
   docker build -t minimal-api-server -f Dockerfile.api-minimal .
   ```

2. Run the Docker container:
   ```
   docker run -p 5000:5000 --name minimal-api-server-container minimal-api-server
   ```

## Render Deployment

### Prerequisites

- Git repository with your code
- Render account (https://render.com)

### Option 1: Manual Deployment

#### Windows

1. Run the deployment script:
   ```
   deploy-minimal-to-render.bat
   ```

2. Follow the prompts to commit and push your changes to GitHub.

3. The script will open the Render dashboard where you can create a new Web Service.

#### Linux/macOS

1. Make the script executable:
   ```
   chmod +x deploy-minimal-to-render.sh
   ```

2. Run the deployment script:
   ```
   ./deploy-minimal-to-render.sh
   ```

3. Follow the prompts to commit and push your changes to GitHub.

4. The script will open the Render dashboard where you can create a new Web Service.

### Option 2: Blueprint Deployment

1. Push your code to GitHub, including the `render-minimal.yaml` file.

2. In the Render dashboard, create a new Blueprint.

3. Connect your GitHub repository.

4. Render will automatically detect the `render-minimal.yaml` file and create the services defined in it.

### Render Configuration

When creating a Web Service on Render, use the following settings:

- **Build Command**: `npm install && cd client && npm install && npm run build && cd ..`
- **Start Command**: `node api-server-minimal.js`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: `5000`

## GitHub Actions Automated Deployment

### Prerequisites

- GitHub repository with your code
- Render account with API key

### Setup

1. In your GitHub repository, go to Settings > Secrets and add a new secret:
   - Name: `RENDER_API_KEY`
   - Value: Your Render API key

2. Push your code to GitHub, including the `.github/workflows/deploy-minimal-to-render.yml` file.

3. GitHub Actions will automatically deploy your application to Render when you push changes to the main branch that affect the files specified in the workflow.

## Troubleshooting

### Common Issues

#### "Bad Gateway" Error on Render

If you encounter a "Bad Gateway" error when deploying to Render:

1. Check the Render logs for any errors.
2. Ensure the health check endpoint is working correctly.
3. Verify that the application is listening on the correct port (should be `process.env.PORT`).

#### Docker Build Fails

If the Docker build fails:

1. Ensure Docker is installed and running.
2. Check that the client build files exist in the client/build directory.
3. Verify that the Dockerfile.api-minimal file is correct.

#### Application Crashes on Startup

If the application crashes on startup:

1. Check the logs for any error messages.
2. Ensure all required environment variables are set.
3. Verify that the port is not already in use by another application.

### Getting Help

If you encounter any issues not covered in this guide:

1. Check the application logs for error messages.
2. Consult the Render documentation: https://render.com/docs
3. Search for similar issues on GitHub or Stack Overflow.
4. Contact the development team for assistance.
