#!/bin/bash
# Script to deploy the application to Render using Web Service approach

set -e

echo "=== DEPLOYING TO RENDER USING WEB SERVICE APPROACH ==="
echo "Current directory: $(pwd)"

# Check if we're in the right directory
if [ ! -f "render.json" ] || [ ! -f "package.json" ]; then
    echo "Error: Required files not found. Make sure you're in the project root directory."
    exit 1
fi

# Check if render-cli is installed
if ! command -v render &> /dev/null; then
    echo "Render CLI not found. Installing render-cli..."
    npm install -g @render/cli
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

# Add all the relevant files
echo "Adding files to git..."
git add render.json package.json server/index.js client/src/utils/api.js client/src/pages/public/HomePage.js

# Commit the changes
echo "Committing changes..."
git commit -m "Update for Render Web Service deployment"

# Check if render remote exists
if ! git remote | grep -q "render"; then
    echo "Render remote not found. Please add it manually with:"
    echo "git remote add render <your-render-git-url>"
    echo "Then push with: git push render master"
    
    # Ask if the user wants to deploy using render-cli instead
    read -p "Do you want to deploy using render-cli instead? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Deploying using render-cli..."
        render blueprint apply
    else
        echo "Exiting. Please add the render remote and push manually."
        exit 0
    fi
else
    # Push to render
    echo "Pushing to render remote..."
    git push render master
    
    echo "=== DEPLOYMENT INITIATED ==="
    echo "Your changes have been pushed to Render."
    echo "The deployment process will continue on Render's servers."
    echo "You can check the status in your Render dashboard."
fi

echo "=== DEPLOYMENT COMPLETED ==="
