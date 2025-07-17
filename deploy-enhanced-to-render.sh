#!/bin/bash
# Script to deploy the enhanced minimal API server to Render
# Updated to work without Render CLI

set -e

echo "=== DEPLOYING ENHANCED MINIMAL API SERVER TO RENDER ==="
echo "Current directory: $(pwd)"

# Check if we're in the right directory
if [ ! -f "Dockerfile.api-minimal-enhanced" ] || [ ! -f "render-minimal-enhanced.yaml" ]; then
    echo "Error: Required files not found. Make sure you're in the project root directory."
    exit 1
fi

# Ensure the client is built
if [ ! -d "client/build" ]; then
    echo "Client build directory not found. Building client..."
    cd client
    npm install
    npm run build
    cd ..
    echo "Client built successfully."
fi

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install git to continue."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "This directory is not a git repository. Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
    echo "Git repository initialized."
fi

# Add and commit changes
echo "Adding and committing changes..."
git add Dockerfile.api-minimal-enhanced render-minimal-enhanced.yaml
git add client/src/pages/public/HomePage.js
git add RENDER-HOMEPAGE-FIX-GUIDE.md
git commit -m "Update deployment files for Render homepage fix"

# Check if remote exists
if ! git remote | grep -q "render"; then
    echo "Render remote not found. Please add it manually with:"
    echo "git remote add render <your-render-git-url>"
    echo "Then push with: git push render master"
    echo ""
    echo "Alternatively, you can deploy directly from the Render dashboard:"
    echo "1. Go to https://dashboard.render.com/"
    echo "2. Create a new Web Service"
    echo "3. Connect your GitHub repository"
    echo "4. Select 'Docker' as the environment"
    echo "5. Set the Docker file path to: Dockerfile.api-minimal-enhanced"
    echo "6. Configure environment variables as specified in render-minimal-enhanced.yaml"
    echo "7. Deploy the service"
else
    # Push to render remote
    echo "Pushing to Render remote..."
    git push render master
    
    echo "=== DEPLOYMENT INITIATED ==="
    echo "Your changes have been pushed to Render."
    echo "Check the deployment status in your Render dashboard."
    echo "Once deployed, the server will be available at your Render URL."
fi

echo ""
echo "=== MANUAL DEPLOYMENT INSTRUCTIONS ==="
echo "If you prefer to deploy manually through the Render dashboard:"
echo "1. Go to https://dashboard.render.com/"
echo "2. Create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Select 'Docker' as the environment"
echo "5. Set the Docker file path to: Dockerfile.api-minimal-enhanced"
echo "6. Configure environment variables as specified in render-minimal-enhanced.yaml"
echo "7. Deploy the service"
