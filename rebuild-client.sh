#!/bin/bash

# Script to rebuild the client application with improved error handling

echo "Starting client rebuild process..."

# Navigate to client directory
cd client

# Install any missing dependencies
echo "Installing dependencies..."
npm install

# Build the client application
echo "Building client application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Client build successful!"
  
  # Copy diagnostic scripts to the build directory
  echo "Copying diagnostic scripts to build directory..."
  cp ../client-error-handler.js build/
  cp ../api-diagnostic.js build/
  
  echo "Client rebuild completed successfully!"
  echo "The application now includes improved error handling and diagnostic tools."
  echo ""
  echo "To test the application, run: npm start"
  echo "To deploy the application, run: ./deploy-to-render.sh"
else
  echo "Client build failed. Please check the error messages above."
  exit 1
fi
