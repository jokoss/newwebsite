import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        background: theme.palette.background.default,
      }}
    >
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          // Add top spacing to account for fixed header
          paddingTop: '88px', // Header height + some padding
          minHeight: 'calc(100vh - 88px)',
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
