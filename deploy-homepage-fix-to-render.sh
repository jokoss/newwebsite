#!/bin/bash

# Script to deploy the homepage fix to Render
# This script will commit the changes to the HomePage.js file and push them to the repository
# which will trigger the Render deployment

echo "===== Deploying HomePage fix to Render ====="
echo "This script will commit and push the changes to trigger a Render deployment."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git and try again."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "Error: Not in a git repository. Please run this script from within your git repository."
    exit 1
fi

# Check if there are any changes to commit
if git diff --quiet client/src/pages/public/HomePage.js; then
    echo "No changes detected in HomePage.js. Have you made the necessary changes?"
    read -p "Continue anyway? (y/n): " continue_anyway
    if [[ $continue_anyway != "y" ]]; then
        echo "Deployment cancelled."
        exit 0
    fi
fi

# Add the changed file
git add client/src/pages/public/HomePage.js

# Commit the changes
echo "Committing changes..."
git commit -m "Fix: Update HomePage to handle API connection issues on Render"

# Push to the repository
echo "Pushing changes to remote repository..."
git push

# Check if the push was successful
if [ $? -eq 0 ]; then
    echo "===== Success! ====="
    echo "Changes have been pushed to the repository."
    echo "The Render deployment should be triggered automatically."
    echo "You can check the deployment status on your Render dashboard."
else
    echo "===== Error ====="
    echo "Failed to push changes to the repository."
    echo "Please check your git configuration and try again."
    exit 1
fi

echo "Done!"
