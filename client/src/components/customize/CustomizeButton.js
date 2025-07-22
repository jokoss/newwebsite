import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  Typography, 
  Grid, 
  Tooltip, 
  Fade,
  useTheme,
  Paper,
  Zoom,
  Badge,
  IconButton,
  Divider
} from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import PaletteIcon from '@mui/icons-material/Palette';
import CheckIcon from '@mui/icons-material/Check';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import CloseIcon from '@mui/icons-material/Close';

// Enhanced theme color mapping for the color swatches
const themeColors = {
  default: {
    primary: '#7C321D',
    secondary: '#A85C2E',
    background: '#F8FAFC',
    name: 'Default',
    description: 'Classic brown theme'
  },
  brown: {
    primary: '#7C321D',
    secondary: '#A85C2E',
    background: '#F8FAFC',
    name: 'Brown',
    description: 'Warm earthy tones'
  },
  dark: {
    primary: '#7C321D',
    secondary: '#A85C2E',
    background: '#111827',
    name: 'Dark',
    description: 'Dark mode with brown accents'
  },
  black: {
    primary: '#000000',
    secondary: '#333333',
    background: '#F8FAFC',
    name: 'Black',
    description: 'Sleek black & white'
  },
  lightGreen: {
    primary: '#A5C882',
    secondary: '#7D9B63',
    background: '#F8FAFC',
    name: 'Light Green',
    description: 'Fresh & natural'
  },
  darkGreen: {
    primary: '#4A6741',
    secondary: '#5D7A41',
    background: '#F8FAFC',
    name: 'Dark Green',
    description: 'Deep forest tones'
  },
  brownGreen: {
    primary: '#7C321D',
    secondary: '#5D7A41',
    background: '#F8FAFC',
    name: 'Brown & Green',
    description: 'Earth & nature blend'
  },
  blackGreen: {
    primary: '#000000',
    secondary: '#5D7A41',
    background: '#F8FAFC',
    name: 'Black & Green',
    description: 'Modern & natural'
  }
};

const ColorSwatch = ({ color, onClick, isSelected, name }) => {
  const theme = useTheme();
  
  return (
    <Tooltip 
      title={
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{name}</Typography>
          <Typography variant="caption">{color.description}</Typography>
        </Box>
      } 
      arrow 
      placement="top"
      TransitionComponent={Zoom}
    >
      <Paper
        elevation={isSelected ? 4 : 1}
        onClick={onClick}
        sx={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          border: isSelected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
          boxShadow: isSelected ? `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}` : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          },
          background: color.background || '#F8FAFC',
        }}
      >
        {/* Primary color */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '60%',
            height: '60%',
            background: color.primary,
            borderBottomRightRadius: '12px',
          }}
        />
        
        {/* Secondary color */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '60%',
            height: '60%',
            background: color.secondary,
            borderTopLeftRadius: '12px',
          }}
        />
        
        {/* Selected checkmark */}
        {isSelected && (
          <Box 
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <CheckIcon sx={{ fontSize: '16px', color: theme.palette.primary.main }} />
          </Box>
        )}
      </Paper>
    </Tooltip>
  );
};

const CustomizeButton = ({ setTheme }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Try to get the saved theme from localStorage
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme || 'default';
  });
  const theme = useTheme();
  const [showBadge, setShowBadge] = useState(false);

  // Show badge animation on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBadge(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowBadge(false);
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowBadge(false); // Hide badge when menu is opened
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (themeKey) => {
    setTheme(themeKey);
    setCurrentTheme(themeKey);
    localStorage.setItem('themeMode', themeKey); // Save to localStorage
    handleClose();
  };

  return (
    <Box>
      <Tooltip 
        title={
          <Box sx={{ p: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Customize Colors</Typography>
            <Typography variant="caption">Change the website's color theme</Typography>
          </Box>
        } 
        arrow 
        placement="left"
      >
        <Badge
          color="secondary"
          variant="dot"
          invisible={!showBadge}
          overlap="circular"
          sx={{
            '& .MuiBadge-badge': {
              transform: 'scale(1.5)',
              animation: showBadge ? 'pulse 1.5s infinite' : 'none',
            },
            '@keyframes pulse': {
              '0%': { transform: 'scale(1.5)' },
              '50%': { transform: 'scale(2)' },
              '100%': { transform: 'scale(1.5)' },
            }
          }}
        >
          <Paper
            elevation={4}
            sx={{
              borderRadius: '50%',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              },
            }}
          >
            <IconButton
              aria-controls="customize-menu"
              aria-haspopup="true"
              onClick={handleClick}
              size="large"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: 'white',
                width: 60,
                height: 60,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                },
              }}
            >
              <PaletteIcon fontSize="medium" />
            </IconButton>
          </Paper>
        </Badge>
      </Tooltip>
      
      <Menu
        id="customize-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 6,
          sx: {
            borderRadius: '24px',
            padding: '24px',
            minWidth: '320px',
            overflow: 'visible',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              zIndex: -1,
            },
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormatColorFillIcon sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Choose Your Theme
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={handleClose}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { 
                background: 'rgba(0,0,0,0.05)',
                color: 'text.primary'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {Object.entries(themeColors).map(([key, color]) => (
            <Grid item xs={6} sm={3} key={key} sx={{ display: 'flex', justifyContent: 'center' }}>
              <ColorSwatch 
                color={color} 
                onClick={() => handleThemeChange(key)}
                isSelected={currentTheme === key}
                name={color.name}
              />
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Changes apply instantly to the entire website
          </Typography>
          
          <Button 
            size="small" 
            variant="outlined" 
            onClick={handleClose}
            sx={{ 
              borderRadius: '20px',
              textTransform: 'none',
              px: 2,
              py: 0.5,
              fontSize: '0.75rem'
            }}
          >
            Close
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default CustomizeButton;
