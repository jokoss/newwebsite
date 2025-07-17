#!/bin/sh
# Script to check if dependencies are installed correctly in the Docker container

echo "=== DEPENDENCY CHECK SCRIPT ==="

# Check if we're running in a Docker container
if [ -f "/.dockerenv" ]; then
  echo "✅ Running in a Docker container"
else
  echo "❌ Not running in a Docker container"
  echo "This script is designed to be run inside the Docker container."
  echo "You can use 'docker exec' to run this script in the container:"
  echo "docker exec -it your-container-name /bin/sh check-dependencies.sh"
  exit 1
fi

# Check for express in various locations
echo "\n=== Checking for Express.js ==="

# Check in /app/node_modules
if [ -d "/app/node_modules/express" ]; then
  echo "✅ Express found in /app/node_modules"
  echo "Version: $(cat /app/node_modules/express/package.json | grep version | head -1)"
else
  echo "❌ Express not found in /app/node_modules"
fi

# Check in /app/server/node_modules
if [ -d "/app/server/node_modules/express" ]; then
  echo "✅ Express found in /app/server/node_modules"
  echo "Version: $(cat /app/server/node_modules/express/package.json | grep version | head -1)"
else
  echo "❌ Express not found in /app/server/node_modules"
fi

# Check global node_modules
if [ -d "/usr/local/lib/node_modules/express" ]; then
  echo "✅ Express found in global node_modules"
  echo "Version: $(cat /usr/local/lib/node_modules/express/package.json | grep version | head -1)"
else
  echo "❌ Express not found in global node_modules"
fi

# Check package.json files
echo "\n=== Checking package.json files ==="

# Check root package.json
if [ -f "/app/package.json" ]; then
  echo "✅ Root package.json exists"
  echo "Dependencies:"
  cat /app/package.json | grep -A 20 '"dependencies"' | grep -B 20 '}'
else
  echo "❌ Root package.json not found"
fi

# Check server package.json
if [ -f "/app/server/package.json" ]; then
  echo "✅ Server package.json exists"
  echo "Dependencies:"
  cat /app/server/package.json | grep -A 20 '"dependencies"' | grep -B 20 '}'
else
  echo "❌ Server package.json not found"
fi

# Check node_modules directories
echo "\n=== Checking node_modules directories ==="

# Check root node_modules
if [ -d "/app/node_modules" ]; then
  echo "✅ Root node_modules exists"
  echo "Size: $(du -sh /app/node_modules | cut -f1)"
  echo "Number of packages: $(ls -1 /app/node_modules | wc -l)"
else
  echo "❌ Root node_modules not found"
fi

# Check server node_modules
if [ -d "/app/server/node_modules" ]; then
  echo "✅ Server node_modules exists"
  echo "Size: $(du -sh /app/server/node_modules | cut -f1)"
  echo "Number of packages: $(ls -1 /app/server/node_modules | wc -l)"
else
  echo "❌ Server node_modules not found"
fi

# Check for other key dependencies
echo "\n=== Checking for other key dependencies ==="

# Check for cors
if [ -d "/app/node_modules/cors" ] || [ -d "/app/server/node_modules/cors" ]; then
  echo "✅ cors is installed"
else
  echo "❌ cors is not installed"
fi

# Check for dotenv
if [ -d "/app/node_modules/dotenv" ] || [ -d "/app/server/node_modules/dotenv" ]; then
  echo "✅ dotenv is installed"
else
  echo "❌ dotenv is not installed"
fi

# Check for sequelize
if [ -d "/app/node_modules/sequelize" ] || [ -d "/app/server/node_modules/sequelize" ]; then
  echo "✅ sequelize is installed"
else
  echo "❌ sequelize is not installed"
fi

echo "\n=== DEPENDENCY CHECK COMPLETE ==="
