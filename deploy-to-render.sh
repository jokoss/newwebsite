#!/bin/bash
# Script to deploy to Render with a single command

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Analytical Testing Laboratory Render Deployment ===${NC}"
echo -e "This script will help you deploy your application to Render."
echo ""

# Check if Git is installed
echo -e "${YELLOW}Checking if Git is installed...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install Git first.${NC}"
    exit 1
else
    echo -e "${GREEN}Git is installed.${NC}"
fi

# Check if we're in a Git repository
echo -e "${YELLOW}Checking if we're in a Git repository...${NC}"
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo -e "${RED}Not in a Git repository. Please run this script from your project directory.${NC}"
    exit 1
else
    echo -e "${GREEN}In a Git repository.${NC}"
fi

# Check for uncommitted changes
echo -e "${YELLOW}Checking for uncommitted changes...${NC}"
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}You have uncommitted changes. Would you like to commit them? (Y/N)${NC}"
    read -r commit
    if [[ $commit =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Enter commit message:${NC}"
        read -r message
        git add .
        git commit -m "$message"
        echo -e "${GREEN}Changes committed.${NC}"
    else
        echo -e "${RED}Deployment aborted. Please commit your changes before deploying.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}No uncommitted changes.${NC}"
fi

# Check if remote exists
echo -e "${YELLOW}Checking if remote repository exists...${NC}"
if ! git remote -v | grep origin &> /dev/null; then
    echo -e "${RED}No remote repository found. Please set up a remote repository first.${NC}"
    exit 1
else
    git remote -v | grep origin
    echo -e "${GREEN}Remote repository found.${NC}"
fi

# Determine default branch
default_branch=$(git symbolic-ref --short HEAD)
echo -e "${YELLOW}Current branch: ${default_branch}${NC}"

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
if ! git push origin "$default_branch"; then
    echo -e "${RED}Failed to push to GitHub. Please check your remote repository configuration.${NC}"
    exit 1
else
    echo -e "${GREEN}Successfully pushed to GitHub.${NC}"
fi

# Open Render dashboard
echo ""
echo -e "${GREEN}Your code has been pushed to GitHub.${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. If this is your first deployment, go to Render.com and set up a new Blueprint using your GitHub repository."
echo "2. If you've already set up the Blueprint, your changes will be automatically deployed."
echo ""
echo -e "${YELLOW}Would you like to open the Render dashboard? (Y/N)${NC}"
read -r open
if [[ $open =~ ^[Yy]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open https://dashboard.render.com
    elif command -v open &> /dev/null; then
        open https://dashboard.render.com
    else
        echo -e "${YELLOW}Could not automatically open browser. Please visit https://dashboard.render.com${NC}"
    fi
    echo -e "${GREEN}Render dashboard opened in your browser.${NC}"
else
    echo -e "${YELLOW}You can manually check your deployment status at https://dashboard.render.com${NC}"
fi

echo ""
echo -e "${YELLOW}=== Deployment Process Complete ===${NC}"
echo -e "${GREEN}Your application is being deployed to Render.${NC}"
echo -e "${GREEN}You can check the deployment status in the Render dashboard.${NC}"
echo ""
echo -e "${YELLOW}For troubleshooting, refer to RENDER-DOCKER-DEPLOYMENT.md${NC}"
