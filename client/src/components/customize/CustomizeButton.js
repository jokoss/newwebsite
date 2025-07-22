import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  Typography, 
  Grid, 
  Tooltip, 
  IconButton,
  Paper
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import CheckIcon from '@mui/icons-material/Check';

// Simple theme colors - guaranteed to work without theme context
const themeColors = {
  default: { primary: '#7C321D', secondary: '#A85C2E', name: 'Default' },
  brown: { primary: '#7C321D', secondary: '#A85C2E', name: 'Brown' },
  dark: { primary: '#7C321D', secondary: '#A85C2E', name: 'Dark' },
  black: { primary: '#000000', secondary: '#333333', name: 'Black' },
  lightGreen: { primary: '#A5C882', secondary: '#7D9B63', name: 'Light Green' },
  darkGreen: { primary: '#4A6741', secondary: '#5D7A41', name: 'Dark Green' },
  brownGreen: { primary: '#7C321D', secondary: '#5D7A41', name: 'Brown & Green' },
  blackGreen: { primary: '#000000', secondary: '#5D7A41', name: 'Black & Green' },
  blue: { primary: '#1976D2', secondary: '#42A5F5', name: 'Blue' },
  navy: { primary: '#0D47A1', secondary: '#1565C0', name: 'Navy' },
  teal: { primary: '#00695C', secondary: '#26A69A', name: 'Teal' },
  purple: { primary: '#7B1FA2', secondary: '#AB47BC', name: 'Purple' },
  indigo: { primary: '#303F9F', secondary: '#5C6BC0', name: 'Indigo' },
  orange: { primary: '#F57C00', secondary: '#FF9800', name: 'Orange' },
  red: { primary: '#C62828', secondary: '#E53935', name: 'Red' },
  pink: { primary: '#C2185B', secondary: '#E91E63', name: 'Pink' },
  cyan: { primary: '#00838F', secondary: '#00ACC1', name: 'Cyan' },
  amber: { primary: '#FF8F00', secondary: '#FFC107', name: 'Amber' },
  deepOrange: { primary: '#D84315', secondary: '#FF5722', name: 'Deep Orange' },
  blueGrey: { primary: '#455A64', secondary: '#607D8B', name: 'Blue Grey' },
  emerald: { primary: '#047857', secondary: '#10B981', name: 'Emerald' },
  rose: { primary: '#BE185D', secondary: '#F43F5E', name: 'Rose' },
  violet: { primary: '#7C3AED', secondary: '#A78BFA', name: 'Violet' },
  slate: { primary: '#475569', secondary: '#64748B', name: 'Slate' },
  lime: { primary: '#65A30D', secondary: '#84CC16', name: 'Lime' },
  coral: { primary: '#DC2626', secondary: '#F87171', name: 'Coral' },
  mint: { primary: '#059669', secondary: '#34D399', name: 'Mint' },
  gold: { primary: '#D97706', secondary: '#F59E0B', name: 'Gold' }
};

const CustomizeButton = ({ setTheme }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('default');

  // Debug logging
  useEffect(() => {
    console.log('🎨 CustomizeButton mounted successfully!');
    console.log('🎨 setTheme function:', typeof setTheme);
    
    // Get saved theme
    const savedTheme = localStorage.getItem('themeMode') || 'default';
    setCurrentTheme(savedTheme);
    console.log('🎨 Current theme:', savedTheme);
  }, []);

  const handleClick = (event) => {
    console.log('🎨 Button clicked!');
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    console.log('🎨 Menu closed');
    setAnchorEl(null);
  };

  const handleThemeChange = (themeKey) => {
    console.log('🎨 Theme changing to:', themeKey);
    try {
      if (setTheme && typeof setTheme === 'function') {
        setTheme(themeKey);
        setCurrentTheme(themeKey);
        localStorage.setItem('themeMode', themeKey);
        console.log('🎨 Theme changed successfully!');
      } else {
        console.error('🎨 setTheme function not available');
      }
    } catch (error) {
      console.error('🎨 Error changing theme:', error);
    }
    handleClose();
  };

  // Simple color swatch component - no theme dependencies
  const ColorSwatch = ({ color, onClick, isSelected, name }) => (
    <Tooltip title={name} arrow>
      <Paper
        elevation={isSelected ? 4 : 1}
        onClick={onClick}
        sx={{
          width: 50,
          height: 50,
          borderRadius: 2,
          cursor: 'pointer',
          position: 'relative',
          border: isSelected ? '2px solid #7C321D' : '2px solid transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
          background: `linear-gradient(45deg, ${color.primary} 50%, ${color.secondary} 50%)`,
        }}
      >
        {isSelected && (
          <Box 
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckIcon sx={{ fontSize: 14, color: '#7C321D' }} />
          </Box>
        )}
      </Paper>
    </Tooltip>
  );

  console.log('🎨 Rendering CustomizeButton...');

  return (
    <Box>
      {/* Debug indicator - visible red dot to confirm component renders */}
      <Box
        sx={{
          position: 'absolute',
          top: -5,
          right: -5,
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: 'red',
          zIndex: 10000,
        }}
      />
      
      <Tooltip title="Customize Colors" arrow placement="left">
        <IconButton
          aria-label="customize colors"
          onClick={handleClick}
          sx={{
            width: 60,
            height: 60,
            backgroundColor: '#7C321D',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: '#5E2516',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            minWidth: 320,
            maxWidth: 400,
            maxHeight: 500,
            overflowY: 'auto',
          }
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          Choose Theme
        </Typography>
        
        <Grid container spacing={1.5}>
          {Object.entries(themeColors).map(([key, color]) => (
            <Grid item xs={2.4} key={key}>
              <ColorSwatch 
                color={color} 
                onClick={() => handleThemeChange(key)}
                isSelected={currentTheme === key}
                name={color.name}
              />
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button size="small" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default CustomizeButton;
