import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Divider,
  Tooltip,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const ImageManagement = () => {
  const theme = useTheme();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    altText: '',
    type: 'general',
    referenceId: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [filters, setFilters] = useState({
    type: '',
    search: ''
  });
  const [openFilters, setOpenFilters] = useState(false);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/images');
      setImages(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (image = null) => {
    if (image) {
      setSelectedImage(image);
      setFormData({
        name: image.name,
        description: image.description || '',
        altText: image.altText || '',
        type: image.type,
        referenceId: image.referenceId || ''
      });
      setImagePreview(image.filePath);
    } else {
      setSelectedImage(null);
      setFormData({
        name: '',
        description: '',
        altText: '',
        type: 'general',
        referenceId: ''
      });
      setImageFile(null);
      setImagePreview('');
    }
    setFormErrors({});
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedImage(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleOpenDeleteDialog = (image) => {
    setSelectedImage(image);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedImage(null);
  };

  const handleOpenBulkDeleteDialog = () => {
    if (selectedImages.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one image to delete',
        severity: 'warning'
      });
      return;
    }
    setBulkDeleteDialog(true);
  };

  const handleCloseBulkDeleteDialog = () => {
    setBulkDeleteDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setFormErrors(prev => ({
        ...prev,
        image: 'Please upload a valid image file (JPEG, PNG, or GIF)'
      }));
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({
        ...prev,
        image: 'Image size should be less than 5MB'
      }));
      return;
    }
    
    setImageFile(file);
    setFormErrors(prev => ({
      ...prev,
      image: ''
    }));
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Image name is required';
    }
    
    if (!selectedImage && !imageFile) {
      errors.image = 'Please select an image file';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description);
      formDataObj.append('altText', formData.altText);
      formDataObj.append('type', formData.type);
      if (formData.referenceId) {
        formDataObj.append('referenceId', formData.referenceId);
      }
      
      if (imageFile) {
        formDataObj.append('image', imageFile);
      }
      
      if (selectedImage) {
        // Update existing image
        await axios.put(`/api/admin/images/${selectedImage.id}`, formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSnackbar({
          open: true,
          message: 'Image updated successfully',
          severity: 'success'
        });
      } else {
        // Create new image
        await axios.post('/api/admin/images', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSnackbar({
          open: true,
          message: 'Image uploaded successfully',
          severity: 'success'
        });
      }
      
      fetchImages();
      handleCloseForm();
    } catch (err) {
      console.error('Error saving image:', err);
      setSnackbar({
        open: true,
        message: 'Error saving image. Please try again.',
        severity: 'error'
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedImage) return;
    
    try {
      await axios.delete(`/api/admin/images/${selectedImage.id}`);
      
      setSnackbar({
        open: true,
        message: 'Image deleted successfully',
        severity: 'success'
      });
      
      fetchImages();
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting image:', err);
      
      setSnackbar({
        open: true,
        message: 'Error deleting image. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await axios.delete('/api/admin/images/bulk', {
        data: { ids: selectedImages.map(id => id) }
      });
      
      setSnackbar({
        open: true,
        message: `${selectedImages.length} images deleted successfully`,
        severity: 'success'
      });
      
      setSelectedImages([]);
      fetchImages();
      handleCloseBulkDeleteDialog();
    } catch (err) {
      console.error('Error bulk deleting images:', err);
      
      setSnackbar({
        open: true,
        message: 'Error deleting images. Please try again.',
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    setOpenFilters(false);
    fetchFilteredImages();
  };

  const fetchFilteredImages = async () => {
    try {
      setLoading(true);
      let url = '/api/admin/images';
      const params = {};
      
      if (filters.type) {
        params.type = filters.type;
      }
      
      const response = await axios.get(url, { params });
      
      let filteredImages = response.data.data;
      
      // Client-side filtering for search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredImages = filteredImages.filter(image => 
          image.name.toLowerCase().includes(searchLower) || 
          (image.description && image.description.toLowerCase().includes(searchLower))
        );
      }
      
      setImages(filteredImages);
      setError('');
    } catch (err) {
      console.error('Error fetching filtered images:', err);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      search: ''
    });
    fetchImages();
    setOpenFilters(false);
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const selectAllImages = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(image => image.id));
    }
  };

  const getImageTypeLabel = (type) => {
    switch (type) {
      case 'category':
        return 'Category';
      case 'test':
        return 'Test';
      case 'certification':
        return 'Certification';
      case 'general':
      default:
        return 'General';
    }
  };

  const getImageTypeColor = (type) => {
    switch (type) {
      case 'category':
        return 'primary';
      case 'test':
        return 'secondary';
      case 'certification':
        return 'success';
      case 'general':
      default:
        return 'default';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading && images.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const filteredImages = images.filter(image => {
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!image.name.toLowerCase().includes(searchLower) && 
          !(image.description && image.description.toLowerCase().includes(searchLower))) {
        return false;
      }
    }
    
    // Apply type filter
    if (filters.type && image.type !== filters.type) {
      return false;
    }
    
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Image Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={() => setOpenFilters(!openFilters)}
          >
            Filters
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            Upload Image
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Filters */}
      {openFilters && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filter Images
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Image Type</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  label="Image Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="test">Test</MenuItem>
                  <MenuItem value="certification">Certification</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                onClick={clearFilters}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Bulk Actions */}
      {selectedImages.length > 0 && (
        <Paper sx={{ p: 2, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            {selectedImages.length} images selected
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleOpenBulkDeleteDialog}
            >
              Delete Selected
            </Button>
          </Box>
        </Paper>
      )}
      
      {filteredImages.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ImageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Images Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {filters.type || filters.search ? 
              'No images match your filters. Try adjusting your search criteria.' : 
              'Upload your first image to get started.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            Upload Image
          </Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                  indeterminate={selectedImages.length > 0 && selectedImages.length < filteredImages.length}
                  onChange={selectAllImages}
                />
              }
              label="Select All"
            />
          </Box>
          
          <Grid container spacing={3}>
            {filteredImages.map((image) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    transform: selectedImages.includes(image.id) ? 'scale(0.98)' : 'scale(1)',
                    boxShadow: selectedImages.includes(image.id) ? 
                      `0 0 0 2px ${theme.palette.primary.main}, 0 4px 20px rgba(0,0,0,0.1)` : 
                      undefined
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                    <Checkbox
                      checked={selectedImages.includes(image.id)}
                      onChange={() => toggleImageSelection(image.id)}
                      sx={{ 
                        color: 'white', 
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: '50%',
                        padding: '4px',
                        '&.Mui-checked': {
                          color: 'white',
                          backgroundColor: theme.palette.primary.main,
                        }
                      }}
                    />
                  </Box>
                  
                  <CardMedia
                    component="img"
                    height="160"
                    image={image.filePath}
                    alt={image.altText || image.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" component="div" noWrap sx={{ fontWeight: 'medium' }}>
                        {image.name}
                      </Typography>
                      <Chip 
                        label={getImageTypeLabel(image.type)} 
                        size="small" 
                        color={getImageTypeColor(image.type)}
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    
                    {image.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {image.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {image.width && image.height && (
                        <Chip 
                          label={`${image.width}×${image.height}`} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                      {image.fileSize && (
                        <Chip 
                          label={formatFileSize(image.fileSize)} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions>
                    <Tooltip title="Edit Image">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenForm(image)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Image">
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(image)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      {/* Upload/Edit Image Form Dialog */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedImage ? 'Edit Image' : 'Upload New Image'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  name="name"
                  label="Image Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={handleFormChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  required
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
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
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  margin="dense"
                  id="altText"
                  name="altText"
                  label="Alt Text"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.altText}
                  onChange={handleFormChange}
                  helperText="Text description for accessibility"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="type-label">Image Type</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    label="Image Type"
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                    <MenuItem value="test">Test</MenuItem>
                    <MenuItem value="certification">Certification</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  margin="dense"
                  id="referenceId"
                  name="referenceId"
                  label="Reference ID (Optional)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.referenceId}
                  onChange={handleFormChange}
                  helperText="ID of the related item (category, test, etc.)"
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                border: '2px dashed',
                borderColor: formErrors.image ? 'error.main' : 'divider',
                borderRadius: 1,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 250,
                position: 'relative',
                mb: 2
              }}>
                {imagePreview ? (
                  <>
                    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                      <img 
                        src={imagePreview.startsWith('/uploads') ? imagePreview : imagePreview}
                        alt="Preview" 
                        style={{ 
                          width: '100%', 
                          height: 'auto', 
                          maxHeight: 250,
                          objectFit: 'contain',
                          borderRadius: 4
                        }} 
                      />
                      {!selectedImage && (
                        <IconButton
                          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)' }}
                          size="small"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                        >
                          <ClearIcon sx={{ color: 'white' }} />
                        </IconButton>
                      )}
                    </Box>
                  </>
                ) : (
                  <>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                      >
                        Select Image
                      </Button>
                    </label>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                      Drag and drop an image here, or click to select a file
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                      Supported formats: JPEG, PNG, GIF (max 5MB)
                    </Typography>
                  </>
                )}
              </Box>
              
              {formErrors.image && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formErrors.image}
                </Alert>
              )}
              
              {selectedImage && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    To replace the current image, select a new file:
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="replace-image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="replace-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      size="small"
                      startIcon={<CloudUploadIcon />}
                    >
                      Replace Image
                    </Button>
                  </label>
                </Box>
              )}
              
              {selectedImage && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Uploaded: {new Date(selectedImage.createdAt).toLocaleDateString()}
                  </Typography>
                  {selectedImage.width && selectedImage.height && (
                    <Typography variant="body2" color="text.secondary">
                      Dimensions: {selectedImage.width} × {selectedImage.height} pixels
                    </Typography>
                  )}
                  {selectedImage.fileSize && (
                    <Typography variant="body2" color="text.secondary">
                      Size: {formatFileSize(selectedImage.fileSize)}
                    </Typography>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={formSubmitting}
            startIcon={formSubmitting ? <CircularProgress size={20} /> : null}
          >
            {formSubmitting ? 'Saving...' : selectedImage ? 'Update' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the image "{selectedImage?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={bulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
      >
        <DialogTitle>Confirm Bulk Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedImages.length} selected images? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseBulkDeleteDialog}>Cancel</Button>
          <Button onClick={handleBulkDelete} color="error" variant="contained">
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ImageManagement;
