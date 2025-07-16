import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../utils/api';
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
      handleLogout();
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      const { token, user } = response.data;
      
      setToken(token);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
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
        } else {
          setError(error.response.data.message || 'Authentication failed');
        }
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

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    changePassword,
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
