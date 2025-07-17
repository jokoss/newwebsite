@echo off
setlocal enabledelayedexpansion

echo =========================================================
echo    Analytical Testing Laboratory - Railway Deployment    
echo =========================================================

REM Check if Railway CLI is installed
where railway >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Railway CLI not found. Installing...
    call npm install -g @railway/cli
    
    REM Check if installation was successful
    where railway >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo Failed to install Railway CLI. Please install it manually:
        echo npm install -g @railway/cli
        exit /b 1
    )
)

echo Railway CLI is installed.

REM Check if user is logged in to Railway
railway whoami >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo You are not logged in to Railway. Please login:
    railway login
    
    REM Check if login was successful
    railway whoami >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo Failed to login to Railway. Please try again later.
        exit /b 1
    )
)

echo Successfully logged in to Railway.

REM Check if git is initialized
if not exist .git (
    echo Git repository not initialized. Initializing...
    git init
    git add .
    git commit -m "Initial commit for Railway deployment"
)

REM Check if the project is already linked to Railway
railway list >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Project is already linked to Railway.
) else (
    echo Creating a new Railway project...
    railway init
)

echo =========================================================
echo                Setting up PostgreSQL                    
echo =========================================================

REM Check if PostgreSQL is already provisioned
railway variables | findstr "DATABASE_URL" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo PostgreSQL is already provisioned.
) else (
    echo Adding PostgreSQL to the project...
    echo Please select PostgreSQL when prompted.
    railway add
)

echo =========================================================
echo              Setting up Environment Variables           
echo =========================================================

echo Setting required environment variables...

REM Generate a secure JWT secret
for /f "tokens=*" %%a in ('powershell -Command "[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))"') do set JWT_SECRET=%%a

REM Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set JWT_SECRET=%JWT_SECRET%

REM Prompt for admin credentials
set /p admin_email=Please enter admin email: 
railway variables set ADMIN_EMAIL=%admin_email%

set /p admin_password=Please enter admin password: 
railway variables set ADMIN_PASSWORD=%admin_password%

echo Environment variables set successfully.

echo =========================================================
echo                 Deploying Application                   
echo =========================================================

echo Deploying application to Railway...
railway up

if %ERRORLEVEL% equ 0 (
    echo Application deployed successfully!
    
    REM Get the deployment URL
    echo Generating public URL...
    railway domain
    
    echo =========================================================
    echo Deployment complete! Your application is now live.
    echo =========================================================
    echo To monitor your application, visit: https://railway.app/dashboard
) else (
    echo Deployment failed. Please check the logs for more information.
    exit /b 1
)

echo =========================================================
echo                  Next Steps                             
echo =========================================================
echo 1. Set up a custom domain (optional):
echo    railway domain
echo 2. Monitor your application:
echo    railway logs
echo 3. Update your application:
echo    git push (Railway will automatically deploy updates)
echo =========================================================

endlocal
