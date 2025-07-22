import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const themes = {
  default: {
    palette: {
      primary: {
        main: '#7C321D',
        light: '#9A4D39',
        dark: '#5E2516',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#A85C2E',
        light: '#C27A4C',
        dark: '#8A4A24',
        contrastText: '#FFFFFF',
      },
      tertiary: {
        main: '#5D4037',
        light: '#7D5B52',
        dark: '#3E2723',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #7C321D 0%, #A85C2E 100%)',
        overlay: 'rgba(124, 50, 29, 0.95)',
        light: '#F1F5F9',
        dark: '#2D1A14',
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
      divider: 'rgba(124, 50, 29, 0.08)',
      action: {
        hover: 'rgba(124, 50, 29, 0.04)',
        selected: 'rgba(124, 50, 29, 0.08)',
      },
    },
  },
  brown: {
    palette: {
      primary: {
        main: '#7C321D',
        light: '#9A4D39',
        dark: '#5E2516',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#A85C2E',
        light: '#C27A4C',
        dark: '#8A4A24',
        contrastText: '#FFFFFF',
      },
      tertiary: {
        main: '#5D4037',
        light: '#7D5B52',
        dark: '#3E2723',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #7C321D 0%, #A85C2E 100%)',
        overlay: 'rgba(124, 50, 29, 0.95)',
        light: '#F1F5F9',
        dark: '#2D1A14',
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
      divider: 'rgba(124, 50, 29, 0.08)',
      action: {
        hover: 'rgba(124, 50, 29, 0.04)',
        selected: 'rgba(124, 50, 29, 0.08)',
      },
    },
  },
};

const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
};

export const createAppTheme = (themeName = 'default') => {
  const selectedTheme = themes[themeName] || themes.default;
  
  const theme = createTheme({
    ...baseTheme,
    ...selectedTheme,
  });

  return responsiveFontSizes(theme);
};

export const getAvailableThemes = () => Object.keys(themes);

export default createAppTheme();
