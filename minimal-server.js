// minimal-server.js
// A minimal Express server for testing deployment on Render

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Log environment information on startup
console.log('=== MINIMAL SERVER STARTUP ===');
console.log('Current directory:', process.cwd());
console.log('Directory contents:', fs.readdirSync('.').join(', '));
console.log('Environment variables:', Object.keys(process.env).filter(key => 
  !key.includes('SECRET') && !key.includes('PASSWORD') && !key.includes('KEY')
).join(', '));
console.log('=== END STARTUP INFO ===');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage()
  });
});

// API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Minimal API is working!',
    timestamp: new Date().toISOString()
  });
});

// Directory structure endpoint
app.get('/api/structure', (req, res) => {
  const structure = {
    root: fs.existsSync('/app') ? fs.readdirSync('/app') : 'Not accessible',
    server: fs.existsSync('/app/server') ? fs.readdirSync('/app/server') : 'Not accessible',
    client: fs.existsSync('/app/client') ? fs.readdirSync('/app/client') : 'Not accessible',
    clientBuild: fs.existsSync('/app/client/build') ? fs.readdirSync('/app/client/build') : 'Not accessible',
    uploads: fs.existsSync('/app/uploads') ? fs.readdirSync('/app/uploads') : 'Not accessible',
    current: fs.readdirSync('.')
  };
  
  res.json(structure);
});

// Environment variables endpoint (filtered for security)
app.get('/api/env', (req, res) => {
  const filteredEnv = {};
  Object.keys(process.env).forEach(key => {
    if (!key.includes('SECRET') && !key.includes('PASSWORD') && !key.includes('KEY')) {
      filteredEnv[key] = process.env[key];
    } else {
      filteredEnv[key] = '[FILTERED]';
    }
  });
  
  res.json(filteredEnv);
});

// Serve a minimal HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Minimal Server</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .message { margin: 30px 0; }
        .endpoints { text-align: left; max-width: 500px; margin: 0 auto; }
        .endpoint { margin-bottom: 10px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>Minimal Server</h1>
      <div class="message">
        <p>The minimal server is running successfully!</p>
        <p>Server started at: ${new Date().toISOString()}</p>
        <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
      </div>
      <div class="endpoints">
        <h2>Available Endpoints:</h2>
        <div class="endpoint">
          <code>/api/health</code> - Health check information
        </div>
        <div class="endpoint">
          <code>/api</code> - Basic API response
        </div>
        <div class="endpoint">
          <code>/api/structure</code> - Directory structure information
        </div>
        <div class="endpoint">
          <code>/api/env</code> - Environment variables (filtered)
        </div>
      </div>
      <div class="system-info">
        <h2>System Information:</h2>
        <pre>
Memory Usage: ${JSON.stringify(process.memoryUsage(), null, 2)}
Uptime: ${process.uptime()} seconds
Platform: ${process.platform}
Node Version: ${process.version}
        </pre>
      </div>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Minimal server is running on port ${PORT}`);
});
