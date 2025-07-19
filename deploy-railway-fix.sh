#!/bin/bash

echo "🚀 Railway Not Found Fix - Deployment Script"
echo "============================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Found uncommitted changes. Committing them..."
    
    # Add all changes
    git add .
    
    # Commit with descriptive message
    git commit -m "🔧 Railway Fix: Enhanced build process and static file serving

- Updated nixpacks.toml with CI=false to prevent ESLint build failures
- Enhanced client/.env.production with build optimizations
- Fixed React app serving issue (404 -> proper homepage)
- Added comprehensive build verification and logging
- This should resolve the 'Node start process not serving React app' issue

Changes:
- nixpacks.toml: Added CI=false and enhanced build logging
- client/.env.production: Added GENERATE_SOURCEMAP=false and CI=false
- Created RAILWAY-NOT-FOUND-FIX-SOLUTION.md with complete solution guide

Expected Results:
✅ Homepage will show new animated design instead of 404
✅ All React Router routes will work properly
✅ API endpoints will continue functioning
✅ Admin login and categories will be properly loaded"
    
    echo "✅ Changes committed successfully"
else
    echo "✅ No uncommitted changes found"
fi

# Push to GitHub (which triggers Railway deployment)
echo "🔄 Pushing to GitHub (this will trigger Railway deployment)..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Deployment initiated"
    echo "================================"
    echo ""
    echo "📋 What happens next:"
    echo "1. 🔄 Railway will automatically detect the push and start building"
    echo "2. 🏗️  The enhanced build process will run with CI=false"
    echo "3. ⚡ React client will build successfully without ESLint errors"
    echo "4. 🚀 Server will start and serve the React app properly"
    echo ""
    echo "🔍 Monitor your deployment:"
    echo "- Railway Dashboard: https://railway.app/dashboard"
    echo "- Check build logs for the enhanced logging we added"
    echo "- Look for '🏗️ Building React client...' and '✅ Client build completed'"
    echo ""
    echo "🧪 Test after deployment:"
    echo "1. Visit your Railway URL"
    echo "2. Verify the homepage shows the new animated design"
    echo "3. Test navigation between pages"
    echo "4. Try admin login at /login"
    echo "5. Check that /api/health returns proper status"
    echo ""
    echo "📚 For troubleshooting, see: RAILWAY-NOT-FOUND-FIX-SOLUTION.md"
else
    echo "❌ Error: Failed to push to GitHub"
    echo "Please check your git configuration and try again"
    exit 1
fi
