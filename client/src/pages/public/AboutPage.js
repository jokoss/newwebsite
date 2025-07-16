import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  useTheme
} from '@mui/material';

const AboutPage = () => {
  const theme = useTheme();

  // Team members data
  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Laboratory Director',
      image: 'https://biodesign.asu.edu/sites/default/files/styles/asu_isearch_profile/public/2021-08/Haydel-Shelley-headshot.jpg',
      bio: 'Ph.D. in Analytical Chemistry with over 15 years of experience in laboratory management and analytical testing.'
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'Technical Director',
      image: 'https://biodesign.asu.edu/sites/default/files/styles/asu_isearch_profile/public/chaput_john.jpg',
      bio: 'Ph.D. in Materials Science specializing in advanced characterization techniques and quality control systems.'
    },
    {
      name: 'Dr. Emily Chen',
      role: 'Research Scientist',
      image: 'https://biodesign.asu.edu/sites/default/files/styles/asu_isearch_profile/public/kusumi_kenro.jpg',
      bio: 'Ph.D. in Molecular Biology with expertise in microbiological testing and genomic analysis.'
    }
  ];

  return (
    <Box>
      {/* Hero section */}
      <Box
        sx={{
          py: 8,
          bgcolor: theme.palette.primary.main,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            About Our Laboratory
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
            A state-of-the-art analytical testing facility dedicated to providing accurate, reliable, and timely results
          </Typography>
        </Container>
      </Box>

      {/* Mission and vision */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h3" component="h2" gutterBottom>
              About Motzz Laboratory
            </Typography>
            <Typography variant="body1" paragraph>
              Motzz Laboratory is an independent analytical testing laboratory located in Prescott Valley, Arizona. We provide a wide range of testing services to meet the needs of our clients in various industries.
            </Typography>
            <Typography variant="body1" paragraph>
              Our laboratory is equipped with state-of-the-art instrumentation and staffed by experienced scientists, ensuring accurate and reliable results. We are committed to providing exceptional customer service and quick turnaround times.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Our facilities */}
      <Box sx={{ bgcolor: theme.palette.grey[100], py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
            Our Facilities
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://biodesign.asu.edu/sites/default/files/styles/asu_spotlight_image/public/biodesign-spotlight-asu-helios-digital-microscope-image-1.jpg?itok=Jv1uQMvg"
                alt="Laboratory equipment"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                State-of-the-Art Equipment
              </Typography>
              <Typography variant="body1" paragraph>
                Our laboratory is equipped with cutting-edge instrumentation and technology to provide comprehensive analytical services across various disciplines.
              </Typography>
              <Typography variant="body1" paragraph>
                Our facilities include advanced spectrometers, chromatography systems, microscopy equipment, and molecular analysis tools that enable us to deliver precise and reliable results.
              </Typography>
              <Typography variant="body1">
                We continuously invest in new technologies and methodologies to enhance our capabilities and meet the evolving needs of our clients.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                component={RouterLink}
                to="/services"
                sx={{ mt: 3 }}
              >
                Explore Our Services
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our team */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
          Our Expert Team
        </Typography>
        
        <Grid container spacing={4}>
          {/* This section can be populated with actual team members from Motzz Laboratory */}
        </Grid>
      </Container>

      {/* Quality commitment */}
      <Box sx={{ bgcolor: theme.palette.primary.main, color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" component="h2" gutterBottom>
                Our Commitment to Quality
              </Typography>
              <Typography variant="body1" paragraph>
                Quality is at the core of everything we do. Our laboratory adheres to strict quality control procedures and follows internationally recognized standards to ensure the highest level of accuracy and reliability in our testing services.
              </Typography>
              <Typography variant="body1" paragraph>
                Our quality management system is designed to meet the requirements of ISO/IEC 17025, the international standard for testing and calibration laboratories. We regularly participate in proficiency testing programs to validate our methods and ensure the competence of our staff.
              </Typography>
              <Button 
                variant="outlined" 
                component={RouterLink}
                to="/contact"
                sx={{ 
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  mt: 2
                }}
              >
                Contact Us
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  bgcolor: 'white',
                  color: 'text.primary',
                  borderRadius: 2
                }}
              >
                <Typography variant="h5" gutterBottom color="primary">
                  Our Quality Standards
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" paragraph>
                    ✓ ISO/IEC 17025 compliant procedures
                  </Typography>
                  <Typography variant="body1" paragraph>
                    ✓ Regular equipment calibration and maintenance
                  </Typography>
                  <Typography variant="body1" paragraph>
                    ✓ Comprehensive staff training and development
                  </Typography>
                  <Typography variant="body1" paragraph>
                    ✓ Rigorous quality control protocols
                  </Typography>
                  <Typography variant="body1">
                    ✓ Continuous improvement initiatives
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to action */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Ready to Work With Us?
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Contact our team today to discuss your analytical testing needs and discover how we can help you achieve accurate, reliable results.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          component={RouterLink}
          to="/contact"
          sx={{ px: 4, py: 1.5 }}
        >
          Get in Touch
        </Button>
      </Container>
    </Box>
  );
};

export default AboutPage;
