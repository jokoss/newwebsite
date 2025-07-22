@echo off
echo 🚀 DEPLOYING LOCAL DATA MIGRATION TO RAILWAY
echo =============================================

echo.
echo 📦 Committing migration script to git...
git add server/scripts/complete-local-to-railway-migration.js
git commit -m "Add complete local to Railway migration script"

echo.
echo 🚢 Pushing to Railway...
git push origin main

echo.
echo ⏳ Waiting for Railway deployment...
timeout /t 30 /nobreak

echo.
echo 🔄 Running migration on Railway...
railway run node server/scripts/complete-local-to-railway-migration.js

echo.
echo ✅ Migration deployment complete!
pause
