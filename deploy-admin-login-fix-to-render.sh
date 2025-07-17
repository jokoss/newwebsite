#!/bin/bash
# Script to deploy admin login fix to Render

echo "=== DEPLOYING ADMIN LOGIN FIX TO RENDER ==="
echo "Current directory: $(pwd)"

# Ensure we're in the project root
if [ ! -d "client" ]; then
  echo "Error: This script must be run from the project root directory"
  exit 1
fi

if [ ! -d "server" ]; then
  echo "Error: This script must be run from the project root directory"
  exit 1
fi

# Run the fix script
echo "Running admin login fix script..."
bash fix-admin-login.sh

# Rebuild the client
echo "Rebuilding client with admin login fixes..."
cd client
npm run build
cd ..

# Create a documentation file for the fix
echo "Creating documentation..."
cat > RENDER-ADMIN-LOGIN-FIX-GUIDE.md << 'EOL'
# Render Admin Login Fix Guide

This document explains the fixes applied to resolve admin login issues on Render deployments.

## Issues Fixed

1. **API Base URL Detection**: Enhanced the API utility to better detect Render deployments and set the correct base URL.
2. **Authentication Error Handling**: Improved error handling for authentication failures, with specific handling for Render-specific issues like cold starts and 502 errors.
3. **Offline/Cold Start Handling**: Added caching mechanisms to handle offline scenarios and cold starts.
4. **Login Page Improvements**: Enhanced the login page with better error messages and connectivity checks.

## Changes Made

1. Updated `client/src/utils/api.js` with:
   - Better Render hostname detection
   - Enhanced error handling for network issues
   - Cache mechanism for API responses
   - Timestamp parameter to prevent caching issues
   - Circuit breaker pattern to prevent cascading failures

2. Updated `client/src/context/AuthContext.js` with:
   - API connectivity checking
   - User data caching for cold starts
   - Better error handling and diagnostics
   - Authentication state persistence improvements

3. Updated `client/src/pages/auth/LoginPage.js` with:
   - Connectivity status display
   - Retry functionality
   - Better error messages
   - Improved UI for error states

## Deployment Notes

When deploying to Render:

1. Ensure the JWT_SECRET environment variable is properly set in Render
2. Verify the DATABASE_URL is correctly configured
3. Check CORS settings to allow requests from the Render domain

## Troubleshooting

If login issues persist:

1. Check browser console for API errors
2. Verify network connectivity to the API endpoints
3. Check if the server is returning 401 or 502 errors
4. Try clearing browser cache and local storage
EOL

echo "✓ Documentation created"

# Commit changes if git is available
if command -v git &> /dev/null; then
  echo "Committing changes..."
  git add client/src/utils/api.js
  git add client/src/context/AuthContext.js
  git add client/src/pages/auth/LoginPage.js
  git add RENDER-ADMIN-LOGIN-FIX-GUIDE.md
  git add fix-admin-login.sh
  git add deploy-admin-login-fix-to-render.sh
  git add deploy-admin-login-fix-to-render.bat
  git commit -m "Fix admin login issues for Render deployment"
  echo "✓ Changes committed"
else
  echo "Git not available, skipping commit"
fi

# Deploy to Render if render CLI is available
if command -v render &> /dev/null; then
  echo "Deploying to Render..."
  render deploy
  echo "✓ Deployment initiated"
else
  echo "Render CLI not available, manual deployment required"
  echo "Please deploy to Render using your preferred method"
fi

echo "=== ADMIN LOGIN FIX DEPLOYMENT COMPLETED ==="
echo "Please check RENDER-ADMIN-LOGIN-FIX-GUIDE.md for documentation"
