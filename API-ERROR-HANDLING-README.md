# API Error Handling and Minimal API Server

This document explains the error handling improvements and the minimal API server solution implemented to address issues with API connectivity and deployment.

## Problem

The application was experiencing several issues:

1. **API Connection Errors**: The frontend was receiving HTML responses instead of JSON when the API server was unavailable, causing errors like:
   - `Error fetching partners: SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON`
   - `Error fetching blog posts: SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON`
   - `Error fetching categories: SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON`

2. **Undefined Property Errors**: In some components like Footer.js, there were errors when trying to access properties of undefined objects:
   - `TypeError: Cannot read properties of undefined (reading 'length')`

3. **Deployment Issues**: The application was experiencing "Bad Gateway" errors when deployed to platforms like Render.

## Solution

### 1. Client-Side Error Handling

We've implemented several improvements to handle API errors gracefully:

- **ApiErrorHandler Component**: A reusable component that displays user-friendly error messages and provides retry functionality.
- **Fallback Data**: Each component that fetches data now has fallback data to display when the API is unavailable.
- **Null Checks**: Added proper null/undefined checks to prevent "Cannot read property of undefined" errors.
- **Request Timeouts**: Added timeout handling to prevent hanging requests.

### 2. Minimal API Server

We've created a minimal API server that can be used for testing and as a fallback when the main server is unavailable:

- **api-server-minimal.js**: A lightweight Express server that provides sample data for all the API endpoints used by the frontend.
- **run-minimal-api-server.bat/sh**: Scripts to run the minimal API server locally.
- **Dockerfile.api-minimal**: Docker configuration for containerizing the minimal API server.
- **build-and-run-docker-minimal.bat/sh**: Scripts to build and run the Docker container.

## How to Use

### Running the Minimal API Server Locally

#### Windows:
```
run-minimal-api-server.bat
```

#### Linux/macOS:
```
chmod +x run-minimal-api-server.sh
./run-minimal-api-server.sh
```

### Running the Minimal API Server with Docker

#### Windows:
```
build-and-run-docker-minimal.bat
```

#### Linux/macOS:
```
chmod +x build-and-run-docker-minimal.sh
./build-and-run-docker-minimal.sh
```

### Deploying to Render

1. Push your changes to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Use the following settings:
   - **Build Command**: `npm install && cd client && npm install && npm run build && cd ..`
   - **Start Command**: `node api-server-minimal.js`
   - **Environment Variables**: Set `NODE_ENV=production` and `PORT=5000`

## Available API Endpoints

The minimal API server provides the following endpoints:

- **GET /api/health**: Health check endpoint
- **GET /api/categories**: Returns sample categories data
- **GET /api/partners**: Returns sample partners data
- **GET /api/blog**: Returns sample blog posts data
- **GET /api/certifications**: Returns sample certifications data

## Benefits

1. **Improved User Experience**: Users will see meaningful error messages instead of cryptic errors.
2. **Graceful Degradation**: The application will continue to function with fallback data even when the API is unavailable.
3. **Easier Debugging**: The minimal API server makes it easier to diagnose issues with the frontend without needing the full backend.
4. **Simplified Deployment**: The minimal API server can be deployed as a standalone service, reducing complexity and potential points of failure.

## Next Steps

1. **Implement Server-Side Logging**: Add comprehensive logging to the main server to better diagnose API issues.
2. **Add Monitoring**: Implement health checks and monitoring to detect and alert on API issues.
3. **Implement Caching**: Add client-side caching to reduce the impact of API outages.
