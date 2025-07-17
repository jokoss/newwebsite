import React, { useState, useEffect, useRef } from 'react';
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
import ApiErrorHandler from '../../components/utils/ApiErrorHandler';
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
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';
import api from '../../utils/api';

// Modern, clean Hero section with minimal design
const Hero = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      // Existing useEffect code will go here
  
    // Delay visibility to ensure smooth animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    
  // If there's an error or we're in a Render environment with warnings, show fallback content
  if (hasError || (isRenderEnvironment() && renderWarning)) {
    console.log('Rendering fallback content due to:', hasError ? 'error' : 'Render warning');
    return renderFallbackContent();
  }
  
  // Normal rendering
  return () => clearTimeout(timer);
  
    } catch (error) {
      console.error('Error in HomePage data fetching:', error);
      setHasError(true);
      setErrorMessage(error.message);
      setIsLoading(false);
    }
    }, []);

  return (
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

// Featured Services Section
const FeaturedServices = () => {
  const theme = useTheme();
  
  // Sample featured services data
  const featuredServices = [
    {
      id: 1,
      title: 'Chemical Analysis',
      description: 'Comprehensive chemical composition analysis for various materials and compounds.',
      icon: <ScienceIcon sx={{ fontSize: '2.5rem', color: theme.palette.primary.main }} />,
      link: '/services/chemical-testing'
    },
    {
      id: 2,
      title: 'Microbiological Testing',
      description: 'Detection and identification of microorganisms in food, water, and environmental samples.',
      icon: <ScienceIcon sx={{ fontSize: '2.5rem', color: theme.palette.secondary.main }} />,
      link: '/services/microbiological-testing'
    },
    {
      id: 3,
      title: 'Material Characterization',
      description: 'Advanced techniques for determining physical and chemical properties of materials.',
      icon: <ScienceIcon sx={{ fontSize: '2.5rem', color: theme.palette.tertiary.main }} />,
      link: '/services/material-characterization'
    }
  ];

  return (
    <Box sx={{ py: 10, background: '#FAFAFA' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h2" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
            Our Services
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontWeight: 300 }}>
            Discover our comprehensive range of analytical testing services
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {featuredServices.map((service) => (
            <Grid item xs={12} md={4} key={service.id}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: '8px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    {service.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3" align="center" sx={{ fontWeight: 500 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center">
                    {service.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
                  <Button 
                    component={RouterLink} 
                    to={service.link}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.03)'
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/services"
            endIcon={<ArrowForwardIcon />}
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: '4px',
              textTransform: 'none',
              fontWeight: 500,
              borderWidth: '1px'
            }}
          >
            View All Services
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

// CTA Section
const CtaSection = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h2" component="h2" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h5" paragraph color="text.secondary" sx={{ fontWeight: 300, mb: 4 }}>
              Our team of experts is ready to help you with your analytical testing needs. Contact us today for a consultation or quote.
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckCircleIcon color="primary" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                      Fast Turnaround
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get your results quickly with our efficient testing processes
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckCircleIcon color="primary" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                      Certified Results
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      All tests performed according to international standards
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckCircleIcon color="primary" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                      Expert Consultation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get insights from our team of experienced scientists
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckCircleIcon color="primary" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                      Competitive Pricing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      High-quality testing services at reasonable rates
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row', md: 'column' },
                gap: 3,
                justifyContent: 'center',
                alignItems: { xs: 'center', md: 'flex-start' }
              }}
            >
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/contact"
                sx={{
                  background: '#FFFFFF',
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  fontSize: '1rem',
                  border: `1px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    background: '#FFFFFF',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                  },
                  px: 4,
                  py: 1.5,
                  borderRadius: '4px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  width: { xs: '100%', sm: 'auto' },
                  textTransform: 'none',
                  letterSpacing: '0.5px',
                }}
              >
                Contact Us
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/services"
                sx={{
                  color: theme.palette.secondary.main,
                  borderColor: 'rgba(0, 163, 180, 0.2)',
                  borderWidth: '1px',
                  fontWeight: 400,
                  '&:hover': {
                    borderColor: theme.palette.secondary.main,
                    bgcolor: 'rgba(0, 163, 180, 0.02)',
                    transform: 'translateY(-2px)',
                  },
                  px: 4,
                  py: 1.5,
                  borderRadius: '4px',
                  width: { xs: '100%', sm: 'auto' },
                  textTransform: 'none',
                  letterSpacing: '0.5px',
                }}
              >
                Explore Services
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Enhanced HomePage component with robust error handling and fallback content
const HomePage = () => {
  // State for tracking API loading and errors
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [renderWarning, setRenderWarning] = useState(false);
  const loadingTimeoutRef = useRef(null);
  
  // Helper function to detect if we're in a Render environment
  const isRenderEnvironment = () => {
    return (
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('render.com') || 
       window.location.hostname.includes('onrender.com'))
    );
  };
  
  // Fallback content to display if there are API issues
  const renderFallbackContent = () => {
    return (
      <div className="fallback-content" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Welcome to Analytical Testing Laboratory</h1>
        {renderWarning && (
          <div style={{ 
            padding: '15px', 
            marginBottom: '20px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeeba', 
            borderRadius: '4px',
            color: '#856404'
          }}>
            <h4 style={{ marginTop: '0' }}>Connection Notice</h4>
            <p>We're experiencing some connectivity issues with our backend services. 
            Some content may not be fully available at the moment.</p>
            <p>Please try refreshing the page or check back later.</p>
          </div>
        )}
        
        <div style={{ marginBottom: '30px' }}>
          <h2>Our Services</h2>
          <p>We provide comprehensive analytical testing services for various industries including:</p>
          <ul>
            <li>Chemical Analysis</li>
            <li>Microbiological Testing</li>
            <li>Environmental Analysis</li>
            <li>Food & Beverage Testing</li>
            <li>Material Characterization</li>
            <li>And more...</li>
          </ul>
          <p>Please navigate to our Services page to learn more about our specific offerings.</p>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <h2>Why Choose Us</h2>
          <p>With state-of-the-art equipment and experienced professionals, we deliver:</p>
          <ul>
            <li>Accurate and reliable results</li>
            <li>Quick turnaround times</li>
            <li>Comprehensive reporting</li>
            <li>Customized testing solutions</li>
            <li>Excellent customer service</li>
          </ul>
        </div>
        
        <div>
          <h2>Contact Us</h2>
          <p>For inquiries about our services or to request a quote, please con
    try {
      // Existing useEffect code will go here
  tact us at:</p>
          <p><strong>Email:</strong> info@analyticaltestinglab.com</p>
          <p><strong>Phone:</strong> (123) 456-7890</p>
        </div>
      </div>
    );
  
    } catch (error) {
      console.error('Error in HomePage data fetching:', error);
      setHasError(true);
      setErrorMessage(error.message);
      setIsLoading(false);
    }
    };
  
  // Set up a safety timeout for loading
  useEffect(() => {
    // Set a timeout to prevent infinite loading state
    loadingTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        console.log('Loading timeout reached, showing fallback content');
        setIsLoading(false);
        setRenderWarning(true);
      }
    }, 10000); // 10 second timeout
    
    // Check for Render-specific issues
    if (isRenderEnvironment()) {
      console.log('Render environment detected, enabling enhanced error handling');
      
      // Add a specific check for API connectivity
      fetch('/api/health')
        .then(response => {
          if (!response.ok) throw new Error('API health check failed');
          return response.json();
        })
        .then(data => {
          console.log('API health check successful:', data);
          // We'll still let the normal data loading happen
        })
        .catch(error => {
          console.error('API health check failed:', error);
          setRenderWarning(true);
        });
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [apiStatus, setApiStatus] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [categories, setCategories] = useState([]);
  const [partners, setPartners] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [renderSpecificError, setRenderSpecificError] = useState(false);
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const maxRetries = 3;

  // Function to safely fetch data with error handling
  const fetchData = async (endpoint, setter, logPrefix, fallbackData = []) => {
    console.log(`Fetching ${logPrefix} for homepage...`);
    try {
      const response = await api.get(endpoint, { 
        timeout: 8000,
        // Add cache-busting parameter specifically for Render
        params: {
          _t: Date.now()
        }
      });
      if (response && response.data) {
        // Ensure we're setting an array even if the API returns null/undefined
        setter(Array.isArray(response.data) ? response.data : fallbackData);
        return true;
      } else {
        // If response exists but data is missing, use fallback
        console.warn(`[warning] No data in response for ${logPrefix}, using fallback`);
        setter(fallbackData);
      }
    } catch (err) {
      console.error(`[error] Error fetching ${logPrefix}:`, err);
      // Set fallback data on error
      setter(fallbackData);
      return false;
    }
    return false;
  };

  // Function to check API connectivity with enhanced error handling
  const checkApiConnection = async (isRetry = false) => {
    if (!isRetry) {
      setLoading(true);
    }
    setError(false);

    try {
      // Try multiple endpoints to ensure connectivity
      let response;
      let connected = false;

      try {
        // First try the health endpoint
        response = await api.get('/health', { 
          timeout: 5000,
          // Add cache-busting parameter
          params: { _t: Date.now() }
        });
        console.log('API health check successful:', response.data);
        setApiStatus('healthy');
        setApiConnected(true);
        connected = true;
      } catch (healthErr) {
        console.warn('Health endpoint failed, trying API root:', healthErr);

        // If health endpoint fails, try the API root
        try {
          response = await api.get('/', { 
            timeout: 5000,
            // Add cache-busting parameter
            params: { _t: Date.now() }
          });
          console.log('API root check successful:', response.data);
          setApiStatus('available');
          setApiConnected(true);
          connected = true;
        } catch (rootErr) {
          // Both endpoints failed, but we'll still show the page
          console.error('API root check failed:', rootErr);
          setApiStatus('error');
          setApiConnected(false);
          
          // Check if this is a Render-specific issue
          const isRenderDomain = window.location.hostname.includes('render.com') || 
                                window.location.hostname.includes('onrender.com');
          if (isRenderDomain) {
            console.warn('Detected Render-specific connectivity issue');
            setRenderSpecificError(true);
          }
        }
      }

      // Define fallback data for each endpoint
      const fallbackCategories = [
        { id: 1, name: "Chemical Testing", description: "Comprehensive chemical analysis services" },
        { id: 2, name: "Microbiological Testing", description: "Detection and identification of microorganisms" },
        { id: 3, name: "Environmental Analysis", description: "Testing of environmental samples" }
      ];
      
      const fallbackPartners = [
        { id: 1, name: "Research Institute", logo: null },
        { id: 2, name: "Healthcare Labs", logo: null },
        { id: 3, name: "Industrial Solutions", logo: null }
      ];
      
      const fallbackBlogPosts = [
        { id: 1, title: "Latest Analytical Methods", slug: "latest-methods", excerpt: "Overview of cutting-edge analytical techniques" },
        { id: 2, title: "Quality Control Essentials", slug: "quality-control", excerpt: "Best practices for quality control in laboratories" }
      ];

      // Initialize with fallback data immediately to ensure the UI has something to render
      setCategories(fallbackCategories);
      setPartners(fallbackPartners);
      setBlogPosts(fallbackBlogPosts);

      // Only try to fetch data if we have a connection
      if (connected) {
        try {
          // Fetch data in parallel with individual error handling
          const results = await Promise.allSettled([
            fetchData('/categories', setCategories, 'categories', fallbackCategories),
            fetchData('/partners', setPartners, 'partners', fallbackPartners),
            fetchData('/blog/posts', setBlogPosts, 'blog posts', fallbackBlogPosts)
          ]);
          
          // Log results for debugging
          results.forEach((result, index) => {
            const endpoints = ['/categories', '/partners', '/blog/posts'];
            if (result.status === 'rejected') {
              console.error(`Failed to fetch from ${endpoints[index]}:`, result.reason);
            }
          });
        } catch (err) {
          console.error('Error during parallel data fetching:', err);
          // Fallback data is already set, so UI will still render
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('[error]', err);

      // Detailed error logging for debugging
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
      } else if (err.request) {
        console.error('No response received from server');
      } else {
        console.error('Error message:', err.message);
      }

      // Don't set error to true here to prevent blank page
      setApiStatus('error');
      setApiConnected(false);

      // Provide more helpful error messages based on error type
      if (err.code === 'ECONNABORTED') {
        setErrorMessage('Connection timed out. The server is taking too long to respond.');
      } else if (err.message && err.message
    try {
      // Existing useEffect code will go here
  .includes('Network Error')) {
        setErrorMessage('Network error. Please check your internet connection or the server might be down.');
      } else {
        setErrorMessage(err.message || 'Failed to connect to the server');
      }

      setLoading(false);
    
    } catch (error) {
      console.error('Error in HomePage data fetching:', error);
      setHasError(true);
      setErrorMessage(error.message);
      setIsLoading(false);
    }
    } finally {
      // Ensure we mark initial render as complete regardless of success/failure
      setInitialRenderComplete(true);
    }
  };

  // Auto-retry mechanism for connection issues
  useEffect(() 
    try {
      // Existing useEffect code will go here
  => {
    if (apiStatus === 'error' && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        console.log(`Auto-retrying connection (${retryCount + 1}/${maxRetries})...`);
        setRetryCount(prev => prev + 1);
        try {
          checkApiConnection(true);
        } catch (err) {
          console.error('Error during auto-retry:', err);
          // Ensure we don't get stuck in a loading state
          setLoading(false);
          setInitialRenderComplete(true);
        }
      }, 2000 * (retryCount + 1)); // Exponential backoff

      return () => clearTimeout(timer);
    }
  }, [apiStatus, retryCount, maxRetries]);

  // Check API connection when component mounts
  useEffect(() => {
    console.log('HomePage mounted, checking API connection...');
    
    // Define fallback data for immediate rendering
    const fallbackCategories = [
      { id: 1, name: "Chemical Testing", description: "Comprehensive chemical analysis services" },
      { id: 2, name: "Microbiological Testing", description: "Detection and identification of microorganisms" },
      { id: 3, name: "Environmental Analysis", description: "Testing of environmental samples" }
    ];
    
    const fallbackPartners = [
      { id: 1, name: "Research Institute", logo: null },
      { id: 2, name: "Healthcare Labs", logo: null },
      { id: 3, name: "Industrial Solutions", logo: null }
    ];
    
    const fallbackBlogPosts = [
      { id: 1, title: "Latest Analytical Methods", slug: "latest-methods", excerpt: "Overview of cutting-edge analytical techniques" },
      { id: 2, title: "Quality Control Essentials", slug: "quality-control", excerpt: "Best practices for quality control in laboratories" }
    ];

    // Initialize with fallback data immediately to ensure the UI has something to render
    setCategories(fallbackCategories);
    setPartners(fallbackPartners);
    setBlogPosts(fallbackBlogPosts);
    
    // Wrap in try-catch to ensure the component renders even if this fails
    try {
      checkApiConnection();
    } catch (err) {
      console.error('Error in initial API connection check:', err);
      // Ensure loading is set to false to prevent infinite loading state
      setLoading(false);
      setInitialRenderComplete(true);
    }

    // Mark component as mounted to prevent issues with React 18 Strict Mode
    const timer = setTimeout(() => {
      if (!initialRenderComplete) {
        console.warn('Forcing initialRenderComplete to true after timeout');
        setInitialRenderComplete(true);
        setLoading(false);
      }
    }, 5000); // Shorter safety timeout

    // Cleanup function
    return () => {
      console.log('HomePage unmounting, cleaning up...');
      clearTimeout(timer);
    };
  }, []);

  const handleRetry = () => {
    console.log('Manual retry initiated');
    setRetryCount(0);
    setRenderSpecificError(false);
    try {
      checkApiConnection();
    } catch (err) {
      console.error('Error during manual retry:', err);
      // Ensure we don't get stuck in a loading state
      setLoading(false);
      setInitialRenderComplete(true);
    }
  };

  // Always render the page content, even if API connection fails
  return (
    <Box>
      {/* API connection warning if needed */}
      {apiStatus === 'error' && initialRenderComplete && (
        <Box sx={{ py: 2, bgcolor: '#FFF3E0' }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WarningIcon color="warning" />
              <Typography variant="body1">
                {renderSpecificError 
                  ? "We're experiencing connectivity issues with our API on Render. Some content may not be available."
                  : "We're experiencing some technical difficulties. Some content may not be available."}
                <Button
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={handleRetry}
                  sx={{ ml: 2 }}
                >
                  Retry
                </Button>
              </Typography>
            </Box>
          </Container>
        </Box>
      )}

      {/* Main content */}
      {loading && !initialRenderComplete ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, minHeight: '50vh' }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading content...
          </Typography>
        </Box>
      ) : (
        <Box>
          <Hero />
          <FeaturedServices />
          <CtaSection />

          {/* Hidden API status indicator for debugging */}
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
    </Box>
  );

    } catch (error) {
      console.error('Error in HomePage data fetching:', error);
      setHasError(true);
      setErrorMessage(error.message);
      setIsLoading(false);
    }
    };

export default HomePage;
