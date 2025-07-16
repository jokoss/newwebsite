# Step-by-Step Guide to Deploy Your Application to Render

This guide will walk you through the process of deploying your Analytical Testing Laboratory application to Render using the Docker configuration we've set up.

## Recent Fixes

We've fixed the following issues in the render.yaml file:
- Removed the `buildEnvironment` section which was causing an error in Render
- Moved the SQLite3 build environment variables to the regular `envVars` section
- Added the required `version: 1` field at the top of the file
- Removed the `startCommand` from render.yaml and moved it to the Dockerfile's CMD instruction (Docker runtime must not have startCommand in render.yaml)

These changes should resolve the deployment errors you were experiencing.

## Prerequisites

- Your code is pushed to GitHub (which you've already done)
- A Render account (sign up at [render.com](https://render.com) if you don't have one)

## Step 1: Create a Render Account

1. Go to [render.com](https://render.com)
2. Sign up for an account (you can use GitHub for authentication)
3. Verify your email address if required

## Step 2: Connect Your GitHub Repository

1. In the Render dashboard, click on your profile icon in the top right
2. Select "Account Settings"
3. Navigate to the "GitHub" tab
4. Click "Connect" next to GitHub
5. Authorize Render to access your repositories
6. Choose the repository containing your application

## Step 3: Deploy Using Blueprint (render.yaml)

1. In the Render dashboard, click the "New +" button in the top right
2. Select "Blueprint" from the dropdown menu
3. Find and select your repository from the list
4. Render will automatically detect your `render.yaml` file (which now includes the required version field)
5. Review the services that will be created:
   - Web service: analytical-lab (Docker)
   - PostgreSQL database: analytical-lab-db
   - Persistent disk: uploads (1GB)

6. Configure the environment variables:
   - `ADMIN_EMAIL`: Set to your admin email (e.g., admin@yourdomain.com)
   - `ADMIN_PASSWORD`: Set to a secure password
   - `ALLOWED_ORIGINS`: Set to your frontend URL (e.g., https://analytical-lab.onrender.com)
   - `FRONTEND_URL`: Set to your frontend URL (same as above)

7. Click "Apply Blueprint" to start the deployment process

## Step 4: Monitor the Deployment

1. Render will create the database, disk, and web service
2. You can monitor the build progress in the Render dashboard
3. The initial build may take 5-10 minutes as it:
   - Builds your Docker image
   - Sets up the PostgreSQL database
   - Provisions the persistent disk
   - Deploys your application

4. Once the build is complete, Render will provide a URL for your application (e.g., https://analytical-lab.onrender.com)

## Step 5: Verify the Setup Script Execution

1. In the Render dashboard, go to your web service
2. Click on the "Logs" tab
3. Look for output from the `render-setup.sh` script
4. Verify that:
   - Client build files were copied to the correct location
   - Database connection was established
   - Uploads directory was linked to persistent storage

## Step 6: Test Your Application

1. Visit the provided URL to access your application
2. Test key functionality:
   - User authentication (login with your admin credentials)
   - Admin dashboard access
   - Database operations (creating/editing records)
   - File uploads (to verify persistent storage)

## Troubleshooting

### If the Blueprint Deployment Still Fails

If you continue to have issues with the Blueprint deployment, you can try manual configuration:

1. In the Render dashboard, click the "New +" button
2. Select "Web Service"
3. Connect your GitHub repository
4. Choose "Docker" as the environment
5. Set the start command to: `bash render-setup.sh && node server/index.js`
6. Add all the environment variables manually
7. After creating the web service, go to the "Disks" tab and add a disk with:
   - Name: uploads
   - Mount path: /var/data
   - Size: 1GB

8. Create a PostgreSQL database separately and connect it to your web service

### Common Issues and Solutions

#### Client Build Files Not Found

If you see errors about missing client build files:

1. Check the logs for output from the `render-setup.sh` script
2. Verify that your client build process completed successfully
3. If needed, manually trigger a rebuild in the Render dashboard

#### Database Connection Issues

If your application can't connect to the database:

1. Check the `DATABASE_URL` environment variable in the Render dashboard
2. Ensure the PostgreSQL database was provisioned correctly
3. Check the database logs for any connection errors

#### File Upload Issues

If file uploads aren't persisting:

1. Verify the persistent disk was mounted correctly
2. Check the logs for messages about the uploads directory
3. Ensure your application has write permissions to the uploads directory

## Automatic Deployments

Once your initial deployment is successful, any changes you push to your GitHub repository will automatically trigger a new deployment on Render. The `render-setup.sh` script will run during each deployment to ensure everything is properly configured.

## Conclusion

Your application should now be successfully deployed to Render with Docker. The automated setup script ensures that client files, database connection, and persistent storage are properly configured, resolving the issues you encountered previously.
