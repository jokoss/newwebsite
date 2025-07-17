#!/bin/bash
# Script to deploy the homepage fix to Render
# This script commits the changes and pushes them to the repository

set -e

echo "=== DEPLOYING HOMEPAGE FIX TO RENDER ==="
echo "Current directory: $(pwd)"

# Check if git is installed
if ! command -v git &> /dev/null; then
  echo "❌ Git is not installed. Please install git and try again."
  exit 1
fi

# Check if the current directory is a git repository
if [ ! -d ".git" ]; then
  echo "❌ The current directory is not a git repository."
  echo "Please run this script from the root of your git repository."
  exit 1
fi

# Check if the required files exist
echo "Checking if the required files exist..."
REQUIRED_FILES=(
  "Dockerfile"
  "ensure-server-files.sh"
  "deploy-render-fix.sh"
  "render.yaml"
  "RENDER-HOMEPAGE-FIX-GUIDE.md"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ $file does not exist."
    echo "Please make sure all required files exist before deploying."
    exit 1
  fi
done

echo "✅ All required files exist."

# Make sure the scripts are executable
echo "Making scripts executable..."
chmod +x ensure-server-files.sh
chmod +x deploy-render-fix.sh
chmod +x deploy-homepage-fix-to-render.sh

# Check if there are any uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "There are uncommitted changes in the repository."
  echo "Do you want to commit these changes? (y/n)"
  read -r response
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    # Add all changes
    git add .
    
    # Commit the changes
    git commit -m "Fix homepage blank screen issue on Render"
    echo "✅ Changes committed."
  else
    echo "❌ Aborting deployment. Please commit your changes manually and try again."
    exit 1
  fi
else
  echo "✅ No uncommitted changes."
fi

# Push the changes to the repository
echo "Pushing changes to the repository..."
git push

echo "✅ Changes pushed to the repository."
echo "The fix will be deployed to Render automatically if you have CI/CD set up."
echo "Otherwise, please deploy manually from the Render dashboard."

echo "=== DEPLOYMENT COMPLETE ==="
echo "See RENDER-HOMEPAGE-FIX-GUIDE.md for more information about the fix."

exit 0
