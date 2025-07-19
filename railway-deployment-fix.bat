@echo off
setlocal enabledelayedexpansion

REM Railway Deployment Fix Script (Windows)
REM This script ensures proper Railway configuration for Node 18 and CRA compatibility

echo 🚂 Railway Deployment Fix Script (Windows)
echo ==========================================
echo.

REM Check if Railway CLI is installed
echo Checking Railway CLI installation...
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Railway CLI not found. Installing...
    npm install -g @railway/cli
    if !errorlevel! neq 0 (
        echo ❌ Failed to install Railway CLI
        pause
        exit /b 1
    )
    echo ✅ Railway CLI installed successfully
) else (
    echo ✅ Railway CLI is installed
    railway --version
)

echo.

REM Verify project configuration
echo ℹ️  Verifying project configuration...

REM Check package.json
if exist "package.json" (
    findstr "node.*18" package.json >nul
    if !errorlevel! equ 0 (
        echo ✅ Node.js version constraint found in package.json
    ) else (
        echo ❌ Node.js version constraint not set to 18 in package.json
    )
) else (
    echo ❌ package.json not found
    pause
    exit /b 1
)

REM Check .nvmrc
if exist ".nvmrc" (
    set /p NVMRC_VERSION=<.nvmrc
    if "!NVMRC_VERSION!"=="18" (
        echo ✅ .nvmrc version: !NVMRC_VERSION!
    ) else (
        echo ⚠️  .nvmrc version: !NVMRC_VERSION! (should be 18)
    )
) else (
    echo ⚠️  .nvmrc not found
)

REM Check nixpacks.toml
if exist "nixpacks.toml" (
    echo ✅ nixpacks.toml found
    type nixpacks.toml
) else (
    echo ⚠️  nixpacks.toml not found
)

REM Check api-server-minimal.js
if exist "api-server-minimal.js" (
    echo ✅ api-server-minimal.js found
) else (
    echo ❌ api-server-minimal.js not found
    pause
    exit /b 1
)

echo.

REM Check Railway authentication
echo ℹ️  Checking Railway authentication...
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Not logged in to Railway. Please login...
    railway login
    if !errorlevel! neq 0 (
        echo ❌ Failed to login to Railway
        pause
        exit /b 1
    )
    echo ✅ Successfully logged in to Railway
) else (
    echo ✅ Already logged in to Railway
    railway whoami
)

echo.

REM Link to Railway project
echo ℹ️  Linking to Railway project...
if exist ".railway\project.json" (
    echo ✅ Already linked to Railway project
) else (
    echo ⚠️  Project not linked. Please link to your Railway project...
    railway link
    if !errorlevel! neq 0 (
        echo ❌ Failed to link to Railway project
        pause
        exit /b 1
    )
    echo ✅ Successfully linked to Railway project
)

echo.

REM Set environment variables
echo ℹ️  Setting Railway environment variables...
railway variables set NODE_VERSION=18.20.4
railway variables set NPM_CONFIG_PRODUCTION=false
railway variables set NIXPACKS_NODE_VERSION=18

if %errorlevel% equ 0 (
    echo ✅ Environment variables set successfully
) else (
    echo ❌ Failed to set environment variables
    pause
    exit /b 1
)

echo.

REM Deploy to Railway
echo ℹ️  Deploying to Railway...
railway up --detach

if %errorlevel% equ 0 (
    echo ✅ Deployment initiated successfully
    echo ℹ️  Monitor deployment progress at: https://railway.app/dashboard
) else (
    echo ❌ Deployment failed
    pause
    exit /b 1
)

echo.
echo ✅ Railway deployment fix completed!
echo ℹ️  Your application should now deploy successfully with Node 18
echo ℹ️  Check the Railway dashboard for deployment status and logs
echo.
pause
