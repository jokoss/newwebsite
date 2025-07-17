#!/bin/sh
# Script to ensure server files are properly copied to the right location
# This is a fallback mechanism in case the main setup script fails

echo "=== ENSURE SERVER FILES SCRIPT ==="
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"

# Check if server/index.js exists
if [ -f "/app/server/index.js" ]; then
  echo "✅ /app/server/index.js exists"
  # Verify the file size to ensure it's not empty
  FILE_SIZE=$(stat -c%s "/app/server/index.js" 2>/dev/null || stat -f%z "/app/server/index.js" 2>/dev/null)
  if [ -n "$FILE_SIZE" ] && [ "$FILE_SIZE" -gt 100 ]; then
    echo "✅ /app/server/index.js has valid content (size: $FILE_SIZE bytes)"
  else
    echo "⚠️ /app/server/index.js exists but may be empty or too small (size: $FILE_SIZE bytes)"
  fi
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
    
    # Create a more robust index.js file as a last resort
    echo "Creating enhanced index.js file"
    mkdir -p /app/server 2>/dev/null
    
    cat > /app/server/index.js << EOF
// Enhanced server index.js file created by ensure-server-files.sh
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced logging middleware
const logRequest = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  console.log(\`[\${timestamp}] \${req.method} \${req.url} - Request received\`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`[\${timestamp}] \${req.method} \${req.url} - Response sent: \${res.statusCode} (\${duration}ms)\`);
  });
  
  next();
};

// CORS configuration with detailed options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Get allowed origins from environment variable or use default
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:3000', 'https://analytical-lab.onrender.com'];
    
    // Check if the origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('render.com')) {
      callback(null, true);
    } else {
      console.warn(\`Origin \${origin} not allowed by CORS policy\`);
      callback(null, true); // Allow anyway in fallback mode for better compatibility
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(logRequest);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app with proper caching
app.use(express.static(path.join(__dirname, '../client/build'), {
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Set cache for static assets (1 day)
    if (path.endsWith('.js') || path.endsWith('.css') || path.includes('/static/')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else {
      // No cache for HTML files
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// API routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is working',
    mode: 'fallback',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint with detailed information
app.get('/api/health', (req, res) => {
  // Check if client build exists
  const clientBuildExists = fs.existsSync(path.join(__dirname, '../client/build/index.html'));
  
  // Get memory usage
  const memoryUsage = process.memoryUsage();
  
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    clientBuildExists,
    serverMode: 'fallback',
    memory: {
      rss: \`\${Math.round(memoryUsage.rss / 1024 / 1024)} MB\`,
      heapTotal: \`\${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB\`,
      heapUsed: \`\${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB\`
    },
    env: {
      port: PORT,
      nodeEnv: process.env.NODE_ENV,
      allowedOrigins: process.env.ALLOWED_ORIGINS,
      databaseConfigured: !!process.env.DATABASE_URL
    }
  });
});

// Mock API endpoints to prevent errors in the frontend
app.get('/api/categories', (req, res) => {
  res.json({ 
    message: 'This is a mock response from the fallback server',
    data: []
  });
});

app.get('/api/tests', (req, res) => {
  res.json({ 
    message: 'This is a mock response from the fallback server',
    data: []
  });
});

app.get('/api/certifications', (req, res) => {
  res.json({ 
    message: 'This is a mock response from the fallback server',
    data: []
  });
});

app.get('/api/blog', (req, res) => {
  res.json({ 
    message: 'This is a mock response from the fallback server',
    data: []
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT} in \${process.env.NODE_ENV || 'development'} mode (FALLBACK SERVER)\`);
  console.log(\`Health check available at: http://localhost:\${PORT}/api/health\`);
  console.log(\`Client files served from: \${path.join(__dirname, '../client/build')}\`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(\`Port \${PORT} is already in use. Please use a different port.\`);
    process.exit(1);
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  // Keep the server running despite the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep the server running despite the error
});
EOF
    echo "✅ Created minimal index.js file"
  fi
fi

# Check for node_modules and install dependencies if needed
echo "Checking for node_modules..."
if [ ! -d "/app/node_modules" ] || [ ! -d "/app/node_modules/express" ]; then
  echo "❌ Express module not found in /app/node_modules"
  echo "Installing express and other dependencies..."
  cd /app && npm install express cors dotenv 2>/dev/null && \
    echo "✅ Installed express and core dependencies in /app" || \
    echo "❌ Failed to install express in /app"
fi

if [ ! -d "/app/server/node_modules" ] || [ ! -d "/app/server/node_modules/express" ]; then
  echo "❌ Express module not found in /app/server/node_modules"
  echo "Installing server dependencies..."
  cd /app/server && npm install express cors dotenv 2>/dev/null && \
    echo "✅ Installed express and core dependencies in /app/server" || \
    echo "❌ Failed to install express in /app/server"
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

# Create a minimal package.json in server directory if it doesn't exist
if [ ! -f "/app/server/package.json" ]; then
  echo "❌ /app/server/package.json does not exist"
  echo "Creating minimal package.json..."
  
  cat > /app/server/package.json << EOF
{
  "name": "server",
  "version": "1.0.0",
  "description": "Server for the application",
  "main": "index.js",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  }
}
EOF
  echo "✅ Created minimal package.json"
  
  # Install dependencies
  cd /app/server && npm install 2>/dev/null && \
    echo "✅ Installed dependencies from minimal package.json" || \
    echo "❌ Failed to install dependencies from minimal package.json"
fi

echo "=== SERVER FILES CHECK COMPLETE ==="
echo "Directory listing of /app/server:"
ls -la /app/server 2>/dev/null || echo "❌ /app/server does not exist"

echo "Node modules in /app:"
ls -la /app/node_modules 2>/dev/null | grep express || echo "❌ Express not found in /app/node_modules"

echo "Node modules in /app/server:"
ls -la /app/server/node_modules 2>/dev/null | grep express || echo "❌ Express not found in /app/server/node_modules"

exit 0
