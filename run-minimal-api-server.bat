@echo off
REM Script to run the minimal API server for testing and diagnosing deployment issues

echo === STARTING MINIMAL API SERVER ===
echo This script will start a minimal API server that provides sample data
echo for testing and diagnosing deployment issues.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo X Node.js is not installed. Please install Node.js first.
  exit /b 1
)

REM Check if required packages are installed
echo Checking for required packages...
if not exist node_modules\express (
  echo Installing required packages...
  npm install express cors
  if %ERRORLEVEL% neq 0 (
    echo X Failed to install required packages. Please check the error messages above.
    exit /b 1
  )
)

REM Start the minimal API server
echo Starting minimal API server...
node api-server-minimal.js

REM This line will only be reached if the server is stopped
echo Server stopped.
