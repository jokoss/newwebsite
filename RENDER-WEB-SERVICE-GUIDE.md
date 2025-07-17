# Render Web Service Deployment Guide

This guide explains how to deploy your application using Render's Web Service approach instead of Docker containers. The Web Service approach is often more reliable for Node.js applications, especially React applications with complex frontend-backend interactions.

## Why Use Render Web Service?

Render's Web Service offers several advantages over Docker-based deployments:

1. **Native Node.js Environment**: Runs your Node.js application directly without the overhead of a container
2. **Faster Cold Starts**: Web Services typically start up faster than Docker containers
3. **Better Logging**: More detailed and accessible logs for debugging
4. **Simpler Configuration**: Less complex setup compared to Docker
5. **Automatic HTTPS**: SSL certificates are automatically provisioned and renewed
6. **Built-in CDN**: Static assets are automatically served through Render's global CDN

## Configuration Files

### render.json

The `render.json` file defines your Render Web Service configuration:

```json
{
  "services": [
    {
      "type": "web",
      "name": "your-app-name",
      "env": "node",
      "plan": "starter",
      "buildCommand": "npm run render-build",
      "startCommand": "npm run render-start",
      "healthCheckPath": "/api/health",
      "autoDeploy": true,
      "envVars": [
        {
          "key": "NODE_ENV",
          "value": "production"
        },
        {
          "key": "PORT",
          "value": "10000"
        },
        {
          "key": "JWT_SECRET",
          "generateValue": true
        }
      ],
      "disk": {
        "name": "uploads",
        "mountPath": "/opt/render/project/src/server/uploads",
        "sizeGB": 1
      }
    }
  ]
}
```

### package.json Scripts

Your `package.json` should include these scripts for Render deployment:

```json
"scripts": {
  "render-build": "npm install && npm run install-server && npm run install-client && npm run build && node server/scripts/ensure-uploads-directory.js",
  "render-start": "node server/index.js"
}
```

## Deployment Steps

### Option 1: Using the Deployment Scripts

1. Run the appropriate deployment script:
   - On Linux/Mac: `./deploy-homepage-fix-to-render-web.sh`
   - On Windows: `deploy-homepage-fix-to-render-web.bat`

2. The script will:
   - Run the update scripts to enhance error handling
   - Commit the changes to git
   - Push to your Render git remote (if configured)

3. Wait for the deployment to complete on Render.

### Option 2: Manual Deployment via GitHub

1. Push your code to GitHub:
   ```
   git add .
   git commit -m "Prepare for Render Web Service deployment"
   git push origin master
   ```

2. Connect your GitHub repository to Render:
   - Log in to your Render dashboard
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch
   - Choose "Node" as the environment
   - Set the build command to: `npm run render-build`
   - Set the start command to: `npm run render-start`
   - Configure environment variables as needed
   - Click "Create Web Service"

### Option 3: Manual Deployment via Git

1. Create a new Web Service in the Render dashboard
2. Copy the Git remote URL provided by Render
3. Add the Render remote to your local repository:
   ```
   git remote add render <your-render-git-url>
   ```
4. Push to the Render remote:
   ```
   git push render master
   ```

## Environment Variables

Configure these environment variables in your Render dashboard:

- `NODE_ENV`: Set to `production`
- `PORT`: Set to `10000` (Render's default port)
- `JWT_SECRET`: A secure random string for JWT authentication
- `DATABASE_URL`: Your database connection string
- `FRONTEND_URL`: The URL of your deployed frontend
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## Persistent Disk

Render Web Services can use a persistent disk for file storage:

1. Configure the disk in your `render.json` file:
   ```json
   "disk": {
     "name": "uploads",
     "mountPath": "/opt/render/project/src/server/uploads",
     "sizeGB": 1
   }
   ```

2. Access files at the specified mount path in your application

## Health Checks

Render uses health checks to determine if your service is running properly:

1. Configure a health check endpoint in your application:
   ```javascript
   app.get('/api/health', (req, res) => {
     res.status(200).json({ status: 'healthy' });
   });
   ```

2. Set the `healthCheckPath` in your `render.json` to `/api/health`

## Troubleshooting

### 502 Bad Gateway Errors

If you encounter 502 errors:

1. Check your server logs in the Render dashboard
2. Ensure your server is listening on the correct port (usually `process.env.PORT`)
3. Verify that your health check endpoint is working
4. Check for any uncaught exceptions or promise rejections

### Blank Pages or Frontend Issues

If your frontend loads but shows blank pages:

1. Check browser console for errors
2. Verify that your API endpoints are accessible
3. Ensure CORS is properly configured
4. Check that your frontend is correctly built during deployment

### Database Connection Issues

If your application can't connect to the database:

1. Verify your database connection string
2. Check if your database service is running
3. Ensure your application has proper error handling for database connections

## Additional Resources

- [Render Web Services Documentation](https://render.com/docs/web-services)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Render Disks](https://render.com/docs/disks)
- [Render Blueprint Specification](https://render.com/docs/blueprint-spec)
