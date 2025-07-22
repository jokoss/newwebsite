# Railway Database Fix Guide

## Problem Overview

The application deployed on Railway is experiencing issues with data not loading from the database. Based on our investigation, we've identified the following issues:

1. **Environment Configuration**: The application is running in development mode on Railway, causing it to use SQLite instead of the PostgreSQL database provided by Railway.

2. **Field Name Mismatch**: There's a mismatch between the field names in the database models and the queries. The models use `active` but some scripts are trying to query for `isActive`.

3. **Database Connection**: The connection to the Railway PostgreSQL database may not be properly established.

## Solution

We've created a set of scripts to fix these issues:

1. **railway-database-diagnostic.js**: This script diagnoses the current state of the database connection and tables.

2. **railway-database-setup.js**: This script ensures the database is properly set up with the required tables and initial data.

3. **railway-fix-categories.js**: This script fixes the categories and tests, ensuring they use the correct field names and are properly activated.

4. **deploy-railway-database-fix.bat/sh**: A deployment script that runs all the above scripts in sequence to fix the issues.

## How to Fix

### Prerequisites

1. Make sure you have the Railway CLI installed and logged in:
   ```
   npm install -g @railway/cli
   railway login
   ```

2. Ensure you're linked to the correct Railway project:
   ```
   railway link
   ```

### Fix Steps

1. Run the deployment script:
   - On Windows: `deploy-railway-database-fix.bat`
   - On Mac/Linux: `sh deploy-railway-database-fix.sh`

2. The script will:
   - Run a diagnostic to identify issues
   - Set up the database properly
   - Fix categories and tests
   - Restart the Railway service

3. After the script completes, your application should be working correctly.

### Manual Fix (if needed)

If the automated script doesn't work, you can run the steps manually:

1. Run the database diagnostic:
   ```
   railway run node server/scripts/railway-database-diagnostic.js
   ```

2. Set up the database:
   ```
   railway run node server/scripts/railway-database-setup.js
   ```

3. Fix categories and tests:
   ```
   railway run node server/scripts/railway-fix-categories.js
   ```

4. Restart the Railway service:
   ```
   railway up
   ```

## Technical Details

### Issue 1: Environment Configuration

The application was running in development mode on Railway, causing it to use SQLite instead of PostgreSQL. We fixed this by:

- Forcing `NODE_ENV=production` in our scripts
- Ensuring the database connection uses the `DATABASE_URL` environment variable provided by Railway

### Issue 2: Field Name Mismatch

There was a mismatch between field names in models and queries:

- Models use `active` field
- Some scripts were querying for `isActive`

We fixed this by updating all scripts to use the correct field name (`active`).

### Issue 3: Database Connection

We ensured proper database connection by:

- Verifying the `DATABASE_URL` environment variable is set
- Testing the connection to the PostgreSQL database
- Syncing the database models
- Creating initial data if needed

## Admin Access

After running the fix, you can access the admin dashboard with:

- URL: https://vigilant-compassion-production.up.railway.app/admin
- Username: admin
- Password: Railway2025!

## Troubleshooting

If you still encounter issues:

1. Check the Railway logs:
   ```
   railway logs
   ```

2. Verify the database connection:
   ```
   railway run node server/scripts/railway-database-diagnostic.js
   ```

3. Check if the environment variables are set correctly:
   ```
   railway variables
   ```

4. Ensure the `DATABASE_URL` is properly set and points to a PostgreSQL database.

5. If all else fails, you may need to reset the database and run the setup script again:
   ```
   railway run node server/scripts/railway-database-setup.js
