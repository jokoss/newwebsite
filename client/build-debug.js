const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting build debug script...');
console.log('Current directory:', process.cwd());

// Check if node_modules exists
const nodeModulesExists = fs.existsSync(path.join(process.cwd(), 'node_modules'));
console.log('node_modules exists:', nodeModulesExists);

// Check package.json
try {
  const packageJson = require('./package.json');
  console.log('package.json found');
  console.log('Dependencies:', Object.keys(packageJson.dependencies).length);
  console.log('Scripts:', Object.keys(packageJson.scripts));
} catch (error) {
  console.error('Error reading package.json:', error.message);
}

// Try running the build
try {
  console.log('Running npm build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully');
  
  // Check if build directory exists
  const buildExists = fs.existsSync(path.join(process.cwd(), 'build'));
  console.log('build directory exists:', buildExists);
  
  if (buildExists) {
    // List files in build directory
    const buildFiles = fs.readdirSync(path.join(process.cwd(), 'build'));
    console.log('Files in build directory:', buildFiles);
    
    // Check for index.html
    const indexHtmlExists = fs.existsSync(path.join(process.cwd(), 'build', 'index.html'));
    console.log('index.html exists in build directory:', indexHtmlExists);
  }
} catch (error) {
  console.error('Error during build:', error.message);
}
