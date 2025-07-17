import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  useTheme,
  CircularProgress,
  Chip,
  IconButton,
  Fade,
  Slide,
  Avatar
} from '@mui/material';
import ApiErrorHandler from '../../components/utils/ApiErrorHandler';\nimport RenderApiErrorHandler from '../../components/utils/RenderApiErrorHandler';
import RenderApiErrorHandler from '../../components/utils/RenderApiErrorHandler';
import { 
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Science as ScienceIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  StarRate as StarRateIcon,
  Link as LinkIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import api from '../../utils/api';

// Modern, clean Hero section with minimal design
const Hero = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

    // Determine if we're on Render\n  const isRenderHosted = typeof window  ApiErrorHandler;\n\n  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '85vh', md: '90vh' },
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle geometric shapes for modern aesthetic */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '15%', 
          right: '8%', 
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          border: '1px solid rgba(11, 77, 131, 0.03)',
          opacity: 0.5
        }}
      />
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: '20%', 
          left: '5%', 
          width: '200px',
          height: '200px',
          transform: 'rotate(45deg)',
          border: '1px solid rgba(0, 163, 180, 0.03)',
          opacity: 0.5
        }}
      />
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '40%', 
          left: '15%', 
          width: '150px',
          height: '150px',
          borderRadius: '30px',
          border: '1px solid rgba(126, 87, 194, 0.03)',
          opacity: 0.5
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Fade in={isVisible} timeout={1000}>
              <Box>
                <Chip 
                  label="Trusted by 500+ Organizations" 
                  sx={{ 
                    mb: 3,
                    background: '#FFFFFF',
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(11, 77, 131, 0.1)'
                  }} 
                />
                <Typography 
                  variant="h1" 
                  component="h1" 
                  color={theme.palette.primary.main}
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    lineHeight: 1.1,
                    mb: 3,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Precision 
                  <Box component="span" sx={{ 
                    color: theme.palette.secondary.main,
                    display: 'block',
                    fontWeight: 500
                  }}>
                    Analytical Testing
                  </Box>
                </Typography>
                <Typography 
                  variant="h5" 
                  color="text.secondary" 
                  paragraph 
                  sx={{ 
                    mb: 4,
                    fontWeight: 300,
                    lineHeight: 1.6,
                    maxWidth: '500px',
                    letterSpacing: '0.01em'
                  }}
                >
                  Delivering cutting-edge analytical solutions with unmatched accuracy and reliability for research, industry, and healthcare applications.
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    component={RouterLink} 
                    to="/services" 
                    endIcon={<ArrowForwardIcon sx={{ fontSize: '1.2rem' }} />}
                    sx={{ 
                      background: '#FFFFFF',
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      px: 3,
                      py: 1.5,
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      '&:hover': {
                        background: '#FFFFFF',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    Explore Services
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    component={RouterLink} 
                    to="/contact" 
                    sx={{ 
                      color: theme.palette.primary.main,
                      borderColor: 'rgba(11, 77, 131, 0.2)',
                      borderWidth: '1px',
                      fontWeight: 400,
                      px: 3,
                      py: 1.5,
                      borderRadius: '4px',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        background: 'rgba(11, 77, 131, 0.02)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Get Quote
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={12} md={5}>
            <Slide direction="left" in={isVisible} timeout={1200}>
              <Box sx={{ position: 'relative' }}>
                {/* Stats Cards */}
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        background: '#FFFFFF',
                        border: '1px solid rgba(11, 77, 131, 0.08)',
                        borderLeft: '3px solid',
                        borderLeftColor: theme.palette.primary.main,
                        borderRadius: '4px',
                        color: theme.palette.primary.main,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}
                    >
                      <SpeedIcon sx={{ fontSize: '2rem', mb: 1, opacity: 0.8 }} />
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>99.9%</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Accuracy Rate</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        background: '#FFFFFF',
                        border: '1px solid rgba(0, 163, 180, 0.08)',
                        borderLeft: '3px solid',
                        borderLeftColor: theme.palette.secondary.main,
                        borderRadius: '4px',
                        color: theme.palette.secondary.main,
                        mt: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}
                    >
                      <SecurityIcon sx={{ fontSize: '2rem', mb: 1, opacity: 0.8 }} />
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>24h</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Turnaround</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        background: '#FFFFFF',
                        border: '1px solid rgba(126, 87, 194, 0.08)',
                        borderLeft: '3px solid',
                        borderLeftColor: theme.palette.tertiary.main,
                        borderRadius: '4px',
                        color: theme.palette.tertiary.main,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}
                    >
                      <TrendingUpIcon sx={{ fontSize: '2rem', mb: 1, opacity: 0.8 }} />
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>50,000+</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Tests Completed Annually</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Enhanced HomePage component with robust error handling
const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [apiStatus, setApiStatus] = useState(null);
  const maxRetries = 3;
  
  // Function to check API connectivity with enhanced error handling
  const checkApiConnection = async (isRetry = false) => {
    if (!isRetry) {
      setLoading(true);
    }
    setError(false);
    
    try {
      // Try multiple endpoints to ensure connectivity
      let response;
      
      try {
        // First try the health endpoint
        response = await api.get('/health', { timeout: 5000 });
        console.log('API health check successful:', response.data);
        setApiStatus('healthy');
      } catch (healthErr) {
        console.warn('Health endpoint failed, trying API root:', healthErr);
        
        // If health endpoint fails, try the API root
        response = await api.get('/', { timeout: 5000 });
        console.log('API root check successful:', response.data);
        setApiStatus('available');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('API connection error:', err);
      
      // Detailed error logging for debugging
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        console.error('Error response headers:', err.response.headers);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Error request:', err.request);
        console.error('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
      }
      
      setError(true);
      setApiStatus('error');
      
      // Provide more helpful error messages based on error type
      if (err.code === 'ECONNABORTED') {
        setErrorMessage('Connection timed out. The server is taking too long to respond.');
      } else if (err.message && err.message.includes('Network Error')) {
        setErrorMessage('Network error. Please check your internet connection or the server might be down.');
      } else if (err.response && err.response.status === 404) {
        setErrorMessage('API endpoint not found. The server might be misconfigured.');
      } else if (err.response && err.response.status === 500) {
        setErrorMessage('Server error. The server encountered an internal error.');
      } else if (err.response && err.response.status === 502) {
        setErrorMessage('Bad gateway error. This often happens during deployment or when the server is restarting.');
      } else if (err.response && err.response.status === 503) {
        setErrorMessage('Service unavailable. The server might be overloaded or down for maintenance.');
      } else {
        setErrorMessage(err.message || 'Failed to connect to the server');
      }
      
      setLoading(false);
    }
  };

  // Auto-retry mechanism for connection issues
  useEffect(() => {
    if (error && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        console.log(`Auto-retrying connection (${retryCount + 1}/${maxRetries})...`);
        setRetryCount(prev => prev + 1);
        checkApiConnection(true);
      }, 2000 * (retryCount + 1)); // Exponential backoff
      
        // Determine if we're on Render\n  const isRenderHosted = typeof window  ApiErrorHandler;\n\n  return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  // Check API connection when component mounts
  useEffect(() => {
    console.log('HomePage mounted, checking API connection...');
    checkApiConnection();
    
    // Cleanup function
      // Determine if we're on Render\n  const isRenderHosted = typeof window  ApiErrorHandler;\n\n  return () => {
      console.log('HomePage unmounting, cleaning up...');
    };
  }, []);

  const handleRetry = () => {
    console.log('Manual retry initiated');
    setRetryCount(0);
    checkApiConnection();
  };

  // Determine if we're on Render
  const isRenderHosted = typeof window !== 'undefined' && 
    (window.location.hostname.includes('render.com') || 
     window.location.hostname.includes('onrender.com'));

  // Use RenderApiErrorHandler for Render deployments, otherwise use regular ApiErrorHandler
  const ErrorHandler = isRenderHosted ? RenderApiErrorHandler : ApiErrorHandler;

    // Determine if we're on Render\n  const isRenderHosted = typeof window  ApiErrorHandler;\n\n  return (
    <ErrorHandler 
      error={error} 
      errorMessage={errorMessage}
      onRetry={handleRetry}
      showDetails={true}
      title={
        apiStatus === 'error' 
          ? "Connection Issue Detected" 
          : "Loading Error"
      }
      message={
        retryCount > 0 
          ? `Attempting to reconnect... (${retryCount}/${maxRetries})` 
          : "We're having trouble connecting to our servers."
      }
      maxRetries={maxRetries}
      retryDelay={2000}
      fallback={
        <Box sx={{ py: 4 }}>
          <Container>
            <Hero />
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  maxWidth: 600, 
                  mx: 'auto',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom color="error">
                  Connection Issue Detected
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We're having trouble connecting to our servers. This might be due to:
                </Typography>
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleIcon color="disabled" fontSize="small" sx={{ mr: 1 }} />
                    Temporary network issues
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleIcon color="disabled" fontSize="small" sx={{ mr: 1 }} />
                    Server maintenance
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon color="disabled" fontSize="small" sx={{ mr: 1 }} />
                    Recent deployment updates
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  The static content is still available. You can continue browsing or try refreshing the page.
                </Typography>
                <Button 
                  startIcon={<RefreshIcon />} 
                  variant="contained" 
                  onClick={handleRetry}
                  sx={{ mt: 2 }}
                >
                  Retry Connection
                </Button>
              </Paper>
            </Box>
          </Container>
        </Box>
      }
    >
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Connecting to server...
          </Typography>
        </Box>
      ) : (
        <Box>
          <Hero />
          {/* Add a hidden API status indicator for debugging */}
          {process.env.NODE_ENV !== 'production' && apiStatus && (
            <Box 
              sx={{ 
                position: 'fixed', 
                bottom: 10, 
                right: 10, 
                zIndex: 9999,
                p: 1,
                borderRadius: 1,
                bgcolor: apiStatus === 'healthy' ? 'success.light' : 
                         apiStatus === 'available' ? 'warning.light' : 'error.light',
                color: 'white',
                fontSize: '0.75rem',
                opacity: 0.7
              }}
            >
              API: {apiStatus}
            </Box>
          )}
        </Box>
      )}
    </ErrorHandler>
  );
};

export default HomePage;
