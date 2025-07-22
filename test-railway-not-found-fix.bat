@echo off
REM Script to test the Railway 404 Not Found fix locally

echo 🧪 Testing Railway 404 Not Found Fix Locally
echo ===========================================

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js and try again.
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ npm is not installed. Please install npm and try again.
    exit /b 1
)

REM Build the client
echo 🏗️ Building React client...
cd client && npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to build React client. Please check for errors and try again.
    exit /b 1
)
cd ..

REM Start the server
echo 🚀 Starting server with api-server-minimal.js...
echo This will serve the React app from the Express server.
echo Press Ctrl+C to stop the server.
echo.
echo Once the server is running, open your browser and navigate to:
echo http://localhost:5000
echo.
echo You should see the React app instead of a 404 error.
echo.

node api-server-minimal.js
