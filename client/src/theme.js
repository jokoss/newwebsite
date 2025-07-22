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
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #7C321D 0%, #A85C2E 100%)',
        overlay: 'rgba(124, 50, 29, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(124, 50, 29, 0.08)',
    },
  },
  dark: {
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
      background: {
        default: '#111827',
        paper: '#1F2937',
        glass: 'rgba(31, 41, 55, 0.95)',
        gradient: 'linear-gradient(135deg, #7C321D 0%, #A85C2E 100%)',
        overlay: 'rgba(124, 50, 29, 0.95)',
      },
      text: {
        primary: '#F9FAFB',
        secondary: '#D1D5DB',
        muted: '#9CA3AF',
      },
      divider: 'rgba(255, 255, 255, 0.12)',
    },
  },
  black: {
    palette: {
      primary: {
        main: '#000000',
        light: '#333333',
        dark: '#000000',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#333333',
        light: '#666666',
        dark: '#1A1A1A',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
        overlay: 'rgba(0, 0, 0, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(0, 0, 0, 0.12)',
    },
  },
  lightGreen: {
    palette: {
      primary: {
        main: '#A5C882',
        light: '#C5E1A5',
        dark: '#7D9B63',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#7D9B63',
        light: '#9CCC65',
        dark: '#689F38',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #A5C882 0%, #7D9B63 100%)',
        overlay: 'rgba(165, 200, 130, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(165, 200, 130, 0.12)',
    },
  },
  darkGreen: {
    palette: {
      primary: {
        main: '#4A6741',
        light: '#6B8E5A',
        dark: '#3E5A35',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#5D7A41',
        light: '#7D9B63',
        dark: '#4A6741',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #4A6741 0%, #5D7A41 100%)',
        overlay: 'rgba(74, 103, 65, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(74, 103, 65, 0.12)',
    },
  },
  brownGreen: {
    palette: {
      primary: {
        main: '#7C321D',
        light: '#9A4D39',
        dark: '#5E2516',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#5D7A41',
        light: '#7D9B63',
        dark: '#4A6741',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #7C321D 0%, #5D7A41 100%)',
        overlay: 'rgba(124, 50, 29, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(124, 50, 29, 0.08)',
    },
  },
  blackGreen: {
    palette: {
      primary: {
        main: '#000000',
        light: '#333333',
        dark: '#000000',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#5D7A41',
        light: '#7D9B63',
        dark: '#4A6741',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #000000 0%, #5D7A41 100%)',
        overlay: 'rgba(0, 0, 0, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(0, 0, 0, 0.12)',
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
  // Add gradients that components expect
  gradients: {
    primary: 'linear-gradient(135deg, #7C321D 0%, #A85C2E 100%)',
    secondary: 'linear-gradient(135deg, #A85C2E 0%, #C27A4C 100%)',
    footer: 'linear-gradient(135deg, #7C321D 0%, #A85C2E 100%)',
  },
  // Add custom shadows that components expect
  customShadows: {
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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

// Export getTheme function that App.js expects
export const getTheme = (themeName = 'default') => {
  return createAppTheme(themeName);
};

export const getAvailableThemes = () => Object.keys(themes);

export default getTheme;
