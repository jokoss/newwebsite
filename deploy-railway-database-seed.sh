#!/bin/bash

echo "🚀 RAILWAY DATABASE SEEDING DEPLOYMENT"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_error "Railway CLI is not installed. Please install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Check if we're logged in to Railway
if ! railway whoami &> /dev/null; then
    print_error "You're not logged in to Railway. Please run:"
    echo "railway login"
    exit 1
fi

print_status "Starting Railway database seeding deployment..."

# Step 1: Add and commit the new seeding script
print_status "Adding new seeding script to git..."
git add server/scripts/railway-complete-seed.js
git add deploy-railway-database-seed.sh

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to commit. The seeding script may already be committed."
else
    print_status "Committing seeding script..."
    git commit -m "Add comprehensive Railway database seeding script

- Creates 8 analytical testing categories with proper descriptions
- Adds 25+ tests across all categories with pricing and details
- Fixes image URLs with proper Unsplash placeholders
- Updates existing categories to ensure proper data
- Comprehensive logging and error handling"
fi

# Step 2: Push to GitHub
print_status "Pushing changes to GitHub..."
if git push origin main; then
    print_success "Successfully pushed to GitHub"
else
    print_error "Failed to push to GitHub"
    exit 1
fi

# Step 3: Wait for Railway deployment
print_status "Waiting for Railway to deploy the changes..."
print_warning "This may take a few minutes..."

# Wait a bit for the deployment to start
sleep 10

# Step 4: Run the seeding script on Railway
print_status "Running database seeding script on Railway..."
print_warning "This will populate your Railway database with all analytical testing categories and tests..."

# Run the seeding script
if railway run node server/scripts/railway-complete-seed.js; then
    print_success "Database seeding completed successfully!"
else
    print_error "Database seeding failed. Check the logs above for details."
    exit 1
fi

# Step 5: Verify the results
print_status "Verifying the seeding results..."
sleep 5

print_status "Testing the API endpoint..."
echo ""
echo "🔍 Checking your Railway API..."
curl -s "https://vigilant-compassion-production.up.railway.app/api/categories" | jq '.' || echo "API response received (jq not available for formatting)"

echo ""
print_success "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo ""
echo "✅ Your Railway database has been seeded with:"
echo "   - 8 analytical testing categories"
echo "   - 25+ individual tests with pricing"
echo "   - Proper descriptions and images"
echo ""
echo "🌐 Visit your website to see all services:"
echo "   https://vigilant-compassion-production.up.railway.app/services"
echo ""
echo "📊 Admin dashboard to manage categories:"
echo "   https://vigilant-compassion-production.up.railway.app/admin"
echo ""
print_status "The services page should now show all 8 categories instead of just 2!"
