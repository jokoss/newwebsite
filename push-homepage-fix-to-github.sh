#!/bin/bash
# Script to push the homepage fix to GitHub

set -e

echo "=== PUSHING HOMEPAGE FIX TO GITHUB ==="
echo "Current directory: $(pwd)"

# Check if we're in the right directory
if [ ! -f "render.json" ] || [ ! -f "package.json" ]; then
    echo "Error: Required files not found. Make sure you're in the project root directory."
    exit 1
fi

# Run the scripts to add health endpoints and update the homepage
echo "Adding health endpoints to server..."
node server/scripts/add-health-endpoints.js

echo "Updating HomePage component for better Render compatibility..."
node server/scripts/update-homepage-for-render.js

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
git add render.json package.json server/index.js client/src/utils/api.js client/src/pages/public/HomePage.js server/scripts/add-health-endpoints.js server/scripts/update-homepage-for-render.js deploy-homepage-fix-to-render-web.sh deploy-homepage-fix-to-render-web.bat RENDER-HOMEPAGE-FIX-GUIDE.md RENDER-WEB-SERVICE-GUIDE.md

# Commit the changes
echo "Committing changes..."
git commit -m "Fix blank homepage issue on Render Web Service deployment"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin master

echo "=== PUSH COMPLETED ==="
echo "Your changes have been pushed to GitHub."
echo "Now you can deploy to Render using one of the following methods:"
echo "1. Run './deploy-homepage-fix-to-render-web.sh' (Linux/Mac) or 'deploy-homepage-fix-to-render-web.bat' (Windows)"
echo "2. Connect your GitHub repository to Render and deploy through the Render dashboard"
echo "3. Add a Render remote and push directly: git remote add render <your-render-git-url> && git push render master"
