#!/bin/sh
# Render pre-start setup script
# This script runs before the application starts on Render

# Debug information at the very beginning
echo "=== RENDER SETUP SCRIPT DEBUG INFO ==="
echo "Script path: $0"
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"
echo "Directory listing:"
ls -la
echo "Environment variables:"
env | grep -v PASSWORD | grep -v SECRET | grep -v KEY
echo "=== END DEBUG INFO ==="

# Exit on error, but allow for proper error handling
set -e

echo "=== Starting Render Setup Script ==="

# Function to log messages with timestamps
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to log errors
error() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

# Function to check if a directory exists and is writable
check_dir() {
  if [ -d "$1" ]; then
    if [ -w "$1" ]; then
      log "✅ Directory $1 exists and is writable"
      return 0
    else
      log "⚠️ Directory $1 exists but is not writable"
      return 1
    fi
  else
    log "⚠️ Directory $1 does not exist"
    return 1
  fi
}

# Function to create directory with error handling
create_dir() {
  log "Creating directory: $1"
  mkdir -p "$1" 2>/dev/null || {
    error "Failed to create directory $1"
    return 1
  }
  log "✅ Created directory $1"
  return 0
}

# Detect environment and set paths accordingly
CURRENT_DIR=$(pwd)
log "Current directory: $CURRENT_DIR"

# Try to determine if we're running in Render
if [ -n "$RENDER" ] || [ -d "/var/render" ]; then
  log "Detected Render environment"
  IS_RENDER=true
else
  log "Not running in Render environment"
  IS_RENDER=false
fi

# Set up paths with fallbacks
if [ "$IS_RENDER" = true ]; then
  # Primary paths for Render
  CLIENT_BUILD_DIR="/app/client-build"
  UPLOADS_DIR="/app/uploads"
  
  # Fallback paths if primary paths fail
  FALLBACK_CLIENT_BUILD_DIR="$CURRENT_DIR/client-build"
  FALLBACK_UPLOADS_DIR="$CURRENT_DIR/uploads"
else
  # Local development paths
  CLIENT_BUILD_DIR="$CURRENT_DIR/client-build"
  UPLOADS_DIR="$CURRENT_DIR/uploads"
  
  # No fallbacks needed for local development
  FALLBACK_CLIENT_BUILD_DIR=""
  FALLBACK_UPLOADS_DIR=""
fi

# Create client build directory
if ! create_dir "$CLIENT_BUILD_DIR"; then
  if [ -n "$FALLBACK_CLIENT_BUILD_DIR" ]; then
    log "Trying fallback client build directory"
    CLIENT_BUILD_DIR="$FALLBACK_CLIENT_BUILD_DIR"
    create_dir "$CLIENT_BUILD_DIR" || {
      error "Failed to create client build directory even with fallback"
      exit 1
    }
  else
    error "Failed to create client build directory and no fallback available"
    exit 1
  fi
fi

# Find and copy client build files
if [ -d "./client/build" ]; then
  log "Found client/build in project root, copying to $CLIENT_BUILD_DIR"
  cp -r ./client/build/* "$CLIENT_BUILD_DIR/" 2>/dev/null || {
    error "Failed to copy from ./client/build to $CLIENT_BUILD_DIR"
    # Continue execution, as this might not be fatal
  }
elif [ -d "/app/client/build" ]; then
  log "Found client/build in /app, copying to $CLIENT_BUILD_DIR"
  cp -r /app/client/build/* "$CLIENT_BUILD_DIR/" 2>/dev/null || {
    error "Failed to copy from /app/client/build to $CLIENT_BUILD_DIR"
    # Continue execution, as this might not be fatal
  }
else
  log "WARNING: client/build directory not found. Attempting to build client..."
  # Try to build the client if it's not found
  if [ -d "./client" ]; then
    cd ./client
    npm install --no-audit --no-fund --silent || {
      error "Failed to install client dependencies"
      cd "$CURRENT_DIR"
      # Continue execution, as we might have fallbacks
    }
    npm run build --silent || {
      error "Failed to build client"
      cd "$CURRENT_DIR"
      # Continue execution, as we might have fallbacks
    }
    cd "$CURRENT_DIR"
    if [ -d "./client/build" ]; then
      log "Successfully built client, copying to $CLIENT_BUILD_DIR"
      cp -r ./client/build/* "$CLIENT_BUILD_DIR/" 2>/dev/null || {
        error "Failed to copy from ./client/build to $CLIENT_BUILD_DIR after building"
        # Continue execution, as this might not be fatal
      }
    else
      error "ERROR: Failed to build client"
      # Continue execution, as we might have fallbacks
    fi
  else
    error "ERROR: client directory not found"
    # Continue execution, as we might have fallbacks
  fi
fi

# Verify client build files
if [ -f "$CLIENT_BUILD_DIR/index.html" ]; then
  log "✅ Client build files successfully copied to $CLIENT_BUILD_DIR"
else
  log "❌ Client build files not found at $CLIENT_BUILD_DIR"
  log "Files in $CLIENT_BUILD_DIR:"
  ls -la "$CLIENT_BUILD_DIR" 2>/dev/null || log "Directory does not exist or is empty"
  
  # Try to create a minimal index.html as a last resort
  log "Creating minimal index.html as fallback"
  mkdir -p "$CLIENT_BUILD_DIR"
  cat > "$CLIENT_BUILD_DIR/index.html" << EOF
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
    <p>Please check the server logs for more information.</p>
  </div>
</body>
</html>
EOF
  log "✅ Created minimal index.html as fallback"
fi

# Check database connection
log "Checking database connection..."
if [ -z "$DATABASE_URL" ]; then
  log "❌ DATABASE_URL environment variable is not set"
  log "Using SQLite as fallback (not recommended for production)"
else
  log "✅ DATABASE_URL is set"
  # Extract database type from URL for better logging
  DB_TYPE=$(echo "$DATABASE_URL" | cut -d':' -f1)
  log "Database type: $DB_TYPE"
fi

# Set up uploads directory
log "Setting up uploads directory..."
if ! create_dir "$UPLOADS_DIR"; then
  if [ -n "$FALLBACK_UPLOADS_DIR" ]; then
    log "Trying fallback uploads directory"
    UPLOADS_DIR="$FALLBACK_UPLOADS_DIR"
    create_dir "$UPLOADS_DIR" || {
      error "Failed to create uploads directory even with fallback"
      exit 1
    }
  else
    error "Failed to create uploads directory and no fallback available"
    exit 1
  fi
fi

# Try to set permissions, but don't fail if it doesn't work
chmod 777 "$UPLOADS_DIR" 2>/dev/null || log "⚠️ Could not set permissions on $UPLOADS_DIR"
log "✅ Uploads directory created at $UPLOADS_DIR"

# Handle persistent storage if available
if [ -d "/var/data" ] && [ -w "/var/data" ]; then
  log "Persistent disk detected at /var/data"
  PERSISTENT_UPLOADS_DIR="/var/data/uploads"
  
  if create_dir "$PERSISTENT_UPLOADS_DIR"; then
    chmod 777 "$PERSISTENT_UPLOADS_DIR" 2>/dev/null || log "⚠️ Could not set permissions on $PERSISTENT_UPLOADS_DIR"
    
    # Try to create a symlink, but don't fail if it doesn't work
    if [ "$UPLOADS_DIR" != "$PERSISTENT_UPLOADS_DIR" ]; then
      log "Linking uploads directory to persistent storage"
      rm -rf "$UPLOADS_DIR" 2>/dev/null
      ln -s "$PERSISTENT_UPLOADS_DIR" "$UPLOADS_DIR" 2>/dev/null || {
        log "⚠️ Could not create symlink, copying directory structure instead"
        mkdir -p "$UPLOADS_DIR"
        cp -r "$PERSISTENT_UPLOADS_DIR"/* "$UPLOADS_DIR/" 2>/dev/null || log "⚠️ Could not copy from persistent storage"
      }
    fi
    log "✅ Using persistent storage for uploads at $PERSISTENT_UPLOADS_DIR"
  else
    log "⚠️ Could not create directory in persistent storage, using regular uploads directory"
  fi
else
  log "⚠️ No persistent disk detected or not writable. Uploads will not persist between deployments."
fi

# Create symbolic links or environment variables to help the application find the files
if [ "$IS_RENDER" = true ]; then
  # Export environment variables that the application can use
  export CLIENT_BUILD_PATH="$CLIENT_BUILD_DIR"
  export UPLOADS_PATH="$UPLOADS_DIR"
  
  # Create a .env file in the current directory with these paths
  log "Creating .env file with paths"
  cat > ./.env.paths << EOF
CLIENT_BUILD_PATH=$CLIENT_BUILD_DIR
UPLOADS_PATH=$UPLOADS_DIR
EOF
  
  # Try to create symlinks to standard locations if needed
  if [ "$CLIENT_BUILD_DIR" != "/app/client/build" ]; then
    mkdir -p /app/client 2>/dev/null
    ln -sf "$CLIENT_BUILD_DIR" /app/client/build 2>/dev/null || log "⚠️ Could not create symlink for client build"
  fi
  
  if [ "$UPLOADS_DIR" != "/app/server/uploads" ]; then
    mkdir -p /app/server 2>/dev/null
    ln -sf "$UPLOADS_DIR" /app/server/uploads 2>/dev/null || log "⚠️ Could not create symlink for uploads"
  fi
fi

# Final check
log "=== Setup Complete ==="
log "Client build directory: $CLIENT_BUILD_DIR ($(ls -la "$CLIENT_BUILD_DIR" 2>/dev/null | wc -l || echo "0") files)"
log "Uploads directory: $UPLOADS_DIR"

# Truncate DATABASE_URL for security (sh-compatible way)
if [ -n "$DATABASE_URL" ]; then
  DB_URL_START=$(echo "$DATABASE_URL" | cut -c1-10)
  log "Database URL: $DB_URL_START... (truncated for security)"
else
  log "Database URL: Not set"
fi

# Create a status file to indicate successful setup
touch "$CLIENT_BUILD_DIR/.setup-complete" 2>/dev/null || log "⚠️ Could not create setup status file"

exit 0
