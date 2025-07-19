#!/bin/bash

# Railway Deployment Fix Script
# This script ensures proper Railway configuration for Node 18 and CRA compatibility

echo "🚂 Railway Deployment Fix Script"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Railway CLI is installed
check_railway_cli() {
    if command -v railway &> /dev/null; then
        print_status "Railway CLI is installed"
        railway --version
    else
        print_warning "Railway CLI not found. Installing..."
        npm install -g @railway/cli
        if [ $? -eq 0 ]; then
            print_status "Railway CLI installed successfully"
        else
            print_error "Failed to install Railway CLI"
            exit 1
        fi
    fi
}

# Verify project configuration
verify_config() {
    print_info "Verifying project configuration..."
    
    # Check package.json
    if [ -f "package.json" ]; then
        NODE_VERSION=$(grep -o '"node": "[^"]*"' package.json | cut -d'"' -f4)
        if [[ $NODE_VERSION == *"18"* ]]; then
            print_status "Node.js version constraint: $NODE_VERSION"
        else
            print_error "Node.js version constraint not set to 18: $NODE_VERSION"
        fi
    else
        print_error "package.json not found"
        exit 1
    fi
    
    # Check .nvmrc
    if [ -f ".nvmrc" ]; then
        NVMRC_VERSION=$(cat .nvmrc)
        if [[ $NVMRC_VERSION == "18" ]]; then
            print_status ".nvmrc version: $NVMRC_VERSION"
        else
            print_warning ".nvmrc version: $NVMRC_VERSION (should be 18)"
        fi
    else
        print_warning ".nvmrc not found"
    fi
    
    # Check nixpacks.toml
    if [ -f "nixpacks.toml" ]; then
        print_status "nixpacks.toml found"
        cat nixpacks.toml
    else
        print_warning "nixpacks.toml not found"
    fi
    
    # Check api-server-minimal.js
    if [ -f "api-server-minimal.js" ]; then
        print_status "api-server-minimal.js found"
    else
        print_error "api-server-minimal.js not found"
        exit 1
    fi
}

# Login to Railway (if not already logged in)
railway_login() {
    print_info "Checking Railway authentication..."
    
    if railway whoami &> /dev/null; then
        USER=$(railway whoami)
        print_status "Already logged in as: $USER"
    else
        print_warning "Not logged in to Railway. Please login..."
        railway login
        if [ $? -eq 0 ]; then
            print_status "Successfully logged in to Railway"
        else
            print_error "Failed to login to Railway"
            exit 1
        fi
    fi
}

# Link to Railway project
link_project() {
    print_info "Linking to Railway project..."
    
    if [ -f ".railway/project.json" ]; then
        PROJECT_ID=$(cat .railway/project.json | grep -o '"projectId": "[^"]*"' | cut -d'"' -f4)
        print_status "Already linked to project: $PROJECT_ID"
    else
        print_warning "Project not linked. Please link to your Railway project..."
        railway link
        if [ $? -eq 0 ]; then
            print_status "Successfully linked to Railway project"
        else
            print_error "Failed to link to Railway project"
            exit 1
        fi
    fi
}

# Set environment variables
set_environment_variables() {
    print_info "Setting Railway environment variables..."
    
    # Ensure Node 18 is used
    railway variables set NODE_VERSION=18.20.4
    railway variables set NPM_CONFIG_PRODUCTION=false
    railway variables set NIXPACKS_NODE_VERSION=18
    
    print_status "Environment variables set"
}

# Deploy to Railway
deploy_to_railway() {
    print_info "Deploying to Railway..."
    
    # Force a fresh deployment
    railway up --detach
    
    if [ $? -eq 0 ]; then
        print_status "Deployment initiated successfully"
        print_info "Monitor deployment progress at: https://railway.app/dashboard"
    else
        print_error "Deployment failed"
        exit 1
    fi
}

# Main execution
main() {
    echo "Starting Railway deployment fix process..."
    echo ""
    
    check_railway_cli
    echo ""
    
    verify_config
    echo ""
    
    railway_login
    echo ""
    
    link_project
    echo ""
    
    set_environment_variables
    echo ""
    
    deploy_to_railway
    echo ""
    
    print_status "Railway deployment fix completed!"
    print_info "Your application should now deploy successfully with Node 18"
    print_info "Check the Railway dashboard for deployment status and logs"
}

# Run the main function
main
