import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Container,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  Fade,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Science as ScienceIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Image as ImageIcon,
  VerifiedUser as VerifiedUserIcon,
  ChevronLeft as ChevronLeftIcon,
  Public as PublicIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Article as ArticleIcon,
  FormatQuote as FormatQuoteIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const AdminLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isSuperAdmin } = useAuth();
  
  // Use MUI's useMediaQuery for better responsive behavior
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Get initial drawer state from localStorage or default based on screen size
  const getInitialDrawerState = () => {
    const savedState = localStorage.getItem('adminSidebarOpen');
    if (savedState !== null) {
      return savedState === 'true';
    }
    return isDesktop; // Default open on desktop, closed on smaller screens
  };
  
  const [open, setOpen] = useState(getInitialDrawerState());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Save drawer state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('adminSidebarOpen', open.toString());
  }, [open]);
  
  // Close mobile drawer when navigating to a new page
  useEffect(() => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile, mobileOpen]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate('/admin/profile');
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin'
    },
    {
      text: 'Categories',
      icon: <CategoryIcon />,
      path: '/admin/categories'
    },
    {
      text: 'Tests',
      icon: <ScienceIcon />,
      path: '/admin/tests'
    },
    {
      text: 'Certifications',
      icon: <VerifiedUserIcon />,
      path: '/admin/certifications'
    },
    {
      text: 'Images',
      icon: <ImageIcon />,
      path: '/admin/images'
    },
    {
      text: 'Partners',
      icon: <PeopleIcon />,
      path: '/admin/partners'
    },
    {
      text: 'Blog',
      icon: <ArticleIcon />,
      path: '/admin/blog'
    },
    {
      text: 'Testimonials',
      icon: <FormatQuoteIcon />,
      path: '/admin/testimonials'
    }
  ];

  // Add users menu item for superadmins only
  if (isSuperAdmin) {
    menuItems.push({
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/admin/users'
    });
  }
  
  // Determine if a menu item is active
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: theme.gradients.primary,
          boxShadow: theme.customShadows.navbar,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && !isMobile && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 }, px: { xs: 2, sm: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)'
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {open && !isMobile ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: '0.5px',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {isMobile ? 'Admin Panel' : 'Analytical Testing Laboratory - Admin'}
            {isSuperAdmin && (
              <Chip 
                label="Super Admin" 
                size="small" 
                color="secondary"
                sx={{ 
                  ml: 1, 
                  height: 24, 
                  fontWeight: 600,
                  display: { xs: 'none', md: 'flex' }
                }} 
              />
            )}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="View Website">
              <IconButton 
                color="inherit" 
                sx={{ mr: 1 }}
                onClick={() => navigate('/')}
              >
                <PublicIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ 
                  ml: { xs: 0, sm: 1 },
                  border: '2px solid rgba(255,255,255,0.2)',
                  p: '4px'
                }}
                aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'secondary.main',
                    fontWeight: 'bold'
                  }}
                >
                  {currentUser?.username?.charAt(0)?.toUpperCase() || 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: 'visible',
                borderRadius: 2,
                minWidth: 200,
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {currentUser?.username || 'Admin User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser?.email || 'admin@example.com'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <PersonIcon fontSize="small" color="primary" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => {}}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" color="primary" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {/* Mobile drawer - temporary variant */}
      <Drawer
        variant="temporary"
        open={isMobile && mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            boxShadow: theme.customShadows.navbar,
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2, 
          background: theme.gradients.primary,
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Admin Panel
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ overflow: 'auto' }}>
          <List component="nav" sx={{ px: 2, py: 1 }}>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => navigate(item.path)}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? 'white' : 'primary.main', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive(item.path) ? 600 : 500,
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <List component="nav" sx={{ px: 2, py: 1 }}>
            <ListItem 
              button 
              onClick={() => navigate('/')}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: 'secondary.light',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                }
              }}
            >
              <ListItemIcon sx={{ color: 'secondary.main', minWidth: 40 }}>
                <PublicIcon />
              </ListItemIcon>
              <ListItemText primary="View Website" />
            </ListItem>
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                }
              }}
            >
              <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Desktop/Tablet drawer - persistent variant */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: open ? drawerWidth : theme.spacing(9),
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: open ? drawerWidth : theme.spacing(9),
            overflowX: 'hidden',
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0,0,0,0.08)',
            boxShadow: open ? theme.customShadows.navbar : 'none',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List component="nav" sx={{ px: open ? 2 : 1, py: 1 }}>
            {menuItems.map((item) => (
              <Tooltip 
                title={!open ? item.text : ""} 
                placement="right" 
                key={item.text}
              >
                <ListItem 
                  button 
                  onClick={() => navigate(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    px: open ? 2 : 1.5,
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    }
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isActive(item.path) ? 'white' : 'primary.main', 
                      minWidth: 40,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontWeight: isActive(item.path) ? 600 : 500,
                        noWrap: true
                      }}
                    />
                  )}
                </ListItem>
              </Tooltip>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <List component="nav" sx={{ px: open ? 2 : 1, py: 1 }}>
            <Tooltip title={!open ? "View Website" : ""} placement="right">
              <ListItem 
                button 
                onClick={() => navigate('/')}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: open ? 2 : 1.5,
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  '&:hover': {
                    backgroundColor: 'secondary.light',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: 'secondary.main', 
                    minWidth: 40,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <PublicIcon />
                </ListItemIcon>
                {open && <ListItemText primary="View Website" />}
              </ListItem>
            </Tooltip>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, 
          width: `calc(100% - ${open ? drawerWidth : theme.spacing(9)}px)`,
          ml: open ? `${drawerWidth}px` : theme.spacing(9),
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflow: 'auto',
          height: '100vh',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Fade in={true} timeout={800}>
          <Container 
            maxWidth="xl" 
            sx={{ 
              mt: { xs: 2, sm: 4 }, 
              mb: 4, 
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Outlet />
          </Container>
        </Fade>
      </Box>
      
      {/* Mobile drawer toggle button - fixed position */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1200,
          }}
        >
          <Tooltip title={mobileOpen ? "Close menu" : "Open menu"}>
            <IconButton
              color="primary"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 4,
                '&:hover': {
                  bgcolor: 'background.paper',
                  boxShadow: 6,
                },
                width: 56,
                height: 56,
              }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default AdminLayout;
