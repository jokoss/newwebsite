import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  InputAdornment,
  Tooltip,
  useTheme,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  DragIndicator as DragIndicatorIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    methodReference: '',
    turnaroundTime: '',
    displayOrder: 0
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [reorderMode, setReorderMode] = useState(false);
  const [reordering, setReordering] = useState(false);
  const theme = useTheme();

  // Fetch tests and categories on component mount
  useEffect(() => {
    fetchTestsAndCategories();
  }, []);

  const fetchTestsAndCategories = async () => {
    try {
      setLoading(true);
      const [testsResponse, categoriesResponse] = await Promise.all([
        api.get('/admin/tests'),
        api.get('/admin/categories')
      ]);
      
      setTests(testsResponse.data.data);
      setCategories(categoriesResponse.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (test = null) => {
    if (test) {
      setSelectedTest(test);
      setFormData({
        name: test.name,
        description: test.description || '',
        categoryId: test.categoryId,
        price: test.price ? test.price.toString() : '',
        methodReference: test.methodReference || '',
        turnaroundTime: test.turnaroundTime || '',
        displayOrder: test.displayOrder || 0
      });
    } else {
      setSelectedTest(null);
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        methodReference: '',
        turnaroundTime: '',
        displayOrder: tests.length > 0 ? Math.max(...tests.map(t => t.displayOrder || 0)) + 1 : 0
      });
    }
    setFormErrors({});
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedTest(null);
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      price: '',
      methodReference: '',
      turnaroundTime: '',
      displayOrder: 0
    });
    setFormErrors({});
  };

  const handleOpenDeleteDialog = (test) => {
    setSelectedTest(test);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedTest(null);
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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Test name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.categoryId) {
      errors.categoryId = 'Category is required';
    }
    
    if (formData.price && (isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
      errors.price = 'Price must be a positive number';
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
      const testData = {
        name: formData.name,
        description: formData.description,
        categoryId: parseInt(formData.categoryId),
        price: formData.price ? parseFloat(formData.price) : null,
        methodReference: formData.methodReference,
        turnaroundTime: formData.turnaroundTime,
        displayOrder: parseInt(formData.displayOrder) || 0
      };
      
      if (selectedTest) {
        // Update existing test
        await api.put(`/admin/tests/${selectedTest.id}`, testData);
        setSnackbar({
          open: true,
          message: 'Test updated successfully',
          severity: 'success'
        });
      } else {
        // Create new test
        await api.post('/admin/tests', testData);
        setSnackbar({
          open: true,
          message: 'Test created successfully',
          severity: 'success'
        });
      }
      
      fetchTestsAndCategories();
      handleCloseForm();
    } catch (err) {
      console.error('Error saving test:', err);
      setSnackbar({
        open: true,
        message: 'Error saving test. Please try again.',
        severity: 'error'
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTest) return;
    
    try {
      console.log('Attempting to delete test:', selectedTest.id);
      
      const response = await api.delete(`/admin/tests/${selectedTest.id}`);
      console.log('Delete response:', response);
      
      setSnackbar({
        open: true,
        message: 'Test deleted successfully',
        severity: 'success'
      });
      
      fetchTestsAndCategories();
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting test:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 'Error deleting test. Please try again.';
      
      setSnackbar({
        open: true,
        message: errorMessage,
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

  // Reordering functions
  const toggleReorderMode = () => {
    setReorderMode(!reorderMode);
  };

  const moveTestUp = (index) => {
    if (index === 0) return; // Already at the top
    
    const updatedTests = [...tests];
    const temp = updatedTests[index];
    updatedTests[index] = updatedTests[index - 1];
    updatedTests[index - 1] = temp;
    
    // Update display order
    updatedTests.forEach((test, idx) => {
      test.displayOrder = idx;
    });
    
    setTests(updatedTests);
  };

  const moveTestDown = (index) => {
    if (index === tests.length - 1) return; // Already at the bottom
    
    const updatedTests = [...tests];
    const temp = updatedTests[index];
    updatedTests[index] = updatedTests[index + 1];
    updatedTests[index + 1] = temp;
    
    // Update display order
    updatedTests.forEach((test, idx) => {
      test.displayOrder = idx;
    });
    
    setTests(updatedTests);
  };

  const saveTestOrder = async () => {
    try {
      setReordering(true);
      
      const testOrderData = tests.map((test, index) => ({
        id: test.id,
        displayOrder: index
      }));
      
      await api.put('/admin/tests/reorder', { tests: testOrderData });
      
      setSnackbar({
        open: true,
        message: 'Test order updated successfully',
        severity: 'success'
      });
      
      // Refresh tests to get the updated order
      await fetchTestsAndCategories();
      setReorderMode(false);
    } catch (error) {
      console.error('Error saving test order:', error);
      setSnackbar({
        open: true,
        message: 'Error saving test order. Please try again.',
        severity: 'error'
      });
    } finally {
      setReordering(false);
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Manage Tests
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={reorderMode}
                onChange={toggleReorderMode}
                color="primary"
              />
            }
            label="Reorder Mode"
          />
          {reorderMode && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={saveTestOrder}
              disabled={reordering}
            >
              {reordering ? 'Saving...' : 'Save Order'}
            </Button>
          )}
          {!reorderMode && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm()}
            >
              Add Test
            </Button>
          )}
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {tests.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Tests Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Click the "Add Test" button to create your first testing service.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            Add Test
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
              <TableRow>
                {reorderMode && <TableCell width={50} align="center">Order</TableCell>}
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Method Ref.</TableCell>
                <TableCell>Turnaround Time</TableCell>
                <TableCell width={reorderMode ? 150 : 120} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.map((test, index) => (
                <TableRow 
                  key={test.id} 
                  hover
                  sx={reorderMode ? { 
                    cursor: 'move',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                  } : {}}
                >
                  {reorderMode && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DragIndicatorIcon color="action" />
                      </Box>
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {test.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {test.description}
                    </Typography>
                    {reorderMode && (
                      <Typography variant="caption" color="text.secondary">
                        Display Order: {test.displayOrder || index}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={test.category?.name || 'N/A'} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                    {test.price ? `$${parseFloat(test.price).toFixed(2)}` : 'Contact for pricing'}
                  </TableCell>
                  <TableCell>
                    {test.methodReference || '-'}
                  </TableCell>
                  <TableCell>
                    {test.turnaroundTime || 'Standard'}
                  </TableCell>
                  <TableCell align="center">
                    {reorderMode ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Move Up">
                          <span>
                            <IconButton 
                              color="primary" 
                              onClick={() => moveTestUp(index)}
                              size="small"
                              disabled={index === 0}
                            >
                              <ArrowUpwardIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Move Down">
                          <span>
                            <IconButton 
                              color="primary" 
                              onClick={() => moveTestDown(index)}
                              size="small"
                              disabled={index === tests.length - 1}
                            >
                              <ArrowDownwardIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    ) : (
                      <>
                        <Tooltip title="Edit Test">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenForm(test)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Test">
                          <IconButton 
                            color="error" 
                            onClick={() => handleOpenDeleteDialog(test)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Add/Edit Test Form Dialog */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTest ? 'Edit Test' : 'Add New Test'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                name="name"
                label="Test Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
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
                error={!!formErrors.description}
                helperText={formErrors.description}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.categoryId} required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleFormChange}
                  label="Category"
                  IconComponent={ExpandMoreIcon}
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.categoryId && <FormHelperText>{formErrors.categoryId}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                id="price"
                name="price"
                label="Price (USD)"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.price}
                onChange={handleFormChange}
                error={!!formErrors.price}
                helperText={formErrors.price || "Leave blank if price is variable or to be determined"}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                id="methodReference"
                name="methodReference"
                label="Method Reference"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.methodReference}
                onChange={handleFormChange}
                placeholder="e.g., ASTM D3452, EPA 8260D"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                id="turnaroundTime"
                name="turnaroundTime"
                label="Turnaround Time"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.turnaroundTime}
                onChange={handleFormChange}
                placeholder="e.g., 3-5 business days"
              />
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
            {formSubmitting ? 'Saving...' : 'Save'}
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
            Are you sure you want to delete the test "{selectedTest?.name}"? 
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

export default TestManagement;
