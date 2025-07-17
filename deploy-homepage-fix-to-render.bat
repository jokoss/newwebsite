@echo off
REM Script to deploy homepage fix to Render for Windows users

echo === Deploying Homepage Fix to Render ===
echo This script will help you deploy the fixes for the blank homepage issue to Render.

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

REM Check for uncommitted changes
git diff-index --quiet HEAD -- >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Warning: You have uncommitted changes.
    set /p CONTINUE=Do you want to continue anyway? (y/n): 
    if /i not "%CONTINUE%"=="y" (
        echo Deployment cancelled.
        exit /b 1
    )
)

REM Verify the files we modified exist
echo Verifying modified files...
set MISSING_FILES=0

if not exist "client\src\pages\public\HomePage.js" (
    echo Missing file: client\src\pages\public\HomePage.js
    set /a MISSING_FILES+=1
)
if not exist "server\index.js" (
    echo Missing file: server\index.js
    set /a MISSING_FILES+=1
)
if not exist "client\src\utils\api.js" (
    echo Missing file: client\src\utils\api.js
    set /a MISSING_FILES+=1
)
if not exist "client\src\index.js" (
    echo Missing file: client\src\index.js
    set /a MISSING_FILES+=1
)
if not exist "client\src\components\utils\ApiErrorHandler.js" (
    echo Missing file: client\src\components\utils\ApiErrorHandler.js
    set /a MISSING_FILES+=1
)
if not exist "healthcheck.js" (
    echo Missing file: healthcheck.js
    set /a MISSING_FILES+=1
)
if not exist "Dockerfile" (
    echo Missing file: Dockerfile
    set /a MISSING_FILES+=1
)
if not exist "RENDER-HOMEPAGE-FIX-GUIDE.md" (
    echo Missing file: RENDER-HOMEPAGE-FIX-GUIDE.md
    set /a MISSING_FILES+=1
)

if %MISSING_FILES% neq 0 (
    echo Error: Some required files are missing. Please make sure all the required files exist before deploying.
    exit /b 1
)

echo All required files found.

REM Commit changes
echo Committing changes...
git add client\src\pages\public\HomePage.js server\index.js client\src\utils\api.js client\src\index.js client\src\components\utils\ApiErrorHandler.js healthcheck.js Dockerfile RENDER-HOMEPAGE-FIX-GUIDE.md

git commit -m "Fix blank homepage issue on Render deployment"

REM Push to remote
echo Pushing changes to remote repository...
set /p PUSH=Do you want to push the changes to the remote repository? (y/n): 
if /i "%PUSH%"=="y" (
    REM Get current branch
    for /f "tokens=*" %%a in ('git symbolic-ref --short HEAD') do set CURRENT_BRANCH=%%a
    
    REM Push to remote
    git push origin %CURRENT_BRANCH%
    if %ERRORLEVEL% neq 0 (
        echo Failed to push changes. Please push manually.
        exit /b 1
    ) else (
        echo Changes pushed successfully.
    )
) else (
    echo Skipping push to remote.
)

REM Provide instructions for Render deployment
echo === Next Steps ===
echo To deploy these changes to Render:
echo 1. Go to your Render dashboard: https://dashboard.render.com
echo 2. Select your service
echo 3. Click on 'Manual Deploy'
echo 4. Select 'Clear build cache ^& deploy'
echo 5. Wait for the deployment to complete
echo 6. Test your application to verify the homepage loads correctly

echo === Environment Variables ===
echo Make sure the following environment variables are set in your Render dashboard:
echo - DATABASE_URL: Your PostgreSQL connection string
echo - JWT_SECRET: Secret for JWT token generation
echo - FRONTEND_URL: URL of your frontend (e.g., https://your-app.onrender.com)
echo - NODE_ENV: Set to 'production'
echo - ALLOWED_ORIGINS: Comma-separated list of allowed origins (should include your Render domain)

echo === Troubleshooting ===
echo If you encounter any issues, please refer to the RENDER-HOMEPAGE-FIX-GUIDE.md file for troubleshooting steps.

echo === Deployment Complete ===
echo Thank you for using the homepage fix deployment script.

pause
