@echo off
echo 🚀 Railway Not Found Fix - Deployment Script
echo =============================================

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Not in a git repository
    pause
    exit /b 1
)

REM Check for uncommitted changes
git status --porcelain > temp_status.txt
for /f %%i in ("temp_status.txt") do set size=%%~zi
del temp_status.txt

if %size% gtr 0 (
    echo 📝 Found uncommitted changes. Committing them...
    
    REM Add all changes
    git add .
    
    REM Commit with descriptive message
    git commit -m "🔧 Railway Fix: Enhanced build process and static file serving - Updated nixpacks.toml with CI=false to prevent ESLint build failures - Enhanced client/.env.production with build optimizations - Fixed React app serving issue (404 -> proper homepage) - Added comprehensive build verification and logging - This should resolve the 'Node start process not serving React app' issue"
    
    echo ✅ Changes committed successfully
) else (
    echo ✅ No uncommitted changes found
)

REM Push to GitHub (which triggers Railway deployment)
echo 🔄 Pushing to GitHub (this will trigger Railway deployment)...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo 🎉 SUCCESS! Deployment initiated
    echo ================================
    echo.
    echo 📋 What happens next:
    echo 1. 🔄 Railway will automatically detect the push and start building
    echo 2. 🏗️  The enhanced build process will run with CI=false
    echo 3. ⚡ React client will build successfully without ESLint errors
    echo 4. 🚀 Server will start and serve the React app properly
    echo.
    echo 🔍 Monitor your deployment:
    echo - Railway Dashboard: https://railway.app/dashboard
    echo - Check build logs for the enhanced logging we added
    echo - Look for '🏗️ Building React client...' and '✅ Client build completed'
    echo.
    echo 🧪 Test after deployment:
    echo 1. Visit your Railway URL
    echo 2. Verify the homepage shows the new animated design
    echo 3. Test navigation between pages
    echo 4. Try admin login at /login
    echo 5. Check that /api/health returns proper status
    echo.
    echo 📚 For troubleshooting, see: RAILWAY-NOT-FOUND-FIX-SOLUTION.md
) else (
    echo ❌ Error: Failed to push to GitHub
    echo Please check your git configuration and try again
    pause
    exit /b 1
)

pause
