require('dotenv').config();
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

// Ensure uploads directory exists
require('./scripts/ensure-uploads-directory');

// Debug client build path
require('./scripts/debug-client-build');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://your-app-name.onrender.com'
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.static(process.env.NODE_ENV === 'production' 
  ? './client/build' 
  : '../client/build')); // Serve static files from the React app

// Routes
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
  res.json({ message: 'Welcome to Analytical Testing Laboratory API' });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const path = require('path');
  const clientBuildPath = process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, './client/build/index.html')
    : path.resolve(__dirname, '../client/build/index.html');
  
  res.sendFile(clientBuildPath);
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

// Start server
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    // Disable alter sync to avoid database issues
    return sequelize.sync({ force: false, alter: false });
  })
  .then(() => {
    console.log('Database synchronized successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
