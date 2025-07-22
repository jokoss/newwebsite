import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme, Snackbar, Alert, Zoom, Typography, Fade } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import CustomizeButton from '../customize/CustomizeButton';

const MainLayout = ({ setTheme }) => {
  const theme = useTheme();
  const [themeChanged, setThemeChanged] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [pageTransition, setPageTransition] = useState(false);
  
  // Enable page transition effect on mount
  useEffect(() => {
    setPageTransition(true);
  }, []);
  
  // Function to handle theme change with notification
  const handleThemeChange = (newTheme) => {
    // Get theme name from the theme key
    const themeNames = {
      default: 'Default',
      brown: 'Brown',
      dark: 'Dark Mode',
      black: 'Black',
      lightGreen: 'Light Green',
      darkGreen: 'Dark Green',
      brownGreen: 'Brown & Green',
      blackGreen: 'Black & Green'
    };
    
    setTheme(newTheme);
    setThemeName(themeNames[newTheme] || newTheme);
    setThemeChanged(true);
  };

  // Close the notification
  const handleCloseSnackbar = () => {
    setThemeChanged(false);
  };

  return (
    <Fade in={pageTransition} timeout={800}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          background: theme.palette.background.default,
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Header />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            paddingTop: '88px', // Header height + some padding
            minHeight: 'calc(100vh - 88px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Outlet />
        </Box>
        
        {/* Customize Button - Fixed Position with Debug */}
        <Box 
          sx={{ 
            position: 'fixed', 
            bottom: { xs: 16, md: 24 }, 
            right: { xs: 16, md: 24 }, 
            zIndex: 99999,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
            // Debug background to ensure visibility
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            padding: 1,
            borderRadius: 2,
          }}
        >
          <CustomizeButton setTheme={handleThemeChange} />
        </Box>
        
        <Footer />
        
        {/* Enhanced Theme change notification */}
        <Snackbar
          open={themeChanged}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          TransitionComponent={Zoom}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            variant="filled"
            icon={false}
            sx={{ 
              width: '100%',
              transition: 'all 0.3s ease',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              py: 1,
              px: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  borderRadius: '50%', 
                  background: theme.palette.primary.main,
                  mr: 1.5,
                  border: '2px solid white',
                  boxShadow: '0 0 0 2px rgba(255,255,255,0.2)'
                }} 
              />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Theme changed to <strong>{themeName}</strong>
              </Typography>
            </Box>
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default MainLayout;
