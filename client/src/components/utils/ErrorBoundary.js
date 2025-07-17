import React, { Component } from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { Home as HomeIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

/**
 * Error Boundary component to catch JavaScript errors in child component tree
 * and display a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You can also log the error to an error reporting service like Sentry here
    // logErrorToService(error, errorInfo);
  }

  handleRefresh = () => {
    // Reload the current page
    window.location.reload();
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children } = this.props;

    // If there's a custom fallback component provided, use it
    if (hasError && fallback) {
      return fallback(error, errorInfo, this.handleRefresh);
    }

    // Otherwise, show the default error UI
    if (hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderTop: '4px solid #f44336',
              borderRadius: '4px'
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom color="error">
              Something went wrong
            </Typography>
            
            <Typography variant="body1" paragraph>
              We're sorry, but there was an error loading this page. Our team has been notified.
            </Typography>
            
            <Box sx={{ mt: 4, mb: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={this.handleRefresh}
                startIcon={<RefreshIcon />}
                sx={{ mr: 2 }}
              >
                Refresh Page
              </Button>
              
              <Button 
                variant="outlined" 
                component={Link} 
                to="/"
                startIcon={<HomeIcon />}
              >
                Go to Homepage
              </Button>
            </Box>
            
            {process.env.NODE_ENV !== 'production' && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Error Details (Development Only):
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: '#f5f5f5',
                    overflowX: 'auto'
                  }}
                >
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {error && error.toString()}
                  </Typography>
                  
                  {errorInfo && (
                    <Typography variant="body2" component="pre" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                      {errorInfo.componentStack}
                    </Typography>
                  )}
                </Paper>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    // If there's no error, render children normally
    return children;
  }
}

export default ErrorBoundary;
