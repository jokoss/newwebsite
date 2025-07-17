@echo off
echo ===== DEPLOYING TO RENDER USING WEB SERVICE APPROACH =====
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

REM Check if render-cli is installed
where render >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Render CLI not found. Installing render-cli...
    npm install -g @render/cli
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

REM Add all the relevant files
echo Adding files to git...
git add render.json package.json server\index.js client\src\utils\api.js client\src\pages\public\HomePage.js

REM Commit the changes
echo Committing changes...
git commit -m "Update for Render Web Service deployment"

REM Check if render remote exists
git remote | findstr "render" >nul
if %ERRORLEVEL% neq 0 (
    echo Render remote not found. Please add it manually with:
    echo git remote add render ^<your-render-git-url^>
    echo Then push with: git push render master
    
    REM Ask if the user wants to deploy using render-cli instead
    set /p REPLY=Do you want to deploy using render-cli instead? (y/n) 
    if /i "%REPLY%"=="y" (
        echo Deploying using render-cli...
        render blueprint apply
    ) else (
        echo Exiting. Please add the render remote and push manually.
        pause
        exit /b 0
    )
) else (
    REM Push to render
    echo Pushing to render remote...
    git push render master
    
    echo ===== DEPLOYMENT INITIATED =====
    echo Your changes have been pushed to Render.
    echo The deployment process will continue on Render's servers.
    echo You can check the status in your Render dashboard.
)

echo ===== DEPLOYMENT COMPLETED =====
pause
