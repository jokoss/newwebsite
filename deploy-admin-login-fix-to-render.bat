@echo off
REM Script to deploy admin login fix to Render

echo === DEPLOYING ADMIN LOGIN FIX TO RENDER ===
echo Current directory: %CD%

REM Ensure we're in the project root
if not exist "client" (
  echo Error: This script must be run from the project root directory
  exit /b 1
)

if not exist "server" (
  echo Error: This script must be run from the project root directory
  exit /b 1
)

REM Run the fix script
echo Running admin login fix script...
bash fix-admin-login.sh

REM Rebuild the client
echo Rebuilding client with admin login fixes...
cd client
call npm run build
cd ..

REM Create a documentation file for the fix
echo Creating documentation...
echo # Render Admin Login Fix Guide > RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo This document explains the fixes applied to resolve admin login issues on Render deployments. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo ## Issues Fixed >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 1. **API Base URL Detection**: Enhanced the API utility to better detect Render deployments and set the correct base URL. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 2. **Authentication Error Handling**: Improved error handling for authentication failures, with specific handling for Render-specific issues like cold starts and 502 errors. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 3. **Offline/Cold Start Handling**: Added caching mechanisms to handle offline scenarios and cold starts. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 4. **Login Page Improvements**: Enhanced the login page with better error messages and connectivity checks. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo ## Changes Made >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 1. Updated `client/src/utils/api.js` with: >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo    - Better Render hostname detection >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo    - Enhanced error handling for network issues >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo    - Cache mechanism for API responses >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo    - Timestamp parameter to prevent caching issues >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 2. Updated `client/src/context/AuthContext.js` with: >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo    - API connectivity checking >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo    - User data caching for cold starts >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo    - Better error handling and diagnostics >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 3. Updated `client/src/pages/auth/LoginPage.js` with: >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo    - Connectivity status display >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo    - Retry functionality >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo    - Better error messages >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo ## Deployment Notes >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo When deploying to Render: >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 1. Ensure the JWT_SECRET environment variable is properly set in Render >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 2. Verify the DATABASE_URL is correctly configured >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 3. Check CORS settings to allow requests from the Render domain >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo ## Troubleshooting >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo If login issues persist: >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo. >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 1. Check browser console for API errors >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 2. Verify network connectivity to the API endpoints >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 3. Check if the server is returning 401 or 502 errors >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md
echo 4. Try clearing browser cache and local storage >> RENDER-ADMIN-LOGIN-FIX-GUIDE.md

echo ✓ Documentation created

REM Commit changes if git is available
where git >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo Committing changes...
  git add client/src/utils/api.js
  git add client/src/context/AuthContext.js
  git add client/src/pages/auth/LoginPage.js
  git add RENDER-ADMIN-LOGIN-FIX-GUIDE.md
  git add fix-admin-login.sh
  git add deploy-admin-login-fix-to-render.sh
  git add deploy-admin-login-fix-to-render.bat
  git commit -m "Fix admin login issues for Render deployment"
  echo ✓ Changes committed
) else (
  echo Git not available, skipping commit
)

REM Deploy to Render if render CLI is available
where render >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo Deploying to Render...
  render deploy
  echo ✓ Deployment initiated
) else (
  echo Render CLI not available, manual deployment required
  echo Please deploy to Render using your preferred method
)

echo === ADMIN LOGIN FIX DEPLOYMENT COMPLETED ===
echo Please check RENDER-ADMIN-LOGIN-FIX-GUIDE.md for documentation
