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
import CustomizeButton from '../customize/CustomizeButton';

const drawerWidth = 280;

const AdminLayout = ({ setTheme }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isSuperAdmin } = useAuth();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const getInitialDrawerState = () => {
    const savedState = localStorage.getItem('adminSidebarOpen');
    if (savedState !== null) {
      return savedState === 'true';
    }
    return isDesktop;
  };
  
  const [open, setOpen] = useState(getInitialDrawerState());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  useEffect(() => {
    console.log('🔧 AdminLayout mounted successfully!');
  }, []);
  
  useEffect(() => {
    localStorage.setItem('adminSidebarOpen', open.toString());
  }, [open]);
  
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
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
    { text: 'Tests', icon: <ScienceIcon />, path: '/admin/tests' },
    { text: 'Certifications', icon: <VerifiedUserIcon />, path: '/admin/certifications' },
    { text: 'Images', icon: <ImageIcon />, path: '/admin/images' },
    { text: 'Partners', icon: <PeopleIcon />, path: '/admin/partners' },
    { text: 'Blog', icon: <ArticleIcon />, path: '/admin/blog' },
    { text: 'Testimonials', icon: <FormatQuoteIcon />, path: '/admin/testimonials' }
  ];

  if (isSuperAdmin) {
    menuItems.push({ text: 'Users', icon: <PeopleIcon />, path: '/admin/users' });
  }
  
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'visible' }}>
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
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
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
        </Toolbar>
      </AppBar>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, 
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
      
      {/* CRITICAL FIX: CustomizeButton for AdminLayout */}
      <Box 
        sx={{ 
          position: 'fixed !important', 
          bottom: { xs: 80, md: 24 },
          right: { xs: 16, md: 24 }, 
          zIndex: '999999 !important',
          transition: 'all 0.3s ease',
          '&:hover': { transform: 'scale(1.05)' },
          backgroundColor: 'rgba(255, 0, 0, 0.3) !important',
          padding: '8px !important',
          borderRadius: '8px !important',
          border: '2px solid red !important',
          minWidth: '60px !important',
          minHeight: '60px !important',
          display: 'flex !important',
          alignItems: 'center !important',
          justifyContent: 'center !important',
        }}
      >
        <CustomizeButton setTheme={setTheme} />
      </Box>
    </Box>
  );
};

export default AdminLayout;
