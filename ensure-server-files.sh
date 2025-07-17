#!/bin/sh
# Script to ensure server files are properly copied to the right location
# This is a fallback mechanism in case the main setup script fails

echo "=== ENSURE SERVER FILES SCRIPT ==="
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"

# Check if server/index.js exists
if [ -f "/app/server/index.js" ]; then
  echo "✅ /app/server/index.js exists"
else
  echo "❌ /app/server/index.js does not exist"
  
  # Try to find index.js elsewhere
  echo "Searching for index.js files..."
  INDEX_FILES=$(find /app -name "index.js" -not -path "*/node_modules/*" -not -path "*/client/*" 2>/dev/null)
  
  if [ -n "$INDEX_FILES" ]; then
    echo "Found index.js files:"
    echo "$INDEX_FILES"
    
    # Get the first match
    FIRST_INDEX=$(echo "$INDEX_FILES" | head -n 1)
    echo "Using $FIRST_INDEX"
    
    # Create server directory if it doesn't exist
    mkdir -p /app/server 2>/dev/null
    
    # Copy the file
    cp "$FIRST_INDEX" /app/server/index.js 2>/dev/null && \
      echo "✅ Copied $FIRST_INDEX to /app/server/index.js" || \
      echo "❌ Failed to copy $FIRST_INDEX to /app/server/index.js"
  else
    echo "❌ Could not find any index.js files"
    
    # Create a minimal index.js file as a last resort
    echo "Creating minimal index.js file"
    mkdir -p /app/server 2>/dev/null
    
    cat > /app/server/index.js << EOF
// Minimal server index.js file created by ensure-server-files.sh
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// API route
app.get('/api', (req, res) => {
  res.json({ message: 'API is working' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
EOF
    echo "✅ Created minimal index.js file"
  fi
fi

# Check if server directory has other necessary files
echo "Checking for other necessary server files..."

# Check for models directory
if [ ! -d "/app/server/models" ]; then
  echo "❌ /app/server/models directory does not exist"
  mkdir -p /app/server/models 2>/dev/null
  
  # Create minimal models/index.js
  cat > /app/server/models/index.js << EOF
// Minimal models/index.js file created by ensure-server-files.sh
module.exports = {
  // This is a placeholder for database models
};
EOF
  echo "✅ Created minimal models/index.js file"
fi

# Check for routes directory
if [ ! -d "/app/server/routes" ]; then
  echo "❌ /app/server/routes directory does not exist"
  mkdir -p /app/server/routes 2>/dev/null
fi

# Check for uploads directory
if [ ! -d "/app/server/uploads" ]; then
  echo "❌ /app/server/uploads directory does not exist"
  mkdir -p /app/server/uploads 2>/dev/null
  chmod 777 /app/server/uploads 2>/dev/null
  echo "✅ Created /app/server/uploads directory"
fi

# Check for client/build directory
if [ ! -d "/app/client/build" ]; then
  echo "❌ /app/client/build directory does not exist"
  mkdir -p /app/client/build 2>/dev/null
  
  # Create minimal index.html
  cat > /app/client/build/index.html << EOF
<!DOCTYPE html>
<html>
<head>
  <title>Application</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
    .message { margin: 30px 0; }
  </style>
</head>
<body>
  <h1>Application</h1>
  <div class="message">
    <p>The application is running, but the client build files were not found.</p>
    <p>This is a minimal page created by ensure-server-files.sh</p>
  </div>
</body>
</html>
EOF
  echo "✅ Created minimal index.html file"
fi

echo "=== SERVER FILES CHECK COMPLETE ==="
echo "Directory listing of /app/server:"
ls -la /app/server 2>/dev/null || echo "❌ /app/server does not exist"

exit 0
