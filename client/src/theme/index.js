import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200EA', // Deep purple for main actions
      light: '#9D46FF',
      dark: '#0A00B6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF3366', // Pink for accents and highlights
      light: '#FF6B91',
      dark: '#C4004D',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F5F7',
      paper: '#ffffff',
      dark: '#121212',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01562em',
      background: 'linear-gradient(45deg, #6200EA, #FF3366)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '0.00735em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
          boxShadow: 'none',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #6200EA 30%, #9D46FF 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5000D9 30%, #8B35FF 90%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #FF3366 30%, #FF6B91 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #E62E5C 30%, #FF5C85 90%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 0 0 2px rgba(98, 0, 234, 0.2)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  },
});

export default theme; 