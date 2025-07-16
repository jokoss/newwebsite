const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Enhanced middleware to verify user's JWT token with additional security checks
 */
exports.authenticateToken = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    // Check if Authorization header exists and has the correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Invalid authorization format.' 
      });
    }
    
    const token = authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token with more detailed error handling
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Token expired. Please login again.' 
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token. Please login again.' 
        });
      } else {
        throw err; // Let the outer catch handle other errors
      }
    }
    
    // Check token age (optional additional security)
    const tokenIssuedAt = decoded.iat * 1000; // Convert to milliseconds
    const tokenAge = Date.now() - tokenIssuedAt;
    const maxTokenAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    
    if (tokenAge > maxTokenAge) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token too old. Please login again for security reasons.' 
      });
    }
    
    // Find user by id
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }
    
    if (!user.active) {
      return res.status(401).json({ 
        success: false, 
        message: 'User account is disabled. Please contact an administrator.' 
      });
    }
    
    // Verify token role matches user role (prevent role escalation if user role changed)
    if (decoded.role !== user.role) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token invalid due to role change. Please login again.' 
      });
    }
    
    // Add user and decoded token data to request object
    req.user = user;
    req.token = decoded;
    
    // Log access for audit purposes (optional)
    console.log(`User ${user.username} (${user.id}) accessed ${req.method} ${req.originalUrl} at ${new Date().toISOString()}`);
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed.', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

/**
 * Middleware to check if user is admin
 */
exports.isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  }
  
  return res.status(403).json({ 
    success: false, 
    message: 'Access denied. Admin role required.' 
  });
};

/**
 * Middleware to check if user is superadmin
 */
exports.isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    return next();
  }
  
  return res.status(403).json({ 
    success: false, 
    message: 'Access denied. Superadmin role required.' 
  });
};
