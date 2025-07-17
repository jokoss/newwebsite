@echo off
REM Script to deploy the homepage fix to Render
REM This script applies the fix for the blank homepage issue on Render

echo === Starting Homepage Fix Deployment to Render ===

REM Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: git is not installed. Please install git and try again.
    exit /b 1
)

REM Check if we're in the right directory (project root)
if not exist "client" (
    echo Error: Please run this script from the project root directory.
    exit /b 1
)
if not exist "server" (
    echo Error: Please run this script from the project root directory.
    exit /b 1
)

REM Make sure the update script exists
if not exist "server\scripts\update-homepage-for-render.js" (
    echo Error: Homepage update script not found.
    echo Please make sure server\scripts\update-homepage-for-render.js exists.
    exit /b 1
)

REM Create a new branch for the fix
set BRANCH_NAME=fix/render-homepage-blank-issue
echo Creating new branch: %BRANCH_NAME%
git checkout -b %BRANCH_NAME%

REM Run the update script to modify the HomePage component
echo Applying HomePage fix...
node server\scripts\update-homepage-for-render.js

REM Add health endpoint to server/index.js if it doesn't exist
findstr /c:"app.get('/api/health'" server\index.js >nul
if %ERRORLEVEL% neq 0 (
    echo Adding health endpoint to server\index.js...
    
    REM This is a simplified approach for Windows - it creates a temporary file
    REM with the health endpoint and then uses findstr to merge it with the original file
    
    echo // Health check endpoint > health_endpoint.tmp
    echo app.get('/api/health', (req, res) ^=^> { >> health_endpoint.tmp
    echo   res.status(200).json({ >> health_endpoint.tmp
    echo     status: 'healthy', >> health_endpoint.tmp
    echo     timestamp: new Date().toISOString(), >> health_endpoint.tmp
    echo     environment: process.env.NODE_ENV ^|^| 'development' >> health_endpoint.tmp
    echo   }); >> health_endpoint.tmp
    echo }); >> health_endpoint.tmp
    echo. >> health_endpoint.tmp
    
    REM Find a good place to insert the health endpoint
    findstr /n /c:"// API routes" server\index.js >nul
    if %ERRORLEVEL% equ 0 (
        REM This is a simplified approach - in a real scenario, you would need
        REM a more robust solution to insert text at a specific line
        echo Warning: Automatic insertion of health endpoint not supported in Windows batch.
        echo Please add the health endpoint manually to server\index.js if needed.
        echo See health_endpoint.tmp for the code to add.
    ) else (
        echo Warning: Could not find a good location to add health endpoint.
        echo Please add the health endpoint manually to server\index.js if needed.
        echo See health_endpoint.tmp for the code to add.
    )
)

REM Ensure the ensure-server-files.sh script is included in the deployment
if not exist "ensure-server-files.sh" (
    echo Error: ensure-server-files.sh not found.
    exit /b 1
)

REM Update render.yaml to include the fix
if exist "render.yaml" (
    echo Updating render.yaml to include the homepage fix...
    
    REM Check if the file already has the preDeployCommand
    findstr /c:"preDeployCommand:" render.yaml >nul
    if %ERRORLEVEL% equ 0 (
        echo Warning: render.yaml already has a preDeployCommand.
        echo Please update it manually to include:
        echo   preDeployCommand: ./ensure-server-files.sh ^&^& node ./server/scripts/update-homepage-for-render.js
    ) else (
        echo Warning: Automatic modification of render.yaml not supported in Windows batch.
        echo Please add the following line after buildCommand in render.yaml:
        echo   preDeployCommand: ./ensure-server-files.sh ^&^& node ./server/scripts/update-homepage-for-render.js
    )
) else (
    echo Warning: render.yaml not found. You may need to configure Render manually.
)

REM Commit the changes
echo Committing changes...
git add server\scripts\update-homepage-for-render.js
git add client\src\pages\public\HomePage.js
git add server\index.js
git add render.yaml
git add deploy-homepage-fix-to-render.bat
git add deploy-homepage-fix-to-render.sh
git commit -m "Fix: Prevent blank homepage on Render deployment"

REM Push to remote (optional - uncomment if you want to push automatically)
REM echo Pushing changes to remote...
REM git push -u origin %BRANCH_NAME%

echo === Homepage Fix Deployment Preparation Complete ===
echo.
echo Next steps:
echo 1. Review the changes with 'git diff main'
echo 2. Push the changes to your repository with 'git push -u origin %BRANCH_NAME%'
echo 3. Create a pull request and merge to main
echo 4. Deploy to Render from the main branch
echo.
echo The homepage should now display correctly on Render!

pause
