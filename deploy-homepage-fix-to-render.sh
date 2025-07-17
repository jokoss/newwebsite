#!/bin/bash
# Script to deploy the homepage fix to Render
# This script applies the fix for the blank homepage issue on Render

# Set error handling
set -e

echo "=== Starting Homepage Fix Deployment to Render ==="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git and try again."
    exit 1
fi

# Check if we're in the right directory (project root)
if [ ! -d "client" ] || [ ! -d "server" ]; then
    echo "Error: Please run this script from the project root directory."
    exit 1
fi

# Make sure the update script exists
if [ ! -f "server/scripts/update-homepage-for-render.js" ]; then
    echo "Error: Homepage update script not found."
    echo "Please make sure server/scripts/update-homepage-for-render.js exists."
    exit 1
fi

# Make sure the script is executable
chmod +x server/scripts/update-homepage-for-render.js

# Create a new branch for the fix
BRANCH_NAME="fix/render-homepage-blank-issue"
echo "Creating new branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME

# Run the update script to modify the HomePage component
echo "Applying HomePage fix..."
node server/scripts/update-homepage-for-render.js

# Add health endpoint to server/index.js if it doesn't exist
if ! grep -q "app.get('/api/health'" server/index.js; then
    echo "Adding health endpoint to server/index.js..."
    
    # Find the line where API routes begin
    ROUTES_LINE=$(grep -n "// API routes" server/index.js | cut -d: -f1)
    
    if [ -z "$ROUTES_LINE" ]; then
        # If we can't find the comment, look for another pattern
        ROUTES_LINE=$(grep -n "app.use('/api" server/index.js | head -1 | cut -d: -f1)
    fi
    
    if [ -n "$ROUTES_LINE" ]; then
        # Insert the health endpoint before the first API route
        sed -i "${ROUTES_LINE}i\
// Health check endpoint\n\
app.get('/api/health', (req, res) => {\n\
  res.status(200).json({\n\
    status: 'healthy',\n\
    timestamp: new Date().toISOString(),\n\
    environment: process.env.NODE_ENV || 'development'\n\
  });\n\
});\n" server/index.js
        echo "Health endpoint added successfully."
    else
        echo "Warning: Could not find a good location to add health endpoint."
        echo "You may need to add it manually."
    fi
fi

# Ensure the ensure-server-files.sh script is included in the deployment
if [ ! -f "ensure-server-files.sh" ]; then
    echo "Error: ensure-server-files.sh not found."
    exit 1
fi

# Make sure the script is executable
chmod +x ensure-server-files.sh

# Update render.yaml to include the fix
if [ -f "render.yaml" ]; then
    echo "Updating render.yaml to include the homepage fix..."
    
    # Check if the file already has the preDeployCommand
    if grep -q "preDeployCommand:" render.yaml; then
        # Update existing preDeployCommand
        sed -i 's|preDeployCommand:.*|preDeployCommand: ./ensure-server-files.sh \&\& node ./server/scripts/update-homepage-for-render.js|g' render.yaml
    else
        # Add preDeployCommand after the buildCommand
        sed -i '/buildCommand:/a\  preDeployCommand: ./ensure-server-files.sh \&\& node ./server/scripts/update-homepage-for-render.js' render.yaml
    fi
    
    echo "render.yaml updated successfully."
else
    echo "Warning: render.yaml not found. You may need to configure Render manually."
fi

# Commit the changes
echo "Committing changes..."
git add server/scripts/update-homepage-for-render.js
git add client/src/pages/public/HomePage.js
git add server/index.js
git add render.yaml
git add deploy-homepage-fix-to-render.sh
git commit -m "Fix: Prevent blank homepage on Render deployment"

# Push to remote (optional - uncomment if you want to push automatically)
# echo "Pushing changes to remote..."
# git push -u origin $BRANCH_NAME

echo "=== Homepage Fix Deployment Preparation Complete ==="
echo ""
echo "Next steps:"
echo "1. Review the changes with 'git diff main'"
echo "2. Push the changes to your repository with 'git push -u origin $BRANCH_NAME'"
echo "3. Create a pull request and merge to main"
echo "4. Deploy to Render from the main branch"
echo ""
echo "The homepage should now display correctly on Render!"
