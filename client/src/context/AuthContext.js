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
      localStorage.removeItem('cached_user');
      delete axios.defaults.headers.common['Authorization'];
      setToken(null);
      setCurrentUser(null);
      
      if (expired) {
        setError('Your session has expired. Please login again.');
      }
    }
  }, [token]);

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
  }, [token, lastActivity, SESSION_TIMEOUT, handleLogout]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setCurrentUser(response.data.user);
      
      // Cache user data for offline/cold start scenarios
      localStorage.setItem('cached_user', JSON.stringify(response.data.user));
      
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
  }, [handleLogout]);

  useEffect(() => {
    // If we have a token, fetch the user's profile
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchCurrentUser]);

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
  }, [token, handleLogout]);

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
