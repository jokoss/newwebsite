#!/bin/bash

# Deploy Render Fix Script
# This script ensures all necessary files and configurations are in place for Render deployment

echo "=== Render Deployment Fix Script ==="
echo "Starting pre-deployment checks and fixes..."

# Set error handling
set -e

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Ensure server directory exists
if [ ! -d "server" ]; then
    echo "Error: server directory not found."
    exit 1
fi

# Ensure client directory exists
if [ ! -d "client" ]; then
    echo "Error: client directory not found."
    exit 1
fi

# Check for Dockerfile
if [ ! -f "Dockerfile" ]; then
    echo "Error: Dockerfile not found."
    exit 1
fi

# Ensure uploads directory exists
echo "Ensuring uploads directory exists..."
mkdir -p server/uploads
touch server/uploads/.gitkeep

# Check if node_modules exists in server (will be created during build)
echo "Server directory structure verified."

# Check if client build directory will be created
echo "Client directory structure verified."

# Verify package.json has required scripts
echo "Checking package.json scripts..."
if ! grep -q '"start"' package.json; then
    echo "Warning: No start script found in package.json"
fi

# Check for environment variables (they should be set in Render dashboard)
echo "Environment variables should be configured in Render dashboard:"
echo "- NODE_ENV=production"
echo "- DATABASE_URL (if using database)"
echo "- JWT_SECRET (if using authentication)"
echo "- Any other required environment variables"

# Ensure proper file permissions
echo "Setting proper file permissions..."
chmod +x deploy-render-fix.sh 2>/dev/null || true

# Success message
echo "=== Pre-deployment checks completed successfully ==="
echo "Ready for Render deployment!"

exit 0
