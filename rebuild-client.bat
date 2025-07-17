@echo off
echo Starting client rebuild process...

rem Navigate to client directory
cd client

rem Install any missing dependencies
echo Installing dependencies...
call npm install

rem Build the client application
echo Building client application...
call npm run build

rem Check if build was successful
if %ERRORLEVEL% EQU 0 (
  echo Client build successful!
  
  rem Copy diagnostic scripts to the build directory
  echo Copying diagnostic scripts to build directory...
  copy ..\client-error-handler.js build\
  copy ..\api-diagnostic.js build\
  
  echo Client rebuild completed successfully!
  echo The application now includes improved error handling and diagnostic tools.
  echo.
  echo To test the application, run: npm start
  echo To deploy the application, run: deploy-to-render.bat
) else (
  echo Client build failed. Please check the error messages above.
  exit /b 1
)

cd ..
echo Done!
