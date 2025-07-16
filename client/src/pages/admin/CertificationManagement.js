import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormHelperText,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardMedia,
  Tooltip,
  Switch,
  FormControlLabel,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Chip,
  useTheme,
  Link as MuiLink,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  VerifiedUser as VerifiedUserIcon,
  DragIndicator as DragIndicatorIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';

const CertificationManagement = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    externalUrl: '',
    image: null,
    isActive: true,
    isDisplayed: true,
    sortOrder: 0
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const theme = useTheme();

  // Fetch certifications on component mount
  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/certifications');
      setCertifications(response.data.data);
      console.log('Certifications loaded:', response.data.data);
      
      setError('');
    } catch (err) {
      console.error('Error fetching certifications:', err);
      setError('Failed to load certifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (certification = null) => {
    if (certification) {
      setSelectedCertification(certification);
      setFormData({
        name: certification.name,
        description: certification.description || '',
        externalUrl: certification.externalUrl || '',
        image: null,
        isActive: certification.isActive,
        isDisplayed: certification.isDisplayed,
        sortOrder: certification.sortOrder
      });
    } else {
      setSelectedCertification(null);
      setFormData({
        name: '',
        description: '',
        externalUrl: '',
        image: null,
        isActive: true,
        isDisplayed: true,
        sortOrder: 0
      });
    }
    setFormErrors({});
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedCertification(null);
    setFormData({
      name: '',
      description: '',
      externalUrl: '',
      image: null,
      isActive: true,
      isDisplayed: true,
      sortOrder: 0
    });
    setFormErrors({});
  };

  const handleOpenDeleteDialog = (certification) => {
    setSelectedCertification(certification);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCertification(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
      
      if (formErrors.image) {
        setFormErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Certification name is required';
    }
    
    if (formData.externalUrl && !isValidUrl(formData.externalUrl)) {
      errors.externalUrl = 'Please enter a valid URL';
    }
    
    if (!selectedCertification && !formData.image) {
      errors.image = 'Please upload an image for the certification';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      // Create a FormData object for file uploads
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('externalUrl', formData.externalUrl);
      formDataToSubmit.append('sortOrder', formData.sortOrder);
      formDataToSubmit.append('isActive', formData.isActive);
      formDataToSubmit.append('isDisplayed', formData.isDisplayed);
      
      if (formData.image) {
        formDataToSubmit.append('image', formData.image);
      }
      
      let response;
      
      if (selectedCertification) {
        // Update existing certification
        response = await axios.put(`/api/admin/certifications/${selectedCertification.id}`, formDataToSubmit);
        
        setSnackbar({
          open: true,
          message: 'Certification updated successfully',
          severity: 'success'
        });
      } else {
        // Create new certification
        response = await axios.post('/api/admin/certifications', formDataToSubmit);
        
        setSnackbar({
          open: true,
          message: 'Certification created successfully',
          severity: 'success'
        });
      }
      
      // Refresh the certifications list
      fetchCertifications();
      
      handleCloseForm();
    } catch (err) {
      console.error('Error saving certification:', err);
      setSnackbar({
        open: true,
        message: 'Error saving certification. Please try again.',
        severity: 'error'
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCertification) return;
    
    try {
      console.log('Attempting to delete certification:', selectedCertification.id);
      
      const response = await axios.delete(`/api/admin/certifications/${selectedCertification.id}`);
      console.log('Delete response:', response);
      
      // Refresh the certifications list
      fetchCertifications();
      
      setSnackbar({
        open: true,
        message: 'Certification deleted successfully',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting certification:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 'Error deleting certification. Please try again.';
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleToggleStatus = async (certification, field) => {
    try {
      const formData = new FormData();
      formData.append('name', certification.name);
      formData.append('description', certification.description || '');
      formData.append('externalUrl', certification.externalUrl || '');
      formData.append('sortOrder', certification.sortOrder);
      formData.append('isActive', field === 'isActive' ? !certification.isActive : certification.isActive);
      formData.append('isDisplayed', field === 'isDisplayed' ? !certification.isDisplayed : certification.isDisplayed);

      await axios.put(`/api/admin/certifications/${certification.id}`, formData);
      
      fetchCertifications();
      
      setSnackbar({
        open: true,
        message: `Certification ${field === 'isActive' ? 'status' : 'visibility'} updated successfully`,
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating certification:', err);
      setSnackbar({
        open: true,
        message: 'Error updating certification. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          mb: 4, 
          background: theme.gradients.glass,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Certification Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your laboratory certifications and credentials
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
            sx={{
              background: theme.gradients.primary,
              px: 4,
              py: 1.5,
              '&:hover': {
                background: theme.gradients.primary,
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 24px rgba(30, 58, 138, 0.25)'
              }
            }}
          >
            Add Certification
          </Button>
        </Box>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      {certifications.length === 0 ? (
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            background: theme.gradients.glass,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <VerifiedUserIcon sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Certifications Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Get started by adding your first laboratory certification or credential.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
            sx={{
              background: theme.gradients.primary,
              px: 4,
              py: 1.5
            }}
          >
            Add Your First Certification
          </Button>
        </Paper>
      ) : (
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Certifications ({certifications.length} total)
          </Typography>
          
          <Grid container spacing={3}>
            {certifications.map((certification) => (
              <Grid item xs={12} md={6} lg={4} key={certification.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: theme.gradients.glass,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(30, 58, 138, 0.12)'
                    }
                  }}
                >
                  {certification.imageUrl ? (
                    <CardMedia
                      component="img"
                      height="120"
                      image={certification.imageUrl}
                      alt={certification.name}
                      sx={{ 
                        objectFit: 'contain',
                        p: 2,
                        background: 'white'
                      }}
                    />
                  ) : (
                    <Box 
                      sx={{ 
                        height: 120, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: 'rgba(30, 58, 138, 0.05)',
                        m: 2,
                        borderRadius: 2
                      }}
                    >
                      <VerifiedUserIcon sx={{ fontSize: 48, color: theme.palette.text.disabled }} />
                    </Box>
                  )}
                  
                  <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                        {certification.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Chip 
                          label={certification.isActive ? "Active" : "Inactive"} 
                          size="small"
                          color={certification.isActive ? "success" : "default"}
                          sx={{ fontSize: '0.75rem' }}
                        />
                        <Chip 
                          label={certification.isDisplayed ? "Visible" : "Hidden"} 
                          size="small"
                          color={certification.isDisplayed ? "primary" : "default"}
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>
                    </Box>
                    
                    {certification.description && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mb: 2, lineHeight: 1.4 }}
                      >
                        {certification.description}
                      </Typography>
                    )}
                    
                    {certification.externalUrl && (
                      <MuiLink 
                        href={certification.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 2,
                          fontSize: '0.875rem'
                        }}
                      >
                        <LinkIcon fontSize="small" />
                        View Certificate
                        <OpenInNewIcon fontSize="small" />
                      </MuiLink>
                    )}
                    
                    <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Certification">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenForm(certification)}
                          size="small"
                          sx={{
                            background: 'rgba(30, 58, 138, 0.1)',
                            '&:hover': {
                              background: theme.gradients.primary,
                              color: 'white'
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={certification.isActive ? "Deactivate" : "Activate"}>
                        <IconButton 
                          color={certification.isActive ? "success" : "default"}
                          onClick={() => handleToggleStatus(certification, 'isActive')}
                          size="small"
                          sx={{
                            background: certification.isActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(158, 158, 158, 0.1)',
                            '&:hover': {
                              background: certification.isActive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)'
                            }
                          }}
                        >
                          {certification.isActive ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete Certification">
                        <IconButton 
                          color="error" 
                          onClick={() => handleOpenDeleteDialog(certification)}
                          size="small"
                          sx={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                              color: 'white'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* Add/Edit Certification Form Dialog */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {selectedCertification ? 'Edit Certification' : 'Add New Certification'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                name="name"
                label="Certification Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                id="description"
                name="description"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleFormChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                id="externalUrl"
                name="externalUrl"
                label="Certificate URL (Optional)"
                type="url"
                fullWidth
                variant="outlined"
                value={formData.externalUrl}
                onChange={handleFormChange}
                error={!!formErrors.externalUrl}
                helperText={formErrors.externalUrl || "Link to the official certificate or verification page"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="sortOrder"
                name="sortOrder"
                label="Sort Order"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.sortOrder}
                onChange={handleFormChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ pt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleFormChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isDisplayed}
                      onChange={handleFormChange}
                      name="isDisplayed"
                      color="primary"
                    />
                  }
                  label="Displayed"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                fullWidth
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  borderStyle: 'dashed',
                  borderWidth: 2
                }}
              >
                {formData.image ? 'Change Image' : `${selectedCertification ? 'Change' : 'Upload'} Certificate Image`}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {formData.image && (
                <Typography variant="body2" sx={{ mt: 1, color: theme.palette.success.main }}>
                  Selected file: {formData.image.name}
                </Typography>
              )}
              {formErrors.image && (
                <FormHelperText error>{formErrors.image}</FormHelperText>
              )}
              {selectedCertification && !formData.image && (
                <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                  Current image will be kept if no new image is uploaded.
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseForm} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={formSubmitting}
            startIcon={formSubmitting ? <CircularProgress size={20} /> : null}
            sx={{
              background: theme.gradients.primary,
              borderRadius: 2,
              px: 3
            }}
          >
            {formSubmitting ? 'Saving...' : 'Save Certification'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Confirm Deletion
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete "{selectedCertification?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDeleteDialog} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CertificationManagement;
