/**
 * ClubViz Design System
 * Comprehensive design schema based on design screens analysis
 */

export const designSystem = {
  // Typography
  typography: {
    fontFamily: {
      primary: "'Manrope', sans-serif",
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

  // Color Palette - Teal/Cyan Theme (Based on actual designs)
  colors: {
    // Primary Brand Colors - Teal/Cyan (Main brand colors from designs)
    primary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6', // Main primary teal
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e',
    },

    // Cyan (Secondary brand color)
    cyan: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4', // Secondary cyan
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      950: '#083344',
    },

    // Accent Purple (For special elements)
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

    // Background Colors (From COLOR_PALETTE_REFERENCE.md)
    background: {
      primary: '#031313',   // Main Background - Deep Teal Black
      secondary: '#0e1f1f', // Cards & Components - Dark Teal
      tertiary: '#1a3030',  // Border/Muted Elements
      glass: 'rgba(14, 31, 31, 0.7)', // Glassmorphism Base - Dark Teal with transparency
    },

    // Text Colors (From COLOR_PALETTE_REFERENCE.md)
    text: {
      primary: '#ffffff',               // Primary Text - White
      secondary: 'rgba(255, 255, 255, 0.8)',  // Secondary Text - 80% opacity
      tertiary: 'rgba(255, 255, 255, 0.7)',   // Tertiary Text - 70% opacity
      muted: 'rgba(255, 255, 255, 0.5)',      // Muted Text - 50% opacity
    },

    // Accent Colors (From COLOR_PALETTE_REFERENCE.md)
    accent: {
      teal: '#14b8a6',      // Teal 500 - Primary Brand
      tealDark: '#0d9488',  // Teal 600
      tealDarker: '#0f766e', // Teal 700
      cyan: '#06b6d4',      // Cyan 500 - Secondary Brand
      cyanDark: '#0891b2',  // Cyan 600
      cyanDarker: '#0e7490', // Cyan 700
      green: '#10b981',     // Success/Live - Green
      yellow: '#f59e0b',    // Warning/Scheduled - Orange
      red: '#ef4444',       // Error/Offline - Red
    },

    // Semantic Colors
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#14b8a6',  // Using teal for info
    },

    // Gradient Definitions (From COLOR_PALETTE_REFERENCE.md)
    gradients: {
      primaryHeader: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)', // Primary Header Gradient
      alternativeHeader: 'linear-gradient(to right, #14b8a6 0%, #06b6d4 100%)', // Alternative Header Gradient
      cardOverlay: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
      button: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)', // Primary button gradient
      glassLight: 'rgba(14, 31, 31, 0.5)',   // Light Glass
      glassStandard: 'rgba(14, 31, 31, 0.7)', // Standard Glass
      glassStrong: 'rgba(14, 31, 31, 0.85)',  // Strong Glass
    },

    // Border Colors (From COLOR_PALETTE_REFERENCE.md)
    borders: {
      subtle: 'rgba(255, 255, 255, 0.1)',     // 10% white
      medium: 'rgba(255, 255, 255, 0.15)',    // 15% white
      strong: 'rgba(255, 255, 255, 0.2)',     // 20% white
      tealMedium: 'rgba(20, 184, 166, 0.3)',  // 30% teal
      tealStrong: 'rgba(45, 212, 191, 0.4)',  // 40% teal
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
        background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)', // Teal gradient
        color: '#ffffff',
        borderRadius: '0.75rem',
        padding: '0.75rem 1.5rem',
        fontWeight: 600,
        fontSize: '1rem',
        border: 'none',
        boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.4)',
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
        color: '#e5e5e5',
        borderRadius: '0.75rem',
        padding: '0.75rem 1.5rem',
        fontWeight: 500,
        fontSize: '1rem',
        border: '1px solid transparent',
      }
    },

    card: {
      primary: {
        background: 'rgba(26, 26, 26, 0.85)', // Darker background to match designs
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      },
      glass: {
        background: 'rgba(20, 184, 166, 0.05)', // Teal glass effect
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '1px solid rgba(20, 184, 166, 0.2)',
        backdropFilter: 'blur(20px)',
      }
    },

    input: {
      primary: {
        background: 'rgba(42, 42, 42, 0.8)', // Darker to match designs
        color: '#ffffff',
        borderRadius: '0.75rem',
        padding: '0.875rem 1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '1rem',
        placeholder: '#a3a3a3',
      }
    },

    navigation: {
      tabBar: {
        background: 'rgba(26, 26, 26, 0.95)', // Darker to match designs
        borderRadius: '1.5rem 1.5rem 0 0',
        padding: '1rem',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
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
export const { primary, purple, cyan, dark, background, text, accent, semantic, gradients } = designSystem.colors;