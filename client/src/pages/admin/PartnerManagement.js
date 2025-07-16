import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
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
  FormControlLabel,
  Switch,
  Grid,
  Avatar,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  Divider,
  useTheme,
  TablePagination,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const PartnerManagement = () => {
  const theme = useTheme();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    isActive: true
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [reorderMode, setReorderMode] = useState(false);

  // Fetch partners on component mount
  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/partners');
      setPartners(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching partners:', error);
      setError('Failed to fetch partners. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (partner = null) => {
    if (partner) {
      setCurrentPartner(partner);
      setFormData({
        name: partner.name,
        website: partner.website || '',
        description: partner.description || '',
        isActive: partner.isActive
      });
      setLogoPreview(partner.logo ? `${partner.logo}` : null);
    } else {
      setCurrentPartner(null);
      setFormData({
        name: '',
        website: '',
        description: '',
        isActive: true
      });
      setLogoPreview(null);
      setLogoFile(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPartner(null);
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleOpenDeleteDialog = (partner) => {
    setCurrentPartner(partner);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentPartner(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isActive' ? checked : value
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('website', formData.website);
      formDataObj.append('description', formData.description);
      formDataObj.append('isActive', formData.isActive);
      
      if (logoFile) {
        formDataObj.append('logo', logoFile);
      }

      let response;
      if (currentPartner) {
        // Update existing partner
        response = await axios.put(`/api/admin/partners/${currentPartner.id}`, formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSnackbar({
          open: true,
          message: 'Partner updated successfully',
          severity: 'success'
        });
      } else {
        // Create new partner
        response = await axios.post('/api/admin/partners', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSnackbar({
          open: true,
          message: 'Partner created successfully',
          severity: 'success'
        });
      }

      handleCloseDialog();
      fetchPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
      setSnackbar({
        open: true,
        message: `Error: ${error.response?.data?.message || 'Failed to save partner'}`,
        severity: 'error'
      });
    }
  };

  const handleDeletePartner = async () => {
    try {
      await axios.delete(`/api/admin/partners/${currentPartner.id}`);
      setSnackbar({
        open: true,
        message: 'Partner deleted successfully',
        severity: 'success'
      });
      handleCloseDeleteDialog();
      fetchPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
      setSnackbar({
        open: true,
        message: `Error: ${error.response?.data?.message || 'Failed to delete partner'}`,
        severity: 'error'
      });
    }
  };

  const handleToggleActive = async (partner) => {
    try {
      const formDataObj = new FormData();
      formDataObj.append('isActive', !partner.isActive);
      
      await axios.put(`/api/admin/partners/${partner.id}`, formDataObj);
      
      setSnackbar({
        open: true,
        message: `Partner ${!partner.isActive ? 'activated' : 'deactivated'} successfully`,
        severity: 'success'
      });
      
      fetchPartners();
    } catch (error) {
      console.error('Error toggling partner status:', error);
      setSnackbar({
        open: true,
        message: `Error: ${error.response?.data?.message || 'Failed to update partner status'}`,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleReorderMode = () => {
    setReorderMode(!reorderMode);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(partners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update display order
    const updatedItems = items.map((item, index) => ({
      ...item,
      displayOrder: index
    }));
    
    setPartners(updatedItems);
    
    try {
      await axios.post('/api/admin/partners/display-order', {
        partners: updatedItems.map((item, index) => ({
          id: item.id,
          displayOrder: index
        }))
      });
      
      setSnackbar({
        open: true,
        message: 'Display order updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating display order:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update display order',
        severity: 'error'
      });
      fetchPartners(); // Revert to original order
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Industry Partners Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color={reorderMode ? "secondary" : "primary"}
            onClick={handleToggleReorderMode}
            sx={{ mr: 2 }}
          >
            {reorderMode ? "Exit Reorder Mode" : "Reorder Partners"}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New Partner
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {reorderMode ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="partners">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ mb: 4 }}
              >
                <Grid container spacing={3}>
                  {partners.map((partner, index) => (
                    <Draggable key={partner.id} draggableId={partner.id.toString()} index={index}>
                      {(provided) => (
                        <Grid item xs={12} sm={6} md={4}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card 
                            sx={{ 
                              position: 'relative',
                              border: '1px solid',
                              borderColor: 'divider',
                              '&:hover': {
                                boxShadow: theme.shadows[8]
                              }
                            }}
                          >
                            <Box sx={{ 
                              position: 'absolute', 
                              top: 10, 
                              right: 10, 
                              zIndex: 1,
                              display: 'flex',
                              gap: 1
                            }}>
                              <Chip 
                                label={index + 1} 
                                color="primary" 
                                size="small" 
                                sx={{ fontWeight: 'bold' }}
                              />
                              {!partner.isActive && (
                                <Chip 
                                  label="Inactive" 
                                  color="error" 
                                  size="small" 
                                  variant="outlined"
                                />
                              )}
                            </Box>
                            <CardMedia
                              component="div"
                              sx={{
                                height: 140,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'background.default'
                              }}
                            >
                              {partner.logo ? (
                                <img 
                                  src={partner.logo} 
                                  alt={partner.name}
                                  style={{ 
                                    maxHeight: '100%', 
                                    maxWidth: '100%',
                                    objectFit: 'contain',
                                    padding: '16px'
                                  }}
                                />
                              ) : (
                                <Box sx={{ 
                                  display: 'flex', 
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  color: 'text.secondary'
                                }}>
                                  <ImageIcon sx={{ fontSize: 40 }} />
                                  <Typography variant="caption">No Logo</Typography>
                                </Box>
                              )}
                            </CardMedia>
                            <CardContent>
                              <Typography variant="h6" component="div" gutterBottom>
                                {partner.name}
                              </Typography>
                              {partner.website && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <LinkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary" noWrap>
                                    {partner.website}
                                  </Typography>
                                </Box>
                              )}
                              {partner.description && (
                                <Typography variant="body2" color="text.secondary" sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {partner.description}
                                </Typography>
                              )}
                            </CardContent>
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
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Logo</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Website</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      {partner.logo ? (
                        <Avatar
                          src={partner.logo}
                          alt={partner.name}
                          variant="rounded"
                          sx={{ width: 60, height: 60, objectFit: 'contain' }}
                        />
                      ) : (
                        <Avatar
                          variant="rounded"
                          sx={{ width: 60, height: 60, bgcolor: 'grey.200' }}
                        >
                          <ImageIcon color="action" />
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>{partner.name}</TableCell>
                    <TableCell>
                      {partner.website ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinkIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {partner.website}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No website
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={partner.isActive ? 'Active' : 'Inactive'}
                        color={partner.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{partner.displayOrder}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={partner.isActive ? 'Deactivate' : 'Activate'}>
                        <IconButton
                          color={partner.isActive ? 'success' : 'default'}
                          onClick={() => handleToggleActive(partner)}
                        >
                          {partner.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(partner)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(partner)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {partners.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        No partners found. Add your first partner!
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={partners.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Add/Edit Partner Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentPartner ? 'Edit Partner' : 'Add New Partner'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      bgcolor: 'background.default'
                    }}
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          padding: '16px'
                        }}
                      />
                    ) : (
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <ImageIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          No logo uploaded
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                  >
                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Partner Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 3 }}
                />
                <TextField
                  margin="dense"
                  name="website"
                  label="Website URL"
                  type="url"
                  fullWidth
                  variant="outlined"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  helperText="Optional: Enter the partner's website URL"
                  sx={{ mb: 3 }}
                />
                <TextField
                  margin="dense"
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  value={formData.description}
                  onChange={handleInputChange}
                  helperText="Optional: Provide a brief description of the partner"
                  sx={{ mb: 3 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the partner "{currentPartner?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeletePartner} color="error" variant="contained">
            Delete
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PartnerManagement;
