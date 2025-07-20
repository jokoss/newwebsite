@echo off
echo ================================================================================
echo RUN MOTZZ LABORATORY DATA MIGRATION ON RAILWAY
echo ================================================================================
echo.
echo This script will run ONLY the migration on Railway (no git push)
echo.
echo Prerequisites:
echo - Railway CLI installed and logged in
echo - Railway project connected
echo - PostgreSQL database running on Railway
echo.
pause

echo.
echo Running migration on Railway...
echo This will create all Motzz Laboratory categories and tests in your Railway database
echo.
railway run npm run migrate-motzz

echo.
echo ================================================================================
echo MIGRATION COMPLETE!
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
