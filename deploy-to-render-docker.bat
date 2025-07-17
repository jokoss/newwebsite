@echo off
echo Deploying Docker image to Render with improved error handling...

rem Check if Render CLI is installed
where render >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Render CLI not found. Please install it first.
  echo Visit: https://render.com/docs/cli
  exit /b 1
)

rem Build the Docker image
echo Building Docker image...
docker build -t analytical-lab-website:latest .

if %ERRORLEVEL% NEQ 0 (
  echo Docker build failed. Please check the error messages above.
  exit /b 1
)

echo Docker image built successfully!

rem Tag the image for Render
echo Tagging Docker image for Render...
docker tag analytical-lab-website:latest registry.render.com/analytical-lab-website:latest

if %ERRORLEVEL% NEQ 0 (
  echo Failed to tag Docker image. Please check the error messages above.
  exit /b 1
)

rem Login to Render registry
echo Logging in to Render registry...
echo Please enter your Render API key when prompted.
render login

if %ERRORLEVEL% NEQ 0 (
  echo Failed to login to Render. Please check your API key.
  exit /b 1
)

rem Push the image to Render
echo Pushing Docker image to Render...
docker push registry.render.com/analytical-lab-website:latest

if %ERRORLEVEL% NEQ 0 (
  echo Failed to push Docker image to Render. Please check the error messages above.
  exit /b 1
)

echo Docker image pushed to Render successfully!

rem Deploy the service on Render
echo Deploying service on Render...
render deploy --image registry.render.com/analytical-lab-website:latest

if %ERRORLEVEL% NEQ 0 (
  echo Failed to deploy service on Render. Please check the error messages above.
  exit /b 1
)

echo Deployment to Render completed successfully!
echo.
echo Your application should be available at your Render URL shortly.
echo.
echo Note: It may take a few minutes for the deployment to complete and the application to be available.
echo.
echo Press any key to exit...
pause >nul
