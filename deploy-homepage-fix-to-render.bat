@echo off
setlocal enabledelayedexpansion

echo ===== Deploying HomePage fix to Render =====
echo This script will commit and push the changes to trigger a Render deployment.

REM Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: git is not installed. Please install git and try again.
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Not in a git repository. Please run this script from within your git repository.
    exit /b 1
)

REM Check if there are any changes to commit
git diff --quiet client/src/pages/public/HomePage.js
if %ERRORLEVEL% equ 0 (
    echo No changes detected in HomePage.js. Have you made the necessary changes?
    set /p continue_anyway=Continue anyway? (y/n): 
    if /i "!continue_anyway!" neq "y" (
        echo Deployment cancelled.
        exit /b 0
    )
)

REM Add the changed file
git add client/src/pages/public/HomePage.js

REM Commit the changes
echo Committing changes...
git commit -m "Fix: Update HomePage to handle API connection issues on Render"

REM Push to the repository
echo Pushing changes to remote repository...
git push

REM Check if the push was successful
if %ERRORLEVEL% equ 0 (
    echo ===== Success! =====
    echo Changes have been pushed to the repository.
    echo The Render deployment should be triggered automatically.
    echo You can check the deployment status on your Render dashboard.
) else (
    echo ===== Error =====
    echo Failed to push changes to the repository.
    echo Please check your git configuration and try again.
    exit /b 1
)

echo Done!
