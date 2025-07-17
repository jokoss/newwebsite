@echo off
:: Script to deploy the homepage fix to Render

echo === Deploying Homepage Fix to Render ===
echo This script will deploy the fixes for the blank homepage issue to Render.

:: Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: git is not installed. Please install git and try again.
    exit /b 1
)

:: Check if the required files exist
echo Checking for required files...
set REQUIRED_FILES=Dockerfile ensure-server-files.sh RENDER-HOMEPAGE-FIX-GUIDE.md

for %%F in (%REQUIRED_FILES%) do (
    if not exist %%F (
        echo Error: Required file %%F not found.
        exit /b 1
    )
)

:: Check if we're in a git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Not in a git repository. Please run this script from the root of your git repository.
    exit /b 1
)

:: Check if there are uncommitted changes
git status --porcelain >nul
if %ERRORLEVEL% equ 0 (
    echo There are uncommitted changes in your repository.
    set /p RESPONSE=Would you like to commit them? (y/n): 
    if /i "%RESPONSE%"=="y" (
        echo Committing changes...
        git add Dockerfile ensure-server-files.sh RENDER-HOMEPAGE-FIX-GUIDE.md
        git commit -m "Fix blank homepage issue on Render deployment"
    ) else (
        echo Please commit your changes manually and run this script again.
        exit /b 1
    )
)

:: Get the current branch
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%a
echo Current branch: %CURRENT_BRANCH%

:: Check if the remote repository exists
git ls-remote --exit-code origin >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Remote repository 'origin' not found. Please set up a remote repository and try again.
    exit /b 1
)

:: Push to the remote repository
echo Pushing changes to remote repository...
git push origin %CURRENT_BRANCH%

echo === Deployment Preparation Complete ===
echo Changes have been pushed to the remote repository.
echo To complete the deployment, follow these steps:

echo 1. Go to your Render dashboard: https://dashboard.render.com
echo 2. Select your service
echo 3. Click on 'Manual Deploy'
echo 4. Select 'Clear build cache ^& deploy'
echo 5. Wait for the deployment to complete
echo 6. Test your application to verify the homepage loads correctly

echo For more information, see the RENDER-HOMEPAGE-FIX-GUIDE.md file.

pause
