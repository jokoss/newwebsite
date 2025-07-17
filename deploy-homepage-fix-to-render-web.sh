#!/bin/bash

# Script to deploy the homepage fix to Render Web Service
# This script runs the necessary scripts to fix the blank homepage issue on Render

echo "Deploying homepage fix to Render Web Service..."

# Create the ApiErrorHandler component
echo "Creating ApiErrorHandler component..."
node server/scripts/create-api-error-handler.js

# Add health endpoints to the server
echo "Adding health endpoints to the server..."
node server/scripts/add-health-endpoints.js

# Update the HomePage component for better Render compatibility
echo "Updating HomePage component for better Render compatibility..."
node server/scripts/update-homepage-for-render.js

# Check if render.json exists, create it if it doesn't
if [ ! -f "render.json" ]; then
  echo "Creating render.json..."
  cat > render.json << EOF
{
  "services": [
    {
      "type": "web",
      "name": "analytical-lab-website",
      "env": "node",
      "plan": "starter",
      "buildCommand": "npm run render-build",
      "startCommand": "npm run render-start",
      "healthCheckPath": "/api/health",
      "autoDeploy": true,
      "envVars": [
        {
          "key": "NODE_ENV",
          "value": "production"
        },
        {
          "key": "PORT",
          "value": "10000"
        },
        {
          "key": "JWT_SECRET",
          "generateValue": true
        }
      ],
      "disk": {
        "name": "uploads",
        "mountPath": "/opt/render/project/src/server/uploads",
        "sizeGB": 1
      }
    }
  ]
}
EOF
fi

# Check if package.json has the necessary scripts for Render
if ! grep -q "render-build" package.json; then
  echo "Adding Render scripts to package.json..."
  # Use a temporary file to avoid issues with in-place editing
  jq '.scripts += {"render-build": "npm install && cd server && npm install && cd ../client && npm install && npm run build && cd .. && node server/scripts/ensure-uploads-directory.js", "render-start": "node server/index.js"}' package.json > package.json.tmp
  mv package.json.tmp package.json
fi

# Commit the changes
echo "Committing changes..."
git add .
git commit -m "Fix blank homepage issue on Render"

# Check if the render remote exists
if git remote | grep -q "render"; then
  echo "Pushing changes to Render..."
  git push render master
else
  echo "Render remote not found. Please set up the Render remote with:"
  echo "git remote add render <your-render-git-url>"
  echo "Then push the changes with:"
  echo "git push render master"
fi

echo "Homepage fix deployment completed!"
echo "If you haven't set up the Render remote, please follow the instructions in RENDER-WEB-SERVICE-GUIDE.md"
