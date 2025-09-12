export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      light: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    accessibility: {
      highContrast: string;
      focus: string;
      selected: string;
    };
  };
  typography: {
    fontFamily: {
      primary: string;
      accessible: string;
      dyslexic: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#007ACC',
    secondary: '#00BFA6',
    accent: '#FFC107',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: {
      primary: '#212121',
      secondary: '#4A5568',
      light: '#718096',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    accessibility: {
      highContrast: '#000000',
      focus: '#007ACC',
      selected: '#E3F2FD',
    },
  },
  typography: {
    fontFamily: {
      primary: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      accessible: 'Atkinson Hyperlegible, Roboto, sans-serif',
      dyslexic: 'OpenDyslexic, Roboto, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#111827',
    surface: '#1F2937',
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      light: '#9CA3AF',
    },
    accessibility: {
      highContrast: '#FFFFFF',
      focus: '#60A5FA',
      selected: '#1E3A8A',
    },
  },
};

export const highContrastTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#000000',
    secondary: '#000000',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: {
      primary: '#000000',
      secondary: '#000000',
      light: '#000000',
    },
    accessibility: {
      highContrast: '#000000',
      focus: '#FF0000',
      selected: '#FFFF00',
    },
  },
};

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export const getTheme = (mode: ThemeMode): Theme => {
  switch (mode) {
    case 'dark':
      return darkTheme;
    case 'high-contrast':
      return highContrastTheme;
    default:
      return lightTheme;
  }
};