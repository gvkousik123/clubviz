import { designSystem } from './design-system'

const config = {
  // Tailwind CSS v4 configuration
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Extending default theme with design system
    extend: {
      // Font Family from design system
      fontFamily: {
        sans: [designSystem.typography.fontFamily.primary, ...designSystem.typography.fontFamily.fallback.split(', ')],
        primary: designSystem.typography.fontFamily.primary,
      },
      
      // Font Sizes from design system
      fontSize: designSystem.typography.fontSizes,
      
      // Font Weights from design system
      fontWeight: designSystem.typography.fontWeights,
      
      // Line Heights from design system
      lineHeight: designSystem.typography.lineHeights,
      
      // Colors from design system
      colors: {
        primary: designSystem.colors.primary,
        cyan: designSystem.colors.cyan,
        purple: designSystem.colors.purple,
        dark: designSystem.colors.dark,
        background: designSystem.colors.background,
        text: designSystem.colors.text,
        accent: designSystem.colors.accent,
        semantic: designSystem.colors.semantic,
        borders: designSystem.colors.borders,
        
        // Additional semantic mappings for common Tailwind patterns
        teal: designSystem.colors.primary, // Map teal to our primary
        slate: designSystem.colors.dark,   // Map slate to our dark colors
        blue: designSystem.colors.cyan,    // Map blue to our cyan
      },
      
      // Spacing from design system
      spacing: designSystem.spacing,
      
      // Border Radius from design system
      borderRadius: designSystem.borderRadius,
      
      // Box Shadow from design system
      boxShadow: designSystem.shadows,
      
      // Z-Index from design system
      zIndex: designSystem.zIndex,
      
      // Animation from design system
      transitionDuration: designSystem.animations.duration,
      transitionTimingFunction: designSystem.animations.easing,
      
      // Backdrop filters and effects
      backdropBlur: {
        'glass': '16px',
        'glass-md': '20px',
        'glass-lg': '24px',
      },
      
      // Container max width from design system
      container: {
        center: true,
        padding: designSystem.spacing[6],
        screens: {
          'mobile': designSystem.layout.containerMaxWidth,
        }
      },
      
      // Custom gradients using CSS-in-JS approach for Tailwind v4
      backgroundImage: {
        'gradient-primary': designSystem.colors.gradients.primaryHeader,
        'gradient-secondary': designSystem.colors.gradients.alternativeHeader,
        'gradient-button': designSystem.colors.gradients.button,
        'gradient-card-overlay': designSystem.colors.gradients.cardOverlay,
      },
    },
  },
  
  // Custom utilities
  plugins: [
    // Glass morphism effect
    function({ addUtilities }: { addUtilities: (utilities: Record<string, any>) => void }) {
      addUtilities({
        '.glass-effect': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-card': {
          'background': designSystem.colors.background.glass,
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.08)',
          'box-shadow': designSystem.shadows.glass,
        },
        '.gradient-text-primary': {
          'background': designSystem.colors.gradients.primaryHeader,
          'background-clip': 'text',
          'color': 'transparent',
        },
        '.btn-primary': {
          'background': designSystem.colors.gradients.button,
          'color': designSystem.colors.text.primary,
          'border-radius': designSystem.borderRadius.xl,
          'padding': `${designSystem.spacing[3]} ${designSystem.spacing[6]}`,
          'font-weight': designSystem.typography.fontWeights.semibold,
          'box-shadow': '0 4px 14px 0 rgba(20, 184, 166, 0.4)',
          'transition': `all ${designSystem.animations.duration.normal} ${designSystem.animations.easing.easeInOut}`,
        },
        '.btn-secondary': {
          'background': designSystem.colors.background.glass,
          'color': designSystem.colors.text.primary,
          'border-radius': designSystem.borderRadius.xl,
          'padding': `${designSystem.spacing[3]} ${designSystem.spacing[6]}`,
          'font-weight': designSystem.typography.fontWeights.medium,
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'backdrop-filter': 'blur(10px)',
          'transition': `all ${designSystem.animations.duration.normal} ${designSystem.animations.easing.easeInOut}`,
        },
        '.card-venue': {
          'background': designSystem.colors.background.secondary,
          'border-radius': designSystem.borderRadius['2xl'],
          'padding': designSystem.spacing[6],
          'border': '1px solid rgba(255, 255, 255, 0.08)',
          'overflow': 'hidden',
        },
        '.search-bar': {
          'background': designSystem.colors.background.glass,
          'border-radius': designSystem.borderRadius['2xl'],
          'padding': `${designSystem.spacing[4]} ${designSystem.spacing[5]}`,
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(20px)',
        },
        '.nav-tab-bar': {
          'background': designSystem.colors.background.glass,
          'backdrop-filter': 'blur(20px)',
          'border-top': '1px solid rgba(255, 255, 255, 0.08)',
        },
      })
    }
  ],
}

export default config