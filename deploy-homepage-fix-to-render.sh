#!/bin/bash
# Script to deploy the homepage fix to Render

# Set error handling
set -e

echo "=== Deploying Homepage Fix to Render ==="
echo "This script will deploy the fixes for the blank homepage issue to Render."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git and try again."
    exit 1
fi

# Check if the required files exist
echo "Checking for required files..."
REQUIRED_FILES=(
    "Dockerfile"
    "ensure-server-files.sh"
    "RENDER-HOMEPAGE-FIX-GUIDE.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Error: Required file $file not found."
        exit 1
    fi
done

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "Error: Not in a git repository. Please run this script from the root of your git repository."
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "There are uncommitted changes in your repository."
    echo "Would you like to commit them? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Committing changes..."
        git add Dockerfile ensure-server-files.sh RENDER-HOMEPAGE-FIX-GUIDE.md
        git commit -m "Fix blank homepage issue on Render deployment"
    else
        echo "Please commit your changes manually and run this script again."
        exit 1
    fi
fi

# Get the current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"

# Check if the remote repository exists
if ! git ls-remote --exit-code origin &> /dev/null; then
    echo "Error: Remote repository 'origin' not found. Please set up a remote repository and try again."
    exit 1
fi

# Push to the remote repository
echo "Pushing changes to remote repository..."
git push origin "$CURRENT_BRANCH"

echo "=== Deployment Preparation Complete ==="
echo "Changes have been pushed to the remote repository."
echo "To complete the deployment, follow these steps:"

echo "1. Go to your Render dashboard: https://dashboard.render.com"
echo "2. Select your service"
echo "3. Click on 'Manual Deploy'"
echo "4. Select 'Clear build cache & deploy'"
echo "5. Wait for the deployment to complete"
echo "6. Test your application to verify the homepage loads correctly"

echo "For more information, see the RENDER-HOMEPAGE-FIX-GUIDE.md file."
