/**
 * Comprehensive Health Check Script for Analytical Testing Laboratory
 * 
 * This script performs a series of checks to diagnose issues with the application
 * when deployed to Render or other hosting environments.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('=== Starting Health Check ===');
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log(`Environment: ${NODE_ENV}`);
console.log(`Node Version: ${process.version}`);

// System Information
try {
  console.log('\n=== System Information ===');
  console.log('Current Directory:', process.cwd());
  console.log('Platform:', process.platform);
  console.log('Architecture:', process.arch);
  console.log('Memory Usage:', JSON.stringify(process.memoryUsage(), null, 2));
  
  // Get disk space information if possible
  if (process.platform === 'linux') {
    try {
      const diskSpace = execSync('df -h').toString();
      console.log('Disk Space:\n', diskSpace);
    } catch (err) {
      console.log('Could not get disk space information:', err.message);
    }
  }
} catch (err) {
  console.error('Error getting system information:', err);
}

// Environment Variables
try {
  console.log('\n=== Environment Variables ===');
  const safeEnvVars = Object.keys(process.env)
    .filter(key => !key.toLowerCase().includes('secret') && 
                   !key.toLowerCase().includes('password') && 
                   !key.toLowerCase().includes('token') &&
                   !key.toLowerCase().includes('key'))
    .reduce((obj, key) => {
      // For DATABASE_URL, only show if it exists, not the actual value
      if (key === 'DATABASE_URL') {
        obj[key] = process.env[key] ? '[REDACTED]' : 'not set';
      } else {
        obj[key] = process.env[key];
      }
      return obj;
    }, {});
  
  console.log(JSON.stringify(safeEnvVars, null, 2));
} catch (err) {
  console.error('Error getting environment variables:', err);
}

// File System Checks
try {
  console.log('\n=== File System Checks ===');
  
  // Check current directory contents
  console.log('Current Directory Contents:');
  const currentDirContents = fs.readdirSync('.');
  console.log(currentDirContents);
  
  // Check if server directory exists
  const serverDirExists = fs.existsSync('./server');
  console.log('Server Directory Exists:', serverDirExists);
  if (serverDirExists) {
    console.log('Server Directory Contents:', fs.readdirSync('./server'));
    
    // Check if server/index.js exists
    const serverIndexExists = fs.existsSync('./server/index.js');
    console.log('server/index.js Exists:', serverIndexExists);
    
    // Check if uploads directory exists
    const uploadsExists = fs.existsSync('./server/uploads');
    console.log('server/uploads Directory Exists:', uploadsExists);
  }
  
  // Check if client directory exists
  const clientDirExists = fs.existsSync('./client');
  console.log('Client Directory Exists:', clientDirExists);
  if (clientDirExists) {
    console.log('Client Directory Contents:', fs.readdirSync('./client'));
    
    // Check if client/build directory exists
    const clientBuildExists = fs.existsSync('./client/build');
    console.log('client/build Directory Exists:', clientBuildExists);
    if (clientBuildExists) {
      console.log('client/build Directory Contents:', fs.readdirSync('./client/build'));
    }
  }
  
  // Check for package.json
  const packageJsonExists = fs.existsSync('./package.json');
  console.log('package.json Exists:', packageJsonExists);
  if (packageJsonExists) {
    const packageJson = require('./package.json');
    console.log('Package Name:', packageJson.name);
    console.log('Package Version:', packageJson.version);
    console.log('Main Script:', packageJson.main);
  }
  
  // Check for node_modules
  const nodeModulesExists = fs.existsSync('./node_modules');
  console.log('node_modules Directory Exists:', nodeModulesExists);
  
  // Check for .env file
  const envFileExists = fs.existsSync('./.env');
  console.log('.env File Exists:', envFileExists);
  
  // Check for .env.production file
  const envProdFileExists = fs.existsSync('./.env.production');
  console.log('.env.production File Exists:', envProdFileExists);
  
  // Check for Dockerfile
  const dockerfileExists = fs.existsSync('./Dockerfile');
  console.log('Dockerfile Exists:', dockerfileExists);
  
} catch (err) {
  console.error('Error checking file system:', err);
}

// Database Connection Check
try {
  console.log('\n=== Database Connection Check ===');
  if (DATABASE_URL) {
    console.log('DATABASE_URL is set');
    
    // Try to load sequelize if available
    try {
      const { Sequelize } = require('sequelize');
      const sequelize = new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      });
      
      console.log('Attempting to connect to database...');
      sequelize.authenticate()
        .then(() => {
          console.log('Database connection successful');
        })
        .catch(err => {
          console.error('Database connection failed:', err.message);
        });
    } catch (err) {
      console.error('Could not load Sequelize:', err.message);
    }
  } else {
    console.log('DATABASE_URL is not set');
  }
} catch (err) {
  console.error('Error checking database connection:', err);
}

// Network Connectivity Check
try {
  console.log('\n=== Network Connectivity Check ===');
  
  // Start a simple HTTP server
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Healthcheck OK');
  });
  
  server.listen(PORT, () => {
    console.log(`Healthcheck server started on port ${PORT}`);
    
    // Make a request to our own server to verify it's working
    http.get(`http://localhost:${PORT}`, (res) => {
      console.log('Healthcheck response status:', res.statusCode);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Healthcheck response data:', data);
        
        // Try to make an external request to check internet connectivity
        console.log('Checking external connectivity...');
        http.get('http://www.google.com', (externalRes) => {
          console.log('External connectivity status:', externalRes.statusCode);
          server.close(() => {
            console.log('Healthcheck server closed');
            console.log('\n=== Health Check Complete ===');
          });
        }).on('error', (err) => {
          console.error('External connectivity error:', err.message);
          server.close(() => {
            console.log('Healthcheck server closed');
            console.log('\n=== Health Check Complete ===');
          });
        });
      });
    }).on('error', (err) => {
      console.error('Healthcheck request error:', err.message);
      server.close(() => {
        console.log('Healthcheck server closed');
        console.log('\n=== Health Check Complete ===');
      });
    });
  });
} catch (err) {
  console.error('Error checking network connectivity:', err);
  console.log('\n=== Health Check Complete ===');
}
