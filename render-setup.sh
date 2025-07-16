#!/bin/bash
# Render pre-start setup script
# This script runs before the application starts on Render

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Starting Render Setup Script ==="

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p /opt/render/project/src/client/build

# Check if we're running in the correct directory
CURRENT_DIR=$(pwd)
echo "Current directory: $CURRENT_DIR"

# If client/build exists in the project root, copy it to the expected location
if [ -d "./client/build" ]; then
  echo "Found client/build in project root, copying to /opt/render/project/src/client/build"
  cp -r ./client/build/* /opt/render/project/src/client/build/
elif [ -d "/app/client/build" ]; then
  echo "Found client/build in /app, copying to /opt/render/project/src/client/build"
  cp -r /app/client/build/* /opt/render/project/src/client/build/
else
  echo "WARNING: client/build directory not found. Attempting to build client..."
  # Try to build the client if it's not found
  if [ -d "./client" ]; then
    cd ./client
    npm install
    npm run build
    cd ..
    if [ -d "./client/build" ]; then
      echo "Successfully built client, copying to /opt/render/project/src/client/build"
      cp -r ./client/build/* /opt/render/project/src/client/build/
    else
      echo "ERROR: Failed to build client"
    fi
  else
    echo "ERROR: client directory not found"
  fi
fi

# Verify client build files
if [ -f "/opt/render/project/src/client/build/index.html" ]; then
  echo "✅ Client build files successfully copied to the correct location"
else
  echo "❌ Client build files not found at the expected location"
  echo "Files in /opt/render/project/src/client/build:"
  ls -la /opt/render/project/src/client/build || echo "Directory does not exist or is empty"
fi

# Check database connection
echo "Checking database connection..."
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL environment variable is not set"
  echo "Using SQLite as fallback (not recommended for production)"
else
  echo "✅ DATABASE_URL is set"
fi

# Check uploads directory
echo "Setting up uploads directory..."
UPLOADS_DIR="/opt/render/project/src/uploads"
mkdir -p $UPLOADS_DIR
chmod 777 $UPLOADS_DIR
echo "✅ Uploads directory created at $UPLOADS_DIR"

# If we have a disk mounted, create a symlink to it
if [ -d "/var/data" ]; then
  echo "Persistent disk detected at /var/data"
  mkdir -p /var/data/uploads
  chmod 777 /var/data/uploads
  
  # Remove the uploads directory if it exists and create a symlink
  rm -rf $UPLOADS_DIR
  ln -s /var/data/uploads $UPLOADS_DIR
  echo "✅ Linked uploads directory to persistent storage at /var/data/uploads"
else
  echo "⚠️ No persistent disk detected. Uploads will not persist between deployments."
fi

# Final check
echo "=== Setup Complete ==="
echo "Client build directory: $(ls -la /opt/render/project/src/client/build | wc -l) files"
echo "Uploads directory: $UPLOADS_DIR"
echo "Database URL: ${DATABASE_URL:0:10}... (truncated for security)"

exit 0
