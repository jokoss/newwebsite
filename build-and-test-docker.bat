@echo off
echo Building and testing Docker image with improved error handling...

rem Build the Docker image
echo Building Docker image...
docker build -t analytical-lab-website:latest .

if %ERRORLEVEL% NEQ 0 (
  echo Docker build failed. Please check the error messages above.
  exit /b 1
)

echo Docker image built successfully!

rem Run the Docker container
echo Starting Docker container for testing...
docker run -d --name analytical-lab-test -p 5000:5000 analytical-lab-website:latest

if %ERRORLEVEL% NEQ 0 (
  echo Failed to start Docker container. Please check the error messages above.
  exit /b 1
)

echo Docker container started successfully!
echo.
echo The application is now running at http://localhost:5000
echo.
echo To stop the container, run: docker stop analytical-lab-test
echo To remove the container, run: docker rm analytical-lab-test
echo.
echo Press Ctrl+C to exit this script.

rem Wait for the container to start
timeout /t 5 /nobreak > nul

rem Open the browser to the application
start http://localhost:5000

rem Wait for user to press Ctrl+C
pause
