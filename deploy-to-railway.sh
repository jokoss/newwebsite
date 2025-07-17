#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}   Analytical Testing Laboratory - Railway Deployment    ${NC}"
echo -e "${BLUE}=========================================================${NC}"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
    
    # Check if installation was successful
    if ! command -v railway &> /dev/null; then
        echo -e "${RED}Failed to install Railway CLI. Please install it manually:${NC}"
        echo -e "${YELLOW}npm install -g @railway/cli${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}Railway CLI is installed.${NC}"

# Check if user is logged in to Railway
railway whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}You are not logged in to Railway. Please login:${NC}"
    railway login
    
    # Check if login was successful
    railway whoami &> /dev/null
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to login to Railway. Please try again later.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}Successfully logged in to Railway.${NC}"

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${YELLOW}Git repository not initialized. Initializing...${NC}"
    git init
    git add .
    git commit -m "Initial commit for Railway deployment"
fi

# Check if the project is already linked to Railway
if railway list &> /dev/null; then
    echo -e "${GREEN}Project is already linked to Railway.${NC}"
else
    echo -e "${YELLOW}Creating a new Railway project...${NC}"
    railway init
fi

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}                Setting up PostgreSQL                    ${NC}"
echo -e "${BLUE}=========================================================${NC}"

# Check if PostgreSQL is already provisioned
if railway variables | grep -q "DATABASE_URL"; then
    echo -e "${GREEN}PostgreSQL is already provisioned.${NC}"
else
    echo -e "${YELLOW}Adding PostgreSQL to the project...${NC}"
    echo -e "${YELLOW}Please select PostgreSQL when prompted.${NC}"
    railway add
fi

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}              Setting up Environment Variables           ${NC}"
echo -e "${BLUE}=========================================================${NC}"

echo -e "${YELLOW}Setting required environment variables...${NC}"

# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set JWT_SECRET=$JWT_SECRET

# Prompt for admin credentials
echo -e "${YELLOW}Please enter admin email:${NC}"
read admin_email
railway variables set ADMIN_EMAIL=$admin_email

echo -e "${YELLOW}Please enter admin password:${NC}"
read -s admin_password
echo ""
railway variables set ADMIN_PASSWORD=$admin_password

echo -e "${GREEN}Environment variables set successfully.${NC}"

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}                 Deploying Application                   ${NC}"
echo -e "${BLUE}=========================================================${NC}"

echo -e "${YELLOW}Deploying application to Railway...${NC}"
railway up

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Application deployed successfully!${NC}"
    
    # Get the deployment URL
    echo -e "${YELLOW}Generating public URL...${NC}"
    railway domain
    
    echo -e "${BLUE}=========================================================${NC}"
    echo -e "${GREEN}Deployment complete! Your application is now live.${NC}"
    echo -e "${BLUE}=========================================================${NC}"
    echo -e "${YELLOW}To monitor your application, visit:${NC} https://railway.app/dashboard"
else
    echo -e "${RED}Deployment failed. Please check the logs for more information.${NC}"
    exit 1
fi

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}                  Next Steps                             ${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo -e "${YELLOW}1. Set up a custom domain (optional):${NC}"
echo -e "   railway domain"
echo -e "${YELLOW}2. Monitor your application:${NC}"
echo -e "   railway logs"
echo -e "${YELLOW}3. Update your application:${NC}"
echo -e "   git push (Railway will automatically deploy updates)"
echo -e "${BLUE}=========================================================${NC}"
