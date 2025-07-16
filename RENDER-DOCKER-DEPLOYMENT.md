# Render Docker Deployment Guide

This guide will walk you through deploying your Analytical Testing Laboratory application to Render using Docker with the automated setup script.

## Overview

We've created a streamlined deployment process that addresses common issues:

1. **Client Build Files**: Automatically copies client build files to the correct location
2. **Database Connection**: Ensures proper database connection with PostgreSQL
3. **Persistent Storage**: Sets up persistent storage for uploads

## Prerequisites

- A GitHub account with your repository pushed to it
- A Render account (you can sign up at [render.com](https://render.com))

## Files Added/Modified

We've added or modified the following files to ensure smooth deployment:

1. **render-setup.sh**: A pre-start script that runs before your application starts
2. **render.yaml**: Updated to include persistent disk and proper configuration
3. **Dockerfile**: Modified to include the setup script

## Deployment Steps

### 1. Prepare Your Repository

Ensure all the following files are committed and pushed to your GitHub repository:

- `Dockerfile`
- `render.yaml`
- `render-setup.sh`
- All your application code

### 2. Create a Render Account

1. Go to [render.com](https://render.com)
2. Sign up for an account (you can use GitHub for authentication)
3. Verify your email address if required

### 3. Connect Your GitHub Repository

1. In the Render dashboard, click on your profile icon in the top right
2. Select "Account Settings"
3. Navigate to the "GitHub" tab
4. Click "Connect" next to GitHub
5. Authorize Render to access your repositories
6. Choose the repository containing your application

### 4. Deploy Using Blueprint (render.yaml)

1. In the Render dashboard, click the "New +" button in the top right
2. Select "Blueprint" from the dropdown menu
3. Find and select your repository from the list
4. Render will automatically detect your `render.yaml` file
5. Review the services that will be created:
   - Web service: analytical-lab (Docker)
   - PostgreSQL database: analytical-lab-db
   - Persistent disk: uploads (1GB)

6. Before applying the blueprint, you'll need to configure the environment variables:
   - `ADMIN_EMAIL`: Set to your admin email (e.g., admin@yourdomain.com)
   - `ADMIN_PASSWORD`: Set to a secure password
   - `ALLOWED_ORIGINS`: Set to your frontend URL (e.g., https://analytical-lab.onrender.com)
   - `FRONTEND_URL`: Set to your frontend URL (same as above)

7. Click "Apply Blueprint" to start the deployment process

### 5. Monitor the Deployment

1. Render will create the database, disk, and web service
2. You can monitor the build progress in the Render dashboard
3. The initial build may take 5-10 minutes as it:
   - Builds your Docker image
   - Sets up the PostgreSQL database
   - Provisions the persistent disk
   - Deploys your application

4. Once the build is complete, Render will provide a URL for your application (e.g., https://analytical-lab.onrender.com)

### 6. Verify the Setup Script Execution

1. In the Render dashboard, go to your web service
2. Click on the "Logs" tab
3. Look for output from the `render-setup.sh` script
4. Verify that:
   - Client build files were copied to the correct location
   - Database connection was established
   - Uploads directory was linked to persistent storage

### 7. Test Your Application

1. Visit the provided URL to access your application
2. Test key functionality:
   - User authentication (login with your admin credentials)
   - Admin dashboard access
   - Database operations (creating/editing records)
   - File uploads (to verify persistent storage)

## Troubleshooting

### Client Build Files Not Found

If you see errors about missing client build files:

1. Check the logs for output from the `render-setup.sh` script
2. Verify that your client build process completed successfully
3. If needed, manually trigger a rebuild in the Render dashboard

### Database Connection Issues

If your application can't connect to the database:

1. Check the `DATABASE_URL` environment variable in the Render dashboard
2. Ensure the PostgreSQL database was provisioned correctly
3. Check the database logs for any connection errors

### File Upload Issues

If file uploads aren't persisting:

1. Verify the persistent disk was mounted correctly
2. Check the logs for messages about the uploads directory
3. Ensure your application has write permissions to the uploads directory

## Maintenance and Updates

To update your application:

1. Push changes to your GitHub repository
2. Render will automatically detect the changes and rebuild your application
3. The `render-setup.sh` script will run again during the deployment process
4. Monitor the logs to ensure a successful deployment

## Understanding the Setup Script

The `render-setup.sh` script performs several important tasks:

1. **Client Build Files**: Copies client build files to `/opt/render/project/src/client/build` where the server expects them
2. **Database Connection**: Verifies the DATABASE_URL environment variable is set
3. **Persistent Storage**: Sets up the uploads directory and links it to the persistent disk at `/var/data`

This script runs automatically before your application starts, ensuring everything is properly configured.

## Scaling (If Needed)

To scale your application:

1. In the Render dashboard, go to your web service
2. Click on the "Settings" tab
3. Under "Instance Type", select a larger instance if needed
4. Under "Scaling", you can configure auto-scaling for paid plans
5. If you need more storage, you can increase the size of the persistent disk

## Conclusion

Your application is now deployed to Render using Docker with proper configuration for client files, database connection, and persistent storage. The automated setup script ensures a smooth deployment process and helps troubleshoot any issues that may arise.
