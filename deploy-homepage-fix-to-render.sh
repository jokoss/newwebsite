#!/bin/bash
# Script to deploy homepage fix to Render

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Deploying Homepage Fix to Render ===${NC}"
echo "This script will help you deploy the fixes for the blank homepage issue to Render."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed. Please install git and try again.${NC}"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo -e "${RED}Error: Not in a git repository. Please run this script from your project directory.${NC}"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}Warning: You have uncommitted changes.${NC}"
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Verify the files we modified exist
echo -e "${GREEN}Verifying modified files...${NC}"
files_to_check=(
    "client/src/pages/public/HomePage.js"
    "server/index.js"
    "client/src/utils/api.js"
    "client/src/index.js"
    "client/src/components/utils/ApiErrorHandler.js"
    "healthcheck.js"
    "Dockerfile"
    "RENDER-HOMEPAGE-FIX-GUIDE.md"
)

missing_files=()
for file in "${files_to_check[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo -e "${RED}Error: The following files are missing:${NC}"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    echo "Please make sure all the required files exist before deploying."
    exit 1
fi

echo -e "${GREEN}All required files found.${NC}"

# Commit changes
echo -e "${GREEN}Committing changes...${NC}"
git add client/src/pages/public/HomePage.js server/index.js client/src/utils/api.js client/src/index.js client/src/components/utils/ApiErrorHandler.js healthcheck.js Dockerfile RENDER-HOMEPAGE-FIX-GUIDE.md

git commit -m "Fix blank homepage issue on Render deployment"

# Push to remote
echo -e "${GREEN}Pushing changes to remote repository...${NC}"
read -p "Do you want to push the changes to the remote repository? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Get current branch
    current_branch=$(git symbolic-ref --short HEAD)
    
    # Push to remote
    if git push origin "$current_branch"; then
        echo -e "${GREEN}Changes pushed successfully.${NC}"
    else
        echo -e "${RED}Failed to push changes. Please push manually.${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Skipping push to remote.${NC}"
fi

# Provide instructions for Render deployment
echo -e "${GREEN}=== Next Steps ===${NC}"
echo -e "To deploy these changes to Render:"
echo -e "1. Go to your Render dashboard: ${YELLOW}https://dashboard.render.com${NC}"
echo -e "2. Select your service"
echo -e "3. Click on 'Manual Deploy'"
echo -e "4. Select 'Clear build cache & deploy'"
echo -e "5. Wait for the deployment to complete"
echo -e "6. Test your application to verify the homepage loads correctly"

echo -e "${GREEN}=== Environment Variables ===${NC}"
echo -e "Make sure the following environment variables are set in your Render dashboard:"
echo -e "- DATABASE_URL: Your PostgreSQL connection string"
echo -e "- JWT_SECRET: Secret for JWT token generation"
echo -e "- FRONTEND_URL: URL of your frontend (e.g., https://your-app.onrender.com)"
echo -e "- NODE_ENV: Set to 'production'"
echo -e "- ALLOWED_ORIGINS: Comma-separated list of allowed origins (should include your Render domain)"

echo -e "${GREEN}=== Troubleshooting ===${NC}"
echo -e "If you encounter any issues, please refer to the RENDER-HOMEPAGE-FIX-GUIDE.md file for troubleshooting steps."

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "Thank you for using the homepage fix deployment script."
