const fs = require('fs');
const path = require('path');

console.log('🔍 Railway Build Verification Script');
console.log('=====================================');

// Check if we're in the right directory
console.log('📁 Current working directory:', process.cwd());

// Check if client directory exists
const clientDir = path.join(process.cwd(), 'client');
console.log('📂 Client directory exists:', fs.existsSync(clientDir));

// Check if client/build directory exists
const buildDir = path.join(clientDir, 'build');
console.log('🏗️  Build directory exists:', fs.existsSync(buildDir));

if (fs.existsSync(buildDir)) {
  // List contents of build directory
  try {
    const buildContents = fs.readdirSync(buildDir);
    console.log('📋 Build directory contents:', buildContents);
    
    // Check for index.html specifically
    const indexPath = path.join(buildDir, 'index.html');
    console.log('📄 index.html exists:', fs.existsSync(indexPath));
    
    if (fs.existsSync(indexPath)) {
      const stats = fs.statSync(indexPath);
      console.log('📊 index.html size:', stats.size, 'bytes');
      console.log('📅 index.html modified:', stats.mtime);
    }
  } catch (error) {
    console.error('❌ Error reading build directory:', error.message);
  }
} else {
  console.log('⚠️  Build directory does not exist - React app was not built');
}

// Check package.json scripts
try {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log('📦 Root package.json build script:', packageJson.scripts?.build);
  }
  
  const clientPackagePath = path.join(clientDir, 'package.json');
  if (fs.existsSync(clientPackagePath)) {
    const clientPackageJson = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));
    console.log('📦 Client package.json build script:', clientPackageJson.scripts?.build);
  }
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

console.log('=====================================');
console.log('✅ Build verification complete');
