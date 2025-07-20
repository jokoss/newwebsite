@echo off
echo ================================================================================
echo DEPLOY MOTZZ LABORATORY DATA TO RAILWAY
echo ================================================================================
echo.
echo This script will deploy and run the Motzz Laboratory data migration on Railway
echo.
echo Prerequisites:
echo - Railway CLI installed and logged in
echo - Railway project connected to GitHub
echo - PostgreSQL database running on Railway
echo.
pause

echo.
echo Step 1: Pushing latest code to GitHub...
git add .
git commit -m "Add Motzz Laboratory data migration script"
git push origin master

echo.
echo Step 2: Running migration on Railway...
echo This will create all Motzz Laboratory categories and tests in your Railway database
echo.
railway run npm run migrate-motzz

echo.
echo ================================================================================
echo DEPLOYMENT COMPLETE!
echo ================================================================================
echo.
echo Your Railway database now contains:
echo - 4 Main Categories (Agriculture, Construction/Materials, Environmental, Microbiology)
echo - 5 Agriculture Subcategories (Soil, Plant/Tissue, Water, Compost, Fertilizer)
echo - 9 Professional Tests with pricing ($35-$225)
echo - Complete hierarchical category structure
echo.
echo Visit your Railway app to see the professional analytical testing services!
echo.
pause
