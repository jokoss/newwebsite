@echo off
REM Script to deploy to Render with a single command

echo === Analytical Testing Laboratory Render Deployment ===
echo This script will help you deploy your application to Render.
echo.

REM Check if Git is installed
echo Checking if Git is installed...
git --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Git is not installed. Please install Git first.
    exit /b 1
) else (
    echo Git is installed.
)

REM Check if we're in a Git repository
echo Checking if we're in a Git repository...
git rev-parse --is-inside-work-tree > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Not in a Git repository. Please run this script from your project directory.
    exit /b 1
) else (
    echo In a Git repository.
)

REM Check for uncommitted changes
echo Checking for uncommitted changes...
git diff-index --quiet HEAD --
if %ERRORLEVEL% neq 0 (
    echo You have uncommitted changes. Would you like to commit them? (Y/N)
    set /p commit=
    if /i "%commit%"=="Y" (
        echo Enter commit message:
        set /p message=
        git add .
        git commit -m "%message%"
        echo Changes committed.
    ) else (
        echo Deployment aborted. Please commit your changes before deploying.
        exit /b 1
    )
) else (
    echo No uncommitted changes.
)

REM Check if remote exists
echo Checking if remote repository exists...
git remote -v | findstr origin > nul
if %ERRORLEVEL% neq 0 (
    echo No remote repository found. Please set up a remote repository first.
    exit /b 1
) else (
    git remote -v | findstr origin
    echo Remote repository found.
)

REM Push to GitHub
echo Pushing to GitHub...
git push origin main
if %ERRORLEVEL% neq 0 (
    echo Failed to push to GitHub. Please check your remote repository configuration.
    exit /b 1
) else (
    echo Successfully pushed to GitHub.
)

REM Open Render dashboard
echo.
echo Your code has been pushed to GitHub.
echo.
echo Next steps:
echo 1. If this is your first deployment, go to Render.com and set up a new Blueprint using your GitHub repository.
echo 2. If you've already set up the Blueprint, your changes will be automatically deployed.
echo.
echo Would you like to open the Render dashboard? (Y/N)
set /p open=
if /i "%open%"=="Y" (
    start https://dashboard.render.com
    echo Render dashboard opened in your browser.
) else (
    echo You can manually check your deployment status at https://dashboard.render.com
)

echo.
echo === Deployment Process Complete ===
echo Your application is being deployed to Render.
echo You can check the deployment status in the Render dashboard.
echo.
echo For troubleshooting, refer to RENDER-DOCKER-DEPLOYMENT.md
