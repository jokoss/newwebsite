@echo off
echo Rebuilding client with improved error handling...

rem Create backup of original files
echo Creating backups of original files...
if not exist "client\public\client-error-handler.js.bak" (
  if exist "client\public\client-error-handler.js" (
    copy "client\public\client-error-handler.js" "client\public\client-error-handler.js.bak"
  )
)

if not exist "client\public\api-diagnostic.js.bak" (
  if exist "client\public\api-diagnostic.js" (
    copy "client\public\api-diagnostic.js" "client\public\api-diagnostic.js.bak"
  )
)

rem Copy error handling scripts to client/public directory
echo Copying error handling scripts to client/public directory...
copy "client-error-handler.js" "client\public\client-error-handler.js"
copy "api-diagnostic.js" "client\public\api-diagnostic.js"

if %ERRORLEVEL% NEQ 0 (
  echo Failed to copy error handling scripts. Please check if the files exist.
  exit /b 1
)

rem Rebuild client
echo Rebuilding client...
cd client
call npm run build

if %ERRORLEVEL% NEQ 0 (
  echo Client build failed. Please check the error messages above.
  cd ..
  exit /b 1
)

cd ..

echo Client rebuilt successfully with error handling improvements!
echo.
echo You can now test the application locally or deploy it to a server.
echo.
echo To test locally, run: npm run start
echo To deploy to Render, run: deploy-to-render-docker.bat
echo.
echo Press any key to exit...
pause >nul
