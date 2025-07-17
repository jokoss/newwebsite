@echo off
echo ===== PUSHING HOMEPAGE FIX TO GITHUB =====
echo Current directory: %cd%

REM Check if we're in the right directory
if not exist "render.json" (
    echo Error: Required files not found. Make sure you're in the project root directory.
    pause
    exit /b 1
)

if not exist "package.json" (
    echo Error: Required files not found. Make sure you're in the project root directory.
    pause
    exit /b 1
)

REM Run the scripts to add health endpoints and update the homepage
echo Adding health endpoints to server...
node server\scripts\add-health-endpoints.js

echo Updating HomePage component for better Render compatibility...
node server\scripts\update-homepage-for-render.js

REM Check if git is available
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Git is not installed. Please install git to continue.
    pause
    exit /b 1
)

REM Check if we're in a git repository
if not exist ".git" (
    echo This directory is not a git repository. Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
    echo Git repository initialized.
)

REM Add all the relevant files
echo Adding files to git...
git add render.json package.json server\index.js client\src\utils\api.js client\src\pages\public\HomePage.js server\scripts\add-health-endpoints.js server\scripts\update-homepage-for-render.js deploy-homepage-fix-to-render-web.sh deploy-homepage-fix-to-render-web.bat RENDER-HOMEPAGE-FIX-GUIDE.md RENDER-WEB-SERVICE-GUIDE.md

REM Commit the changes
echo Committing changes...
git commit -m "Fix blank homepage issue on Render Web Service deployment"

REM Push to GitHub
echo Pushing to GitHub...
git push origin master

echo ===== PUSH COMPLETED =====
echo Your changes have been pushed to GitHub.
echo Now you can deploy to Render using one of the following methods:
echo 1. Run 'deploy-homepage-fix-to-render-web.bat' (Windows) or './deploy-homepage-fix-to-render-web.sh' (Linux/Mac)
echo 2. Connect your GitHub repository to Render and deploy through the Render dashboard
echo 3. Add a Render remote and push directly: git remote add render ^<your-render-git-url^> ^&^& git push render master
pause
