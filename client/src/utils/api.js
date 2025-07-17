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
  // Enable client-side caching for GET requests
  cache: {
    maxAge: 15 * 60 * 1000, // 15 minutes
    exclude: { query: false }
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
}

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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
      if (!window.location.pathname.includes('/login')) {
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
