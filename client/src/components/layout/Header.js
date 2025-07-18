import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useTheme,
  Fade,
  Avatar,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Science as ScienceIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const pages = [
  { title: 'Home', path: '/' },
  { title: 'Services', path: '/services' },
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' },
  { title: 'Blog', path: '/blog' }
];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Handle scroll effect for glass morphism
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavMenuClick = (path) => {
    handleCloseNavMenu();
    navigate(path);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        background: isScrolled 
          ? 'rgba(255, 255, 255, 0.95)' 
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isScrolled ? 'rgba(30, 58, 138, 0.12)' : 'rgba(30, 58, 138, 0.08)'}`,
        boxShadow: isScrolled 
          ? '0 8px 32px rgba(30, 58, 138, 0.12)' 
          : '0 4px 24px rgba(30, 58, 138, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo with icon for larger screens */}
          <Box 
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
          >
            <Avatar 
              sx={{ 
                mr: 2, 
                background: theme.gradients.primary,
                width: 40,
                height: 40,
              }}
            >
              <ScienceIcon sx={{ color: 'white' }} />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: theme.gradients.primary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                }}
              >
                Analytical Testing Laboratory
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                }}
              >
                Precision • Innovation • Excellence
              </Typography>
            </Box>
          </Box>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: 'rgba(30, 58, 138, 0.04)',
                }
              }}
            >
              {Boolean(anchorElNav) ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              TransitionComponent={Fade}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(30, 58, 138, 0.08)',
                  mt: 1,
                  minWidth: 200,
                }
              }}
            >
              {pages.map((page, index) => (
                <MenuItem 
                  key={page.title} 
                  onClick={() => handleNavMenuClick(page.path)}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: '12px',
                    mx: 1,
                    my: 0.5,
                    background: isActivePage(page.path) ? 'rgba(30, 58, 138, 0.08)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(30, 58, 138, 0.08)',
                    }
                  }}
                >
                  <Typography 
                    textAlign="center" 
                    sx={{ 
                      fontWeight: isActivePage(page.path) ? 600 : 400,
                      color: isActivePage(page.path) ? theme.palette.primary.main : theme.palette.text.primary,
                    }}
                  >
                    {page.title}
                  </Typography>
                </MenuItem>
              ))}
              
              {/* Mobile auth section */}
              <Divider sx={{ mx: 2, my: 1 }} />
              {isAuthenticated ? (
                <>
                  <MenuItem onClick={handleAdminClick} sx={{ py: 1.5, px: 3, borderRadius: '12px', mx: 1, my: 0.5 }}>
                    <DashboardIcon sx={{ mr: 2, fontSize: 20 }} />
                    <Typography>Admin Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogoutClick} sx={{ py: 1.5, px: 3, borderRadius: '12px', mx: 1, my: 0.5 }}>
                    <ExitToAppIcon sx={{ mr: 2, fontSize: 20 }} />
                    <Typography>Logout</Typography>
                  </MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleLoginClick} sx={{ py: 1.5, px: 3, borderRadius: '12px', mx: 1, my: 0.5 }}>
                  <Typography sx={{ fontWeight: 500 }}>Login</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Logo for mobile screens */}
          <Box 
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Avatar 
              sx={{ 
                mr: 1.5, 
                background: theme.gradients.primary,
                width: 32,
                height: 32,
              }}
            >
              <ScienceIcon sx={{ color: 'white', fontSize: 20 }} />
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: theme.gradients.primary,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ATL
            </Typography>
          </Box>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                sx={{ 
                  px: 3,
                  py: 1.5,
                  borderRadius: '12px',
                  color: isActivePage(page.path) ? theme.palette.primary.main : theme.palette.text.primary,
                  fontWeight: isActivePage(page.path) ? 600 : 500,
                  background: isActivePage(page.path) ? 'rgba(30, 58, 138, 0.08)' : 'transparent',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(30, 58, 138, 0.08)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Desktop auth buttons */}
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Button
                  onClick={handleAdminClick}
                  startIcon={<DashboardIcon />}
                  sx={{ 
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    px: 3,
                    py: 1.5,
                    borderRadius: '12px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(30, 58, 138, 0.08)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogoutClick}
                  variant="outlined"
                  startIcon={<ExitToAppIcon />}
                  sx={{ 
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: 'rgba(30, 58, 138, 0.04)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLoginClick}
                variant="contained"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  fontWeight: 500,
                  background: theme.gradients.primary,
                  boxShadow: 'none',
                  '&:hover': {
                    background: theme.gradients.primary,
                    boxShadow: '0 4px 14px 0 rgba(30, 58, 138, 0.25)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
