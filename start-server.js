#!/usr/bin/env node

/**
 * Bulletproof Server Startup Script for Render Deployment
 * 
 * This script handles path resolution issues where Render might look for files
 * in /opt/render/project/src/ instead of /opt/render/project/
 * 
 * It will find and start the server regardless of the working directory.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Starting Bulletproof Server Startup...');
console.log('📍 Current working directory:', process.cwd());
console.log('📍 __dirname:', __dirname);

// Possible server file locations to check
const possiblePaths = [
  // Standard paths
  path.join(process.cwd(), 'server', 'index.js'),
  path.join(__dirname, 'server', 'index.js'),
  
  // If we're in a src directory, go up one level
  path.join(process.cwd(), '..', 'server', 'index.js'),
  path.join(__dirname, '..', 'server', 'index.js'),
  
  // Alternative paths
  path.join(process.cwd(), 'server.js'),
  path.join(__dirname, 'server.js'),
  
  // Absolute fallback paths for Render
  '/opt/render/project/server/index.js',
  '/opt/render/project/src/server/index.js'
];

console.log('🔍 Searching for server file in the following locations:');
possiblePaths.forEach((p, i) => console.log(`   ${i + 1}. ${p}`));

let serverPath = null;

// Find the server file
for (const possiblePath of possiblePaths) {
  if (fs.existsSync(possiblePath)) {
    serverPath = possiblePath;
    console.log(`✅ Found server file at: ${serverPath}`);
    break;
  }
}

if (!serverPath) {
  console.error('❌ ERROR: Could not find server/index.js in any expected location!');
  console.error('📁 Directory contents of current working directory:');
  try {
    const files = fs.readdirSync(process.cwd());
    files.forEach(file => console.error(`   - ${file}`));
  } catch (err) {
    console.error('   Could not read directory:', err.message);
  }
  process.exit(1);
}

// Start the server
console.log(`🎯 Starting server with: node ${serverPath}`);
console.log('=' .repeat(50));

const serverProcess = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: process.env
});

serverProcess.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`🔄 Server process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully...');
  serverProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully...');
  serverProcess.kill('SIGINT');
});
