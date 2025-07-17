#!/bin/bash
# Script to build and run the minimal API server Docker container

echo "=== BUILDING AND RUNNING MINIMAL API SERVER DOCKER CONTAINER ==="
echo "This script will build and run a Docker container for the minimal API server."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker first."
  exit 1
fi

# Check if client/build directory exists
if [ ! -d "client/build" ]; then
  echo "❌ client/build directory not found. Please build the client first with:"
  echo "  cd client"
  echo "  npm run build"
  echo "  cd .."
  exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build -t minimal-api-server -f Dockerfile.api-minimal .
if [ $? -ne 0 ]; then
  echo "❌ Failed to build Docker image. Please check the error messages above."
  exit 1
fi

# Run the Docker container
echo "Running Docker container..."
docker run -p 5000:5000 --name minimal-api-server-container minimal-api-server
if [ $? -ne 0 ]; then
  echo "❌ Failed to run Docker container. Please check the error messages above."
  exit 1
fi

# This line will only be reached if the container is stopped
echo "Container stopped."
