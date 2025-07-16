import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  useTheme
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const ContactPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call
      // await axios.post('/api/contact', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccess(false);
    setShowError(false);
  };

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
            Contact Us
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
            Get in touch with our laboratory experts to discuss your analytical testing needs
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" gutterBottom>
              Send Us a Message
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              Fill out the form below, and one of our specialists will get back to you as soon as possible.
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    name="name"
                    label="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="subject"
                    name="subject"
                    label="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="message"
                    name="message"
                    label="Your Message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <LocationIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Laboratory Address
                  </Typography>
                  <Typography variant="body1">
                    3540 E Corona Ave<br />
                    Phoenix, AZ 85040
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <PhoneIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Phone Numbers
                  </Typography>
                  <Typography variant="body1">
                    (928) 772-3393
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 5 }}>
                <EmailIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Email Addresses
                  </Typography>
                  <Typography variant="body1">
                    motzz@motzzlaboratory.com
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h6" gutterBottom>
                Business Hours
              </Typography>
              <Typography variant="body1" paragraph>
                Monday - Friday: 8:00 AM - 5:00 PM<br />
                Saturday - Sunday: Closed
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Map Section */}
      <Box sx={{ bgcolor: theme.palette.grey[100], py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            Our Location
          </Typography>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Box
              component="iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3328.3!2d-112.066!3d33.397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b06bbbbbbbbbb%3A0x1234567890abcdef!2s3540%20E%20Corona%20Ave%2C%20Phoenix%2C%20AZ%2085040!5e0!3m2!1sen!2sus!4v1672000000000!5m2!1sen!2sus"
              sx={{
                border: 0,
                width: '100%',
                height: '450px',
                display: 'block',
              }}
              allowFullScreen=""
              loading="lazy"
              title="Laboratory Location Map"
            />
          </Paper>
        </Container>
      </Box>

      {/* Success and Error Snackbars */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Your message has been sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          There was an error sending your message. Please try again later.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
