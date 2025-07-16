# Netlify Deployment Guide

## Current Issue: Dashboard Settings Override

**Problem:** Netlify is ignoring the `netlify.toml` configuration file and using old dashboard settings instead.

**Error Log Indicators:**
```
❯ Config file
No config file was defined: using default values.

Build command from Netlify app
$ cd client && npm install && CI= npm run build && node netlify.js
bash: line 1: cd: client: No such file or directory
```

## CRITICAL FIX REQUIRED

### Step 1: Clear Netlify Dashboard Settings

**You MUST completely clear these fields in your Netlify dashboard:**

1. **Access Build Settings:**
   - Go to your Netlify site dashboard
   - Click "Site Settings" (not "Site Overview")
   - Click "Build & Deploy" in left sidebar
   - Click "Build Settings"

2. **Clear These Fields (leave completely empty):**
   - **Build command:** Currently shows `cd client && npm install && CI= npm run build && node netlify.js` → DELETE ALL
   - **Publish directory:** Currently shows `/opt/build/repo/client/build` → DELETE ALL  
   - **Functions directory:** May show `netlify/functions` → DELETE ALL

3. **Save Changes:**
   - Click "Save" button
   - Verify all fields are completely empty after saving

### Step 2: Verify netlify.toml Configuration

Your `netlify.toml` file is correctly configured:

```toml
[build]
  base = "."
  command = "npm install && cd client && npm install && npm run build"
  publish = "client/build"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
  CI = "false"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/server/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 3: Trigger New Deployment

After clearing dashboard settings:
- Go to "Deploys" tab
- Click "Trigger deploy" → "Deploy site"

### Step 4: Verify Success

Your deployment log should now show:
```
❯ Config file
netlify.toml

Build command from netlify.toml
$ npm install && cd client && npm install && npm run build
```

## Environment Variables Required

Set these in Netlify Dashboard → Site Settings → Environment Variables:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

## Alternative Deployment Methods

If dashboard clearing doesn't work, try these alternatives:

### Option 1: Delete and Recreate Site
1. Delete the current Netlify site
2. Create a new site from the same GitHub repository
3. Don't configure any build settings in dashboard
4. Let it read from netlify.toml automatically

### Option 2: Use Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from local machine
netlify deploy --prod --dir=client/build
```

### Option 3: Manual Build and Deploy
```bash
# Build locally
npm install
cd client && npm install && npm run build

# Deploy build folder manually via Netlify dashboard
```

## Troubleshooting Common Issues

### Issue: "No config file was defined"
**Solution:** Dashboard settings are overriding netlify.toml. Clear all dashboard build settings.

### Issue: "cd: client: No such file or directory"
**Solution:** Old dashboard command is being used. Clear dashboard settings.

### Issue: "node netlify.js" not found
**Solution:** Old dashboard command references non-existent file. Clear dashboard settings.

### Issue: Build succeeds but functions don't work
**Solution:** Check environment variables are set in Netlify dashboard.

## Project Structure

```
project-root/
├── netlify.toml          # Netlify configuration (MUST be read)
├── client/               # React frontend
│   ├── package.json
│   ├── src/
│   └── build/           # Generated build output
├── server/              # Express backend
├── netlify/
│   └── functions/
│       └── server.js    # Serverless function
└── package.json         # Root dependencies
```

## Build Process Flow

1. **Install root dependencies:** `npm install`
2. **Navigate to client:** `cd client`
3. **Install client dependencies:** `npm install`
4. **Build React app:** `npm run build`
5. **Deploy to Netlify:** Static files + serverless functions

## Success Indicators

✅ Config file shows: `netlify.toml`
✅ Build command from: `netlify.toml`
✅ No "No such file or directory" errors
✅ React build completes successfully
✅ Functions deploy to `/.netlify/functions/server`

## Support

If issues persist after clearing dashboard settings:
1. Check Netlify community forums
2. Contact Netlify support
3. Consider alternative deployment platforms (Vercel, Railway, etc.)

---

**Last Updated:** July 16, 2025
**Status:** Dashboard override issue - requires manual intervention
