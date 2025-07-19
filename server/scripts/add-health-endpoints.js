/**
 * Script to add health endpoints to the server
 * This script ensures that the server has proper health check endpoints
 * for Render Web Service deployment
 */

const fs = require('fs');
const path = require('path');

// Path to server index.js
const serverIndexPath = path.join(__dirname, '..', 'index.js');

console.log('Adding health endpoints to server...');

// Read the current server index.js file
let serverIndexContent = fs.readFileSync(serverIndexPath, 'utf8');

// Check if health endpoints already exist
if (serverIndexContent.includes('/api/health') && serverIndexContent.includes('/api/diagnostics')) {
  console.log('Health endpoints already exist in server/index.js');
} else {
  console.log('Adding health endpoints to server/index.js');

  // Define the health endpoints to add
  const healthEndpoints = `
// Health check endpoint for Docker and client-side connectivity checks
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: sequelize.authenticate()
      .then(() => 'connected')
      .catch(() => 'disconnected')
      .finally(() => 'checked')
  });
});

// Enhanced health check with detailed diagnostics
app.get('/api/diagnostics', (req, res) => {
  const diagnostics = {
    server: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
    },
    database: {
      status: 'checking...'
    },
    filesystem: {
      cwd: process.cwd(),
      uploadsDirectory: require('fs').existsSync('./uploads') ? 'exists' : 'missing'
    },
    request: {
      headers: req.headers,
      ip: req.ip,
      originalUrl: req.originalUrl
    }
  };
  
  // Check database connection
  sequelize.authenticate()
    .then(() => {
      diagnostics.database.status = 'connected';
      res.status(200).json(diagnostics);
    })
    .catch((err) => {
      diagnostics.database.status = 'disconnected';
      diagnostics.database.error = err.message;
      res.status(200).json(diagnostics);
    });
});
`;

  // Find the position to insert the health endpoints
  // We'll add them after the API root route
  const apiRootRoutePosition = serverIndexContent.indexOf("app.get('/api', (req, res) => {");
  
  if (apiRootRoutePosition !== -1) {
    // Find the end of the API root route block
    const endOfApiRootRoute = serverIndexContent.indexOf('});', apiRootRoutePosition) + 3;
    
    // Insert the health endpoints after the API root route
    serverIndexContent = 
      serverIndexContent.substring(0, endOfApiRootRoute) + 
      '\n' + healthEndpoints + 
      serverIndexContent.substring(endOfApiRootRoute);
    
    // Write the updated content back to the file
    fs.writeFileSync(serverIndexPath, serverIndexContent);
    console.log('Health endpoints added successfully');
  } else {
    console.log('Could not find API root route in server/index.js');
    console.log('Health endpoints not added');
  }
}

console.log('Health endpoints script completed');
