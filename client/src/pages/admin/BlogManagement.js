import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    authorName: '',
    isPublished: false,
    schemaMarkup: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();

  // Fetch blog posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/blog');
      setPosts(response.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to fetch blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isPublished' ? checked : value
    });

    // Auto-generate slug from title if slug field is empty
    if (name === 'title' && (!formData.slug || formData.slug === '')) {
      setFormData({
        ...formData,
        title: value,
        slug: value.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
      });
    }

    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Handle rich text editor changes
  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      content
    });

    // Clear validation error when content is edited
    if (formErrors.content) {
      setFormErrors({
        ...formErrors,
        content: ''
      });
    }
  };

  // Handle schema markup changes
  const handleSchemaChange = (e) => {
    setFormData({
      ...formData,
      schemaMarkup: e.target.value
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }
    
    if (!formData.authorName.trim()) {
      errors.authorName = 'Author name is required';
    }
    
    if (formData.schemaMarkup) {
      try {
        JSON.parse(formData.schemaMarkup);
      } catch (e) {
        errors.schemaMarkup = 'Invalid JSON format';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('slug', formData.slug);
      formDataObj.append('content', formData.content);
      formDataObj.append('authorName', formData.authorName);
      formDataObj.append('isPublished', formData.isPublished);
      
      if (formData.schemaMarkup) {
        formDataObj.append('schemaMarkup', formData.schemaMarkup);
      }
      
      if (selectedFile) {
        formDataObj.append('featuredImage', selectedFile);
      }
      
      let response;
      
      if (currentPost) {
        // Update existing post
        response = await axios.put(`/api/admin/blog/${currentPost.id}`, formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setSnackbar({
          open: true,
          message: 'Blog post updated successfully!',
          severity: 'success'
        });
      } else {
        // Create new post
        response = await axios.post('/api/admin/blog', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setSnackbar({
          open: true,
          message: 'Blog post created successfully!',
          severity: 'success'
        });
      }
      
      // Close dialog and refresh posts
      setOpenDialog(false);
      fetchPosts();
      
    } catch (err) {
      console.error('Error saving blog post:', err);
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        const validationErrors = {};
        
        err.response.data.errors.forEach(error => {
          validationErrors[error.field] = error.message;
        });
        
        setFormErrors(validationErrors);
        
        setSnackbar({
          open: true,
          message: `Validation error: ${err.response.data.message}`,
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: `Error: ${err.response?.data?.message || 'Failed to save blog post'}`,
          severity: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!currentPost) return;
    
    try {
      setLoading(true);
      await axios.delete(`/api/admin/blog/${currentPost.id}`);
      
      setSnackbar({
        open: true,
        message: 'Blog post deleted successfully!',
        severity: 'success'
      });
      
      // Close dialog and refresh posts
      setOpenDeleteDialog(false);
      fetchPosts();
      
    } catch (err) {
      console.error('Error deleting blog post:', err);
      setSnackbar({
        open: true,
        message: `Error: ${err.response?.data?.message || 'Failed to delete blog post'}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Open dialog for creating a new post
  const handleOpenCreateDialog = () => {
    setCurrentPost(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      authorName: '',
      isPublished: false,
      schemaMarkup: ''
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setFormErrors({});
    setOpenDialog(true);
  };

  // Open dialog for editing an existing post
  const handleOpenEditDialog = async (post) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/blog/${post.id}`);
      const postData = response.data.data;
      
      setCurrentPost(postData);
      setFormData({
        title: postData.title || '',
        slug: postData.slug || '',
        content: postData.content || '',
        authorName: postData.authorName || '',
        isPublished: postData.isPublished || false,
        schemaMarkup: postData.schemaMarkup || ''
      });
      
      if (postData.featuredImage) {
        setPreviewUrl(postData.featuredImage);
      } else {
        setPreviewUrl('');
      }
      
      setSelectedFile(null);
      setFormErrors({});
      setOpenDialog(true);
      
    } catch (err) {
      console.error('Error fetching blog post details:', err);
      setSnackbar({
        open: true,
        message: 'Error fetching blog post details',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (post) => {
    setCurrentPost(post);
    setOpenDeleteDialog(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle preview
  const handlePreview = (post) => {
    window.open(`/blog/${post.slug}`, '_blank');
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Rich text editor modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Blog Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          New Post
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Published Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={24} sx={{ my: 2 }} />
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No blog posts found. Create your first post!
                  </TableCell>
                </TableRow>
              ) : (
                posts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {post.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {`/${post.slug}`}
                        </Typography>
                      </TableCell>
                      <TableCell>{post.authorName}</TableCell>
                      <TableCell>
                        <Chip
                          label={post.isPublished ? 'Published' : 'Draft'}
                          color={post.isPublished ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(post.publishedAt)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="View">
                          <IconButton
                            color="info"
                            onClick={() => handlePreview(post)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEditDialog(post)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(post)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={posts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentPost ? 'Edit Blog Post' : 'Create New Blog Post'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <TextField
                name="title"
                label="Title"
                fullWidth
                value={formData.title}
                onChange={handleInputChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="slug"
                label="Slug"
                fullWidth
                value={formData.slug}
                onChange={handleInputChange}
                error={!!formErrors.slug}
                helperText={formErrors.slug || 'URL-friendly identifier'}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                name="authorName"
                label="Author Name"
                fullWidth
                value={formData.authorName}
                onChange={handleInputChange}
                error={!!formErrors.authorName}
                helperText={formErrors.authorName}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Publish"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Content
              </Typography>
              <Box sx={{ mb: 1 }}>
                <ReactQuill
                  value={formData.content}
                  onChange={handleEditorChange}
                  modules={modules}
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              </Box>
              {formErrors.content && (
                <Typography color="error" variant="caption">
                  {formErrors.content}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Featured Image
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="featured-image-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="featured-image-upload">
                <Button variant="outlined" component="span">
                  Upload Image
                </Button>
              </label>
              {previewUrl && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Schema Markup (JSON-LD)
              </Typography>
              <TextField
                name="schemaMarkup"
                fullWidth
                multiline
                rows={4}
                value={formData.schemaMarkup}
                onChange={handleSchemaChange}
                error={!!formErrors.schemaMarkup}
                helperText={
                  formErrors.schemaMarkup ||
                  'Optional: JSON-LD schema markup for SEO'
                }
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the blog post "
            {currentPost?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
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

export default BlogManagement;
