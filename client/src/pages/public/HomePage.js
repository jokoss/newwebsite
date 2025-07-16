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
import { 
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Science as ScienceIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  StarRate as StarRateIcon,
  Link as LinkIcon
} from '@mui/icons-material';

// Modern, clean Hero section with minimal design
const Hero = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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

// Featured service categories
const FeaturedServices = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample fallback categories data
  const fallbackCategories = [
    {
      id: 1,
      name: "Chemical Testing",
      description: "Comprehensive chemical analysis for various industries including pharmaceuticals, food, and environmental.",
      imageUrl: "/images/categories/chemical-testing.jpg"
    },
    {
      id: 2,
      name: "Microbiological Testing",
      description: "Detection and identification of microorganisms for safety and quality control.",
      imageUrl: "/images/categories/microbiological-testing.jpg"
    },
    {
      id: 3,
      name: "Environmental Analysis",
      description: "Testing of soil, water, and air samples for environmental monitoring and compliance.",
      imageUrl: "/images/categories/environmental-analysis.jpg"
    },
    {
      id: 4,
      name: "Food & Beverage Testing",
      description: "Quality and safety testing for food and beverage products to ensure regulatory compliance.",
      imageUrl: "/images/categories/food-&-beverage-testing.jpg"
    },
    {
      id: 5,
      name: "Pharmaceutical Analysis",
      description: "Testing and validation services for pharmaceutical products and raw materials.",
      imageUrl: "/images/categories/pharmaceutical-analysis.jpg"
    },
    {
      id: 6,
      name: "Material Characterization",
      description: "Analysis of material properties and composition for research and quality control.",
      imageUrl: "/images/categories/material-characterization.jpg"
    }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories for homepage...');
        const response = await fetch('/api/categories');
        
        // Handle non-OK responses
        if (!response.ok) {
          console.warn(`API returned status ${response.status}. Using fallback data.`);
          setCategories(fallbackCategories);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Categories loaded for homepage:', result);
        
        // Check if API response has data property
        const categories = result.data || result;
        
        // Filter to get only main categories (no parentId) and limit to 6 for display
        const mainCategories = Array.isArray(categories) && categories.length > 0
          ? categories.filter(category => !category.parentId).slice(0, 6)
          : fallbackCategories;
        
        // If no categories were found in the API response, use fallback data
        if (mainCategories.length === 0) {
          console.log('No categories found in API response. Using fallback data.');
          setCategories(fallbackCategories);
        } else {
          setCategories(mainCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Use fallback data when there's an error
        if (categories.length === 0) {
          setCategories(fallbackCategories);
        }
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
  return (
    <Box sx={{ py: 8, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
            Our Testing Services
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Box>
    );
  }

  // We no longer need to show the error message since we're using fallback data
  // Instead, we'll just render the categories (either from API or fallback)

  return (
    <Box sx={{ py: 8, bgcolor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
          Our Testing Services
        </Typography>
        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item key={category.id} xs={12} md={4}>
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
                <CardMedia
                  component="img"
                  height="200"
                  image={category.imageUrl || '/images/categories/test.jpg'}
                  alt={category.name}
                  onError={(e) => {
                    e.target.src = '/images/categories/test.jpg';
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {category.name}
                  </Typography>
                  <Typography>
                    {category.description || 'Professional testing services for this category.'}
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
  );
};

// About section with lab capabilities
const AboutSection = () => {
  const theme = useTheme();
  return (
    <Box sx={{ py: 8, bgcolor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ pr: { md: 4 } }}>
              <Typography variant="h3" component="h2" gutterBottom>
                State-of-the-Art Laboratory
              </Typography>
              <Typography variant="body1" paragraph>
                Our analytical testing laboratory is equipped with cutting-edge instrumentation and staffed by experts with decades of combined experience in various analytical disciplines.
              </Typography>
              <Typography variant="body1" paragraph>
                We are committed to providing accurate, reliable, and timely results to meet the analytical needs of researchers, industries, and healthcare professionals.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="outlined" 
                  size="large" 
                  component={RouterLink} 
                  to="/about"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: '1.2rem' }} />}
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
                  About Our Lab
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
              <img 
                src="/images/categories/biochemical-testing.jpg" 
                alt="Laboratory facility" 
                style={{ width: '100%', height: 'auto', display: 'block' }} 
                onError={(e) => {
                  e.target.src = '/images/categories/test.jpg';
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Enhanced Call to Action section with improved button design
const CTASection = () => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        py: { xs: 10, md: 12 }, 
        position: 'relative',
        overflow: 'hidden',
        background: '#FFFFFF'
      }}
    >
      {/* Decorative elements */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '10%', 
          left: '5%', 
          width: '200px', 
          height: '200px', 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.03)',
          zIndex: 3
        }} 
      />
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: '15%', 
          right: '10%', 
          width: '300px', 
          height: '300px', 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.04)',
          zIndex: 3
        }} 
      />
      
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
  );
};

  // Industry Partners Section
  const TestimonialsSection = () => {
    const theme = useTheme();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    
    // Sample fallback partners data
    const fallbackPartners = [
      {
        id: 1,
        name: "Pharmaceutical Innovations Inc.",
        logo: "https://via.placeholder.com/150x50",
        website: "https://example.com",
        description: "The analytical results provided by the laboratory were crucial for our product development process. Their precision and quick turnaround time exceeded our expectations."
      },
      {
        id: 2,
        name: "EcoSolutions Group",
        logo: "https://via.placeholder.com/150x50",
        website: "https://example.com",
        description: "We've been working with this laboratory for over 5 years. Their consistent quality and reliability have made them an invaluable partner for our environmental compliance testing."
      },
      {
        id: 3,
        name: "Advanced Materials Corp",
        logo: "https://via.placeholder.com/150x50",
        website: "https://example.com",
        description: "The team's expertise in analytical chemistry helped us identify critical impurities that were affecting our manufacturing process. Their insights saved us both time and resources."
      }
    ];

    useEffect(() => {
      const fetchPartners = async () => {
        try {
          console.log('Fetching partners for homepage...');
          const response = await fetch('/api/partners');
          
          // Handle non-OK responses
          if (!response.ok) {
            console.warn(`API returned status ${response.status} for partners. Using fallback data.`);
            setPartners(fallbackPartners);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          console.log('Partners loaded for homepage:', result);
          
          // Check if API response has data property
          const partnersData = result.data || result;
          
          if (Array.isArray(partnersData) && partnersData.length > 0) {
            // Only show active partners
            const activePartners = partnersData.filter(partner => partner.isActive);
            
            if (activePartners.length === 0) {
              console.log('No active partners found. Using fallback data.');
              setPartners(fallbackPartners);
              return;
            }
            
            // Process descriptions to ensure they're clean strings
            const processedPartners = activePartners.map(partner => ({
              ...partner,
              description: typeof partner.description === 'string' 
                ? partner.description.replace(/^;|;?font-family:[^;]+|;?font-size:[^;]+|;?color:[^;]+|;?position:[^;]+|;?top:[^;]+|;?left:[^;]+|;?text-align:[^;]+|;?margin:[^;]+|;?padding:[^;]+|;?line-height:[^;]+|;?background:[^;]+|;?display:[^;]+|;?width:[^;]+|;?height:[^;]+|;?border:[^;]+|style="[^"]*"|;$/g, '')
                : "The analytical results provided by the laboratory were crucial for our product development process."
            }));
            
            setPartners(processedPartners);
          } else {
            // Fallback to sample data if no partners found
            console.log('No partners data found in API response. Using fallback data.');
            setPartners(fallbackPartners);
          }
        } catch (error) {
          console.error('Error fetching partners:', error);
          // Use fallback data when there's an error
          if (partners.length === 0) {
            setPartners(fallbackPartners);
          }
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPartners();
    }, []);
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % partners.length);
  };
  
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + partners.length) % partners.length);
  };
  
  return (
    <Box sx={{ py: 10, bgcolor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 6
          }}
        >
          Trusted by Industry Leaders
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : partners.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ py: 4 }}>
            No partners found.
          </Typography>
        ) : (
          <Box sx={{ position: 'relative' }}>
            <IconButton 
              sx={{ 
                position: 'absolute', 
                left: { xs: '50%', md: -20 }, 
                top: { xs: 'auto', md: '50%' },
                bottom: { xs: -70, md: 'auto' },
                transform: { 
                  xs: 'translateX(-60px) translateY(0)', 
                  md: 'translateX(0) translateY(-50%)' 
                },
                bgcolor: 'background.paper',
                boxShadow: theme.customShadows.card,
                '&:hover': { bgcolor: 'background.paper', opacity: 0.9 }
              }}
              onClick={handlePrev}
              disabled={partners.length <= 1}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 3, md: 5 },
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.04)',
                maxWidth: '900px',
                mx: 'auto',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: theme.palette.primary.main
                }
              }}
            >
              {partners.length > 0 && (
                <Fade in={true} key={partners[activeIndex].id}>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontStyle: 'italic', 
                        mb: 4,
                        lineHeight: 1.6,
                        color: 'text.primary',
                        position: 'relative',
                        '&::before': {
                          content: '"""',
                          fontFamily: 'Georgia, serif',
                          fontSize: '5rem',
                          color: 'rgba(0,0,0,0.05)',
                          position: 'absolute',
                          top: -40,
                          left: -15
                        }
                      }}
                    >
                      {/* Ensure description is rendered as plain text */}
                      {typeof partners[activeIndex].description === 'string' 
                        ? partners[activeIndex].description.replace(/^;|;?font-family:[^;]+|;?font-size:[^;]+|;?color:[^;]+|;?position:[^;]+|;?top:[^;]+|;?left:[^;]+|;?text-align:[^;]+|;?margin:[^;]+|;?padding:[^;]+|;?line-height:[^;]+|;?background:[^;]+|;?display:[^;]+|;?width:[^;]+|;?height:[^;]+|;?border:[^;]+|style="[^"]*"|;$/g, '')
                        : "The analytical results provided by the laboratory were crucial for our product development process."}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                      {partners[activeIndex].logo ? (
                        <Avatar 
                          src={partners[activeIndex].logo}
                          alt={partners[activeIndex].name}
                          variant="rounded"
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            bgcolor: 'background.paper',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            p: 1
                          }}
                        />
                      ) : (
                        <Avatar 
                          sx={{ 
                            width: 64, 
                            height: 64, 
                            bgcolor: 'primary.main',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          {partners[activeIndex].name.charAt(0)}
                        </Avatar>
                      )}
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {partners[activeIndex].name}
                        </Typography>
                        {partners[activeIndex].website && (
                          <Button 
                            variant="text" 
                            size="small" 
                            component="a" 
                            href={partners[activeIndex].website}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<LinkIcon />}
                            sx={{ mt: 0.5, p: 0 }}
                          >
                            Visit Website
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Fade>
              )}
            </Paper>
          
            <IconButton 
              sx={{ 
                position: 'absolute', 
                right: { xs: '50%', md: -20 }, 
                top: { xs: 'auto', md: '50%' },
                bottom: { xs: -70, md: 'auto' },
                transform: { 
                  xs: 'translateX(60px) translateY(0)', 
                  md: 'translateX(0) translateY(-50%)' 
                },
                bgcolor: 'background.paper',
                boxShadow: theme.customShadows.card,
                '&:hover': { bgcolor: 'background.paper', opacity: 0.9 }
              }}
              onClick={handleNext}
              disabled={partners.length <= 1}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        )}
        
        {!loading && !error && partners.length > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            {partners.map((_, index) => (
              <Box
                key={index}
                onClick={() => setActiveIndex(index)}
                sx={{
                  width: 12,
                  height: 12,
                  mx: 1,
                  borderRadius: '50%',
                  bgcolor: index === activeIndex ? 'primary.main' : 'grey.300',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: index === activeIndex ? 'primary.main' : 'grey.400',
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

// Latest Blog Posts Section
const BlogSection = () => {
  const theme = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Sample fallback blog posts data
  const fallbackPosts = [
    {
      id: 1,
      title: "Introduction to Laboratory Testing Methods",
      slug: "introduction-to-laboratory-testing-methods",
      content: "<p>Laboratory testing is a critical component of scientific research, quality control, and regulatory compliance across various industries. This article provides an overview of common laboratory testing methods and their applications.</p>",
      authorName: "Dr. Sarah Johnson",
      publishedAt: new Date().toISOString(),
      featuredImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 2,
      title: "Advances in Chemical Analysis Techniques",
      slug: "advances-in-chemical-analysis-techniques",
      content: "<p>Recent advances in chemical analysis have revolutionized how we identify and quantify substances. This article explores cutting-edge techniques and their applications in various industries.</p>",
      authorName: "Dr. Michael Chen",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      featuredImage: "https://images.unsplash.com/photo-1518112166137-85f9979a43aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
    },
    {
      id: 3,
      title: "Quality Control in Pharmaceutical Testing",
      slug: "quality-control-in-pharmaceutical-testing",
      content: "<p>Quality control is essential in pharmaceutical manufacturing to ensure product safety and efficacy. This article discusses key testing methodologies and regulatory requirements.</p>",
      authorName: "Dr. Emily Rodriguez",
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      featuredImage: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blog?limit=3');
        
        // Handle non-OK responses
        if (!response.ok) {
          console.warn(`API returned status ${response.status} for blog posts. Using fallback data.`);
          setPosts(fallbackPosts);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Blog posts loaded for homepage:', result);
        
        // Check if API response has data property
        const postsData = result.data || result;
        
        if (Array.isArray(postsData) && postsData.length > 0) {
          // Only show published posts
          const publishedPosts = postsData.filter(post => post.isPublished);
          
          if (publishedPosts.length === 0) {
            console.log('No published blog posts found. Using fallback data.');
            setPosts(fallbackPosts);
            return;
          }
          
          setPosts(publishedPosts);
        } else {
          // Fallback to sample data if no posts found
          console.log('No blog posts data found in API response. Using fallback data.');
          setPosts(fallbackPosts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Use fallback data when there's an error
        setPosts(fallbackPosts);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Extract excerpt from HTML content
  const getExcerpt = (htmlContent, maxLength = 150) => {
    if (!htmlContent) return '';
    
    // Remove HTML tags
    const textContent = htmlContent.replace(/<[^>]+>/g, '');
    
    // Truncate to maxLength
    if (textContent.length <= maxLength) return textContent;
    
    // Find the last space before maxLength
    const lastSpace = textContent.substring(0, maxLength).lastIndexOf(' ');
    return textContent.substring(0, lastSpace) + '...';
  };
  
  return (
    <Box sx={{ py: 10, bgcolor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 6
          }}
        >
          Latest from Our Blog
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {posts.map((post) => (
              <Grid item key={post.id} xs={12} md={4}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0,0,0,0.04)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                      borderColor: 'rgba(0,0,0,0)',
                      '& .MuiCardMedia-root': {
                        transform: 'scale(1.03)'
                      }
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    {post.featuredImage ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={post.featuredImage}
                        alt={post.title}
                        sx={{ 
                          transition: 'transform 0.6s ease',
                        }}
                      />
                    ) : (
                      <Box 
                        sx={{ 
                          height: 200, 
                          background: theme.gradients.secondary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <Typography variant="h5" sx={{ fontWeight: 'bold', p: 2, textAlign: 'center' }}>
                          {post.title}
                        </Typography>
                      </Box>
                    )}
                    <Chip 
                      label="Blog" 
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        left: 16,
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        bgcolor: '#FFFFFF',
                        color: theme.palette.primary.main
                      }} 
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      {formatDate(post.publishedAt)} • {post.authorName}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getExcerpt(post.content)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                      component={RouterLink}
                      to={`/blog/${post.slug}`}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ fontWeight: 600 }}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button 
            variant="outlined" 
            size="large" 
            component={RouterLink}
            to="/blog"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              px: 4,
              py: 1.5,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2
              }
            }}
          >
            View All Blog Posts
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

// Stats Bar Section
const StatsBar = () => {
  const stats = [
    { value: '99.8%', label: 'Accuracy Rate', icon: <CheckCircleIcon /> },
    { value: '24h', label: 'Turnaround Time', icon: <SpeedIcon /> },
    { value: '50,000+', label: 'Tests Annually', icon: <ScienceIcon /> },
    { value: '15+', label: 'Years Experience', icon: <StarRateIcon /> }
  ];
  
  return (
    <Box 
      sx={{ 
        py: 4, 
        bgcolor: '#FFFFFF',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'rgba(0,0,0,0.04)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2
                }}
              >
                <Box 
                  sx={{ 
                    color: 'primary.main', 
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'primary.main',
                    lineHeight: 1.2
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const HomePage = () => {
  return (
    <Box>
      <Hero />
      <StatsBar />
      <FeaturedServices />
      <AboutSection />
      <TestimonialsSection />
      <BlogSection />
      <CTASection />
    </Box>
  );
};

export default HomePage;
