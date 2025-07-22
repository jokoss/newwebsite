import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  DragIndicator as DragIndicatorIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState({
    name: '',
    role: '',
    company: '',
    quote: '',
    avatar: '',
    isActive: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/testimonials');
      setTestimonials(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (testimonial = null) => {
    if (testimonial) {
      setCurrentTestimonial(testimonial);
      setIsEditing(true);
    } else {
      setCurrentTestimonial({
        name: '',
        role: '',
        company: '',
        quote: '',
        avatar: '',
        isActive: true,
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTestimonial({
      ...currentTestimonial,
      [name]: value,
    });
  };

  const handleSwitchChange = (e) => {
    setCurrentTestimonial({
      ...currentTestimonial,
      isActive: e.target.checked,
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`/api/admin/testimonials/${currentTestimonial.id}`, currentTestimonial);
        setSnackbar({
          open: true,
          message: 'Testimonial updated successfully!',
          severity: 'success',
        });
      } else {
        await axios.post('/api/admin/testimonials', currentTestimonial);
        setSnackbar({
          open: true,
          message: 'Testimonial created successfully!',
          severity: 'success',
        });
      }
      handleCloseDialog();
      fetchTestimonials();
    } catch (err) {
      console.error('Error saving testimonial:', err);
      setSnackbar({
        open: true,
        message: `Failed to ${isEditing ? 'update' : 'create'} testimonial. Please try again.`,
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await axios.delete(`/api/admin/testimonials/${id}`);
        setSnackbar({
          open: true,
          message: 'Testimonial deleted successfully!',
          severity: 'success',
        });
        fetchTestimonials();
      } catch (err) {
        console.error('Error deleting testimonial:', err);
        setSnackbar({
          open: true,
          message: 'Failed to delete testimonial. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axios.put(`/api/admin/testimonials/${id}`, {
        isActive: !currentStatus,
      });
      setSnackbar({
        open: true,
        message: `Testimonial ${!currentStatus ? 'activated' : 'deactivated'} successfully!`,
        severity: 'success',
      });
      fetchTestimonials();
    } catch (err) {
      console.error('Error toggling testimonial status:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update testimonial status. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(testimonials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTestimonials(items);

    // Update display order in the backend
    try {
      const orderedIds = items.map(item => item.id);
      await axios.put('/api/admin/testimonials/order/update', { orderedIds });
      setSnackbar({
        open: true,
        message: 'Display order updated successfully!',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error updating display order:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update display order. Please try again.',
        severity: 'error',
      });
      // Revert to original order by refetching
      fetchTestimonials();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Testimonial Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Testimonial
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Drag and drop to reorder testimonials
        </Typography>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="testimonials">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <Grid container spacing={3}>
                  {testimonials.map((testimonial, index) => (
                    <Draggable
                      key={testimonial.id.toString()}
                      draggableId={testimonial.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Card
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative',
                              opacity: testimonial.isActive ? 1 : 0.6,
                            }}
                          >
                            <Box
                              {...provided.dragHandleProps}
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                cursor: 'grab',
                                color: 'text.secondary',
                              }}
                            >
                              <DragIndicatorIcon />
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ mr: 2 }}>
                                  {testimonial.avatar || testimonial.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="h6" component="div">
                                    {testimonial.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {testimonial.role}, {testimonial.company}
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                                "{testimonial.quote}"
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                  Status:
                                </Typography>
                                {testimonial.isActive ? (
                                  <Chip
                                    label="Active"
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                  />
                                ) : (
                                  <Chip
                                    label="Inactive"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </CardContent>
                            <Divider />
                            <CardActions>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleOpenDialog(testimonial)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={testimonial.isActive ? 'Deactivate' : 'Activate'}>
                                <IconButton
                                  size="small"
                                  color={testimonial.isActive ? 'warning' : 'success'}
                                  onClick={() => handleToggleActive(testimonial.id, testimonial.isActive)}
                                >
                                  {testimonial.isActive ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(testimonial.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </CardActions>
                          </Card>
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Grid>
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Name"
                fullWidth
                value={currentTestimonial.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="role"
                label="Role"
                fullWidth
                value={currentTestimonial.role}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="company"
                label="Company"
                fullWidth
                value={currentTestimonial.company}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="quote"
                label="Testimonial Quote"
                fullWidth
                multiline
                rows={4}
                value={currentTestimonial.quote}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="avatar"
                label="Avatar URL (optional)"
                fullWidth
                value={currentTestimonial.avatar || ''}
                onChange={handleInputChange}
                helperText="Leave blank to use initials"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentTestimonial.isActive}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!currentTestimonial.name || !currentTestimonial.role || !currentTestimonial.company || !currentTestimonial.quote}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TestimonialManagement;
