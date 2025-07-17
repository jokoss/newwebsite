import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Alert, 
  AlertTitle,
  Collapse,
  IconButton,
  Divider,
  Chip,
  Link,
  CircularProgress
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';
import api from '../../utils/api';

/**
 * Enhanced error handler specifically for Render deployments
 * This component provides detailed diagnostics and troubleshooting for Render-specific issues
 */
const RenderApiErrorHandler = ({ 
  error, 
  errorMessage, 
  children, 
  fallback, 
  onRetry,
  showDetails = false
}) => {
  const [expanded, setExpanded] = useState(showDetails);
  const [diagnostics, setDiagnostics] = useState(null);
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [diagnosticError, setDiagnosticError] = useState(null);
  const [renderSpecificIssue, setRenderSpecificIssue] = useState(false);
  const [recommendedFix, setRecommendedFix] = useState(null);

  // Analyze error message to determine if it's a Render-specific issue
  useEffect(() => {
    if (error && errorMessage) {
      // Check for common Render-specific errors
      const isRenderIssue = 
        errorMessage.includes('502') || 
        errorMessage.includes('Bad Gateway') ||
        errorMessage.includes('cold start') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('Network Error') ||
        window.location.hostname.includes('render.com') ||
        window.location.hostname.includes('onrender.com');
      
      setRenderSpecificIssue(isRenderIssue);
      
      // Set recommended fix based on error type
      if (isRenderIssue) {
        if (errorMessage.includes('502') || errorMessage.includes('Bad Gateway')) {
          setRecommendedFix({
            title: 'Render Bad Gateway (502) Error',
            description: 'This is common during deployments or when the server is starting up.',
            steps: [
              'Wait a few minutes for the server to fully start',
              'Check Render logs for any startup errors',
              'Verify environment variables are correctly set in Render dashboard',
              'Run the admin setup script to initialize the database'
            ]
          });
        } else if (errorMessage.includes('timeout')) {
          setRecommendedFix({
            title: 'Request Timeout',
            description: 'The server is taking too long to respond.',
            steps: [
              'Check if the server is under heavy load',
              'Consider upgrading your Render service plan',
              'Optimize database queries or server operations'
            ]
          });
        } else if (errorMessage.includes('Network Error')) {
          setRecommendedFix({
            title: 'Network Error',
            description: 'Cannot establish connection to the server.',
            steps: [
              'Verify the server is running',
              'Check for CORS configuration issues',
              'Ensure the API URL is correctly configured',
              'Run the admin setup script to initialize the database'
            ]
          });
        }
      }
    }
  }, [error, errorMessage]);

  // Run diagnostics to help troubleshoot the issue
  const runDiagnostics = async () => {
    setRunningDiagnostics(true);
    setDiagnosticError(null);
    
    try {
      // Try multiple diagnostic endpoints
      const results = {};
      
      try {
        // Quick health check
        const quickHealth = await fetch(`${window.location.origin}/api/health/quick`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });
        results.quickHealth = {
          status: quickHealth.status,
          data: await quickHealth.json()
        };
      } catch (err) {
        results.quickHealth = { error: err.message };
      }
      
      try {
        // CORS test
        const corsTest = await fetch(`${window.location.origin}/api/health/cors`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });
        results.corsTest = {
          status: corsTest.status,
          data: await corsTest.json()
        };
      } catch (err) {
        results.corsTest = { error: err.message };
      }
      
      try {
        // API root check
        const apiRoot = await fetch(`${window.location.origin}/api`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });
        results.apiRoot = {
          status: apiRoot.status,
          data: await apiRoot.json()
        };
      } catch (err) {
        results.apiRoot = { error: err.message };
      }
      
      // Add client-side information
      results.client = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        online: navigator.onLine,
        url: window.location.href,
        hostname: window.location.hostname,
        apiBaseUrl: api.defaults.baseURL,
        timestamp: new Date().toISOString()
      };
      
      setDiagnostics(results);
    } catch (err) {
      setDiagnosticError(err.message);
    } finally {
      setRunningDiagnostics(false);
    }
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // If no error, render children
  if (!error) {
    return children;
  }

  // If fallback content is provided, use it
  if (fallback) {
    return fallback;
  }

  // Render error UI with Render-specific diagnostics
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        bgcolor: 'background.paper',
        width: '100%',
        maxWidth: '800px',
        mx: 'auto',
        my: 4
      }}
    >
      <Alert 
        severity={renderSpecificIssue ? "warning" : "error"}
        variant="outlined"
        icon={renderSpecificIssue ? <WarningIcon /> : <ErrorIcon />}
        action={
          <IconButton
            aria-label="toggle details"
            color="inherit"
            size="small"
            onClick={toggleExpanded}
          >
            <ExpandMoreIcon 
              sx={{ 
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }} 
            />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        <AlertTitle>
          {renderSpecificIssue 
            ? (recommendedFix?.title || "Render Deployment Issue Detected") 
            : "Connection Error"}
        </AlertTitle>
        {renderSpecificIssue 
          ? (recommendedFix?.description || "We're having trouble connecting to the server. This is common with new Render deployments.")
          : "We're having trouble connecting to the server."}
      </Alert>

      <Collapse in={expanded}>
        {renderSpecificIssue && recommendedFix && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Recommended Fix:
            </Typography>
            <Box component="ol" sx={{ pl: 2 }}>
              {recommendedFix.steps.map((step, index) => (
                <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>
                  {step}
                </Typography>
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
          </Box>
        )}
        
        <Typography variant="subtitle2" gutterBottom>
          Error Details:
        </Typography>
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, overflowX: 'auto', mb: 3 }}>
          <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {errorMessage || 'No detailed error information available'}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Diagnostics:
          </Typography>
          
          {runningDiagnostics ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography variant="body2">Running diagnostics...</Typography>
            </Box>
          ) : diagnostics ? (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, overflowX: 'auto' }}>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {JSON.stringify(diagnostics, null, 2)}
              </Typography>
            </Box>
          ) : diagnosticError ? (
            <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
              <AlertTitle>Diagnostic Error</AlertTitle>
              {diagnosticError}
            </Alert>
          ) : (
            <Button
              variant="outlined"
              size="small"
              startIcon={<BugReportIcon />}
              onClick={runDiagnostics}
              sx={{ mt: 1 }}
            >
              Run Diagnostics
            </Button>
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Render Deployment Resources:
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography variant="body2" component="div">
            • <Link href="https://render.com/docs/deploys" target="_blank" rel="noopener">Render Deployment Documentation</Link>
          </Typography>
          <Typography variant="body2" component="div">
            • <Link href="https://render.com/docs/environment-variables" target="_blank" rel="noopener">Environment Variables Guide</Link>
          </Typography>
          <Typography variant="body2" component="div">
            • <Link href="https://render.com/docs/databases" target="_blank" rel="noopener">Render Database Documentation</Link>
          </Typography>
        </Box>
      </Collapse>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{ mr: 2 }}
        >
          Retry Connection
        </Button>
        
        {!expanded && (
          <Button
            variant="outlined"
            onClick={toggleExpanded}
          >
            Show Details
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default RenderApiErrorHandler;
