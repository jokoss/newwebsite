@echo off
echo ===== DEPLOYING ENHANCED MINIMAL API SERVER TO RENDER =====
echo Current directory: %cd%

REM Check if we're in the right directory
if not exist "Dockerfile.api-minimal-enhanced" (
    echo Error: Required files not found. Make sure you're in the project root directory.
    pause
    exit /b 1
)

if not exist "render-minimal-enhanced.yaml" (
    echo Error: Required files not found. Make sure you're in the project root directory.
    pause
    exit /b 1
)

REM Ensure the client is built
if not exist "client\build" (
    echo Client build directory not found. Building client...
    cd client
    call npm install
    call npm run build
    cd ..
    echo Client built successfully.
)

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

REM Add and commit changes
echo Adding and committing changes...
git add Dockerfile.api-minimal-enhanced render-minimal-enhanced.yaml
git add client\src\pages\public\HomePage.js
git add RENDER-HOMEPAGE-FIX-GUIDE.md
git commit -m "Update deployment files for Render homepage fix"

REM Check if render remote exists
git remote | findstr "render" >nul
if %ERRORLEVEL% neq 0 (
    echo Render remote not found. Please add it manually with:
    echo git remote add render ^<your-render-git-url^>
    echo Then push with: git push render master
    echo.
    echo Alternatively, you can deploy directly from the Render dashboard:
    echo 1. Go to https://dashboard.render.com/
    echo 2. Create a new Web Service
    echo 3. Connect your GitHub repository
    echo 4. Select 'Docker' as the environment
    echo 5. Set the Docker file path to: Dockerfile.api-minimal-enhanced
    echo 6. Configure environment variables as specified in render-minimal-enhanced.yaml
    echo 7. Deploy the service
) else (
    REM Push to render remote
    echo Pushing to Render remote...
    git push render master
    
    echo ===== DEPLOYMENT INITIATED =====
    echo Your changes have been pushed to Render.
    echo Check the deployment status in your Render dashboard.
    echo Once deployed, the server will be available at your Render URL.
)

echo.
echo ===== MANUAL DEPLOYMENT INSTRUCTIONS =====
echo If you prefer to deploy manually through the Render dashboard:
echo 1. Go to https://dashboard.render.com/
echo 2. Create a new Web Service
echo 3. Connect your GitHub repository
echo 4. Select 'Docker' as the environment
echo 5. Set the Docker file path to: Dockerfile.api-minimal-enhanced
echo 6. Configure environment variables as specified in render-minimal-enhanced.yaml
echo 7. Deploy the service

pause
