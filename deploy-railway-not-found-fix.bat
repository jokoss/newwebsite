@echo off
REM Script to deploy the Railway 404 Not Found fix

echo 🚀 Deploying Railway 404 Not Found Fix
echo =======================================

REM Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Git is not installed. Please install git and try again.
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Not in a git repository. Please run this script from within your project's git repository.
    exit /b 1
)

REM Create a new branch for the fix
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set datetime=%%I
set BRANCH_NAME=railway-not-found-fix-%datetime:~0,14%
echo 📁 Creating new branch: %BRANCH_NAME%
git checkout -b %BRANCH_NAME%

REM Add the modified files
echo 📝 Adding modified files to git
git add package.json nixpacks.toml RAILWAY-NOT-FOUND-FIX-SOLUTION.md

REM Commit the changes
echo 💾 Committing changes
git commit -m "Fix: Serve React app from Express server to resolve 404 Not Found issue"

REM Push to the remote repository
echo 📤 Pushing changes to remote repository
git push -u origin %BRANCH_NAME%

echo.
echo ✅ Changes pushed to branch: %BRANCH_NAME%
echo.
echo Next steps:
echo 1. Create a pull request on GitHub to merge these changes
echo 2. After merging, Railway will automatically deploy the changes
echo 3. Verify that the root URL now serves the React app instead of returning a 404 error
echo.
echo To test locally before deploying, run:
echo npm run build ^&^& npm start
echo.

pause
