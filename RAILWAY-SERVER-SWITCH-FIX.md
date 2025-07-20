# Railway Server Switch Fix

## Problem

The application deployed on Railway was not loading data from the database correctly. After investigation, we discovered that the application was using `api-server-minimal.js` instead of the real server (`server/index.js`).

### Root Cause

1. The `package.json` file had the start script set to use the minimal server:
   ```json
   "start": "node api-server-minimal.js"
   ```

2. The `nixpacks.toml` file also specified the minimal server:
   ```toml
   [phases.start]
   cmd = "node api-server-minimal.js"
   ```

3. The minimal server (`api-server-minimal.js`) is a simplified version that:
   - Does not connect to a real database
   - Serves hardcoded sample data
   - Ignores any DATABASE_URL environment variable

This explains why:
- The admin dashboard showed limited data
- Adding a PostgreSQL database didn't fix the issue
- The data remained the same regardless of database changes

## Solution

We implemented the following changes:

1. Updated `package.json` to use the real server:
   ```json
   "start": "node server/index.js"
   ```

2. Updated `nixpacks.toml` to use the real server:
   ```toml
   [phases.start]
   cmd = "node server/index.js"
   ```

3. Created a database setup script (`railway-database-setup.js`) to:
   - Verify the DATABASE_URL environment variable is set
   - Test the connection to the PostgreSQL database
   - Check if tables exist and provide seeding instructions if needed

4. Created deployment scripts to help deploy the changes:
   - `deploy-railway-server-fix.bat` (Windows)
   - `deploy-railway-server-fix.sh` (Linux/Mac)

## Deployment Steps

1. Run the deployment script:
   - Windows: `deploy-railway-server-fix.bat`
   - Linux/Mac: `deploy-railway-server-fix.sh`

2. After deployment completes, set up the PostgreSQL database in Railway if not already done:
   - Go to Railway Dashboard
   - Select your project
   - Click "New Service" or "+"
   - Select "Database" → "PostgreSQL"

3. Verify the DATABASE_URL is set in your main service:
   - Run `node railway-database-setup.js`
   - This will check if DATABASE_URL is set and test the connection

4. If needed, seed the database:
   - Run `npm run migrate-motzz` or `node server/scripts/migrate-motzz-data.js`

5. Visit your application to verify data is loading correctly:
   - https://vigilant-compassion-production.up.railway.app/

## Technical Details

### Real Server vs. Minimal Server

The real server (`server/index.js`):
- Connects to a PostgreSQL database in production (using DATABASE_URL)
- Falls back to SQLite if DATABASE_URL is not set
- Provides full functionality including admin features
- Handles file uploads and other advanced features

The minimal server (`api-server-minimal.js`):
- Serves hardcoded sample data
- Does not connect to any database
- Provides limited functionality
- Was likely intended for testing or development purposes

### Database Configuration

The database configuration in `server/config/database.js` shows:
- In production with DATABASE_URL set: Uses PostgreSQL
- In production without DATABASE_URL: Falls back to SQLite
- In development: Uses SQLite

This explains why the admin login worked (it uses a hardcoded admin user), but the data wasn't loading properly (it was using an empty SQLite database or hardcoded data).

## Troubleshooting

If you encounter issues after deployment:

1. Check if DATABASE_URL is set:
   ```
   node railway-database-setup.js
   ```

2. Verify the deployment is using the correct server:
   - Check Railway logs for "Using PostgreSQL database in production with DATABASE_URL"
   - If you see "Using SQLite in production", DATABASE_URL is not set correctly

3. If needed, manually seed the database:
   ```
   npm run migrate-motzz
   ```

4. If the issue persists, check Railway logs for any errors related to database connection.
