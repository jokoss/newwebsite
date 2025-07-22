#!/bin/bash

# Script to test the Railway 404 Not Found fix locally

echo "🧪 Testing Railway 404 Not Found Fix Locally"
echo "==========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

# Build the client
echo "🏗️ Building React client..."
cd client && npm run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build React client. Please check for errors and try again."
    exit 1
fi
cd ..

# Start the server
echo "🚀 Starting server with api-server-minimal.js..."
echo "This will serve the React app from the Express server."
echo "Press Ctrl+C to stop the server."
echo ""
echo "Once the server is running, open your browser and navigate to:"
echo "http://localhost:5000"
echo ""
echo "You should see the React app instead of a 404 error."
echo ""

node api-server-minimal.js
