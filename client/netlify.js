// This file is used to help debug Netlify deployments
console.log('Netlify deployment debugging');

const fs = require('fs');
const path = require('path');

// Check if build directory exists
if (fs.existsSync(path.join(__dirname, 'build'))) {
  console.log('Build directory exists');
  
  // List files in build directory
  const buildFiles = fs.readdirSync(path.join(__dirname, 'build'));
  console.log('Files in build directory:', buildFiles);
  
  // Check for index.html
  if (fs.existsSync(path.join(__dirname, 'build', 'index.html'))) {
    console.log('index.html exists in build directory');
  } else {
    console.log('index.html does not exist in build directory');
  }
  
  // Check for 404.html
  if (fs.existsSync(path.join(__dirname, 'build', '404.html'))) {
    console.log('404.html exists in build directory');
  } else {
    console.log('404.html does not exist in build directory');
  }
  
  // Check for 200.html
  if (fs.existsSync(path.join(__dirname, 'build', '200.html'))) {
    console.log('200.html exists in build directory');
  } else {
    console.log('200.html does not exist in build directory');
  }
  
  // Check for _redirects
  if (fs.existsSync(path.join(__dirname, 'build', '_redirects'))) {
    console.log('_redirects exists in build directory');
    const redirectsContent = fs.readFileSync(path.join(__dirname, 'build', '_redirects'), 'utf8');
    console.log('_redirects content:', redirectsContent);
  } else {
    console.log('_redirects does not exist in build directory');
  }
} else {
  console.log('Build directory does not exist');
}

// Create a simple test file in the build directory if it exists
if (fs.existsSync(path.join(__dirname, 'build'))) {
  fs.writeFileSync(path.join(__dirname, 'build', 'netlify-test.txt'), 'This is a test file created by netlify.js');
  console.log('Created netlify-test.txt in build directory');
}

console.log('Netlify deployment debugging complete');
