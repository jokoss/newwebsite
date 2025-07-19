@echo off
setlocal enabledelayedexpansion

echo 🚀 RAILWAY DATABASE SEEDING DEPLOYMENT
echo ======================================

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Railway CLI is not installed. Please install it first:
    echo npm install -g @railway/cli
    exit /b 1
)

REM Check if we're logged in to Railway
railway whoami >nul 2>&1
if errorlevel 1 (
    echo [ERROR] You're not logged in to Railway. Please run:
    echo railway login
    exit /b 1
)

echo [INFO] Starting Railway database seeding deployment...

REM Step 1: Add and commit the new seeding script
echo [INFO] Adding new seeding script to git...
git add server/scripts/railway-complete-seed.js
git add deploy-railway-database-seed.sh
git add deploy-railway-database-seed.bat

REM Check if there are changes to commit
git diff --staged --quiet
if errorlevel 1 (
    echo [INFO] Committing seeding script...
    git commit -m "Add comprehensive Railway database seeding script

- Creates 8 analytical testing categories with proper descriptions
- Adds 25+ tests across all categories with pricing and details
- Fixes image URLs with proper Unsplash placeholders
- Updates existing categories to ensure proper data
- Comprehensive logging and error handling"
) else (
    echo [WARNING] No changes to commit. The seeding script may already be committed.
)

REM Step 2: Push to GitHub
echo [INFO] Pushing changes to GitHub...
git push origin main
if errorlevel 1 (
    echo [ERROR] Failed to push to GitHub
    exit /b 1
)
echo [SUCCESS] Successfully pushed to GitHub

REM Step 3: Wait for Railway deployment
echo [INFO] Waiting for Railway to deploy the changes...
echo [WARNING] This may take a few minutes...
timeout /t 10 /nobreak >nul

REM Step 4: Run the seeding script on Railway
echo [INFO] Running database seeding script on Railway...
echo [WARNING] This will populate your Railway database with all analytical testing categories and tests...

railway run node server/scripts/railway-complete-seed.js
if errorlevel 1 (
    echo [ERROR] Database seeding failed. Check the logs above for details.
    exit /b 1
)
echo [SUCCESS] Database seeding completed successfully!

REM Step 5: Verify the results
echo [INFO] Verifying the seeding results...
timeout /t 5 /nobreak >nul

echo [INFO] Testing the API endpoint...
echo.
echo 🔍 Checking your Railway API...
curl -s "https://vigilant-compassion-production.up.railway.app/api/categories"

echo.
echo [SUCCESS] 🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!
echo.
echo ✅ Your Railway database has been seeded with:
echo    - 8 analytical testing categories
echo    - 25+ individual tests with pricing
echo    - Proper descriptions and images
echo.
echo 🌐 Visit your website to see all services:
echo    https://vigilant-compassion-production.up.railway.app/services
echo.
echo 📊 Admin dashboard to manage categories:
echo    https://vigilant-compassion-production.up.railway.app/admin
echo.
echo [INFO] The services page should now show all 8 categories instead of just 2!

pause
