/**
 * ClubViz Design System
 * Comprehensive design schema based on design screens analysis
 */

export const designSystem = {
  // Typography
  typography: {
    fontFamily: {
      primary: "'Poppins', sans-serif",
      fallback: "system-ui, -apple-system, sans-serif"
    },
    fontSizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
    }
  },

  // Color Palette - Blue Theme
  colors: {
    // Primary Brand Colors - Blue
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main primary
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#4338ca',
      900: '#3730a3',
      950: '#2d1b69',
    },

    // Purple/Pink Gradient (Prominent in designs)
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764',
    },

    pink: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
      950: '#500724',
    },

    // Dark Theme Colors (Primary background scheme)
    dark: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',  // Secondary background
      900: '#0f172a',  // Primary background
      950: '#020617',
    },

    // Background Colors
    background: {
      primary: '#0f172a',   // Main dark background
      secondary: '#1e293b', // Card/component background
      tertiary: '#334155',  // Hover states
      glass: 'rgba(30, 41, 59, 0.8)', // Glass morphism
    },

    // Text Colors
    text: {
      primary: '#ffffff',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      disabled: '#64748b',
    },

    // Accent Colors
    accent: {
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#f59e0b',
      red: '#ef4444',
      orange: '#f97316',
    },

    // Semantic Colors
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },

    // Gradient Definitions
    gradients: {
      primaryHero: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      secondaryHero: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      cardOverlay: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
      glassEffect: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    }
  },

  // Spacing System
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },

  // Component Styles
  components: {
    button: {
      primary: {
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        color: '#ffffff',
        borderRadius: '0.75rem',
        padding: '0.75rem 1.5rem',
        fontWeight: 600,
        fontSize: '1rem',
        border: 'none',
        boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.4)',
      },
      secondary: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        borderRadius: '0.75rem',
        padding: '0.75rem 1.5rem',
        fontWeight: 500,
        fontSize: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
      },
      ghost: {
        background: 'transparent',
        color: '#cbd5e1',
        borderRadius: '0.75rem',
        padding: '0.75rem 1.5rem',
        fontWeight: 500,
        fontSize: '1rem',
        border: '1px solid transparent',
      }
    },

    card: {
      primary: {
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      glass: {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
      }
    },

    input: {
      primary: {
        background: 'rgba(51, 65, 85, 0.6)',
        color: '#ffffff',
        borderRadius: '0.75rem',
        padding: '0.875rem 1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '1rem',
        placeholder: '#94a3b8',
      }
    },

    navigation: {
      tabBar: {
        background: 'rgba(30, 41, 59, 0.95)',
        borderRadius: '1.5rem 1.5rem 0 0',
        padding: '1rem',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }
    }
  },

  // Layout
  layout: {
    containerMaxWidth: '428px', // Mobile first approach
    headerHeight: '4rem',
    tabBarHeight: '5rem',
    contentPadding: '1.5rem',
  },

  // Animations & Transitions
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  }
} as const;

// Theme tokens for easy consumption
export const tokens = {
  color: designSystem.colors,
  space: designSystem.spacing,
  size: designSystem.spacing,
  font: designSystem.typography,
  radius: designSystem.borderRadius,
  shadow: designSystem.shadows,
  zIndex: designSystem.zIndex,
} as const;

// Export individual color palettes for convenience
export const { primary, purple, pink, dark, background, text, accent, semantic, gradients } = designSystem.colors;