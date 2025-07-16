const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('../../server/routes/auth.routes');
const categoryRoutes = require('../../server/routes/category.routes');
const testRoutes = require('../../server/routes/test.routes');
const userRoutes = require('../../server/routes/user.routes');
const adminRoutes = require('../../server/routes/admin.routes');
const certificationRoutes = require('../../server/routes/certification.routes');
const partnerRoutes = require('../../server/routes/partner.routes');
const blogRoutes = require('../../server/routes/blog.routes');

// Initialize Express app
const app = express();

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow all origins in production for now
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/users', userRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);

// API root route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to Analytical Testing Laboratory API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path
  });
});

// Initialize database connection when the function starts
let dbInitialized = false;

const initializeDatabase = async () => {
  if (dbInitialized) return;
  
  try {
    const { sequelize } = require('../../server/models');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (don't alter in production)
    await sequelize.sync({ force: false, alter: false });
    console.log('Database synchronized successfully.');
    
    dbInitialized = true;
  } catch (error) {
    console.error('Database initialization error:', error);
    // Don't throw error to prevent function from failing
  }
};

// Wrap the handler to initialize database
const handler = async (event, context) => {
  // Initialize database on cold start
  await initializeDatabase();
  
  // Use serverless-http to handle the request
  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};

exports.handler = handler;
