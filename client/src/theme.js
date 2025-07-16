import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Modern, sophisticated color palette for analytical laboratory
// Inspired by leading laboratory websites like Eurofins, SGS, and Bureau Veritas
const palette = {
  primary: {
    main: '#0B4D83', // Deep scientific blue
    light: '#2D7CB6',
    dark: '#083A64',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#00A3B4', // Teal/cyan for scientific precision
    light: '#33C1CF',
    dark: '#007D8A',
    contrastText: '#FFFFFF',
  },
  tertiary: {
    main: '#7E57C2', // Sophisticated purple for innovation
    light: '#9E77DB',
    dark: '#5E35B1',
  },
  success: {
    main: '#10B981', // Green for environmental focus
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.95)',
    gradient: 'linear-gradient(135deg, #0B4D83 0%, #00A3B4 100%)',
    overlay: 'rgba(11, 77, 131, 0.95)',
    light: '#F1F5F9',
    dark: '#0F172A',
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    muted: '#9CA3AF',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  divider: 'rgba(30, 58, 138, 0.08)',
  action: {
    hover: 'rgba(30, 58, 138, 0.04)',
    selected: 'rgba(30, 58, 138, 0.08)',
  },
};

// Modern typography system with improved readability
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  fontWeightExtraBold: 800,
  h1: {
    fontSize: '3.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    '@media (max-width:600px)': {
      fontSize: '2.5rem',
    },
  },
  h2: {
    fontSize: '2.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    '@media (max-width:600px)': {
      fontSize: '2rem',
    },
  },
  h3: {
    fontSize: '2.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
    '@media (max-width:600px)': {
      fontSize: '1.75rem',
    },
  },
  h4: {
    fontSize: '1.875rem',
    fontWeight: 600,
    lineHeight: 1.4,
    '@media (max-width:600px)': {
      fontSize: '1.5rem',
    },
  },
  h5: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    '@media (max-width:600px)': {
      fontSize: '1.25rem',
    },
  },
  h6: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  subtitle1: {
    fontSize: '1.125rem',
    lineHeight: 1.6,
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: '1rem',
    lineHeight: 1.6,
    fontWeight: 500,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.7,
    fontWeight: 400,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    fontWeight: 400,
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.9375rem',
    letterSpacing: '0.01em',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
    fontWeight: 400,
  },
};

// Enhanced spacing and shape system for modern design
const spacing = 8;
const shape = {
  borderRadius: 8,
  borderRadiusRounded: '50%',
};

// Sophisticated component overrides
const components = {
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        boxSizing: 'border-box',
      },
      html: {
        height: '100%',
        width: '100%',
      },
      body: {
        height: '100%',
        margin: 0,
        padding: 0,
        fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
      },
      '#root': {
        height: '100%',
        width: '100%',
      },
      '*::-webkit-scrollbar': {
        width: '8px',
      },
      '*::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '*::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: '4px',
      },
      '*::-webkit-scrollbar-thumb:hover': {
        background: '#a8a8a8',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 600,
        padding: '12px 24px',
        boxShadow: 'none',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.1)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover': {
          boxShadow: '0 8px 25px 0 rgba(11, 77, 131, 0.25)',
          transform: 'translateY(-2px)',
          '&::after': {
            opacity: 1,
          },
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      contained: {
        background: 'linear-gradient(135deg, #0B4D83 0%, #2D7CB6 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #083A64 0%, #0B4D83 100%)',
        },
      },
      containedSecondary: {
        background: 'linear-gradient(135deg, #00A3B4 0%, #33C1CF 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #007D8A 0%, #00A3B4 100%)',
        },
      },
      outlined: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
        },
      },
      sizeLarge: {
        padding: '16px 32px',
        fontSize: '1rem',
        borderRadius: '10px',
      },
      sizeSmall: {
        padding: '8px 16px',
        fontSize: '0.875rem',
        borderRadius: '6px',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        border: '1px solid rgba(11, 77, 131, 0.08)',
        background: '#FFFFFF',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(11, 77, 131, 0.06)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 25px 50px rgba(11, 77, 131, 0.12)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, #0B4D83 0%, #00A3B4 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        border: '1px solid rgba(30, 58, 138, 0.08)',
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: '0 2px 12px rgba(30, 58, 138, 0.08)',
      },
      elevation2: {
        boxShadow: '0 4px 24px rgba(30, 58, 138, 0.12)',
      },
      elevation3: {
        boxShadow: '0 8px 32px rgba(30, 58, 138, 0.16)',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          background: '#FAFBFC',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3B82F6',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1E3A8A',
            borderWidth: '2px',
          },
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(11, 77, 131, 0.08)',
        boxShadow: '0 4px 20px rgba(11, 77, 131, 0.06)',
        color: '#1F2937',
        zIndex: 1200,
      },
      colorPrimary: {
        background: 'linear-gradient(90deg, #0B4D83 0%, #083A64 100%)',
        color: '#FFFFFF',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: '1px solid rgba(11, 77, 131, 0.08)',
        boxShadow: '4px 0 24px rgba(11, 77, 131, 0.06)',
        background: '#FFFFFF',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        fontWeight: 500,
      },
      colorPrimary: {
        background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
        color: '#FFFFFF',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: '20px',
        border: '1px solid rgba(30, 58, 138, 0.08)',
        boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)',
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        overflow: 'hidden',
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
        '& .MuiTableCell-head': {
          fontWeight: 600,
          color: '#1F2937',
          borderBottom: '2px solid rgba(30, 58, 138, 0.08)',
        },
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: 'rgba(30, 58, 138, 0.02)',
        },
      },
    },
  },
};

// Create the modern theme
let theme = createTheme({
  palette,
  typography,
  spacing,
  shape,
  components,
  // Custom theme extensions
  customShadows: {
    card: '0 8px 32px rgba(11, 77, 131, 0.08)',
    hover: '0 25px 50px rgba(11, 77, 131, 0.12)',
    button: '0 8px 25px rgba(11, 77, 131, 0.25)',
    dialog: '0 32px 64px rgba(11, 77, 131, 0.2)',
    navbar: '0 4px 20px rgba(11, 77, 131, 0.06)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #0B4D83 0%, #2D7CB6 100%)',
    secondary: 'linear-gradient(135deg, #00A3B4 0%, #33C1CF 100%)',
    accent: 'linear-gradient(135deg, #7E57C2 0%, #9E77DB 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
    hero: 'linear-gradient(135deg, #0B4D83 0%, #00A3B4 100%)',
    footer: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
  },
  // Breakpoints for responsive design
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

export default theme;
