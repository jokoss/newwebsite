@echo off
REM Script to deploy the homepage fix to Render Web Service
REM This script runs the necessary scripts to fix the blank homepage issue on Render

echo Deploying homepage fix to Render Web Service...

REM Create the ApiErrorHandler component
echo Creating ApiErrorHandler component...
node server/scripts/create-api-error-handler.js

REM Add health endpoints to the server
echo Adding health endpoints to the server...
node server/scripts/add-health-endpoints.js

REM Update the HomePage component for better Render compatibility
echo Updating HomePage component for better Render compatibility...
node server/scripts/update-homepage-for-render.js

REM Check if render.json exists, create it if it doesn't
if not exist render.json (
  echo Creating render.json...
  echo {> render.json
  echo   "services": [>> render.json
  echo     {>> render.json
  echo       "type": "web",>> render.json
  echo       "name": "analytical-lab-website",>> render.json
  echo       "env": "node",>> render.json
  echo       "plan": "starter",>> render.json
  echo       "buildCommand": "npm run render-build",>> render.json
  echo       "startCommand": "npm run render-start",>> render.json
  echo       "healthCheckPath": "/api/health",>> render.json
  echo       "autoDeploy": true,>> render.json
  echo       "envVars": [>> render.json
  echo         {>> render.json
  echo           "key": "NODE_ENV",>> render.json
  echo           "value": "production">> render.json
  echo         },>> render.json
  echo         {>> render.json
  echo           "key": "PORT",>> render.json
  echo           "value": "10000">> render.json
  echo         },>> render.json
  echo         {>> render.json
  echo           "key": "JWT_SECRET",>> render.json
  echo           "generateValue": true>> render.json
  echo         }>> render.json
  echo       ],>> render.json
  echo       "disk": {>> render.json
  echo         "name": "uploads",>> render.json
  echo         "mountPath": "/opt/render/project/src/server/uploads",>> render.json
  echo         "sizeGB": 1>> render.json
  echo       }>> render.json
  echo     }>> render.json
  echo   ]>> render.json
  echo }>> render.json
)

REM Check if package.json has the necessary scripts for Render
findstr /C:"render-build" package.json >nul
if errorlevel 1 (
  echo Adding Render scripts to package.json...
  echo WARNING: This script cannot automatically update package.json on Windows.
  echo Please manually add the following scripts to your package.json:
  echo.
  echo "render-build": "npm install && cd server && npm install && cd ../client && npm install && npm run build && cd .. && node server/scripts/ensure-uploads-directory.js",
  echo "render-start": "node server/index.js"
  echo.
  echo Press any key to continue after you've updated package.json...
  pause >nul
)

REM Commit the changes
echo Committing changes...
git add .
git commit -m "Fix blank homepage issue on Render"

REM Check if the render remote exists
git remote | findstr /C:"render" >nul
if errorlevel 1 (
  echo Render remote not found. Please set up the Render remote with:
  echo git remote add render ^<your-render-git-url^>
  echo Then push the changes with:
  echo git push render master
) else (
  echo Pushing changes to Render...
  git push render master
)

echo Homepage fix deployment completed!
echo If you haven't set up the Render remote, please follow the instructions in RENDER-WEB-SERVICE-GUIDE.md
