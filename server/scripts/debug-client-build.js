const fs = require('fs');
const path = require('path');

console.log('=== DEBUG: Client Build Path Check ===');

// Check if client/build directory exists (relative to project root)
const clientBuildPath = path.resolve(__dirname, '../../client/build');
console.log(`Checking if client build directory exists (project root): ${clientBuildPath}`);
console.log(`Directory exists: ${fs.existsSync(clientBuildPath)}`);

// Check if index.html exists (relative to project root)
const indexHtmlPath = path.resolve(clientBuildPath, 'index.html');
console.log(`Checking if index.html exists (project root): ${indexHtmlPath}`);
console.log(`File exists: ${fs.existsSync(indexHtmlPath)}`);

// Check if client/build directory exists (relative to server directory)
const serverClientBuildPath = path.resolve(__dirname, '../client/build');
console.log(`\nChecking if client build directory exists (server directory): ${serverClientBuildPath}`);
console.log(`Directory exists: ${fs.existsSync(serverClientBuildPath)}`);

// Check if index.html exists (relative to server directory)
const serverIndexHtmlPath = path.resolve(serverClientBuildPath, 'index.html');
console.log(`Checking if index.html exists (server directory): ${serverIndexHtmlPath}`);
console.log(`File exists: ${fs.existsSync(serverIndexHtmlPath)}`);

// List files in client/build directory if it exists
if (fs.existsSync(clientBuildPath)) {
  console.log('Files in client/build directory:');
  const files = fs.readdirSync(clientBuildPath);
  files.forEach(file => {
    console.log(`- ${file}`);
  });
} else {
  console.log('client/build directory does not exist');
}

// Check parent directories
const clientPath = path.resolve(__dirname, '../../client');
console.log(`\nChecking if client directory exists: ${clientPath}`);
console.log(`Directory exists: ${fs.existsSync(clientPath)}`);

if (fs.existsSync(clientPath)) {
  console.log('Files in client directory:');
  const files = fs.readdirSync(clientPath);
  files.forEach(file => {
    console.log(`- ${file}`);
  });
}

// Check current working directory
console.log(`\nCurrent working directory: ${process.cwd()}`);
console.log('Files in current working directory:');
const cwdFiles = fs.readdirSync(process.cwd());
cwdFiles.forEach(file => {
  console.log(`- ${file}`);
});

console.log('=== END DEBUG ===');
