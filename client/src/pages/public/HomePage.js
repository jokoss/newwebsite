import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Paper,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowForward as ArrowForwardIcon, 
  Science as ScienceIcon,
  Verified as VerifiedIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

// Modern, clean Hero section with minimal design
const Hero = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay visibility to ensure smooth animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
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
          <p>For inquiries about our services or to request a quote, please contact us at:</p>
          <p><strong>Email:</strong> info@analyticaltestinglab.com</p>
          <p><strong>Phone:</strong> (123) 456-7890</p>
        </div>
      </div>
    );
  };
  
  // Set up a safety timeout for loading
  useEffect(() => {
    try {
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
    } catch (error) {
      console.error('Error in HomePage useEffect:', error);
      setHasError(true);
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }, [isLoading]);

  // Main data fetching and rendering logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasError(true);
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render the main content or fallback content based on state
  return (
    <div>
      {hasError ? (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" color="error" gutterBottom>
            Error Loading Content
          </Typography>
          <Typography variant="body1" paragraph>
            {errorMessage || 'An unexpected error occurred. Please try again later.'}
          </Typography>
          {renderFallbackContent()}
        </Box>
      ) : isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Hero />
          <FeaturedServices />
          <CtaSection />
        </>
      )}
    </div>
  );
};

export default HomePage;
