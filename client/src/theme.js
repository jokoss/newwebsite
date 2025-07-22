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
  blue: {
    palette: {
      primary: {
        main: '#1976D2',
        light: '#42A5F5',
        dark: '#1565C0',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#42A5F5',
        light: '#64B5F6',
        dark: '#1976D2',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
        overlay: 'rgba(25, 118, 210, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(25, 118, 210, 0.12)',
    },
  },
  navy: {
    palette: {
      primary: {
        main: '#0D47A1',
        light: '#1976D2',
        dark: '#01579B',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#1565C0',
        light: '#1976D2',
        dark: '#0D47A1',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
        overlay: 'rgba(13, 71, 161, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(13, 71, 161, 0.12)',
    },
  },
  teal: {
    palette: {
      primary: {
        main: '#00695C',
        light: '#26A69A',
        dark: '#004D40',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#26A69A',
        light: '#4DB6AC',
        dark: '#00695C',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #00695C 0%, #26A69A 100%)',
        overlay: 'rgba(0, 105, 92, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(0, 105, 92, 0.12)',
    },
  },
  purple: {
    palette: {
      primary: {
        main: '#7B1FA2',
        light: '#AB47BC',
        dark: '#4A148C',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#AB47BC',
        light: '#BA68C8',
        dark: '#7B1FA2',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #7B1FA2 0%, #AB47BC 100%)',
        overlay: 'rgba(123, 31, 162, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(123, 31, 162, 0.12)',
    },
  },
  indigo: {
    palette: {
      primary: {
        main: '#303F9F',
        light: '#5C6BC0',
        dark: '#1A237E',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#5C6BC0',
        light: '#7986CB',
        dark: '#303F9F',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #303F9F 0%, #5C6BC0 100%)',
        overlay: 'rgba(48, 63, 159, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(48, 63, 159, 0.12)',
    },
  },
  orange: {
    palette: {
      primary: {
        main: '#F57C00',
        light: '#FF9800',
        dark: '#E65100',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FF9800',
        light: '#FFB74D',
        dark: '#F57C00',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #F57C00 0%, #FF9800 100%)',
        overlay: 'rgba(245, 124, 0, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(245, 124, 0, 0.12)',
    },
  },
  red: {
    palette: {
      primary: {
        main: '#C62828',
        light: '#E53935',
        dark: '#B71C1C',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#E53935',
        light: '#EF5350',
        dark: '#C62828',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #C62828 0%, #E53935 100%)',
        overlay: 'rgba(198, 40, 40, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(198, 40, 40, 0.12)',
    },
  },
  pink: {
    palette: {
      primary: {
        main: '#C2185B',
        light: '#E91E63',
        dark: '#AD1457',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#E91E63',
        light: '#EC407A',
        dark: '#C2185B',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #C2185B 0%, #E91E63 100%)',
        overlay: 'rgba(194, 24, 91, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(194, 24, 91, 0.12)',
    },
  },
  cyan: {
    palette: {
      primary: {
        main: '#00838F',
        light: '#00ACC1',
        dark: '#006064',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#00ACC1',
        light: '#26C6DA',
        dark: '#00838F',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #00838F 0%, #00ACC1 100%)',
        overlay: 'rgba(0, 131, 143, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(0, 131, 143, 0.12)',
    },
  },
  amber: {
    palette: {
      primary: {
        main: '#FF8F00',
        light: '#FFC107',
        dark: '#FF6F00',
        contrastText: '#000000',
      },
      secondary: {
        main: '#FFC107',
        light: '#FFD54F',
        dark: '#FF8F00',
        contrastText: '#000000',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #FF8F00 0%, #FFC107 100%)',
        overlay: 'rgba(255, 143, 0, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(255, 143, 0, 0.12)',
    },
  },
  deepOrange: {
    palette: {
      primary: {
        main: '#D84315',
        light: '#FF5722',
        dark: '#BF360C',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FF5722',
        light: '#FF7043',
        dark: '#D84315',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #D84315 0%, #FF5722 100%)',
        overlay: 'rgba(216, 67, 21, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(216, 67, 21, 0.12)',
    },
  },
  blueGrey: {
    palette: {
      primary: {
        main: '#455A64',
        light: '#607D8B',
        dark: '#37474F',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#607D8B',
        light: '#78909C',
        dark: '#455A64',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #455A64 0%, #607D8B 100%)',
        overlay: 'rgba(69, 90, 100, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(69, 90, 100, 0.12)',
    },
  },
  emerald: {
    palette: {
      primary: {
        main: '#047857',
        light: '#10B981',
        dark: '#065F46',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#10B981',
        light: '#34D399',
        dark: '#047857',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
        overlay: 'rgba(4, 120, 87, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(4, 120, 87, 0.12)',
    },
  },
  rose: {
    palette: {
      primary: {
        main: '#BE185D',
        light: '#F43F5E',
        dark: '#9F1239',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#F43F5E',
        light: '#FB7185',
        dark: '#BE185D',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #BE185D 0%, #F43F5E 100%)',
        overlay: 'rgba(190, 24, 93, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(190, 24, 93, 0.12)',
    },
  },
  violet: {
    palette: {
      primary: {
        main: '#7C3AED',
        light: '#A78BFA',
        dark: '#5B21B6',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#A78BFA',
        light: '#C4B5FD',
        dark: '#7C3AED',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
        overlay: 'rgba(124, 58, 237, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(124, 58, 237, 0.12)',
    },
  },
  slate: {
    palette: {
      primary: {
        main: '#475569',
        light: '#64748B',
        dark: '#334155',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#64748B',
        light: '#94A3B8',
        dark: '#475569',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #475569 0%, #64748B 100%)',
        overlay: 'rgba(71, 85, 105, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(71, 85, 105, 0.12)',
    },
  },
  lime: {
    palette: {
      primary: {
        main: '#65A30D',
        light: '#84CC16',
        dark: '#4D7C0F',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#84CC16',
        light: '#A3E635',
        dark: '#65A30D',
        contrastText: '#000000',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #65A30D 0%, #84CC16 100%)',
        overlay: 'rgba(101, 163, 13, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(101, 163, 13, 0.12)',
    },
  },
  coral: {
    palette: {
      primary: {
        main: '#DC2626',
        light: '#F87171',
        dark: '#B91C1C',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#F87171',
        light: '#FCA5A5',
        dark: '#DC2626',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)',
        overlay: 'rgba(220, 38, 38, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(220, 38, 38, 0.12)',
    },
  },
  mint: {
    palette: {
      primary: {
        main: '#059669',
        light: '#34D399',
        dark: '#047857',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#34D399',
        light: '#6EE7B7',
        dark: '#059669',
        contrastText: '#000000',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
        overlay: 'rgba(5, 150, 105, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(5, 150, 105, 0.12)',
    },
  },
  gold: {
    palette: {
      primary: {
        main: '#D97706',
        light: '#F59E0B',
        dark: '#B45309',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#F59E0B',
        light: '#FCD34D',
        dark: '#D97706',
        contrastText: '#000000',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
        gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
        overlay: 'rgba(217, 119, 6, 0.95)',
      },
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
      divider: 'rgba(217, 119, 6, 0.12)',
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
  
  // Ensure gradients are always available based on the selected theme
  const themeGradients = {
    primary: selectedTheme.palette?.background?.gradient || baseTheme.gradients.primary,
    secondary: baseTheme.gradients.secondary,
    footer: selectedTheme.palette?.background?.gradient || baseTheme.gradients.footer,
  };
  
  const theme = createTheme({
    ...baseTheme,
    ...selectedTheme,
    // Ensure these custom properties are always present
    gradients: themeGradients,
    customShadows: baseTheme.customShadows,
  });

  return responsiveFontSizes(theme);
};

// Export getTheme function that App.js expects
export const getTheme = (themeName = 'default') => {
  return createAppTheme(themeName);
};

export const getAvailableThemes = () => Object.keys(themes);

export default getTheme;
