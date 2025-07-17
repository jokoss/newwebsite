#!/bin/bash
# Script to deploy the minimal API server to Render

echo "=== DEPLOYING MINIMAL API SERVER TO RENDER ==="
echo "This script will help you deploy the minimal API server to Render."

# Check if Git is installed
if ! command -v git &> /dev/null; then
  echo "❌ Git is not installed. Please install Git first."
  exit 1
fi

# Check if client/build directory exists
if [ ! -d "client/build" ]; then
  echo "❌ client/build directory not found. Building client..."
  cd client
  npm install
  npm run build
  if [ $? -ne 0 ]; then
    echo "❌ Failed to build client. Please check the error messages above."
    cd ..
    exit 1
  fi
  cd ..
fi

# Ensure all files are committed
echo "Checking for uncommitted changes..."
git status --porcelain
if [ $? -ne 0 ]; then
  echo "❌ Failed to check Git status. Please make sure you're in a Git repository."
  exit 1
fi

read -p "Do you want to commit and push all changes? (y/n): " CONTINUE
if [ "$CONTINUE" != "y" ]; then
  echo "Deployment cancelled."
  exit 0
fi

# Commit changes
read -p "Enter commit message: " COMMIT_MSG
git add .
git commit -m "$COMMIT_MSG"
if [ $? -ne 0 ]; then
  echo "❌ Failed to commit changes. Please check the error messages above."
  exit 1
fi

# Push changes
git push
if [ $? -ne 0 ]; then
  echo "❌ Failed to push changes. Please check the error messages above."
  exit 1
fi

echo
echo "Changes have been pushed to the repository."
echo
echo "=== RENDER DEPLOYMENT INSTRUCTIONS ==="
echo "1. Go to https://dashboard.render.com/"
echo "2. Create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Use the following settings:"
echo "   - Build Command: npm install && cd client && npm install && npm run build && cd .."
echo "   - Start Command: node api-server-minimal.js"
echo "   - Environment Variables: "
echo "     * NODE_ENV=production"
echo "     * PORT=5000"
echo
echo "Your minimal API server will be deployed to Render!"
echo

read -p "Do you want to open the Render dashboard now? (y/n): " OPEN_RENDER
if [ "$OPEN_RENDER" = "y" ]; then
  # Try to open the browser based on the OS
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "https://dashboard.render.com/"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "https://dashboard.render.com/"
  else
    # Other OS
    echo "Please open https://dashboard.render.com/ in your browser."
  fi
fi
