const express = require('express');
const router = express.Router();

// Debug endpoint to check environment and database status
router.get('/env', (req, res) => {
  try {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET ✅' : 'NOT SET ❌',
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
      RAILWAY_PROJECT_ID: process.env.RAILWAY_PROJECT_ID,
      RAILWAY_SERVICE_ID: process.env.RAILWAY_SERVICE_ID,
      // Show all environment variables that contain DATABASE or RAILWAY or POSTGRES
      allRelevantVars: {}
    };

    // Add all relevant environment variables
    Object.keys(process.env).forEach(key => {
      if (key.includes('DATABASE') || key.includes('RAILWAY') || key.includes('POSTGRES') || key.includes('PG')) {
        envInfo.allRelevantVars[key] = key.toLowerCase().includes('password') || key.toLowerCase().includes('secret') 
          ? '[HIDDEN]' 
          : process.env[key];
      }
    });

    res.json({
      status: 'success',
      message: 'Environment debug info',
      data: envInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get environment info',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Database connection test endpoint
router.get('/database', async (req, res) => {
  try {
    const sequelize = require('../config/database');
    
    // Test database connection
    await sequelize.authenticate();
    
    const dialect = sequelize.getDialect();
    const dbInfo = {
      status: 'connected',
      dialect: dialect,
      isPostgreSQL: dialect === 'postgres',
      isSQLite: dialect === 'sqlite',
      message: dialect === 'postgres' ? 'Using PostgreSQL ✅' : 'Using SQLite (fallback) ⚠️'
    };

    // Try to check admin user
    try {
      const { User } = require('../models');
      const adminUser = await User.findOne({ where: { username: 'admin' } });
      
      dbInfo.adminUser = {
        exists: !!adminUser,
        username: adminUser ? adminUser.username : null,
        email: adminUser ? adminUser.email : null,
        role: adminUser ? adminUser.role : null,
        active: adminUser ? adminUser.active : null
      };
    } catch (userError) {
      dbInfo.adminUser = {
        error: userError.message
      };
    }

    res.json({
      status: 'success',
      message: 'Database connection test',
      data: dbInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// Test login endpoint with detailed error info
router.post('/test-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔍 Debug login attempt:', { username, passwordProvided: !!password });
    
    const { User } = require('../models');
    const bcrypt = require('bcryptjs');
    
    // Find user
    const user = await User.findOne({ where: { username } });
    console.log('🔍 User found:', !!user);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        debug: {
          username,
          userExists: false
        }
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('🔍 Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid password',
        debug: {
          username,
          userExists: true,
          passwordValid: false
        }
      });
    }
    
    res.json({
      status: 'success',
      message: 'Login would succeed',
      debug: {
        username,
        userExists: true,
        passwordValid: true,
        userRole: user.role,
        userActive: user.active
      }
    });
    
  } catch (error) {
    console.error('🚨 Debug login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login test failed',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
