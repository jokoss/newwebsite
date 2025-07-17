@echo off
REM Script to deploy the minimal API server to Render

echo === DEPLOYING MINIMAL API SERVER TO RENDER ===
echo This script will help you deploy the minimal API server to Render.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo X Git is not installed. Please install Git first.
  exit /b 1
)

REM Check if client/build directory exists
if not exist client\build (
  echo X client/build directory not found. Building client...
  cd client
  call npm install
  call npm run build
  if %ERRORLEVEL% neq 0 (
    echo X Failed to build client. Please check the error messages above.
    cd ..
    exit /b 1
  )
  cd ..
)

REM Ensure all files are committed
echo Checking for uncommitted changes...
git status --porcelain
if not "%ERRORLEVEL%"=="0" (
  echo X Failed to check Git status. Please make sure you're in a Git repository.
  exit /b 1
)

set /p CONTINUE=Do you want to commit and push all changes? (y/n): 
if /i not "%CONTINUE%"=="y" (
  echo Deployment cancelled.
  exit /b 0
)

REM Commit changes
set /p COMMIT_MSG=Enter commit message: 
git add .
git commit -m "%COMMIT_MSG%"
if %ERRORLEVEL% neq 0 (
  echo X Failed to commit changes. Please check the error messages above.
  exit /b 1
)

REM Push changes
git push
if %ERRORLEVEL% neq 0 (
  echo X Failed to push changes. Please check the error messages above.
  exit /b 1
)

echo.
echo Changes have been pushed to the repository.
echo.
echo === RENDER DEPLOYMENT INSTRUCTIONS ===
echo 1. Go to https://dashboard.render.com/
echo 2. Create a new Web Service
echo 3. Connect your GitHub repository
echo 4. Use the following settings:
echo    - Build Command: npm install ^&^& cd client ^&^& npm install ^&^& npm run build ^&^& cd ..
echo    - Start Command: node api-server-minimal.js
echo    - Environment Variables: 
echo      * NODE_ENV=production
echo      * PORT=5000
echo.
echo Your minimal API server will be deployed to Render!
echo.

set /p OPEN_RENDER=Do you want to open the Render dashboard now? (y/n): 
if /i "%OPEN_RENDER%"=="y" (
  start https://dashboard.render.com/
)
