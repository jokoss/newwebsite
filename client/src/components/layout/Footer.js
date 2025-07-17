import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  Avatar,
  Chip,
  Button,
  useMediaQuery,
  Paper
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email,
  Phone,
  LocationOn,
  Science as ScienceIcon,
  ArrowUpward as ArrowUpwardIcon,
  KeyboardArrowRight as ArrowRightIcon
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const [certifications, setCertifications] = useState([]);
  const [error, setError] = useState(null);

  // Sample fallback certifications data
  const fallbackCertifications = [
    { id: 1, name: "ISO 9001", externalUrl: "https://www.iso.org/iso-9001-quality-management.html" },
    { id: 2, name: "ISO 17025", externalUrl: "https://www.iso.org/ISO-IEC-17025-testing-and-calibration-laboratories.html" },
    { id: 3, name: "AASHTO", externalUrl: null }
  ];

  // Fetch certifications on component mount
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        // Add a timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await axios.get('/api/certifications', {
          signal: controller.signal,
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        clearTimeout(timeoutId);
        
        // Check if response has data property
        const certificationsData = response.data && response.data.data ? response.data.data : [];
        setCertifications(certificationsData);
      } catch (error) {
        console.error('Error fetching certifications:', error);
        setError(error.message);
        // Use fallback data when there's an error
        setCertifications(fallbackCertifications);
      }
    };

    fetchCertifications();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Check if the viewport is mobile
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        background: theme.gradients.footer,
        color: 'white',
        mt: 'auto',
        overflow: 'hidden',
        pt: { xs: 6, md: 10 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url(https://images.unsplash.com/photo-1581093458791-9d2b06b6c8b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05,
          zIndex: 0
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 80% 20%, rgba(0, 163, 180, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 20% 80%, rgba(11, 77, 131, 0.08) 0%, transparent 50%)`,
          zIndex: 0
        }
      }}
    >
      {/* Request a Quote Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, mb: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(11, 77, 131, 0.95) 0%, rgba(0, 163, 180, 0.9) 100%)',
            boxShadow: theme.customShadows.card,
            position: 'relative',
            overflow: 'hidden',
            transform: 'translateY(-50%)',
            mt: { xs: 0, md: 0 },
            mb: { xs: -2, md: 0 },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url(https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80) center/cover no-repeat',
              opacity: 0.1,
              zIndex: -1
            }
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Request a Quote
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
                Get a personalized quote for your analytical testing needs. Our team will provide a detailed proposal tailored to your specific requirements.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/contact"
                  size="large"
                  sx={{
                    background: 'white',
                    color: 'primary.dark',
                    fontWeight: 600,
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.9)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      transform: 'translateY(-5px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Your Quote
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      {/* Main Footer Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Grid container spacing={6}>
            {/* Company Information */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box 
                    sx={{ 
                      mr: 2, 
                      background: theme.gradients.primary,
                      width: 56,
                      height: 56,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(11, 77, 131, 0.3)'
                    }}
                  >
                    <ScienceIcon sx={{ color: 'white', fontSize: '2rem' }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        lineHeight: 1.2,
                      }}
                    >
                      Analytical Testing
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: 500,
                        letterSpacing: '0.5px',
                      }}
                    >
                      Precision • Innovation • Excellence
                    </Typography>
                  </Box>
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    lineHeight: 1.8,
                    mb: 4,
                    fontSize: '0.95rem'
                  }}
                >
                  Leading provider of analytical testing services for research, industry, and healthcare applications. 
                  Delivering precision results with cutting-edge technology and expert analysis since 2010.
                </Typography>
                
                {/* Social Media */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton 
                    color="inherit" 
                    aria-label="Facebook"
                    component="a"
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      width: 42,
                      height: 42,
                      '&:hover': { 
                        background: theme.gradients.primary,
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(11, 77, 131, 0.4)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    <Facebook />
                  </IconButton>
                  <IconButton 
                    color="inherit" 
                    aria-label="Twitter"
                    component="a"
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      width: 42,
                      height: 42,
                      '&:hover': { 
                        background: theme.gradients.primary,
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(11, 77, 131, 0.4)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    <Twitter />
                  </IconButton>
                  <IconButton 
                    color="inherit" 
                    aria-label="LinkedIn"
                    component="a"
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      width: 42,
                      height: 42,
                      '&:hover': { 
                        background: theme.gradients.primary,
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(11, 77, 131, 0.4)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    <LinkedIn />
                  </IconButton>
                  <IconButton 
                    color="inherit" 
                    aria-label="Instagram"
                    component="a"
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      width: 42,
                      height: 42,
                      '&:hover': { 
                        background: theme.gradients.primary,
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(11, 77, 131, 0.4)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    <Instagram />
                  </IconButton>
                </Box>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  mb: 3,
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: theme.gradients.secondary,
                    borderRadius: 4
                  }
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { title: 'Home', path: '/' },
                  { title: 'Services', path: '/services' },
                  { title: 'About', path: '/about' },
                  { title: 'Contact', path: '/contact' },
                  { title: 'Privacy Policy', path: '/privacy-policy' }
                ].map((link) => (
                  <Link
                    key={link.title}
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 400,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'white',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <ArrowRightIcon 
                      sx={{ 
                        fontSize: '0.9rem', 
                        mr: 1, 
                        color: theme.palette.secondary.main,
                        opacity: 0.8
                      }} 
                    />
                    {link.title}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Services */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  mb: 3,
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: theme.gradients.secondary,
                    borderRadius: 4
                  }
                }}
              >
                Popular Services
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { title: 'Chemical Analysis', path: '/services' },
                  { title: 'Microbiological Testing', path: '/services' },
                  { title: 'Material Characterization', path: '/services' },
                  { title: 'Environmental Analysis', path: '/services' },
                  { title: 'Food & Beverage Testing', path: '/services' }
                ].map((service) => (
                  <Link
                    key={service.title}
                    component={RouterLink}
                    to={service.path}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 400,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'white',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <ArrowRightIcon 
                      sx={{ 
                        fontSize: '0.9rem', 
                        mr: 1, 
                        color: theme.palette.secondary.main,
                        opacity: 0.8
                      }} 
                    />
                    {service.title}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={3}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  mb: 3,
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: theme.gradients.secondary,
                    borderRadius: 4
                  }
                }}
              >
                Contact Info
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      background: theme.gradients.secondary,
                      borderRadius: '10px',
                      p: 1,
                      boxShadow: '0 4px 12px rgba(0, 163, 180, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36
                    }}
                  >
                    <LocationOn fontSize="small" sx={{ color: 'white' }} />
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 1.6,
                      fontSize: '0.95rem'
                    }}
                  >
                    3540 E Corona Ave<br />
                    Phoenix, AZ 85040
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      p: 1,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <Phone fontSize="small" sx={{ color: theme.palette.primary.light }} />
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    (928) 772-3393
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      p: 1,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <Email fontSize="small" sx={{ color: theme.palette.primary.light }} />
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    motzz@motzzlaboratory.com
                  </Typography>
                </Box>
              </Box>

              {/* Certifications/Trust Badges */}
              {Array.isArray(certifications) && certifications.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2 }}>
                    Trusted & Certified
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {certifications.map((certification, index) => (
                      <Chip 
                        key={certification?.id || index}
                        label={certification?.name || 'Certification'}
                        size="small"
                        component={certification?.externalUrl ? "a" : "div"}
                        href={certification?.externalUrl || undefined}
                        target={certification?.externalUrl ? "_blank" : undefined}
                        rel={certification?.externalUrl ? "noopener noreferrer" : undefined}
                        clickable={!!certification?.externalUrl}
                        sx={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          textDecoration: 'none',
                          '&:hover': certification?.externalUrl ? {
                            background: 'rgba(255, 255, 255, 0.2)',
                            transform: 'translateY(-1px)'
                          } : {}
                        }} 
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Section */}
        <Box sx={{ py: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.875rem'
                }}
              >
                © {currentYear} Analytical Testing Laboratory. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'flex-start', md: 'flex-end' }, 
                  alignItems: 'center',
                  gap: 3 
                }}
              >
                <Link
                  component={RouterLink}
                  to="/privacy-policy"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: theme.palette.primary.light
                    }
                  }}
                >
                  Privacy Policy
                </Link>
                <Link
                  component={RouterLink}
                  to="/terms-of-use"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: theme.palette.primary.light
                    }
                  }}
                >
                  Terms of Use
                </Link>
                
                {/* Back to Top Button */}
                <IconButton 
                  onClick={scrollToTop}
                  aria-label="Back to top"
                  sx={{ 
                    background: theme.gradients.primary,
                    color: 'white',
                    ml: 2,
                    '&:hover': { 
                      background: theme.gradients.primary,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ArrowUpwardIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
