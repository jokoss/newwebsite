const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const testRoutes = require('./routes/test.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const certificationRoutes = require('./routes/certification.routes');
const partnerRoutes = require('./routes/partner.routes');
const blogRoutes = require('./routes/blog.routes');

// Initialize Express app
const app = express();

// Configure CORS
const corsOptions = {
  origin: '*', // In production, you might want to restrict this
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - Note the path prefix for Netlify Functions
app.use('/.netlify/functions/server/api/auth', authRoutes);
app.use('/.netlify/functions/server/api/categories', categoryRoutes);
app.use('/.netlify/functions/server/api/tests', testRoutes);
app.use('/.netlify/functions/server/api/users', userRoutes);
app.use('/.netlify/functions/server/api/certifications', certificationRoutes);
app.use('/.netlify/functions/server/api/partners', partnerRoutes);
app.use('/.netlify/functions/server/api/blog', blogRoutes);
app.use('/.netlify/functions/server/api/admin', adminRoutes);

// Also support the original paths for local development
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/users', userRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);

// API root route
app.get('/.netlify/functions/server/api', (req, res) => {
  res.json({ message: 'Welcome to Analytical Testing Laboratory API' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Analytical Testing Laboratory API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    // Disable alter sync to avoid database issues
    return sequelize.sync({ force: false, alter: false });
  })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Export the serverless handler
exports.handler = serverless(app);
