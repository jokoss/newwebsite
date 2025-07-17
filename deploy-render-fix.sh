#!/bin/bash

# Deploy Render Fix Script
# This script ensures all necessary files and configurations are in place for Render deployment
# Runs inside Docker container during pre-deploy phase

echo "=== Render Deployment Fix Script ==="
echo "Starting pre-deployment checks and fixes..."

# Set error handling
set -e

# Display current working directory and contents for debugging
echo "Current working directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check if we're in the correct directory (container should be in /app)
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Ensure server directory exists
if [ ! -d "server" ]; then
    echo "Error: server directory not found."
    exit 1
fi

# Ensure client directory exists (should contain built files)
if [ ! -d "client" ]; then
    echo "Error: client directory not found."
    exit 1
fi

# Check if client build directory exists (created during Docker build)
if [ ! -d "client/build" ]; then
    echo "Warning: client/build directory not found. This may be normal if build happens later."
else
    echo "Client build directory found."
fi

# Ensure uploads directory exists
echo "Ensuring uploads directory exists..."
mkdir -p server/uploads
touch server/uploads/.gitkeep

# Ensure data directory exists (if needed)
mkdir -p data

# Check if server has node_modules (should exist after Docker build)
if [ ! -d "server/node_modules" ]; then
    echo "Warning: server/node_modules not found. Dependencies should be installed during build."
else
    echo "Server dependencies found."
fi

# Verify package.json has required scripts
echo "Checking package.json scripts..."
if ! grep -q '"start"' package.json; then
    echo "Warning: No start script found in package.json"
else
    echo "Start script found in package.json."
fi

# Check for server/index.js (main entry point)
if [ ! -f "server/index.js" ]; then
    echo "Warning: server/index.js not found."
else
    echo "Server entry point found."
fi

# Check for healthcheck.js
if [ ! -f "healthcheck.js" ]; then
    echo "Warning: healthcheck.js not found."
else
    echo "Healthcheck script found."
fi

# Display environment info
echo "Environment information:"
echo "- NODE_ENV: ${NODE_ENV:-not set}"
echo "- PORT: ${PORT:-not set}"
echo "- Current user: $(whoami)"

# Check for environment variables (they should be set in Render dashboard)
echo "Important environment variables should be configured in Render dashboard:"
echo "- NODE_ENV=production"
echo "- PORT (usually set automatically by Render)"
echo "- DATABASE_URL (if using database)"
echo "- JWT_SECRET (if using authentication)"
echo "- Any other required environment variables"

# Ensure proper file permissions for key files
echo "Setting proper file permissions..."
chmod +x deploy-render-fix.sh 2>/dev/null || true
chmod +x healthcheck.js 2>/dev/null || true

# Success message
echo "=== Pre-deployment checks completed successfully ==="
echo "Container environment validated."
echo "Ready for Render deployment!"

exit 0
