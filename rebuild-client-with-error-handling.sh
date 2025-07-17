#!/bin/bash
echo "Rebuilding client with improved error handling..."

# Create backup of original files
echo "Creating backups of original files..."
if [ ! -f "client/public/client-error-handler.js.bak" ] && [ -f "client/public/client-error-handler.js" ]; then
  cp "client/public/client-error-handler.js" "client/public/client-error-handler.js.bak"
fi

if [ ! -f "client/public/api-diagnostic.js.bak" ] && [ -f "client/public/api-diagnostic.js" ]; then
  cp "client/public/api-diagnostic.js" "client/public/api-diagnostic.js.bak"
fi

# Copy error handling scripts to client/public directory
echo "Copying error handling scripts to client/public directory..."
cp "client-error-handler.js" "client/public/client-error-handler.js"
cp "api-diagnostic.js" "client/public/api-diagnostic.js"

if [ $? -ne 0 ]; then
  echo "Failed to copy error handling scripts. Please check if the files exist."
  exit 1
fi

# Rebuild client
echo "Rebuilding client..."
cd client
npm run build

if [ $? -ne 0 ]; then
  echo "Client build failed. Please check the error messages above."
  cd ..
  exit 1
fi

cd ..

echo "Client rebuilt successfully with error handling improvements!"
echo ""
echo "You can now test the application locally or deploy it to a server."
echo ""
echo "To test locally, run: npm run start"
echo "To deploy to Render, run: ./deploy-to-render-docker.sh"
echo ""
echo "Press Enter to exit..."
read
