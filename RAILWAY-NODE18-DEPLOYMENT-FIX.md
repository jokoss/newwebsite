# Railway Node 18 Deployment Fix Guide

## 🚂 Overview

This guide addresses Railway deployment failures caused by Node.js version incompatibility with Create React App (CRA). The primary issue occurs when Railway uses Node 22, which breaks CRA builds.

## 🔍 Problem Identification

### Symptoms
- Build failures during `npm run build` step
- React Scripts compilation errors
- "Module not found" or dependency resolution errors
- Deployment timeouts or crashes

### Root Cause
- **Node 22 Incompatibility**: Create React App (react-scripts 5.0.1) is not compatible with Node.js 22
- **Railway Default**: Railway may default to newer Node versions
- **Configuration Override**: Custom build commands or environment variables may override package.json settings

## ✅ Solution Implementation

### Automated Fix Scripts

We've created two automated scripts to fix the Railway deployment:

#### For Linux/macOS/WSL:
```bash
./railway-deployment-fix.sh
```

#### For Windows:
```batch
railway-deployment-fix.bat
```

### Manual Fix Steps

If you prefer to fix manually, follow these steps:

#### 1. Verify Project Configuration

**Check package.json:**
```json
{
  "engines": {
    "node": ">=18 <19"
  },
  "scripts": {
    "install": "npm ci && cd client && npm ci",
    "build": "cd client && npm run build",
    "start": "node api-server-minimal.js"
  }
}
```

**Check .nvmrc:**
```
18
```

**Check nixpacks.toml:**
```toml
[phases.install]
projectPaths = ["client"]
```

#### 2. Railway CLI Setup

Install Railway CLI if not already installed:
```bash
npm install -g @railway/cli
```

Login to Railway:
```bash
railway login
```

Link to your project:
```bash
railway link
```

#### 3. Set Environment Variables

Force Node 18 usage:
```bash
railway variables set NODE_VERSION=18.20.4
railway variables set NPM_CONFIG_PRODUCTION=false
railway variables set NIXPACKS_NODE_VERSION=18
```

#### 4. Clear Railway Dashboard Overrides

1. Go to your Railway project dashboard
2. Navigate to **Settings** → **Environment**
3. Remove any custom **Build Command** or **Start Command**
4. Ensure **Node.js version** is set to 18.x (not 22.x)
5. Clear any conflicting environment variables

#### 5. Deploy

Force a fresh deployment:
```bash
railway up --detach
```

## 🔧 Configuration Files

### Root package.json
```json
{
  "name": "analytical-testing-lab",
  "version": "1.0.0",
  "main": "api-server-minimal.js",
  "engines": {
    "node": ">=18 <19"
  },
  "scripts": {
    "install": "npm ci && cd client && npm ci",
    "build": "cd client && npm run build",
    "start": "node api-server-minimal.js"
  }
}
```

### .nvmrc
```
18
```

### nixpacks.toml
```toml
[phases.install]
projectPaths = ["client"]
```

## 🚨 Common Issues & Solutions

### Issue 1: Railway Still Uses Node 22
**Solution**: Clear all custom build/start commands in Railway dashboard and redeploy

### Issue 2: Environment Variables Not Applied
**Solution**: 
```bash
railway variables set NODE_VERSION=18.20.4 --force
railway up --detach
```

### Issue 3: Build Cache Issues
**Solution**: Force a clean build by triggering a new deployment

### Issue 4: Client Dependencies Not Installing
**Solution**: Ensure nixpacks.toml includes client in projectPaths

## 📊 Verification Steps

### 1. Check Build Logs
Monitor Railway deployment logs for:
- Node version being used (should be 18.x)
- Successful client dependency installation
- Successful React build completion

### 2. Test Deployment
After successful deployment:
- Visit your Railway app URL
- Check `/api/health` endpoint
- Verify React app loads correctly

### 3. Environment Verification
```bash
railway run node --version
# Should output: v18.x.x
```

## 🎯 Expected Results

After applying the fix:
- ✅ Node 18.x used for builds
- ✅ React Scripts compiles successfully
- ✅ Client dependencies install correctly
- ✅ Application deploys and runs without errors
- ✅ Both API and frontend work correctly

## 🔄 Maintenance

### Regular Checks
1. Monitor Railway for automatic Node version updates
2. Keep package.json engines constraint updated
3. Test deployments after Railway platform updates

### Version Pinning
The configuration pins Node to 18.x to ensure compatibility:
- `"node": ">=18 <19"` in package.json
- `NODE_VERSION=18.20.4` environment variable
- `NIXPACKS_NODE_VERSION=18` for build process

## 📞 Support

If you continue experiencing issues:

1. **Check Railway Status**: Visit Railway status page for platform issues
2. **Review Build Logs**: Look for specific error messages in deployment logs
3. **Verify Configuration**: Ensure all configuration files match this guide
4. **Test Locally**: Verify the application works with Node 18 locally

## 🔗 Related Documentation

- [Railway Documentation](https://docs.railway.app/)
- [Create React App Node Requirements](https://create-react-app.dev/docs/getting-started/)
- [Nixpacks Configuration](https://nixpacks.com/docs)

---

**Last Updated**: January 2025
**Node Version**: 18.20.4
**React Scripts**: 5.0.1
**Railway CLI**: Latest
