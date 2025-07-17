#!/bin/bash
# Script to run the minimal API server for testing and diagnosing deployment issues

echo "=== STARTING MINIMAL API SERVER ==="
echo "This script will start a minimal API server that provides sample data"
echo "for testing and diagnosing deployment issues."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js first."
  exit 1
fi

# Check if required packages are installed
echo "Checking for required packages..."
if [ ! -d "node_modules/express" ]; then
  echo "Installing required packages..."
  npm install express cors
  if [ $? -ne 0 ]; then
    echo "❌ Failed to install required packages. Please check the error messages above."
    exit 1
  fi
fi

# Make sure the script is executable
chmod +x api-server-minimal.js

# Start the minimal API server
echo "Starting minimal API server..."
node api-server-minimal.js

# This line will only be reached if the server is stopped
echo "Server stopped."
