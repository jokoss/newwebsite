@echo off
echo 🚀 COMPLETE LOCAL TO RAILWAY DATA MIGRATION
echo ==========================================

echo.
echo 📦 Adding migration files to git...
git add server/scripts/export-local-data.js
git add server/scripts/import-json-to-railway.js
git add server/scripts/local-data-export.json
git add deploy-complete-migration.bat

echo.
echo 💾 Committing migration files...
git commit -m "Add complete local data migration scripts and exported data"

echo.
echo 🚢 Pushing to Railway...
git push origin main

echo.
echo ⏳ Waiting for Railway deployment (30 seconds)...
timeout /t 30 /nobreak

echo.
echo 🔄 Running data import on Railway...
railway run node server/scripts/import-json-to-railway.js

echo.
echo 🌐 Testing the migration...
echo Opening Railway site to verify data migration...
start https://vigilant-compassion-production.up.railway.app

echo.
echo ✅ Migration deployment complete!
echo Your Railway site should now show your actual laboratory data.
echo.
pause
