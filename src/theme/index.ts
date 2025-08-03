import { createTheme, responsiveFontSizes } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      small: string;
      medium: string;
      large: string;
    };
    customSpacings: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    customBorderRadius: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      rounded: string;
    };
  }
  interface ThemeOptions {
    customShadows?: {
      small?: string;
      medium?: string;
      large?: string;
    };
    customSpacings?: {
      xs?: string;
      sm?: string;
      md?: string;
      lg?: string;
      xl?: string;
      xxl?: string;
    };
    customBorderRadius?: {
      xs?: string;
      sm?: string;
      md?: string;
      lg?: string;
      xl?: string;
      rounded?: string;
    };
  }
}

const tempThemeForUtils = createTheme({
  spacing: 4, // Define o spacing base aqui
  shape: {
    borderRadius: 4, // Define o borderRadius base aqui
  },
});

// Color palette
const palette = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#fff',
  },
  secondary: {
    main: '#dc004e',
    light: '#ff4081',
    dark: '#c51162',
    contrastText: '#fff',
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
    contrastText: '#fff',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
    contrastText: '#fff',
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
};

// Typography
const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'Helvetica',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontWeight: 600,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
  },
  h2: {
    fontWeight: 600,
    fontSize: '2rem',
    lineHeight: 1.3,
    letterSpacing: '-0.25px',
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.75rem',
    lineHeight: 1.35,
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.5,
  },
  h6: {
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: 1.6,
  },
  subtitle1: {
    fontSize: '1rem',
    lineHeight: 1.5,
    letterSpacing: '0.15px',
  },
  subtitle2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
    letterSpacing: '0.1px',
    fontWeight: 500,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5,
    letterSpacing: '0.15px',
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
    letterSpacing: '0.15px',
  },
  button: {
    textTransform: 'none' as const,
    fontWeight: 500,
    letterSpacing: '0.4px',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.66,
    letterSpacing: '0.4px',
  },
  overline: {
    fontSize: '0.75rem',
    lineHeight: 2.66,
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  },
};

// Spacing
const spacing = tempThemeForUtils.spacing;

const customSpacings = {
  xs: spacing(1),
  sm: spacing(2),
  md: spacing(3),
  lg: spacing(4),
  xl: spacing(5),
  xxl: spacing(6),
};

// Border radius
const borderRadiusBase = tempThemeForUtils.shape.borderRadius as number;

const customBorderRadius = {
  xs: `${borderRadiusBase}px`,
  sm: `${borderRadiusBase * 1.5}px`,
  md: `${borderRadiusBase * 2}px`,
  lg: `${borderRadiusBase * 3}px`,
  xl: `${borderRadiusBase * 4}px`,
  rounded: '50%',
};

// Breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

// Custom shadows
const customShadows = {
  small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  medium: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  large: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
};

// Create base theme
const baseTheme = createTheme({
  spacing,
  palette,
  typography,
  breakpoints,
  customShadows,
  customSpacings,
  customBorderRadius,
  shape: {
    borderRadius: borderRadiusBase,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          WebkitFontSmoothing: 'auto',
        },
        body: {
          margin: 0,
          padding: 0,
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: customBorderRadius.md,
          padding: `${customSpacings.md} ${customSpacings.xl}`,
          textTransform: 'none',
          fontWeight: 500,
        },
        sizeLarge: {
          padding: `${customSpacings.md} ${customSpacings.xl}`,
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: `${customSpacings.sm} ${customSpacings.md}`,
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: customShadows.small,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: customBorderRadius.md,
          boxShadow: customShadows.small,
          '&:hover': {
            boxShadow: customShadows.medium,
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: customSpacings.md,
          '&:last-child': {
            paddingBottom: customSpacings.md,
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          borderBottom: `1px solid ${palette.divider}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: customBorderRadius.sm,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: `${customSpacings.md} ${customSpacings.xxl}`,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: `${customSpacings.md} ${customSpacings.xl}`,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: `${customSpacings.md} ${customSpacings.xl}`,
        },
      },
    },
  },
});

const theme = responsiveFontSizes(baseTheme);

export default theme;
