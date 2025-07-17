#!/bin/bash
# Script to deploy homepage fix to Render

echo "=== DEPLOYING HOMEPAGE FIX TO RENDER ==="
echo "This script will:"
echo "1. Run the update-homepage-for-render.js script to update the HomePage.js file"
echo "2. Run the add-health-endpoints.js script to add enhanced health check endpoints"
echo "3. Commit the changes"
echo "4. Push to your repository"
echo "5. Deploy to Render"
echo "6. Provide instructions for running the admin setup script on Render"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git and try again."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "Error: Not in a git repository. Please run this script from your project directory."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Run the update-homepage-for-render.js script
echo
echo "--- Updating HomePage.js for Render ---"
node server/scripts/update-homepage-for-render.js

# Run the add-health-endpoints.js script
echo
echo "--- Adding enhanced health check endpoints ---"
node server/scripts/add-health-endpoints.js

# Add the changes to git
echo
echo "--- Adding changes to git ---"
git add client/src/pages/public/HomePage.js
git add client/src/components/utils/RenderApiErrorHandler.js
git add server/index.js
git add server/scripts/update-homepage-for-render.js
git add server/scripts/add-health-endpoints.js
git add server/scripts/render-admin-setup.js
git add deploy-homepage-fix-to-render.sh
git add deploy-homepage-fix-to-render.bat
git add RENDER-HOMEPAGE-FIX-GUIDE.md
git status

# Prompt for confirmation
read -p "Continue with commit and push? (y/n): " confirm
if [[ $confirm != "y" ]]; then
    echo "Operation cancelled."
    exit 0
fi

# Commit changes
echo
echo "--- Committing changes ---"
git commit -m "Add Render-specific fixes for homepage blank screen issue"

# Push to repository
echo
echo "--- Pushing to repository ---"
branch=$(git rev-parse --abbrev-ref HEAD)
git push origin $branch

echo
echo "=== DEPLOYMENT INSTRUCTIONS ==="
echo "1. Wait for the deployment to complete on Render"
echo "2. Once deployed, go to your Render dashboard"
echo "3. Open your web service"
echo "4. Click on 'Shell' in the sidebar"
echo "5. Run the following command in the Render shell:"
echo "   cd /app && node server/scripts/render-admin-setup.js"
echo
echo "6. After running the script, you should be able to log in with:"
echo "   Username: admin"
echo "   Password: Admin@123456"
echo
echo "7. If you still can't access the homepage, check the script output for errors"
echo "   and make sure all environment variables are correctly set in the Render dashboard:"
echo "   - JWT_SECRET (should be a secure random string, not the default placeholder)"
echo "   - DATABASE_URL (should be set automatically by Render if using their PostgreSQL)"
echo "   - FRONTEND_URL (should match your Render deployment URL)"
echo
echo "8. For more detailed information, refer to the RENDER-HOMEPAGE-FIX-GUIDE.md file"
echo
echo "=== DEPLOYMENT COMPLETE ==="
