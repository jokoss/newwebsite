@echo off
echo ===== PUSHING HOMEPAGE FIX CHANGES TO REPOSITORY =====
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
echo Adding homepage fix files to git...
git add Dockerfile.api-minimal-enhanced render-minimal-enhanced.yaml
git add client\src\pages\public\HomePage.js
git add RENDER-HOMEPAGE-FIX-GUIDE.md
git add deploy-enhanced-to-render.sh deploy-enhanced-to-render.bat
git add .github\workflows\deploy-homepage-fix.yml
git add push-homepage-fix.sh push-homepage-fix.bat

REM Commit the changes
echo Committing changes...
git commit -m "Add homepage fix for Render deployment"

REM Check if origin remote exists
git remote | findstr "origin" >nul
if %ERRORLEVEL% neq 0 (
    echo Origin remote not found. Please add it manually with:
    echo git remote add origin ^<your-git-repository-url^>
    echo Then push with: git push -u origin master
) else (
    REM Push to origin
    echo Pushing to origin remote...
    git push origin master
    
    echo ===== PUSH COMPLETED =====
    echo Your changes have been pushed to the repository.
    echo You can now deploy to Render using one of the methods described in RENDER-HOMEPAGE-FIX-GUIDE.md
)

pause
