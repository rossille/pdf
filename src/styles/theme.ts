import { createTheme } from '@mui/material/styles';

// A vibrant, engaging palette with playful colors
export const theme = createTheme({
  palette: {
    primary: {
      main: '#4361EE', // Vibrant blue
      light: '#738BF5',
      dark: '#2F4BD3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F72585', // Bright pink
      light: '#FF60A8',
      dark: '#C01A66',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF6868',
      light: '#FF9191',
      dark: '#D05353',
    },
    warning: {
      main: '#FFBE0B',
      light: '#FFD056',
      dark: '#D39C00',
    },
    info: {
      main: '#4CC9F0',
      light: '#7DD7F3',
      dark: '#2EABD1',
    },
    success: {
      main: '#10B981',
      light: '#3FC99B',
      dark: '#0A8F63',
    },
    background: {
      default: '#F9FAFE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2A2B3D',
      secondary: '#545671',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: '0 4px 10px rgba(67, 97, 238, 0.15)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 14px rgba(67, 97, 238, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #4361EE 30%, #4CC9F0 90%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #F72585 30%, #FF60A8 90%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          background: 'linear-gradient(90deg, #4361EE 0%, #4CC9F0 100%)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          fontWeight: 600,
        },
      },
    },
  },
});