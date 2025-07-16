import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const ServicesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

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
        setLoading(true);
        const response = await axios.get('/api/categories');
        
        // Handle non-OK responses (axios doesn't have an 'ok' property)
        if (response.status < 200 || response.status >= 300) {
          console.warn(`API returned status ${response.status}. Using fallback data.`);
          setCategories(fallbackCategories);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('Public services - categories loaded:', response.data);
        console.log('Number of categories:', response.data.data?.length);
        console.log('Categories filter criteria - active: true, parentId: null');
        
        // Check if API response has data and it's not empty
        const categoriesData = response.data.data || response.data;
        
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          console.log('No categories found in API response. Using fallback data.');
          setCategories(fallbackCategories);
        }
        
        setError('');
      } catch (err) {
        console.error('Error fetching categories:', err);
        console.error('Error details:', err.response?.data);
        
        // Use fallback data when there's an error
        if (categories.length === 0) {
          console.log('Using fallback categories data due to API error');
          setCategories(fallbackCategories);
        }
        
        setError('');  // Don't show error to user since we're using fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Elegant Hero section with sophisticated design
  const HeroSection = () => (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: theme.gradients.primary,
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 3,
            textShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          Our Services
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            maxWidth: 800, 
            mx: 'auto', 
            mb: 6,
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          Comprehensive analytical testing services delivered with precision, innovation, and excellence to meet your research, industrial, and healthcare needs
        </Typography>
        
        {/* Service highlights */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  15+
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Testing Categories
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Comprehensive range of analytical services
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  500+
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Individual Tests
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Extensive portfolio of analytical methods
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  24/7
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Support Available
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Round-the-clock technical assistance
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // Category grid (similar to ASU Biodesign Institute's centers layout)
  const CategoryGrid = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      );
    }

    if (categories.length === 0) {
      return (
        <Box sx={{ py: 4 }}>
          <Alert severity="info">No service categories are currently available. Please check back later.</Alert>
        </Box>
      );
    }

    // Render a single category card
    const CategoryCard = ({ category }) => (
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)',
          },
          border: '1px solid #eee'
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={category.imageUrl || `https://source.unsplash.com/random/400x300?${category.name.replace(/\s+/g, ',')}`}
          alt={category.name}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            {category.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {category.description || 'Comprehensive testing services for various analytical needs.'}
          </Typography>
          
          <Button 
            component={RouterLink} 
            to={`/services/${category.id}`}
            variant="text" 
            color="primary"
            endIcon={<ArrowForwardIcon />}
            sx={{ mt: 'auto', alignSelf: 'flex-start', p: 0, '&:hover': { backgroundColor: 'transparent' } }}
          >
            Learn More
          </Button>
        </CardContent>
      </Card>
    );

    return (
      <Box sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item key={category.id} xs={12} sm={6} md={4}>
              <CategoryCard category={category} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Additional information section
  const AdditionalInfo = () => (
    <Box sx={{ py: 8, bgcolor: theme.palette.grey[100] }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              Custom Testing Solutions
            </Typography>
            <Typography paragraph>
              Don't see the specific testing service you need? Our laboratory offers custom testing solutions tailored to your unique requirements.
            </Typography>
            <Typography paragraph>
              Our team of experts will work closely with you to develop a testing protocol that meets your specific needs, ensuring accurate and reliable results.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              component={RouterLink}
              to="/contact"
              sx={{ mt: 2 }}
            >
              Request Custom Testing
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Why Choose Our Laboratory?
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph>
                ✓ State-of-the-art instrumentation
              </Typography>
              <Typography variant="body1" paragraph>
                ✓ Experienced PhD-level scientists
              </Typography>
              <Typography variant="body1" paragraph>
                ✓ Rapid turnaround times
              </Typography>
              <Typography variant="body1" paragraph>
                ✓ Comprehensive reporting
              </Typography>
              <Typography variant="body1" paragraph>
                ✓ Competitive pricing
              </Typography>
              <Typography variant="body1">
                ✓ Confidentiality guaranteed
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  return (
    <>
      <HeroSection />
      <Container maxWidth="lg">
        <CategoryGrid />
      </Container>
      <AdditionalInfo />
    </>
  );
};

export default ServicesPage;
