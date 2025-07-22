@echo off
echo ===================================================
echo RAILWAY DATABASE FIX DEPLOYMENT SCRIPT
echo ===================================================
echo.
echo This script will fix database issues in your Railway deployment
echo.

echo Step 1: Running database diagnostic...
railway run node server/scripts/railway-database-diagnostic.js
echo.

echo Step 2: Setting up database and ensuring proper connection...
railway run node server/scripts/railway-database-setup.js
echo.

echo Step 3: Fixing categories and tests...
railway run node server/scripts/railway-fix-categories.js
echo.

echo Step 4: Restarting the Railway service...
railway up
echo.

echo ===================================================
echo DEPLOYMENT COMPLETE
echo ===================================================
echo.
echo Your Railway application should now be working correctly.
echo Visit: https://vigilant-compassion-production.up.railway.app/
echo.
echo Admin login:
echo Username: admin
echo Password: Railway2025!
echo.
echo If you still encounter issues, please check the Railway logs:
echo railway logs
echo.
pause
