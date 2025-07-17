#!/bin/bash
# Script to push the homepage fix changes to the repository

set -e

echo "=== PUSHING HOMEPAGE FIX CHANGES TO REPOSITORY ==="
echo "Current directory: $(pwd)"

# Check if we're in the right directory
if [ ! -f "Dockerfile.api-minimal-enhanced" ] || [ ! -f "render-minimal-enhanced.yaml" ]; then
    echo "Error: Required files not found. Make sure you're in the project root directory."
    exit 1
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
echo "Adding homepage fix files to git..."
git add Dockerfile.api-minimal-enhanced render-minimal-enhanced.yaml
git add client/src/pages/public/HomePage.js
git add RENDER-HOMEPAGE-FIX-GUIDE.md
git add deploy-enhanced-to-render.sh deploy-enhanced-to-render.bat
git add .github/workflows/deploy-homepage-fix.yml
git add push-homepage-fix.sh push-homepage-fix.bat

# Commit the changes
echo "Committing changes..."
git commit -m "Add homepage fix for Render deployment"

# Check if origin remote exists
if ! git remote | grep -q "origin"; then
    echo "Origin remote not found. Please add it manually with:"
    echo "git remote add origin <your-git-repository-url>"
    echo "Then push with: git push -u origin master"
else
    # Push to origin
    echo "Pushing to origin remote..."
    git push origin master
    
    echo "=== PUSH COMPLETED ==="
    echo "Your changes have been pushed to the repository."
    echo "You can now deploy to Render using one of the methods described in RENDER-HOMEPAGE-FIX-GUIDE.md"
fi
