import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper,
  Card,
  CardContent,
  CardActions,
  useTheme
} from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

/**
 * Fallback HomePage component that doesn't rely on API calls
 * This will be displayed if the main HomePage component fails to load
 */
const FallbackHomePage = ({ error }) => {
  const theme = useTheme();

  // Hardcoded service categories for fallback
  const fallbackCategories = [
    {
      id: 1,
      name: "Chemical Testing",
      description: "Comprehensive chemical analysis for various industries including pharmaceuticals, food, and environmental."
    },
    {
      id: 2,
      name: "Microbiological Testing",
      description: "Detection and identification of microorganisms for safety and quality control."
    },
    {
      id: 3,
      name: "Environmental Analysis",
      description: "Testing of soil, water, and air samples for environmental monitoring and compliance."
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '70vh' },
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box>
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
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Error Notice (only shown if there was an error) */}
      {error && (
        <Box sx={{ py: 2, bgcolor: '#FFF3E0' }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WarningIcon color="warning" />
              <Typography variant="body1">
                We're experiencing some technical difficulties. Some content may not be available.
              </Typography>
            </Box>
          </Container>
        </Box>
      )}

      {/* Featured Services Section */}
      <Box sx={{ py: 8, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
            Our Testing Services
          </Typography>
          <Grid container spacing={4}>
            {fallbackCategories.map((category, index) => (
              <Grid item key={index} xs={12} md={4}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0,0,0,0.04)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                      borderColor: 'rgba(0,0,0,0)'
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {category.name}
                    </Typography>
                    <Typography>
                      {category.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      endIcon={<ArrowForwardIcon />}
                      component={RouterLink}
                      to={`/services/${category.id}`}
                      sx={{ ml: 1, mb: 1 }}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
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
                border: '1px solid rgba(11, 77, 131, 0.1)',
                '&:hover': {
                  background: '#FFFFFF',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }
              }}
            >
              View All Services
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: { xs: 10, md: 12 }, 
          position: 'relative',
          overflow: 'hidden',
          background: '#FFFFFF'
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 4 }}>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={8} lg={7}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography 
                  variant="h2" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                  }}
                >
                  Ready to Work With Us?
                </Typography>
                <Typography 
                  variant="h6" 
                  paragraph 
                  sx={{ 
                    mb: 6,
                    color: 'text.secondary',
                    maxWidth: { md: '600px' }
                  }}
                >
                  Our team of experts is ready to help with your analytical testing needs. Get in touch today for a consultation or quote.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} lg={5}>
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
    </Box>
  );
};

export default FallbackHomePage;
