@echo off
REM Script to deploy the homepage fix to Render
REM This script commits the changes and pushes them to the repository

echo === DEPLOYING HOMEPAGE FIX TO RENDER ===
echo Current directory: %CD%

REM Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo X Git is not installed. Please install git and try again.
  exit /b 1
)

REM Check if the current directory is a git repository
if not exist ".git" (
  echo X The current directory is not a git repository.
  echo Please run this script from the root of your git repository.
  exit /b 1
)

REM Check if the required files exist
echo Checking if the required files exist...
set REQUIRED_FILES=Dockerfile ensure-server-files.sh deploy-render-fix.sh render.yaml RENDER-HOMEPAGE-FIX-GUIDE.md

for %%F in (%REQUIRED_FILES%) do (
  if not exist "%%F" (
    echo X %%F does not exist.
    echo Please make sure all required files exist before deploying.
    exit /b 1
  )
)

echo ✓ All required files exist.

REM Check if there are any uncommitted changes
git status --porcelain > git-status.tmp
set /p GIT_STATUS=<git-status.tmp
del git-status.tmp

if not "%GIT_STATUS%"=="" (
  echo There are uncommitted changes in the repository.
  echo Do you want to commit these changes? (y/n)
  set /p RESPONSE=
  
  if /i "%RESPONSE%"=="y" (
    REM Add all changes
    git add .
    
    REM Commit the changes
    git commit -m "Fix homepage blank screen issue on Render"
    echo ✓ Changes committed.
  ) else (
    echo X Aborting deployment. Please commit your changes manually and try again.
    exit /b 1
  )
) else (
  echo ✓ No uncommitted changes.
)

REM Push the changes to the repository
echo Pushing changes to the repository...
git push

echo ✓ Changes pushed to the repository.
echo The fix will be deployed to Render automatically if you have CI/CD set up.
echo Otherwise, please deploy manually from the Render dashboard.

echo === DEPLOYMENT COMPLETE ===
echo See RENDER-HOMEPAGE-FIX-GUIDE.md for more information about the fix.

exit /b 0
