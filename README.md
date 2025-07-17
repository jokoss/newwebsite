# Analytical Testing Laboratory Website

A full-stack web application for an analytical testing laboratory, built with React, Node.js, Express, and Sequelize.

## Error Handling Improvements

This application includes robust error handling to ensure stability and a good user experience:

- **Client-Side Error Boundaries**: React ErrorBoundary components catch rendering errors
- **Fallback UI Components**: Graceful degradation when components fail
- **Early Error Detection**: Global error listeners catch and log issues
- **API Call Improvements**: Timeouts and fallbacks for API failures

For detailed information about error handling, see [ERROR-HANDLING-README.md](ERROR-HANDLING-README.md).

## Deployment to Netlify

This guide explains how to deploy this application to Netlify.

### Prerequisites

1. A GitHub account with this repository pushed to it
2. A Netlify account (sign up at [netlify.com](https://netlify.com))

### Deployment Steps

1. Log in to your Netlify dashboard
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure the build settings:
   - Build command: `npm install && cd client && npm install && npm run build`
   - Publish directory: `client/build`
5. Click "Deploy site"

The application is configured to use Netlify Functions for the backend API, which will be automatically set up during deployment.

### Environment Variables

After deployment, set up the following environment variables in the Netlify dashboard:
- `JWT_SECRET`: A secure random string for JWT token signing
- `JWT_EXPIRES_IN`: `7d` (or your preferred token expiration time)
- `NODE_ENV`: `production`

### Database Configuration

By default, the application will use SQLite for the database. For a production environment, you may want to use a more robust database solution:

1. Set up a PostgreSQL database (e.g., using Heroku, Railway, or another provider)
2. Add the `DATABASE_URL` environment variable in your Netlify dashboard with the connection string

## Alternative Deployment Options

### Deployment to Render.com

This application can also be deployed to Render.com.

### Prerequisites

1. A GitHub account with this repository pushed to it
2. A Render.com account
3. (Optional) A PostgreSQL database (Render offers a free PostgreSQL service)

### Step 1: Set Up PostgreSQL Database on Render (Optional)

If you want to use PostgreSQL instead of SQLite:

1. Log in to your Render dashboard
2. Click on "New" and select "PostgreSQL"
3. Fill in the required fields:
   - Name: `analytical-lab-db` (or your preferred name)
   - Database: `analytical_lab_db`
   - User: Leave as default
   - Region: Choose the closest to your users
4. Click "Create Database"
5. Once created, note the "External Database URL" - you'll need this for your web service

### Step 2: Deploy the Web Service

1. From your Render dashboard, click "New" and select "Web Service"
2. Connect your GitHub repository
3. Fill in the required fields:
   - Name: `analytical-lab` (or your preferred name)
   - Environment: `Node`
   - Region: Choose the closest to your users
   - Branch: `main` (or your deployment branch)
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Under "Advanced", add the following environment variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `JWT_EXPIRES_IN`: `7d` (or your preferred token expiration time)
   - `DATABASE_URL`: The PostgreSQL connection URL from Step 1 (if using PostgreSQL)
   - `FRONTEND_URL`: The URL of your deployed application (e.g., `https://analytical-lab.onrender.com`)
5. Click "Create Web Service"

### Step 3: Verify Deployment

1. Wait for the deployment to complete (this may take a few minutes)
2. Once deployed, click on the URL provided by Render to access your application
3. Verify that all features are working correctly

### Troubleshooting

If you encounter issues:

1. Check the Render logs for error messages
2. Ensure all environment variables are correctly set
   - If you see an error about `DATABASE_URL` being undefined, make sure your PostgreSQL database is properly provisioned in Render
   - The application will fall back to SQLite if `DATABASE_URL` is not set, but this is not recommended for production
3. Verify that the database connection is working
4. Check that the build and start commands are executing correctly
5. If you encounter "invalid ELF header" errors with SQLite:
   - This is a binary compatibility issue with SQLite on Render
   - The application has been configured to use PostgreSQL dependencies instead of SQLite in production
   - If the issue persists, make sure the PostgreSQL database is properly set up and connected
6. If you see errors about missing client build files (e.g., "no such file or directory, stat '/opt/render/project/src/client/build/index.html'"):
   - This indicates that the React client build is not being generated or found correctly
   - The application has been configured to explicitly build the client and copy it to the server directory
   - Check the build logs to ensure the client build is completing successfully
7. If you encounter package-lock.json synchronization issues:
   - Update your package-lock.json files locally with `npm install` in each directory
   - Commit the updated lock files before deploying

### Alternative Deployment Options

If you continue to face issues with Render deployment, consider these alternatives:

1. **Deploy Frontend and Backend Separately**:
   - Deploy the backend API on Render as a Web Service
   - Deploy the frontend on Netlify, Vercel, or GitHub Pages (optimized for React apps)
   - Configure CORS settings to allow communication between services

2. **Use a Pre-build Step**:
   - Build the client locally first
   - Commit the built files to your repository
   - Configure Render to skip the build step and just serve the pre-built files

3. **Use a Different Platform**:
   - Consider platforms specifically designed for full-stack JavaScript applications:
     - Railway.app
     - Heroku
     - DigitalOcean App Platform

## Local Development

To run this application locally:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Docker Deployment

This application can be deployed using Docker:

### Building and Testing Docker Locally

#### Windows
```
build-and-test-docker.bat
```

#### Unix/Linux/Mac
```
chmod +x *.sh  # Make scripts executable (first time only)
./build-and-test-docker.sh
```

### Deploying to Render with Docker

#### Windows
```
deploy-to-render-docker.bat
```

#### Unix/Linux/Mac
```
chmod +x *.sh  # Make scripts executable (first time only)
./deploy-to-render-docker.sh
```

### Rebuilding Client with Error Handling

#### Windows
```
rebuild-client-with-error-handling.bat
```

#### Unix/Linux/Mac
```
chmod +x *.sh  # Make scripts executable (first time only)
./rebuild-client-with-error-handling.sh
```

## File Upload Considerations

This application currently uses local file storage, which is not suitable for production on Render due to its ephemeral filesystem. For a production environment, consider implementing cloud storage solutions like AWS S3 or Cloudinary.

## Database Considerations

The application is configured to use SQLite in development and PostgreSQL in production. If you prefer to use SQLite in production, be aware that:

1. SQLite data will be lost on each deployment due to Render's ephemeral filesystem
2. You'll need to implement a backup/restore mechanism to persist data between deployments

For most production use cases, PostgreSQL is recommended.
