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

# Create uploads directory in the current directory
UPLOADS_DIR="./uploads"
echo "Creating uploads directory at $UPLOADS_DIR"
mkdir -p "$UPLOADS_DIR" 2>/dev/null
if [ -d "$UPLOADS_DIR" ]; then
  echo "✅ Created uploads directory at $UPLOADS_DIR"
  chmod 777 "$UPLOADS_DIR" 2>/dev/null || echo "⚠️ Could not set permissions on $UPLOADS_DIR"
else
  echo "❌ Failed to create uploads directory at $UPLOADS_DIR"
fi

# Create client-build directory in the current directory
CLIENT_BUILD_DIR="./client-build"
echo "Creating client build directory at $CLIENT_BUILD_DIR"
mkdir -p "$CLIENT_BUILD_DIR" 2>/dev/null
if [ -d "$CLIENT_BUILD_DIR" ]; then
  echo "✅ Created client build directory at $CLIENT_BUILD_DIR"
else
  echo "❌ Failed to create client build directory at $CLIENT_BUILD_DIR"
fi

# Check for persistent storage
if [ -d "/var/data" ] && [ -w "/var/data" ]; then
  echo "Persistent disk detected at /var/data"
  PERSISTENT_UPLOADS_DIR="/var/data/uploads"
  
  echo "Creating directory in persistent storage at $PERSISTENT_UPLOADS_DIR"
  mkdir -p "$PERSISTENT_UPLOADS_DIR" 2>/dev/null
  if [ -d "$PERSISTENT_UPLOADS_DIR" ]; then
    echo "✅ Created directory in persistent storage at $PERSISTENT_UPLOADS_DIR"
    chmod 777 "$PERSISTENT_UPLOADS_DIR" 2>/dev/null || echo "⚠️ Could not set permissions on $PERSISTENT_UPLOADS_DIR"
  else
    echo "❌ Failed to create directory in persistent storage at $PERSISTENT_UPLOADS_DIR"
  fi
else
  echo "⚠️ No persistent disk detected or not writable"
fi

# Check if we can create a directory in /app
if [ -d "/app" ] && [ -w "/app" ]; then
  echo "Detected writable /app directory"
  APP_UPLOADS_DIR="/app/uploads"
  
  echo "Creating directory in /app at $APP_UPLOADS_DIR"
  mkdir -p "$APP_UPLOADS_DIR" 2>/dev/null
  if [ -d "$APP_UPLOADS_DIR" ]; then
    echo "✅ Created directory in /app at $APP_UPLOADS_DIR"
    chmod 777 "$APP_UPLOADS_DIR" 2>/dev/null || echo "⚠️ Could not set permissions on $APP_UPLOADS_DIR"
  else
    echo "❌ Failed to create directory in /app at $APP_UPLOADS_DIR"
  fi
else
  echo "⚠️ No writable /app directory detected"
fi

# Create a minimal index.html file
echo "Creating minimal index.html file"
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

echo "=== Minimal setup complete ==="
echo "Directories created:"
echo "- $UPLOADS_DIR"
echo "- $CLIENT_BUILD_DIR"
if [ -d "/var/data" ] && [ -w "/var/data" ]; then
  echo "- $PERSISTENT_UPLOADS_DIR"
fi
if [ -d "/app" ] && [ -w "/app" ]; then
  echo "- $APP_UPLOADS_DIR"
fi

exit 0
