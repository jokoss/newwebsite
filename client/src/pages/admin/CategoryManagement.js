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
  DialogContentText,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Collapse,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  AccountTree as AccountTreeIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  MoveToInbox as MoveToInboxIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  DragIndicator as DragIndicatorIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [deleteOption, setDeleteOption] = useState('deleteAll'); // 'deleteAll', 'moveToParent', 'promoteToMain'
  const [targetParentId, setTargetParentId] = useState('');
  const [reorderMode, setReorderMode] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    parentId: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const theme = useTheme();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/categories');
      setCategories(response.data.data);
      console.log('Categories loaded:', response.data.data);
      
      setError('');
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Organize categories into hierarchy
  const organizeCategories = () => {
    const mainCategories = categories.filter(cat => !cat.parentId);
    const subcategories = categories.filter(cat => cat.parentId);
    
    // Sort main categories by displayOrder
    mainCategories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    return mainCategories.map(mainCat => {
      // Get and sort subcategories for this main category
      const subs = subcategories.filter(sub => sub.parentId === mainCat.id);
      subs.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      
      return {
        ...mainCat,
        subcategories: subs
      };
    });
  };
  
  // Reordering functions
  const toggleReorderMode = () => {
    setReorderMode(!reorderMode);
  };

  const moveMainCategoryUp = (index) => {
    if (index === 0) return; // Already at the top
    
    const mainCategories = categories.filter(cat => !cat.parentId);
    mainCategories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    const updatedCategories = [...categories];
    const categoryToMove = mainCategories[index];
    const categoryAbove = mainCategories[index - 1];
    
    // Swap display orders
    const tempOrder = categoryToMove.displayOrder;
    
    // Find and update the category in the full categories array
    const categoryToMoveIndex = updatedCategories.findIndex(c => c.id === categoryToMove.id);
    const categoryAboveIndex = updatedCategories.findIndex(c => c.id === categoryAbove.id);
    
    if (categoryToMoveIndex !== -1 && categoryAboveIndex !== -1) {
      updatedCategories[categoryToMoveIndex].displayOrder = categoryAbove.displayOrder;
      updatedCategories[categoryAboveIndex].displayOrder = tempOrder;
      
      setCategories(updatedCategories);
    }
  };

  const moveMainCategoryDown = (index) => {
    const mainCategories = categories.filter(cat => !cat.parentId);
    mainCategories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    if (index === mainCategories.length - 1) return; // Already at the bottom
    
    const updatedCategories = [...categories];
    const categoryToMove = mainCategories[index];
    const categoryBelow = mainCategories[index + 1];
    
    // Swap display orders
    const tempOrder = categoryToMove.displayOrder;
    
    // Find and update the category in the full categories array
    const categoryToMoveIndex = updatedCategories.findIndex(c => c.id === categoryToMove.id);
    const categoryBelowIndex = updatedCategories.findIndex(c => c.id === categoryBelow.id);
    
    if (categoryToMoveIndex !== -1 && categoryBelowIndex !== -1) {
      updatedCategories[categoryToMoveIndex].displayOrder = categoryBelow.displayOrder;
      updatedCategories[categoryBelowIndex].displayOrder = tempOrder;
      
      setCategories(updatedCategories);
    }
  };

  const moveSubcategoryUp = (parentId, index) => {
    const subcategories = categories.filter(cat => cat.parentId === parentId);
    subcategories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    if (index === 0) return; // Already at the top
    
    const updatedCategories = [...categories];
    const subcategoryToMove = subcategories[index];
    const subcategoryAbove = subcategories[index - 1];
    
    // Swap display orders
    const tempOrder = subcategoryToMove.displayOrder;
    
    // Find and update the subcategory in the full categories array
    const subcategoryToMoveIndex = updatedCategories.findIndex(c => c.id === subcategoryToMove.id);
    const subcategoryAboveIndex = updatedCategories.findIndex(c => c.id === subcategoryAbove.id);
    
    if (subcategoryToMoveIndex !== -1 && subcategoryAboveIndex !== -1) {
      updatedCategories[subcategoryToMoveIndex].displayOrder = subcategoryAbove.displayOrder;
      updatedCategories[subcategoryAboveIndex].displayOrder = tempOrder;
      
      setCategories(updatedCategories);
    }
  };

  const moveSubcategoryDown = (parentId, index) => {
    const subcategories = categories.filter(cat => cat.parentId === parentId);
    subcategories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    if (index === subcategories.length - 1) return; // Already at the bottom
    
    const updatedCategories = [...categories];
    const subcategoryToMove = subcategories[index];
    const subcategoryBelow = subcategories[index + 1];
    
    // Swap display orders
    const tempOrder = subcategoryToMove.displayOrder;
    
    // Find and update the subcategory in the full categories array
    const subcategoryToMoveIndex = updatedCategories.findIndex(c => c.id === subcategoryToMove.id);
    const subcategoryBelowIndex = updatedCategories.findIndex(c => c.id === subcategoryBelow.id);
    
    if (subcategoryToMoveIndex !== -1 && subcategoryBelowIndex !== -1) {
      updatedCategories[subcategoryToMoveIndex].displayOrder = subcategoryBelow.displayOrder;
      updatedCategories[subcategoryBelowIndex].displayOrder = tempOrder;
      
      setCategories(updatedCategories);
    }
  };

  const saveCategoryOrder = async () => {
    try {
      setReordering(true);
      
      // Prepare data for all categories with their display orders
      const categoryOrderData = categories.map(category => ({
        id: category.id,
        displayOrder: category.displayOrder || 0
      }));
      
      // Send the update to the backend
      await axios.put('/api/admin/categories/reorder', { categories: categoryOrderData });
      
      setSnackbar({
        open: true,
        message: 'Category order updated successfully',
        severity: 'success'
      });
      
      // Refresh categories to get the updated order
      await fetchCategories();
      setReorderMode(false);
    } catch (error) {
      console.error('Error saving category order:', error);
      setSnackbar({
        open: true,
        message: 'Error saving category order. Please try again.',
        severity: 'error'
      });
    } finally {
      setReordering(false);
    }
  };

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleOpenForm = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image: null,
        parentId: category.parentId || ''
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: '',
        description: '',
        image: null,
        parentId: ''
      });
    }
    setFormErrors({});
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      image: null,
      parentId: ''
    });
    setFormErrors({});
  };

  const handleOpenDeleteDialog = (category) => {
    setSelectedCategory(category);
    setDeleteOption('deleteAll');
    setTargetParentId('');
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCategory(null);
    setDeleteOption('deleteAll');
    setTargetParentId('');
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
      errors.name = 'Category name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!selectedCategory && !formData.image) {
      errors.image = 'Please upload an image for the category';
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
      // Create a FormData object for file uploads
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('description', formData.description);
      
      if (formData.parentId) {
        formDataToSubmit.append('parentId', formData.parentId);
      }
      
      if (formData.image) {
        formDataToSubmit.append('image', formData.image);
      }
      
      let response;
      
      if (selectedCategory) {
        // Update existing category
        response = await axios.put(`/api/admin/categories/${selectedCategory.id}`, formDataToSubmit);
        
        setSnackbar({
          open: true,
          message: 'Category updated successfully',
          severity: 'success'
        });
      } else {
        // Create new category
        response = await axios.post('/api/admin/categories', formDataToSubmit);
        
        setSnackbar({
          open: true,
          message: 'Category created successfully',
          severity: 'success'
        });
      }
      
      // Refresh the categories list
      fetchCategories();
      
      handleCloseForm();
    } catch (err) {
      console.error('Error saving category:', err);
      setSnackbar({
        open: true,
        message: 'Error saving category. Please try again.',
        severity: 'error'
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      console.log('Attempting to delete category:', selectedCategory.id);
      console.log('Delete option:', deleteOption);
      
      // Prepare delete request based on selected option
      const deleteData = {
        option: deleteOption,
        targetParentId: deleteOption === 'moveToParent' ? targetParentId : null
      };
      
      // Delete via API with the chosen option
      const response = await axios.delete(`/api/admin/categories/${selectedCategory.id}`, {
        data: deleteData
      });
      console.log('Delete response:', response);
      
      // Refresh the categories list
      fetchCategories();
      
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting category:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 'Error deleting category. Please try again.';
      
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

  const getAvailableParentsForMove = () => {
    return categories.filter(cat => 
      !cat.parentId && 
      cat.id !== selectedCategory?.id
    );
  };

  const CategoryTreeItem = ({ category, isSubcategory = false, index = 0 }) => {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <Box>
        <Paper 
          elevation={isSubcategory ? 1 : 2}
          sx={{ 
            mb: 1,
            ml: isSubcategory ? 4 : 0,
            background: isSubcategory 
              ? 'linear-gradient(135deg, #f8f9fc 0%, #f1f3f9 100%)' 
              : theme.gradients.glass,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: isSubcategory 
                ? '0 4px 12px rgba(30, 58, 138, 0.08)' 
                : '0 8px 24px rgba(30, 58, 138, 0.12)'
            }
          }}
        >
          <ListItem 
            sx={{ 
              py: 2,
              px: 3,
              display: 'flex',
              alignItems: 'flex-start'
            }}
          >
            {!isSubcategory && (
              <ListItemAvatar sx={{ minWidth: 48, mr: 2 }}>
                <IconButton 
                  size="small"
                  onClick={() => toggleExpanded(category.id)}
                  disabled={!hasSubcategories}
                  sx={{
                    background: hasSubcategories ? theme.gradients.primary : 'transparent',
                    color: hasSubcategories ? 'white' : theme.palette.text.disabled,
                    '&:hover': {
                      background: hasSubcategories ? theme.gradients.primary : 'transparent'
                    }
                  }}
                >
                  {hasSubcategories ? (
                    isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />
                  ) : (
                    <DescriptionIcon />
                  )}
                </IconButton>
              </ListItemAvatar>
            )}
            
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {category.imageUrl ? (
                  <Avatar
                    src={category.imageUrl}
                    alt={category.name}
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      mr: 2,
                      border: `2px solid ${theme.palette.primary.light}`
                    }}
                  />
                ) : (
                  <Avatar 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      mr: 2,
                      background: theme.gradients.secondary
                    }}
                  >
                    <ImageIcon />
                  </Avatar>
                )}
                
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography 
                      variant={isSubcategory ? "subtitle1" : "h6"} 
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.text.primary
                      }}
                    >
                      {category.name}
                    </Typography>
                    
                    <Chip 
                      label={isSubcategory ? "Subcategory" : "Main Category"} 
                      size="small"
                      sx={{
                        background: isSubcategory ? theme.gradients.secondary : theme.gradients.primary,
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                    
                    {hasSubcategories && (
                      <Chip 
                        label={`${category.subcategories.length} subcategories`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.4 }}
                  >
                    {category.description || 'No description provided'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {reorderMode ? (
                  <>
                    {!isSubcategory && (
                      <>
                        <Tooltip title="Move Up">
                          <IconButton 
                            color="primary" 
                            onClick={() => moveMainCategoryUp(index)}
                            size="small"
                            disabled={index === 0}
                            sx={{
                              background: 'rgba(30, 58, 138, 0.1)',
                              '&:hover': {
                                background: theme.gradients.primary,
                                color: 'white'
                              },
                              '&.Mui-disabled': {
                                background: 'rgba(0, 0, 0, 0.05)',
                                color: 'rgba(0, 0, 0, 0.26)'
                              }
                            }}
                          >
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Move Down">
                          <IconButton 
                            color="primary" 
                            onClick={() => moveMainCategoryDown(index)}
                            size="small"
                            disabled={index === organizedCategories.length - 1}
                            sx={{
                              background: 'rgba(30, 58, 138, 0.1)',
                              '&:hover': {
                                background: theme.gradients.primary,
                                color: 'white'
                              },
                              '&.Mui-disabled': {
                                background: 'rgba(0, 0, 0, 0.05)',
                                color: 'rgba(0, 0, 0, 0.26)'
                              }
                            }}
                          >
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {isSubcategory && (
                      <>
                        <Tooltip title="Move Up">
                          <IconButton 
                            color="primary" 
                            onClick={() => moveSubcategoryUp(category.parentId, index)}
                            size="small"
                            disabled={index === 0}
                            sx={{
                              background: 'rgba(30, 58, 138, 0.1)',
                              '&:hover': {
                                background: theme.gradients.primary,
                                color: 'white'
                              },
                              '&.Mui-disabled': {
                                background: 'rgba(0, 0, 0, 0.05)',
                                color: 'rgba(0, 0, 0, 0.26)'
                              }
                            }}
                          >
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Move Down">
                          <IconButton 
                            color="primary" 
                            onClick={() => moveSubcategoryDown(category.parentId, index)}
                            size="small"
                            disabled={index === organizedCategories.find(c => c.id === category.parentId)?.subcategories.length - 1}
                            sx={{
                              background: 'rgba(30, 58, 138, 0.1)',
                              '&:hover': {
                                background: theme.gradients.primary,
                                color: 'white'
                              },
                              '&.Mui-disabled': {
                                background: 'rgba(0, 0, 0, 0.05)',
                                color: 'rgba(0, 0, 0, 0.26)'
                              }
                            }}
                          >
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Tooltip title="Edit Category">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenForm(category)}
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
                    <Tooltip title="Delete Category">
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(category)}
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
                  </>
                )}
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        </Paper>
        
        {/* Render subcategories */}
        {hasSubcategories && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ ml: 2, borderLeft: `2px solid ${theme.palette.primary.light}`, pl: 2 }}>
              {category.subcategories.map((subcategory, subIndex) => (
                <CategoryTreeItem 
                  key={subcategory.id} 
                  category={subcategory} 
                  isSubcategory={true} 
                  index={subIndex}
                />
              ))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const organizedCategories = organizeCategories();

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
              Category Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your service categories and subcategories with ease
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                onClick={saveCategoryOrder}
                disabled={reordering}
                sx={{
                  background: theme.gradients.primary,
                  '&:hover': {
                    background: theme.gradients.primary,
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 24px rgba(30, 58, 138, 0.25)'
                  }
                }}
              >
                {reordering ? 'Saving...' : 'Save Order'}
              </Button>
            )}
            {!reorderMode && (
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
                Add Category
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      {organizedCategories.length === 0 ? (
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            background: theme.gradients.glass,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <AccountTreeIcon sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Categories Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Get started by creating your first service category. You can organize them hierarchically with subcategories.
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
            Add Your First Category
          </Button>
        </Paper>
      ) : (
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Category Hierarchy ({organizedCategories.length} main categories)
          </Typography>
          
          <List sx={{ width: '100%' }}>
            {organizedCategories.map((category, index) => (
              <CategoryTreeItem 
                key={category.id} 
                category={category} 
                index={index}
              />
            ))}
          </List>
        </Box>
      )}
      
      {/* Add/Edit Category Form Dialog */}
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
            {selectedCategory ? 'Edit Category' : 'Add New Category'}
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
                label="Category Name"
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
                rows={4}
                value={formData.description}
                onChange={handleFormChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="parent-category-label">Parent Category (Optional)</InputLabel>
                <Select
                  labelId="parent-category-label"
                  id="parentId"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleFormChange}
                  label="Parent Category (Optional)"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    <em>None (Top-level Category)</em>
                  </MenuItem>
                  {categories
                    .filter(cat => !cat.parentId && (!selectedCategory || cat.id !== selectedCategory.id))
                    .map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>
                  Select a parent to make this a subcategory, or leave empty for a top-level category
                </FormHelperText>
              </FormControl>
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
                {formData.image ? 'Change Image' : `${selectedCategory ? 'Change' : 'Upload'} Category Image`}
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
              {selectedCategory && !formData.image && (
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
            {formSubmitting ? 'Saving...' : 'Save Category'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Enhanced Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WarningIcon color="error" />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Confirm Category Deletion
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            You are about to delete "{selectedCategory?.name}". This action cannot be undone.
          </Alert>
          
          {selectedCategory && organizedCategories.find(cat => cat.id === selectedCategory.id)?.subcategories?.length > 0 && (
            <Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                This category has {organizedCategories.find(cat => cat.id === selectedCategory.id)?.subcategories?.length} subcategories. 
                What would you like to do with them?
              </Typography>
              
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
                  Choose an option for subcategories:
                </FormLabel>
                <RadioGroup
                  value={deleteOption}
                  onChange={(e) => setDeleteOption(e.target.value)}
                >
                  <FormControlLabel 
                    value="deleteAll" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Delete all subcategories
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          All subcategories and their associated tests will be permanently removed
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 2, alignItems: 'flex-start' }}
                  />
                  
                  <FormControlLabel 
                    value="promoteToMain" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Promote subcategories to main categories
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Convert all subcategories to independent main categories
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 2, alignItems: 'flex-start' }}
                  />
                  
                  <FormControlLabel 
                    value="moveToParent" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Move subcategories to another parent
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Transfer all subcategories to a different main category
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start' }}
                  />
                </RadioGroup>
              </FormControl>
              
              {deleteOption === 'moveToParent' && (
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel>Select Target Parent Category</InputLabel>
                  <Select
                    value={targetParentId}
                    onChange={(e) => setTargetParentId(e.target.value)}
                    label="Select Target Parent Category"
                    required
                    sx={{ borderRadius: 2 }}
                  >
                    {getAvailableParentsForMove().map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <MoveToInboxIcon fontSize="small" />
                          {category.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          )}
          
          {(!selectedCategory || !organizedCategories.find(cat => cat.id === selectedCategory.id)?.subcategories?.length) && (
            <Typography variant="body1">
              This category has no subcategories. All tests associated with this category will also be removed.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDeleteDialog} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={deleteOption === 'moveToParent' && !targetParentId}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Delete Category
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

export default CategoryManagement;
