# Render Deployment Guide for Analytical Testing Laboratory

This guide will walk you through deploying your Analytical Testing Laboratory application to Render using Docker.

## Prerequisites

- A GitHub account with your repository pushed to it
- A Render account (you can sign up at [render.com](https://render.com))

## Step 1: Prepare Your Repository

Ensure your code is committed and pushed to GitHub. The following files are particularly important:

- `Dockerfile` - Defines how your application is containerized
- `render.yaml` - Blueprint for Render deployment
- `.dockerignore` - Specifies files to exclude from the Docker image

## Step 2: Create a Render Account

1. Go to [render.com](https://render.com)
2. Sign up for an account (you can use GitHub for authentication)
3. Verify your email address if required

## Step 3: Connect Your GitHub Repository

1. In the Render dashboard, click on your profile icon in the top right
2. Select "Account Settings"
3. Navigate to the "GitHub" tab
4. Click "Connect" next to GitHub
5. Authorize Render to access your repositories
6. Choose the repository containing your application

## Step 4: Deploy Using Blueprint (render.yaml)

1. In the Render dashboard, click the "New +" button in the top right
2. Select "Blueprint" from the dropdown menu
3. Find and select your repository from the list
4. Render will automatically detect your `render.yaml` file
5. Review the services that will be created:
   - Web service: analytical-lab (Docker)
   - PostgreSQL database: analytical-lab-db

6. Before applying the blueprint, you'll need to configure the environment variables:
   - `ADMIN_EMAIL`: Set to your admin email (e.g., admin@yourdomain.com)
   - `ADMIN_PASSWORD`: Set to a secure password
   - `ALLOWED_ORIGINS`: Set to your frontend URL (e.g., https://analytical-lab.onrender.com)
   - `FRONTEND_URL`: Set to your frontend URL (same as above)

7. Click "Apply Blueprint" to start the deployment process

## Step 5: Monitor the Deployment

1. Render will create both the database and web service
2. You can monitor the build progress in the Render dashboard
3. The initial build may take 5-10 minutes as it:
   - Builds your Docker image
   - Sets up the PostgreSQL database
   - Deploys your application

4. Once the build is complete, Render will provide a URL for your application (e.g., https://analytical-lab.onrender.com)

## Step 6: Verify Your Deployment

1. Visit the provided URL to access your application
2. Test key functionality:
   - User authentication (login with your admin credentials)
   - Admin dashboard access
   - Database operations (creating/editing records)
   - File uploads (if applicable)

3. Check the logs in the Render dashboard if you encounter any issues:
   - Go to your web service
   - Click on the "Logs" tab
   - Review any error messages

## Step 7: Set Up a Custom Domain (Optional)

1. In the Render dashboard, go to your web service
2. Click on the "Settings" tab
3. Scroll down to the "Custom Domain" section
4. Click "Add Custom Domain"
5. Follow the instructions to configure your domain's DNS settings
6. Render will automatically provision an SSL certificate for your domain

## Step 8: Configure Persistent Storage for Uploads

For file uploads to persist across deployments:

1. In the Render dashboard, go to your web service
2. Click on the "Settings" tab
3. Scroll down to the "Disks" section
4. Click "Add Disk"
5. Configure the disk:
   - Name: uploads
   - Mount Path: /app/server/uploads
   - Size: Choose based on your needs (start with 1 GB)
6. Click "Save Changes"

## Troubleshooting

### Database Connection Issues

If your application can't connect to the database:

1. Check the `DATABASE_URL` environment variable in the Render dashboard
2. Ensure your application is using this environment variable correctly
3. Check the database logs for any connection errors

### Build Failures

If your Docker build fails:

1. Check the build logs for specific error messages
2. Common issues include:
   - Missing dependencies
   - Syntax errors in Dockerfile
   - Permission issues

### Application Errors

If your application deploys but doesn't work correctly:

1. Check the application logs in the Render dashboard
2. Verify all environment variables are set correctly
3. Test your application locally using Docker to identify any issues

## Maintenance and Updates

To update your application:

1. Push changes to your GitHub repository
2. Render will automatically detect the changes and rebuild your application
3. Monitor the build logs to ensure a successful deployment

## Scaling (If Needed)

To scale your application:

1. In the Render dashboard, go to your web service
2. Click on the "Settings" tab
3. Under "Instance Type", select a larger instance if needed
4. Under "Scaling", you can configure auto-scaling for paid plans

## Monitoring

Render provides basic monitoring for all services:

1. In the Render dashboard, go to your web service
2. Click on the "Metrics" tab to view:
   - CPU usage
   - Memory usage
   - Response times
   - Request volume

For more advanced monitoring, consider integrating with a third-party service like New Relic or Datadog.
