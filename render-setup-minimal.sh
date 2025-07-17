#!/bin/sh
# Minimal Render setup script for debugging purposes

# Print debug information
echo "=== MINIMAL RENDER SETUP SCRIPT DEBUG INFO ==="
echo "Script path: $0"
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"
echo "Directory listing:"
ls -la
echo "Environment variables:"
env | grep -v PASSWORD | grep -v SECRET | grep -v KEY
echo "=== END DEBUG INFO ==="

# Only use directories we know we can write to
echo "=== Creating directories in safe locations ==="

# Try multiple possible upload directories
UPLOADS_DIR=""
POSSIBLE_DIRS="/app/uploads /app/server/uploads /var/data/uploads ./uploads"

for dir in $POSSIBLE_DIRS; do
  echo "Trying to create/access directory at $dir"
  mkdir -p "$dir" 2>/dev/null
  if [ -d "$dir" ] && [ -w "$dir" ]; then
    echo "✅ Found writable directory at $dir"
    UPLOADS_DIR="$dir"
    chmod 777 "$UPLOADS_DIR" 2>/dev/null || echo "⚠️ Could not set permissions on $UPLOADS_DIR"
    break
  else
    echo "❌ Cannot use directory at $dir"
  fi
done

if [ -z "$UPLOADS_DIR" ]; then
  echo "⚠️ Could not find any writable directory for uploads"
else
  echo "✅ Using uploads directory: $UPLOADS_DIR"
fi

# Try multiple possible client build directories
CLIENT_BUILD_DIR=""
POSSIBLE_BUILD_DIRS="/app/client/build /app/client-build ./client-build"

for dir in $POSSIBLE_BUILD_DIRS; do
  echo "Trying to create/access client build directory at $dir"
  mkdir -p "$dir" 2>/dev/null
  if [ -d "$dir" ] && [ -w "$dir" ]; then
    echo "✅ Found writable client build directory at $dir"
    CLIENT_BUILD_DIR="$dir"
    break
  else
    echo "❌ Cannot use client build directory at $dir"
  fi
done

if [ -z "$CLIENT_BUILD_DIR" ]; then
  echo "⚠️ Could not find any writable directory for client build"
else
  echo "✅ Using client build directory: $CLIENT_BUILD_DIR"
fi

# Set up persistent storage if available
if [ -d "/var/data" ] && [ -w "/var/data" ]; then
  echo "Persistent disk detected at /var/data"
  PERSISTENT_UPLOADS_DIR="/var/data/uploads"
  
  echo "Creating directory in persistent storage at $PERSISTENT_UPLOADS_DIR"
  mkdir -p "$PERSISTENT_UPLOADS_DIR" 2>/dev/null
  if [ -d "$PERSISTENT_UPLOADS_DIR" ] && [ -w "$PERSISTENT_UPLOADS_DIR" ]; then
    echo "✅ Created directory in persistent storage at $PERSISTENT_UPLOADS_DIR"
    chmod 777 "$PERSISTENT_UPLOADS_DIR" 2>/dev/null || echo "⚠️ Could not set permissions on $PERSISTENT_UPLOADS_DIR"
    
    # Link persistent storage to standard locations
    if [ -n "$UPLOADS_DIR" ] && [ "$UPLOADS_DIR" != "$PERSISTENT_UPLOADS_DIR" ]; then
      echo "Linking $UPLOADS_DIR to persistent storage at $PERSISTENT_UPLOADS_DIR"
      # Remove the directory if it exists and create a symlink
      rm -rf "$UPLOADS_DIR" 2>/dev/null
      ln -sf "$PERSISTENT_UPLOADS_DIR" "$UPLOADS_DIR" 2>/dev/null && \
        echo "✅ Created symlink from $UPLOADS_DIR to $PERSISTENT_UPLOADS_DIR" || \
        echo "❌ Failed to create symlink from $UPLOADS_DIR to $PERSISTENT_UPLOADS_DIR"
    fi
    
    # Also link to standard server uploads location
    if [ -d "/app/server" ]; then
      echo "Linking /app/server/uploads to persistent storage"
      rm -rf "/app/server/uploads" 2>/dev/null
      ln -sf "$PERSISTENT_UPLOADS_DIR" "/app/server/uploads" 2>/dev/null && \
        echo "✅ Created symlink from /app/server/uploads to $PERSISTENT_UPLOADS_DIR" || \
        echo "❌ Failed to create symlink from /app/server/uploads to $PERSISTENT_UPLOADS_DIR"
    fi
  else
    echo "❌ Failed to create directory in persistent storage at $PERSISTENT_UPLOADS_DIR"
  fi
else
  echo "⚠️ No persistent disk detected or not writable"
fi

# Check app directory permissions
if [ -d "/app" ]; then
  if [ -w "/app" ]; then
    echo "✅ /app directory is writable"
  else
    echo "❌ /app directory is not writable"
    # Try to fix permissions
    echo "Attempting to fix /app permissions"
    chmod -R 755 /app 2>/dev/null || echo "❌ Failed to fix /app permissions"
  fi
  
  # Check server directory
  if [ -d "/app/server" ]; then
    echo "✅ /app/server directory exists"
    ls -la /app/server
    
    # Check if index.js exists
    if [ -f "/app/server/index.js" ]; then
      echo "✅ /app/server/index.js exists"
    else
      echo "❌ /app/server/index.js does not exist"
      # Try to find it elsewhere
      find /app -name "index.js" | grep -v "node_modules" || echo "❌ Could not find index.js anywhere in /app"
    fi
  else
    echo "❌ /app/server directory does not exist"
    mkdir -p /app/server 2>/dev/null && echo "✅ Created /app/server directory" || echo "❌ Failed to create /app/server directory"
  fi
else
  echo "❌ /app directory does not exist"
fi

# Create a minimal index.html file if we have a writable client build directory
if [ -n "$CLIENT_BUILD_DIR" ] && [ -w "$CLIENT_BUILD_DIR" ]; then
  echo "Creating minimal index.html file in $CLIENT_BUILD_DIR"
  cat > "$CLIENT_BUILD_DIR/index.html" << EOF
<!DOCTYPE html>
<html>
<head>
  <title>Minimal Setup Test</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
    .message { margin: 30px 0; }
  </style>
</head>
<body>
  <h1>Minimal Setup Test</h1>
  <div class="message">
    <p>The minimal setup script has run successfully.</p>
    <p>This page was created by render-setup-minimal.sh</p>
  </div>
</body>
</html>
EOF
  echo "✅ Created minimal index.html file"
else
  echo "❌ Cannot create index.html file - no writable client build directory"
fi

# Copy client build files if they exist
if [ -d "/app/client/build" ] && [ -n "$CLIENT_BUILD_DIR" ] && [ "/app/client/build" != "$CLIENT_BUILD_DIR" ]; then
  echo "Copying client build files from /app/client/build to $CLIENT_BUILD_DIR"
  cp -r /app/client/build/* "$CLIENT_BUILD_DIR/" 2>/dev/null && \
    echo "✅ Copied client build files" || \
    echo "❌ Failed to copy client build files"
fi

# Export environment variables to help the application find files
echo "Exporting environment variables for file paths"
export UPLOADS_DIR="$UPLOADS_DIR"
export CLIENT_BUILD_DIR="$CLIENT_BUILD_DIR"
if [ -d "/var/data" ] && [ -w "/var/data" ]; then
  export PERSISTENT_UPLOADS_DIR="$PERSISTENT_UPLOADS_DIR"
fi

# Create a .env file with these paths
echo "Creating .env file with paths"
cat > /app/.env.paths << EOF
UPLOADS_DIR=$UPLOADS_DIR
CLIENT_BUILD_DIR=$CLIENT_BUILD_DIR
EOF
if [ -d "/var/data" ] && [ -w "/var/data" ]; then
  echo "PERSISTENT_UPLOADS_DIR=$PERSISTENT_UPLOADS_DIR" >> /app/.env.paths
fi

# Check if server/index.js exists, if not try to copy it
if [ ! -f "/app/server/index.js" ]; then
  echo "❌ /app/server/index.js does not exist, trying to fix"
  
  # Try to find index.js elsewhere
  INDEX_PATH=$(find /app -name "index.js" -not -path "*/node_modules/*" -not -path "*/client/*" | head -n 1)
  
  if [ -n "$INDEX_PATH" ]; then
    echo "Found index.js at $INDEX_PATH"
    mkdir -p /app/server 2>/dev/null
    cp "$INDEX_PATH" /app/server/index.js 2>/dev/null && \
      echo "✅ Copied index.js to /app/server/index.js" || \
      echo "❌ Failed to copy index.js to /app/server/index.js"
  else
    echo "❌ Could not find index.js anywhere in /app"
  fi
fi

echo "=== Minimal setup complete ==="
echo "Directories created/used:"
if [ -n "$UPLOADS_DIR" ]; then
  echo "- Uploads: $UPLOADS_DIR"
fi
if [ -n "$CLIENT_BUILD_DIR" ]; then
  echo "- Client build: $CLIENT_BUILD_DIR"
fi
if [ -d "/var/data" ] && [ -w "/var/data" ]; then
  echo "- Persistent storage: $PERSISTENT_UPLOADS_DIR"
fi

# Final directory listing
echo "Final directory listing of /app:"
ls -la /app
echo "Final directory listing of /app/server (if it exists):"
ls -la /app/server 2>/dev/null || echo "❌ /app/server does not exist"

exit 0
