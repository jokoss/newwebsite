@echo off
echo ================================================================================
echo RAILWAY MOTZZ LABORATORY DATA MIGRATION
echo ================================================================================
echo.
echo This script will migrate your complete Motzz Laboratory database to Railway
echo.
echo Prerequisites:
echo - Railway CLI installed and logged in
echo - Railway project connected to GitHub
echo - PostgreSQL database running on Railway
echo.
pause
echo.
echo Step 1: Generating migration commands...
node railway-motzz-data-migration.js > migration-commands.txt
echo.
echo ✅ Migration commands generated in migration-commands.txt
echo.
echo Step 2: Please follow these instructions:
echo.
echo 1. Open migration-commands.txt
echo 2. Copy and paste each Railway CLI command one by one
echo 3. Wait for each command to complete before running the next
echo 4. Follow the order exactly as shown
echo.
echo The migration will create:
echo ✅ 4 Main Categories (Agriculture, Construction/Materials, Environmental, Microbiology)
echo ✅ 5 Agriculture Subcategories (Soil, Plant/Tissue, Water, Compost, Fertilizer)
echo ✅ 9 Professional Tests with pricing ($35-$225)
echo ✅ Complete hierarchical category structure
echo.
echo After migration, your Railway database will have all professional
echo analytical testing data instead of test categories.
echo.
echo For detailed instructions, see: RAILWAY-MOTZZ-DATA-MIGRATION-GUIDE.md
echo.
pause
