import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f9c41b',
      light: '#fadb4a',
      dark: '#d4a615',
      contrastText: '#000000',
    },
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
    },
    background: {
      default: '#000007',
      paper: '#000007',
    },
    text: {
      primary: '#f9f9f9',
      secondary: '#a3a3a3',
    },
    divider: '#1a1a2e',
  },
  typography: {
    fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 4,
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 48,
        },
        sizeSmall: {
          minHeight: 36,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: 48,
          minHeight: 48,
        },
        sizeSmall: {
          minWidth: 36,
          minHeight: 36,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#010210',
            '& fieldset': {
              borderColor: '#1a1a2e',
            },
            '&:hover fieldset': {
              borderColor: '#f9c41b',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#f9c41b',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#a3a3a3',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#010210',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1a1a2e',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f9c41b',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f9c41b',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: '#010210',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
        sizeSmall: {
          minHeight: 36,
        },
      },
    },
  },
})

export default theme
