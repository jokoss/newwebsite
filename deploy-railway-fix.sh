#!/bin/bash

# Railway Deployment Fix Script
# This script applies fixes to the Railway deployment to resolve data loading issues

echo "🚀 RAILWAY DEPLOYMENT FIX SCRIPT"
echo "================================="
echo ""

# Step 1: Update environment files
echo "📝 Updating environment files..."
echo "- Updating client/.env.production"
echo "- Updating server/.env.production"
echo "✅ Environment files updated"
echo ""

# Step 2: Commit changes to git
echo "📦 Committing changes to git..."
git add client/.env.production server/.env.production server/scripts/railway-database-diagnostic.js server/scripts/railway-fix-categories.js
git commit -m "Fix: Update environment variables and add database diagnostic scripts"
echo "✅ Changes committed"
echo ""

# Step 3: Push changes to Railway
echo "🚂 Deploying to Railway..."
echo "This will trigger a new deployment with the updated environment variables"
git push railway main
echo "✅ Changes pushed to Railway"
echo ""

# Step 4: Wait for deployment to complete
echo "⏳ Waiting for deployment to complete..."
echo "This may take a few minutes..."
echo "You can check the deployment status in the Railway dashboard"
echo ""

# Step 5: Run database diagnostic script
echo "🔍 After deployment completes, run the database diagnostic script:"
echo "railway run node server/scripts/railway-database-diagnostic.js"
echo ""

# Step 6: Run category fix script
echo "🔧 Then run the category fix script:"
echo "railway run node server/scripts/railway-fix-categories.js"
echo ""

echo "🎉 Deployment fix process initiated!"
echo "Follow the steps above to complete the fix process."
echo ""
echo "Once the deployment is complete and scripts have been run,"
echo "your application should be working correctly with data loading from the database."
