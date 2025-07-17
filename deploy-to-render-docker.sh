#!/bin/bash
echo "Deploying Docker image to Render with improved error handling..."

# Check if Render CLI is installed
if ! command -v render &> /dev/null; then
  echo "Render CLI not found. Please install it first."
  echo "Visit: https://render.com/docs/cli"
  exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build -t analytical-lab-website:latest .

if [ $? -ne 0 ]; then
  echo "Docker build failed. Please check the error messages above."
  exit 1
fi

echo "Docker image built successfully!"

# Tag the image for Render
echo "Tagging Docker image for Render..."
docker tag analytical-lab-website:latest registry.render.com/analytical-lab-website:latest

if [ $? -ne 0 ]; then
  echo "Failed to tag Docker image. Please check the error messages above."
  exit 1
fi

# Login to Render registry
echo "Logging in to Render registry..."
echo "Please enter your Render API key when prompted."
render login

if [ $? -ne 0 ]; then
  echo "Failed to login to Render. Please check your API key."
  exit 1
fi

# Push the image to Render
echo "Pushing Docker image to Render..."
docker push registry.render.com/analytical-lab-website:latest

if [ $? -ne 0 ]; then
  echo "Failed to push Docker image to Render. Please check the error messages above."
  exit 1
fi

echo "Docker image pushed to Render successfully!"

# Deploy the service on Render
echo "Deploying service on Render..."
render deploy --image registry.render.com/analytical-lab-website:latest

if [ $? -ne 0 ]; then
  echo "Failed to deploy service on Render. Please check the error messages above."
  exit 1
fi

echo "Deployment to Render completed successfully!"
echo ""
echo "Your application should be available at your Render URL shortly."
echo ""
echo "Note: It may take a few minutes for the deployment to complete and the application to be available."
echo ""
echo "Press Enter to exit..."
read
