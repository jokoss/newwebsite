#!/bin/bash

# Script to deploy the Railway 404 Not Found fix

echo "🚀 Deploying Railway 404 Not Found Fix"
echo "======================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git and try again."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "❌ Not in a git repository. Please run this script from within your project's git repository."
    exit 1
fi

# Create a new branch for the fix
BRANCH_NAME="railway-not-found-fix-$(date +%Y%m%d%H%M%S)"
echo "📁 Creating new branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME

# Add the modified files
echo "📝 Adding modified files to git"
git add package.json nixpacks.toml RAILWAY-NOT-FOUND-FIX-SOLUTION.md

# Commit the changes
echo "💾 Committing changes"
git commit -m "Fix: Serve React app from Express server to resolve 404 Not Found issue"

# Push to the remote repository
echo "📤 Pushing changes to remote repository"
git push -u origin $BRANCH_NAME

echo ""
echo "✅ Changes pushed to branch: $BRANCH_NAME"
echo ""
echo "Next steps:"
echo "1. Create a pull request on GitHub to merge these changes"
echo "2. After merging, Railway will automatically deploy the changes"
echo "3. Verify that the root URL now serves the React app instead of returning a 404 error"
echo ""
echo "To test locally before deploying, run:"
echo "npm run build && npm start"
echo ""
