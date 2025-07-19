const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Simple in-memory rate limiting
// In production, use Redis or a similar solution for distributed rate limiting
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * User login with rate limiting and enhanced security
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const clientId = `${username}-${ip}`;

    // Check for rate limiting
    const currentAttempts = loginAttempts.get(clientId) || { count: 0, timestamp: Date.now() };
    
    // Reset attempts if lockout period has passed
    if (currentAttempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timeSinceLockout = Date.now() - currentAttempts.timestamp;
      if (timeSinceLockout < LOCKOUT_TIME) {
        const minutesLeft = Math.ceil((LOCKOUT_TIME - timeSinceLockout) / 60000);
        return res.status(429).json({
          success: false,
          message: `Too many failed login attempts. Please try again in ${minutesLeft} minutes.`
        });
      } else {
        // Reset attempts after lockout period
        currentAttempts.count = 0;
      }
    }

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Find user by username
    const user = await User.findOne({ where: { username } });
    
    // Check if user exists
    if (!user) {
      // Increment failed attempts
      incrementFailedAttempts(clientId, currentAttempts);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'User account is disabled'
      });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Increment failed attempts
      incrementFailedAttempts(clientId, currentAttempts);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Login successful - reset failed attempts
    loginAttempts.delete(clientId);

    // Generate JWT token with shorter expiration
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        // Add timestamp to help with token rotation
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '4h' // Default to 4 hours if not set
      }
    );

    // Return user data and token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to increment failed login attempts
function incrementFailedAttempts(clientId, currentAttempts) {
  currentAttempts.count += 1;
  currentAttempts.timestamp = Date.now();
  loginAttempts.set(clientId, currentAttempts);
  
  // Log suspicious activity if there are multiple failed attempts
  if (currentAttempts.count >= 3) {
    console.warn(`Security alert: Multiple failed login attempts for client ${clientId}`);
  }
}

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = req.user;

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Change password with enhanced security
 * @route PUT /api/auth/change-password
 * @access Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }

    // Get user from request (attached by auth middleware)
    const user = await User.findByPk(req.user.id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Prevent reuse of current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Invalidate all existing tokens (optional, would require token tracking)
    // This would force logout on all devices
    
    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Logout user (invalidate token)
 * @route POST /api/auth/logout
 * @access Private
 */
exports.logout = async (req, res) => {
  try {
    // In a stateless JWT system, we can't invalidate tokens server-side
    // A proper solution would involve token blacklisting with Redis
    // For now, we'll just return success and let the client remove the token
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
