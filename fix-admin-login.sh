#!/bin/bash
# Script to fix admin login issues on Render deployment

set -e

echo "=== FIXING ADMIN LOGIN FOR RENDER DEPLOYMENT ==="
echo "Current directory: $(pwd)"

# Ensure we're in the project root
if [ ! -d "client" ] || [ ! -d "server" ]; then
  echo "Error: This script must be run from the project root directory"
  exit 1
fi

# Create a backup of key files
echo "Creating backups of key files..."
mkdir -p backups/client/src/utils
mkdir -p backups/client/src/context
mkdir -p backups/server/controllers
mkdir -p backups/server/middleware

cp client/src/utils/api.js backups/client/src/utils/
cp client/src/context/AuthContext.js backups/client/src/context/
cp server/controllers/auth.controller.js backups/server/controllers/
cp server/middleware/auth.middleware.js backups/server/middleware/

echo "✓ Backups created"

# Update the API utility to better handle Render deployments
echo "Updating API utility for Render compatibility..."
cat > client/src/utils/api.js << 'EOL'
import axios from 'axios';

// Connection state tracking
let connectionState = {
  isOnline: navigator?.onLine ?? true,
  lastSuccessfulRequest: null,
  failedRequests: 0,
  maxFailedRequests: 5,
  inCircuitBreakerMode: false,
  circuitBreakerTimeout: 30000, // 30 seconds
};

// Listen for online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Browser reports online status');
    connectionState.isOnline = true;
    connectionState.failedRequests = 0;
    connectionState.inCircuitBreakerMode = false;
  });
  
  window.addEventListener('offline', () => {
    console.log('Browser reports offline status');
    connectionState.isOnline = false;
  });
}

// Determine the base URL based on environment with enhanced detection for Render
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // Try to use the window location as a fallback if we're in a browser
    if (typeof window !== 'undefined') {
      const { protocol, hostname } = window.location;
      
      // Check if we're on Render or another hosting platform
      if (hostname.includes('render.com') || hostname.includes('onrender.com')) {
        console.log(`Detected Render deployment: ${hostname}`);
        return `${protocol}//${hostname}/api`;
      }
      
      // Check for custom domain deployments
      const isCustomDomain = !hostname.includes('localhost') && 
                            !hostname.includes('127.0.0.1') &&
                            !hostname.includes('192.168.');
      
      if (isCustomDomain) {
        console.log(`Detected custom domain: ${hostname}`);
        return `${protocol}//${hostname}/api`;
      }
    }
    
    // Check for environment variable override
    if (process.env.REACT_APP_API_URL) {
      console.log(`Using API URL from environment: ${process.env.REACT_APP_API_URL}`);
      return process.env.REACT_APP_API_URL;
    }
    
    // Default production path
    return '/api';
  }
  
  // Development URL
  return 'http://localhost:5000/api';
};

// Create axios instance with base URL and enhanced configuration
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000, // Increased timeout for serverless functions
  headers: {
    'Content-Type': 'application/json',
  },
  // Retry configuration
  retry: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // exponential backoff
  }
});

// Log configuration in development
if (process.env.NODE_ENV !== 'production') {
  console.log('API configured with baseURL:', api.defaults.baseURL);
} else {
  console.log('Production API configured with baseURL:', api.defaults.baseURL);
}

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add timestamp to prevent caching issues
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors with enhanced error handling
api.interceptors.response.use(
  (response) => {
    // Reset circuit breaker on successful response
    connectionState.lastSuccessfulRequest = Date.now();
    connectionState.failedRequests = 0;
    connectionState.inCircuitBreakerMode = false;
    
    // Cache successful GET responses in localStorage for offline fallback
    if (response.config.method === 'get' && typeof window !== 'undefined') {
      try {
        const cacheKey = `api_cache_${response.config.url}`;
        const cacheData = {
          data: response.data,
          timestamp: Date.now(),
          expires: Date.now() + (15 * 60 * 1000) // 15 minutes
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (err) {
        console.warn('Failed to cache response:', err);
      }
    }
    
    return response;
  },
  (error) => {
    // Increment failed request counter
    connectionState.failedRequests++;
    
    // Check if we should enter circuit breaker mode
    if (connectionState.failedRequests >= connectionState.maxFailedRequests && !connectionState.inCircuitBreakerMode) {
      console.warn(`Circuit breaker activated after ${connectionState.failedRequests} failed requests`);
      connectionState.inCircuitBreakerMode = true;
      
      // Reset circuit breaker after timeout
      setTimeout(() => {
        console.log('Circuit breaker reset');
        connectionState.inCircuitBreakerMode = false;
        connectionState.failedRequests = 0;
      }, connectionState.circuitBreakerTimeout);
    }
    
    // Log detailed error information in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers,
        },
        connectionState: { ...connectionState }
      });
    } else {
      // Simplified logging for production
      console.error(`API Error: ${error.message} (${error.response?.status || 'Network Error'})`);
    }

    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        console.log('Authentication error detected, redirecting to login');
        window.location.href = '/login';
      }
    }

    // Handle network errors with enhanced diagnostics
    if (error.message === 'Network Error') {
      console.error('Network error detected. Server might be unavailable.');
      
      // Check if browser reports as offline
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.warn('Browser reports device is offline');
      }
      
      // Try to ping the server to verify connectivity
      if (typeof window !== 'undefined') {
        const pingStart = Date.now();
        fetch(`${window.location.origin}/api/health`, { 
          method: 'HEAD',
          cache: 'no-store',
          mode: 'no-cors'
        })
          .then(() => {
            const pingTime = Date.now() - pingStart;
            console.log(`Server ping successful (${pingTime}ms)`);
          })
          .catch(err => {
            console.error('Server ping failed:', err);
          });
      }
      
      // Try to load from cache for GET requests
      if (error.config?.method === 'get' && typeof window !== 'undefined') {
        try {
          const cacheKey = `api_cache_${error.config.url}`;
          const cachedData = localStorage.getItem(cacheKey);
          
          if (cachedData) {
            const cache = JSON.parse(cachedData);
            
            // Check if cache is still valid
            if (cache.expires > Date.now()) {
              console.log(`Using cached data for ${error.config.url}`);
              
              // Add a flag to indicate this is cached data
              cache.data._fromCache = true;
              cache.data._cacheTimestamp = cache.timestamp;
              
              // Return cached data instead of error
              return Promise.resolve({
                ...error.response,
                status: 200,
                statusText: 'OK (Cached)',
                data: cache.data,
                _cached: true
              });
            } else {
              console.log(`Cache expired for ${error.config.url}`);
            }
          }
        } catch (cacheErr) {
          console.warn('Failed to load from cache:', cacheErr);
        }
      }
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Server might be overloaded.');
    }
    
    // Handle Render-specific errors
    if (error.response && error.response.status === 502) {
      console.error('Bad Gateway error. This is common during Render deployments or cold starts.');
    }

    return Promise.reject(error);
  }
);

// Enhanced retry functionality with circuit breaker pattern
export const retryRequest = async (apiCall, options = {}) => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
    retryCondition = (error) => true,
    onRetry = (error, retryCount) => {}
  } = options;
  
  let retries = 0;
  let delay = initialDelay;
  
  // Don't retry if in circuit breaker mode
  if (connectionState.inCircuitBreakerMode) {
    console.warn('Circuit breaker active, not attempting request');
    throw new Error('Circuit breaker active, too many failed requests');
  }
  
  while (retries < maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      retries++;
      
      // Check if we should retry this error
      if (!retryCondition(error) || retries >= maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff and jitter
      delay = Math.min(delay * factor, maxDelay);
      const jitter = delay * 0.2 * Math.random();
      const actualDelay = delay + jitter;
      
      console.log(`Retry attempt ${retries}/${maxRetries} after ${Math.round(actualDelay)}ms`);
      onRetry(error, retries);
      
      await new Promise(resolve => setTimeout(resolve, actualDelay));
    }
  }
};

// Helper function to check API connectivity
export const checkApiConnectivity = async () => {
  try {
    const response = await api.get('/health', { timeout: 5000 });
    return {
      online: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      online: false,
      error: error.message
    };
  }
};

// Helper function to check authentication status
export const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { authenticated: false, reason: 'No token found' };
    }
    
    const response = await api.get('/auth/me');
    return {
      authenticated: true,
      user: response.data.user
    };
  } catch (error) {
    return {
      authenticated: false,
      error: error.message,
      status: error.response?.status,
      reason: error.response?.data?.message || 'Authentication check failed'
    };
  }
};

// Helper function to clear API cache
export const clearApiCache = () => {
  if (typeof window !== 'undefined') {
    const cacheKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('api_cache_')) {
        cacheKeys.push(key);
      }
    }
    
    cacheKeys.forEach(key => localStorage.removeItem(key));
    console.log(`Cleared ${cacheKeys.length} cached API responses`);
    return cacheKeys.length;
  }
  return 0;
};

export default api;
EOL

echo "✓ API utility updated"

# Update the AuthContext to handle Render-specific authentication issues
echo "Updating AuthContext for better error handling..."
cat > client/src/context/AuthContext.js << 'EOL'
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api, { checkApiConnectivity } from '../utils/api';
import axios from 'axios'; // Keep for setting default headers

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [apiStatus, setApiStatus] = useState({ online: true, checked: false });
  
  // Session timeout in milliseconds (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000;

  // Update last activity timestamp on user interaction
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    
    // Add event listeners for user activity
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, []);

  // Check API connectivity on mount
  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        const status = await checkApiConnectivity();
        setApiStatus({ ...status, checked: true });
        
        if (!status.online) {
          console.warn('API appears to be offline');
        }
      } catch (err) {
        console.error('Error checking API connectivity:', err);
        setApiStatus({ online: false, checked: true, error: err.message });
      }
    };
    
    checkConnectivity();
  }, []);

  // Check for session timeout
  useEffect(() => {
    if (!token) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > SESSION_TIMEOUT) {
        console.log('Session timeout due to inactivity');
        handleLogout(true);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [token, lastActivity]);

  useEffect(() => {
    // If we have a token, fetch the user's profile
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Set up axios interceptor for handling token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Token expired or invalid
          if (token) {
            console.log('Token expired or invalid, logging out');
            handleLogout(true);
          }
        }
        return Promise.reject(error);
      }
    );
    
    return () => axios.interceptors.response.eject(interceptor);
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setCurrentUser(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching current user:', error);
      
      // Special handling for Render deployments
      if (error.message === 'Network Error' || (error.response && error.response.status === 502)) {
        console.warn('Network error or bad gateway detected. This may be a temporary issue with Render deployment.');
        
        // Check if we have a cached user
        const cachedUserData = localStorage.getItem('cached_user');
        if (cachedUserData) {
          try {
            const cachedUser = JSON.parse(cachedUserData);
            console.log('Using cached user data:', cachedUser);
            setCurrentUser(cachedUser);
            setLoading(false);
            return;
          } catch (cacheErr) {
            console.error('Error parsing cached user data:', cacheErr);
          }
        }
      }
      
      handleLogout();
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError('');
      setLoading(true);
      
      // Check API connectivity before attempting login
      const connectivity = await checkApiConnectivity();
      setApiStatus({ ...connectivity, checked: true });
      
      if (!connectivity.online) {
        setLoading(false);
        setError('Cannot connect to the server. Please check your internet connection and try again.');
        throw new Error('API is offline');
      }
      
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      const { token, user } = response.data;
      
      setToken(token);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Cache user data for offline/cold start scenarios
      localStorage.setItem('cached_user', JSON.stringify(user));
      
      setCurrentUser(user);
      setLastActivity(Date.now());
      setLoading(false);
      
      return user;
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      
      if (error.response) {
        // Handle rate limiting
        if (error.response.status === 429) {
          setError(error.response.data.message || 'Too many login attempts. Please try again later.');
        } else if (error.response.status === 401) {
          setError('Invalid username or password. Please try again.');
        } else {
          setError(error.response.data.message || 'Authentication failed');
        }
      } else if (error.message === 'Network Error') {
        setError('Cannot connect to the server. Please check your internet connection and try again.');
      } else {
        setError('Authentication failed. Please try again.');
      }
      
      throw error;
    }
  };

  const handleLogout = useCallback(async (expired = false) => {
    try {
      if (token) {
        // Call the server logout endpoint
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up regardless of server response
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setToken(null);
      setCurrentUser(null);
      
      if (expired) {
        setError('Your session has expired. Please login again.');
      }
    }
  }, [token]);

  const logout = () => handleLogout(false);

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error('Change password error:', error);
      
      if (error.response) {
        setError(error.response.data.message || 'Failed to change password');
      } else {
        setError('Failed to change password. Please try again.');
      }
      
      throw error;
    }
  };

  // Function to diagnose authentication issues
  const diagnoseAuthIssues = async () => {
    const diagnostics = {
      token: {
        exists: !!localStorage.getItem('token'),
        length: localStorage.getItem('token')?.length || 0
      },
      connectivity: await checkApiConnectivity(),
      browser: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        online: navigator.onLine
      },
      localStorage: {
        available: !!window.localStorage,
        size: Object.keys(localStorage).length
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('Auth diagnostics:', diagnostics);
    return diagnostics;
  };

  const value = {
    currentUser,
    loading,
    error,
    apiStatus,
    login,
    logout,
    changePassword,
    diagnoseAuthIssues,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin' || currentUser?.role === 'superadmin',
    isSuperAdmin: currentUser?.role === 'superadmin',
    clearError: () => setError('')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
EOL

echo "✓ AuthContext updated"

# Add health endpoints to the server
echo "Adding health endpoints to the server..."
node server/scripts/add-health-endpoints.js
echo "✓ Health endpoints added"

# Update the LoginPage to handle Render-specific authentication issues
echo "Updating LoginPage component..."
cat > client/src/pages/auth/LoginPage.js << 'EOL'
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  Link,
  Divider
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  LockOutlined as LockIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  WifiOff as OfflineIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isCheckingConnectivity, setIsCheckingConnectivity] = useState(false);
  
  const { 
    login, 
    isAuthenticated, 
    error: authError, 
    clearError, 
    apiStatus, 
    diagnoseAuthIssues 
  } = useAuth();
  const navigate = useNavigate();

  // Clear auth errors when component mounts or unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Update local error state when auth error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setError(''); // Clear errors on input change
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); // Clear errors on input change
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const checkConnectivity = async () => {
    setIsCheckingConnectivity(true);
    try {
      const diagnostics = await diagnoseAuthIssues();
      setIsCheckingConnectivity(false);
      
      if (!diagnostics.connectivity.online) {
        setError(`Cannot connect to the server. Status: ${diagnostics.connectivity.error || 'Offline'}`);
      } else {
        setError('');
      }
    } catch (err) {
      setIsCheckingConnectivity(false);
      setError('Failed to check connectivity');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      await login(username, password);
      // Reset login attempts on successful login
      setLoginAttempts(0);
      navigate('/admin');
    } catch (err) {
      // Increment login attempts
      setLoginAttempts(prev => prev + 1);
      
      // Use auth error if available, otherwise use a generic message
      setError(authError || 'Login failed. Please check your credentials.');
      
      // Clear password field after failed attempt for security
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: { xs: 4, sm: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Fade in={true} timeout={800}>
          <Paper
            elevation={4}
            sx={{
              padding: { xs: 3, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4,
                flexDirection: { xs: 'column', sm: 'row' }
              }}
            >
              <Box 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  p: 1.5, 
                  borderRadius: '50%',
                  display: 'flex',
                  mr: { xs: 0, sm: 2 },
                  mb: { xs: 2, sm: 0 }
                }}
              >
                <LockIcon fontSize="large" />
              </Box>
              <Typography 
                component="h1" 
                variant="h4" 
                color="primary.main" 
                sx={{ 
                  fontWeight: 600,
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                Admin Login
              </Typography>
            </Box>
            
            {!apiStatus.online && apiStatus.checked && (
              <Alert 
                severity="warning" 
                sx={{ 
                  width: '100%', 
                  mb: 3,
                  '& .MuiAlert-message': {
                    fontWeight: 500
                  }
                }}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={checkConnectivity}
                    disabled={isCheckingConnectivity}
                    startIcon={isCheckingConnectivity ? <CircularProgress size={16} /> : <RefreshIcon />}
                  >
                    Retry
                  </Button>
                }
                icon={<OfflineIcon />}
              >
                Server connection issue detected. This may be temporary during deployment.
              </Alert>
            )}
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  mb: 3,
                  '& .MuiAlert-message': {
                    fontWeight: 500
                  }
                }}
              >
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={handleUsernameChange}
                disabled={isSubmitting}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 1.5 }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                disabled={isSubmitting}
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 1.5 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ 
                  mt: 1, 
                  mb: 3, 
                  py: 1.5,
                  borderRadius: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 5
                  }
                }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              
              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Secure Access
                </Typography>
              </Divider>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon color="action" sx={{ mr: 1, opacity: 0.7 }} />
                <Typography variant="body2" color="text.secondary">
                  For admin access, please contact the laboratory manager.
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                By logging in, you agree to our{' '}
                <Link href="/terms" color="primary" underline="hover">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" color="primary" underline="hover">
                  Privacy Policy
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Container>
  );
};

export default LoginPage;
