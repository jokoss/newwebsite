import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  FormControlLabel,
  Switch,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  InputAdornment,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // 'admin' or 'user'
    isActive: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { currentUser, isAdmin } = useAuth();
  const theme = useTheme();

  // Fetch users on component mount
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setError('You do not have permission to access this page.');
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // In a real application, you would fetch this data from your API
      // const response = await axios.get('/api/users');
      // setUsers(response.data.data);
      
      // For demo purposes, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers([
        { 
          id: 1, 
          username: 'admin',
          name: 'Administrator',
          email: 'admin@example.com',
          role: 'admin',
          isActive: true,
          createdAt: '2025-01-01'
        },
        { 
          id: 2, 
          username: 'sjohnson',
          name: 'Sarah Johnson',
          email: 'sjohnson@example.com',
          role: 'admin',
          isActive: true,
          createdAt: '2025-03-15'
        },
        { 
          id: 3, 
          username: 'mrodriguez',
          name: 'Michael Rodriguez',
          email: 'mrodriguez@example.com',
          role: 'user',
          isActive: true,
          createdAt: '2025-04-20'
        },
        { 
          id: 4, 
          username: 'echen',
          name: 'Emily Chen',
          email: 'echen@example.com',
          role: 'user',
          isActive: false,
          createdAt: '2025-05-10'
        }
      ]);
      
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    } else {
      setSelectedUser(null);
      setFormData({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        isActive: true
      });
    }
    setFormErrors({});
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      isActive: true
    });
    setShowPassword(false);
    setFormErrors({});
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleFormChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? checked : value
    }));
    
    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // If password changes, check confirmPassword validity
    if (name === 'password' && formData.confirmPassword && formData.confirmPassword !== value) {
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
    } else if (name === 'password' && formData.confirmPassword && formData.confirmPassword === value) {
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
    
    // If confirmPassword changes, check against password
    if (name === 'confirmPassword' && value !== formData.password) {
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
    } else if (name === 'confirmPassword' && value === formData.password) {
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers and underscores';
    }
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!selectedUser) {
      // Only validate password for new users
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (formData.password) {
      // If updating user and password is provided, validate it
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
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
      const userData = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive
      };
      
      if (formData.password) {
        userData.password = formData.password;
      }
      
      if (selectedUser) {
        // Update existing user
        // await axios.put(`/api/users/${selectedUser.id}`, userData);
        
        // For demo, update the local state
        setUsers(users.map(user => 
          user.id === selectedUser.id ? { ...user, ...userData } : user
        ));
        
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success'
        });
      } else {
        // Create new user
        // const response = await axios.post('/api/users', userData);
        
        // For demo, add to local state with a fake ID
        const newId = Math.max(...users.map(u => u.id), 0) + 1;
        const newUser = { 
          id: newId, 
          ...userData,
          createdAt: new Date().toISOString().split('T')[0]
        };
        
        setUsers([...users, newUser]);
        
        setSnackbar({
          open: true,
          message: 'User created successfully',
          severity: 'success'
        });
      }
      
      handleCloseForm();
    } catch (err) {
      console.error('Error saving user:', err);
      setSnackbar({
        open: true,
        message: 'Error saving user. Please try again.',
        severity: 'error'
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    // Prevent deleting the currently logged in user
    if (selectedUser.id === currentUser?.id) {
      setSnackbar({
        open: true,
        message: 'You cannot delete your own account.',
        severity: 'error'
      });
      handleCloseDeleteDialog();
      return;
    }
    
    try {
      // In a real application, you would delete via API
      // await axios.delete(`/api/users/${selectedUser.id}`);
      
      // For demo, filter out the deleted user
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting user:', err);
      setSnackbar({
        open: true,
        message: 'Error deleting user. Please try again.',
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Manage Users
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add User
        </Button>
      </Box>
      
      {users.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Users Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Click the "Add User" button to create your first user.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => handleOpenForm()}
          >
            Add User
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell width={120} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id} 
                  hover
                  sx={user.id === currentUser?.id ? { bgcolor: 'rgba(0, 0, 0, 0.04)' } : {}}
                >
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created: {user.createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role === 'admin' ? 'Administrator' : 'User'} 
                      color={user.role === 'admin' ? 'primary' : 'default'} 
                      size="small" 
                      variant={user.role === 'admin' ? 'filled' : 'outlined'} 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isActive ? 'Active' : 'Inactive'} 
                      color={user.isActive ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit User">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenForm(user)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(user)}
                        size="small"
                        disabled={user.id === currentUser?.id} // Can't delete yourself
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Add/Edit User Form Dialog */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                id="username"
                name="username"
                label="Username"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.username}
                onChange={handleFormChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
                required
                disabled={selectedUser !== null} // Can't change username for existing users
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="name"
                name="name"
                label="Full Name"
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
                id="email"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={handleFormChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="password"
                name="password"
                label={selectedUser ? "New Password (leave blank to keep current)" : "Password"}
                type={showPassword ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={formData.password}
                onChange={handleFormChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required={!selectedUser}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleFormChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                required={!selectedUser || !!formData.password}
                disabled={selectedUser && !formData.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
                <FormHelperText>
                  Administrators have full access to all features
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleFormChange}
                      name="isActive"
                    />
                  }
                  label="Active Account"
                />
                <FormHelperText>
                  Inactive accounts cannot log in
                </FormHelperText>
              </FormControl>
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
            Are you sure you want to delete the user "{selectedUser?.name} ({selectedUser?.username})"? 
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

export default UserManagement;
