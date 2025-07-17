#!/bin/bash
echo "Building and testing Docker image with improved error handling..."

# Build the Docker image
echo "Building Docker image..."
docker build -t analytical-lab-website:latest .

if [ $? -ne 0 ]; then
  echo "Docker build failed. Please check the error messages above."
  exit 1
fi

echo "Docker image built successfully!"

# Run the Docker container
echo "Starting Docker container for testing..."
docker run -d --name analytical-lab-test -p 5000:5000 analytical-lab-website:latest

if [ $? -ne 0 ]; then
  echo "Failed to start Docker container. Please check the error messages above."
  exit 1
fi

echo "Docker container started successfully!"
echo ""
echo "The application is now running at http://localhost:5000"
echo ""
echo "To stop the container, run: docker stop analytical-lab-test"
echo "To remove the container, run: docker rm analytical-lab-test"
echo ""
echo "Press Ctrl+C to exit this script."

# Wait for the container to start
sleep 5

# Open the browser to the application
if command -v xdg-open &> /dev/null; then
  xdg-open http://localhost:5000
elif command -v open &> /dev/null; then
  open http://localhost:5000
else
  echo "Could not automatically open browser. Please visit http://localhost:5000 manually."
fi

# Wait for user to press Ctrl+C
read -p "Press Enter to exit..."
