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
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  const { login, isAuthenticated, error: authError, clearError } = useAuth();
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
