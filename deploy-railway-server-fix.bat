@echo off
echo.
echo ===================================================
echo  RAILWAY SERVER FIX DEPLOYMENT SCRIPT
echo ===================================================
echo.
echo This script will deploy the fix to use the real server
echo instead of the minimal server on Railway.
echo.
echo Steps:
echo 1. Commit changes to package.json and nixpacks.toml
echo 2. Push changes to GitHub
echo 3. Railway will automatically deploy the changes
echo.
echo After deployment:
echo 1. Set up PostgreSQL database in Railway if not already done
echo 2. Run database setup script to verify connection
echo 3. Seed the database if needed
echo.
echo ===================================================
echo.

set /p continue=Do you want to continue? (Y/N): 
if /i "%continue%" NEQ "Y" goto :end

echo.
echo Committing changes...
git add package.json nixpacks.toml railway-database-setup.js
git commit -m "fix: use real server instead of minimal server"

echo.
echo Pushing changes to GitHub...
git push

echo.
echo ===================================================
echo  DEPLOYMENT INITIATED
echo ===================================================
echo.
echo Changes have been pushed to GitHub.
echo Railway should automatically start a new deployment.
echo.
echo NEXT STEPS:
echo.
echo 1. Go to Railway Dashboard: https://railway.app/dashboard
echo 2. Select your project: "vigilant-compassion-production"
echo 3. Verify the deployment is in progress
echo.
echo 4. If you haven't already, add PostgreSQL to your project:
echo    - Click "New Service" or "+"
echo    - Select "Database" → "PostgreSQL"
echo.
echo 5. After deployment completes, run the database setup script:
echo    - node railway-database-setup.js
echo.
echo 6. If needed, seed the database:
echo    - npm run migrate-motzz
echo.
echo 7. Visit your application to verify data is loading correctly:
echo    - https://vigilant-compassion-production.up.railway.app/
echo.
echo ===================================================

:end
echo.
echo Script completed.
echo.
