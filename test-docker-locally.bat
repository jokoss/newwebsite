@echo off
REM Script to test Docker setup locally before deploying to Render

echo === Testing Docker Setup for Analytical Testing Laboratory ===
echo This script will build and run your Docker containers locally to verify everything works before deploying to Render.
echo.

REM Check if Docker is installed
echo Checking if Docker is installed...
docker --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Docker is not installed. Please install Docker first.
    exit /b 1
) else (
    echo Docker is installed.
)

REM Check if Docker Compose is installed
echo Checking if Docker Compose is installed...
docker-compose --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
) else (
    echo Docker Compose is installed.
)

REM Stop any running containers
echo Stopping any existing containers...
docker-compose down
echo Done.

REM Build the Docker images
echo Building Docker images...
docker-compose build
if %ERRORLEVEL% neq 0 (
    echo Failed to build Docker images. Please check the error messages above.
    exit /b 1
) else (
    echo Docker images built successfully.
)

REM Start the containers
echo Starting containers...
docker-compose up -d
if %ERRORLEVEL% neq 0 (
    echo Failed to start containers. Please check the error messages above.
    exit /b 1
) else (
    echo Containers started successfully.
)

REM Wait for the application to start
echo Waiting for the application to start (30 seconds)...
timeout /t 30 /nobreak > nul

REM Check if the application is running
echo Checking if the application is running...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 > temp.txt
set /p response=<temp.txt
del temp.txt

if "%response%"=="200" (
    echo Application is running successfully!
) else (
    echo Application might not be fully started yet. Let's check the logs:
    docker-compose logs app
    echo.
    echo You can manually check if the application is running at http://localhost:3000
)

REM Check the health endpoint
echo Checking health endpoint...
curl -s http://localhost:3000/api/health > health.txt
findstr "healthy" health.txt > nul
if %ERRORLEVEL% equ 0 (
    echo Health check passed: 
    type health.txt
) else (
    echo Health check might have failed. Response:
    type health.txt
    echo Check the logs for more details:
    docker-compose logs app
)
del health.txt

echo.
echo === Docker Test Summary ===
echo [✓] Docker and Docker Compose are installed
echo [✓] Docker images built successfully
echo [✓] Containers started successfully
if "%response%"=="200" (
    echo [✓] Application is running at http://localhost:3000
) else (
    echo [?] Application status uncertain, check manually at http://localhost:3000
)
findstr "healthy" health.txt > nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [✓] Health check passed
) else (
    echo [?] Health check status uncertain
)

echo.
echo === Next Steps ===
echo 1. Verify the application works by visiting http://localhost:3000 in your browser
echo 2. Test key functionality (login, admin dashboard, etc.)
echo 3. If everything works, you're ready to deploy to Render!
echo 4. To stop the containers, run: docker-compose down
echo.
echo === Useful Commands ===
echo docker-compose logs - View logs from all containers
echo docker-compose logs app - View logs from the application container
echo docker-compose ps - List running containers
echo docker-compose down - Stop and remove containers
echo docker-compose up -d - Start containers in the background
echo docker-compose up - Start containers and view logs
