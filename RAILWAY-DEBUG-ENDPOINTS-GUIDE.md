# Railway Debug Endpoints Guide

## 🔍 Debug Endpoints Available

After Railway redeploys (should happen automatically after the git push), you'll have these debug endpoints available:

### 1. Environment Variables Check
**URL**: `https://vigilant-compassion-production.up.railway.app/api/debug/env`

**What it shows**:
- Whether DATABASE_URL is set
- All Railway environment variables
- PostgreSQL connection variables

### 2. Database Connection Test
**URL**: `https://vigilant-compassion-production.up.railway.app/api/debug/database`

**What it shows**:
- Database connection status
- Whether using PostgreSQL or SQLite
- Admin user existence and details

### 3. Login Test (POST)
**URL**: `https://vigilant-compassion-production.up.railway.app/api/debug/test-login`

**Method**: POST
**Body**: 
```json
{
  "username": "admin",
  "password": "Railway2025!"
}
```

**What it shows**:
- Detailed login process debugging
- User existence check
- Password validation results

## 🚀 How to Test

### Option 1: Browser (for GET endpoints)
1. Wait for Railway to redeploy (check Deployments tab)
2. Open these URLs in your browser:
   - `https://vigilant-compassion-production.up.railway.app/api/debug/env`
   - `https://vigilant-compassion-production.up.railway.app/api/debug/database`

### Option 2: Using Browser Console (for POST endpoint)
1. Go to your Railway app: `https://vigilant-compassion-production.up.railway.app`
2. Open browser console (F12)
3. Run this code:
```javascript
fetch('/api/debug/test-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'Railway2025!' })
})
.then(r => r.json())
.then(data => console.log('Login test result:', data));
```

## 🎯 What to Look For

### Environment Check Results:
✅ **Good**: `DATABASE_URL: "SET ✅"`
❌ **Problem**: `DATABASE_URL: "NOT SET ❌"`

### Database Check Results:
✅ **Good**: `"dialect": "postgres"` and `"message": "Using PostgreSQL ✅"`
❌ **Problem**: `"dialect": "sqlite"` and `"message": "Using SQLite (fallback) ⚠️"`

### Admin User Check:
✅ **Good**: `"adminUser": { "exists": true, "username": "admin" }`
❌ **Problem**: `"adminUser": { "exists": false }` or error message

## 🔧 Expected Issues & Solutions

### Issue 1: DATABASE_URL Not Set
**Symptoms**: Environment check shows `DATABASE_URL: "NOT SET ❌"`
**Solution**: The DATABASE_URL variable wasn't properly added to your main service
**Fix**: Go back to Railway Variables tab and add it manually

### Issue 2: Using SQLite Instead of PostgreSQL
**Symptoms**: Database check shows `"dialect": "sqlite"`
**Solution**: DATABASE_URL is not reaching the application
**Fix**: Verify the DATABASE_URL format and connection

### Issue 3: Admin User Doesn't Exist
**Symptoms**: Admin user check shows `"exists": false`
**Solution**: Admin user creation failed due to database issues
**Fix**: Once database is connected, admin user will be created automatically

## 📊 Next Steps Based on Results

1. **Test the endpoints** after Railway redeploys
2. **Share the results** with me - copy/paste the JSON responses
3. **I'll analyze** the exact issue and provide the specific fix
4. **Apply the fix** and test login again

## ⏰ Timeline

- **Now**: Railway is redeploying with debug endpoints
- **2-3 minutes**: Deployment should complete
- **Then**: Test the endpoints and share results
- **Next**: Apply targeted fix based on debug results

The debug endpoints will give us the exact information needed to fix the 500 error!
