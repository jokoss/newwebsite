@echo off
REM Script to build and run the minimal API server Docker container

echo === BUILDING AND RUNNING MINIMAL API SERVER DOCKER CONTAINER ===
echo This script will build and run a Docker container for the minimal API server.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo X Docker is not installed. Please install Docker first.
  exit /b 1
)

REM Check if client/build directory exists
if not exist client\build (
  echo X client/build directory not found. Please build the client first with:
  echo   cd client
  echo   npm run build
  echo   cd ..
  exit /b 1
)

REM Build the Docker image
echo Building Docker image...
docker build -t minimal-api-server -f Dockerfile.api-minimal .
if %ERRORLEVEL% neq 0 (
  echo X Failed to build Docker image. Please check the error messages above.
  exit /b 1
)

REM Run the Docker container
echo Running Docker container...
docker run -p 5000:5000 --name minimal-api-server-container minimal-api-server
if %ERRORLEVEL% neq 0 (
  echo X Failed to run Docker container. Please check the error messages above.
  exit /b 1
)

REM This line will only be reached if the container is stopped
echo Container stopped.
