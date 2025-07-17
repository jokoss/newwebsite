@echo off
REM Script to deploy homepage fix to Render

echo === DEPLOYING HOMEPAGE FIX TO RENDER ===
echo This script will:
echo 1. Run the update-homepage-for-render.js script to update the HomePage.js file
echo 2. Run the add-health-endpoints.js script to add enhanced health check endpoints
echo 3. Commit the changes
echo 4. Push to your repository
echo 5. Deploy to Render
echo 6. Provide instructions for running the admin setup script on Render

REM Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: git is not installed. Please install git and try again.
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Not in a git repository. Please run this script from your project directory.
    exit /b 1
)

REM Check if node is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js and try again.
    exit /b 1
)

REM Run the update-homepage-for-render.js script
echo.
echo --- Updating HomePage.js for Render ---
node server/scripts/update-homepage-for-render.js

REM Run the add-health-endpoints.js script
echo.
echo --- Adding enhanced health check endpoints ---
node server/scripts/add-health-endpoints.js

REM Add the changes to git
echo.
echo --- Adding changes to git ---
git add client/src/pages/public/HomePage.js
git add client/src/components/utils/RenderApiErrorHandler.js
git add server/index.js
git add server/scripts/update-homepage-for-render.js
git add server/scripts/add-health-endpoints.js
git add server/scripts/render-admin-setup.js
git add deploy-homepage-fix-to-render.sh
git add deploy-homepage-fix-to-render.bat
git add RENDER-HOMEPAGE-FIX-GUIDE.md
git status

REM Prompt for confirmation
set /p confirm=Continue with commit and push? (y/n): 
if /i "%confirm%" neq "y" (
    echo Operation cancelled.
    exit /b 0
)

REM Commit changes
echo.
echo --- Committing changes ---
git commit -m "Add Render-specific fixes for homepage blank screen issue"

REM Push to repository
echo.
echo --- Pushing to repository ---
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set branch=%%a
git push origin %branch%

echo.
echo === DEPLOYMENT INSTRUCTIONS ===
echo 1. Wait for the deployment to complete on Render
echo 2. Once deployed, go to your Render dashboard
echo 3. Open your web service
echo 4. Click on 'Shell' in the sidebar
echo 5. Run the following command in the Render shell:
echo    cd /app ^&^& node server/scripts/render-admin-setup.js
echo.
echo 6. After running the script, you should be able to log in with:
echo    Username: admin
echo    Password: Admin@123456
echo.
echo 7. If you still can't access the homepage, check the script output for errors
echo    and make sure all environment variables are correctly set in the Render dashboard:
echo    - JWT_SECRET (should be a secure random string, not the default placeholder)
echo    - DATABASE_URL (should be set automatically by Render if using their PostgreSQL)
echo    - FRONTEND_URL (should match your Render deployment URL)
echo.
echo 8. For more detailed information, refer to the RENDER-HOMEPAGE-FIX-GUIDE.md file
echo.
echo === DEPLOYMENT COMPLETE ===

pause
