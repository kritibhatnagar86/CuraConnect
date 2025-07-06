import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5CF6', // purple
    },
    secondary: {
      main: '#A855F7', // lighter purple
    },
    background: {
      default: '#0F0F0F',
      paper: '#18122B',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255,255,255,0.7)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1A1A1A',
          color: '#fff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#18122B',
        },
      },
    },
  },
});

export default theme; 