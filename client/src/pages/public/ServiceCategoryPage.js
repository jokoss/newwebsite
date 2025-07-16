import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Breadcrumbs,
  Link,
  useTheme,
  Chip
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

const ServiceCategoryPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  // Sample fallback category data
  const getFallbackCategory = (id) => ({
    id: parseInt(id),
    name: "Sample Testing Category",
    description: "This is a sample testing category with example tests. This data is shown when the API is unavailable.",
    imageUrl: "/images/categories/test.jpg",
    tests: [
      {
        id: 1,
        name: "Standard Analysis",
        description: "Comprehensive analysis of sample components",
        price: "199.99",
        turnaroundTime: "3-5 business days",
        methodReference: "ASTM D1234"
      },
      {
        id: 2,
        name: "Advanced Characterization",
        description: "Detailed characterization of material properties",
        price: "299.99",
        turnaroundTime: "5-7 business days",
        methodReference: "ISO 5678"
      },
      {
        id: 3,
        name: "Rapid Screening",
        description: "Quick preliminary analysis",
        price: "149.99",
        turnaroundTime: "1-2 business days",
        methodReference: "EPA 9012"
      }
    ]
  });

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/categories/${categoryId}`);
        
        // Check if we have valid data
        if (response.data && (response.data.data || response.data)) {
          const categoryData = response.data.data || response.data;
          setCategory(categoryData);
        } else {
          console.warn('No valid category data found in API response. Using fallback data.');
          setCategory(getFallbackCategory(categoryId));
        }
        
        setError('');
      } catch (err) {
        console.error('Error fetching category details:', err);
        console.log('Using fallback category data due to API error');
        setCategory(getFallbackCategory(categoryId));
        setError(''); // Don't show error to user since we're using fallback data
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryDetails();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button component={RouterLink} to="/services" variant="outlined">
            Back to Services
          </Button>
        </Box>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Category not found.</Alert>
        <Box sx={{ mt: 2 }}>
          <Button component={RouterLink} to="/services" variant="outlined">
            Back to Services
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero section with category title */}
      <Box
        sx={{
          py: 6,
          bgcolor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />} 
            aria-label="breadcrumb"
            sx={{ 
              mb: 2,
              '& .MuiBreadcrumbs-li': { color: 'rgba(255, 255, 255, 0.7)' }
            }}
          >
            <Link 
              component={RouterLink} 
              to="/"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}
            >
              Home
            </Link>
            <Link 
              component={RouterLink} 
              to="/services"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}
            >
              Services
            </Link>
            <Typography color="white">{category.name}</Typography>
          </Breadcrumbs>
          
          <Typography variant="h2" component="h1" gutterBottom>
            {category.name}
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, mb: 4 }}>
            {category.description || 'Comprehensive analytical services for your testing needs.'}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Category details */}
        <Grid container spacing={4}>
          {/* Left column: Image and description */}
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src={category.imageUrl || 'https://biodesign.asu.edu/sites/default/files/2022-11/7.jpg'}
              alt={category.name}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                mb: 3
              }}
            />
            <Typography variant="body1" paragraph>
              {category.description || 'Our laboratory provides comprehensive analytical testing services using state-of-the-art equipment and methodologies. Our team of experts ensures accurate and reliable results with quick turnaround times.'}
            </Typography>
            <Typography variant="body1">
              For custom testing requirements or to discuss your specific needs, please contact our laboratory specialists.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={RouterLink} 
              to="/contact"
              sx={{ mt: 3 }}
            >
              Contact Us
            </Button>
          </Grid>
          
          {/* Right column: Available tests */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" gutterBottom>
              Available Tests
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {category.tests && category.tests.length > 0 ? (
              <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }} aria-label="available tests">
                  <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Test Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Turnaround Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {category.tests.map((test) => (
                      <TableRow 
                        key={test.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                              {test.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {test.description}
                            </Typography>
                            {test.methodReference && (
                              <Chip 
                                label={`Method: ${test.methodReference}`} 
                                size="small" 
                                sx={{ mt: 1, fontSize: '0.75rem' }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {test.price ? `$${parseFloat(test.price).toFixed(2)}` : 'Contact for pricing'}
                        </TableCell>
                        <TableCell>
                          {test.turnaroundTime || 'Standard (3-5 business days)'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Card sx={{ p: 3, bgcolor: theme.palette.grey[50] }}>
                <Typography variant="body1">
                  No specific tests are currently listed for this category. Please contact our laboratory for more information about the testing services available.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  component={RouterLink} 
                  to="/contact"
                  sx={{ mt: 2 }}
                >
                  Contact Us
                </Button>
              </Card>
            )}
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Typography variant="body2" paragraph>
                • All prices are subject to change without notice.
              </Typography>
              <Typography variant="body2" paragraph>
                • Rush services are available for most tests at additional cost.
              </Typography>
              <Typography variant="body2">
                • Sample preparation fees may apply depending on the condition of submitted samples.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {/* Related services section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            Explore Other Services
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Button 
            variant="contained" 
            color="secondary" 
            component={RouterLink} 
            to="/services"
            sx={{ mb: 4 }}
          >
            View All Services
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ServiceCategoryPage;
