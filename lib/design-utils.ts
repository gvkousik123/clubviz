/**
 * Design System Utility Classes
 * Maps hardcoded values to design system-based Tailwind classes
 */

// Color mappings - replace hardcoded colors with design system equivalents
export const colorMappings = {
  // Background mappings
  'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900': 'bg-background-primary',
  'bg-blue-500/10': 'glass-effect',
  'bg-blue-500/20': 'bg-primary-500/20',
  'bg-white/10': 'glass-effect',
  'bg-black/80': 'bg-background-secondary/80',
  'bg-black/40': 'bg-background-secondary/40',
  
  // Text color mappings
  'text-white': 'text-text-primary',
  'text-white/80': 'text-text-secondary',
  'text-white/70': 'text-text-tertiary',
  'text-white/60': 'text-text-tertiary',
  'text-white/50': 'text-text-disabled',
  'text-white/40': 'text-text-disabled',
  'text-blue-400': 'text-primary-500',
  'text-blue-300': 'text-primary-400',
  'text-blue-200': 'text-primary-300',
  'text-red-400': 'text-accent-red',
  'text-yellow-400': 'text-accent-yellow',
  'text-gray-700': 'text-background-primary',
  
  // Border mappings
  'border-blue-500/30': 'border-primary-500/30',
  'border-blue-500/20': 'border-primary-500/20',
  'border-white/20': 'border-border',
  'border-white/10': 'border-border',
  
  // Hover states
  'hover:bg-blue-500/30': 'hover:bg-primary-500/30',
  'hover:bg-blue-500/20': 'hover:bg-primary-500/20',
  'hover:bg-blue-500/15': 'hover:bg-primary-500/15',
  'hover:text-blue-300': 'hover:text-primary-400',
  'hover:text-blue-400': 'hover:text-primary-500',
  'hover:bg-blue-600': 'hover:bg-primary-600',
  
  // Button mappings
  'bg-blue-500': 'bg-primary-500',
  'bg-blue-600': 'bg-primary-600',
  
  // Gradient mappings
  'bg-gradient-to-br from-blue-600 to-blue-800': 'bg-gradient-primary',
  'bg-gradient-to-r from-black/60 to-transparent': 'bg-gradient-card-overlay',
}

// Class mappings for common component patterns
export const componentMappings = {
  // Search bar
  'bg-blue-500/10 backdrop-blur-sm rounded-2xl flex items-center px-5 py-4 border border-blue-500/20 shadow-lg': 'search-bar flex items-center',
  
  // Glass cards
  'bg-blue-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/20 shadow-lg': 'glass-card',
  
  // Buttons
  'bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl text-base font-semibold transition-colors shadow-lg': 'btn-primary text-base shadow-lg',
  
  // Navigation tab bar
  'fixed bottom-0 left-0 right-0 bg-blue-500/10 backdrop-blur-sm border-t border-blue-500/20': 'nav-tab-bar',
}

// Utility functions for easy replacements
export const replaceHardcodedColors = (className: string): string => {
  let result = className
  
  // Replace individual color mappings
  Object.entries(colorMappings).forEach(([hardcoded, designSystem]) => {
    result = result.replace(new RegExp(hardcoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), designSystem)
  })
  
  // Replace component patterns
  Object.entries(componentMappings).forEach(([hardcoded, designSystem]) => {
    result = result.replace(new RegExp(hardcoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), designSystem)
  })
  
  return result
}

// Common design system class combinations
export const designSystemClasses = {
  // Layout
  page: 'flex flex-col min-h-screen bg-background-primary text-text-primary',
  container: 'max-w-container mx-auto px-6',
  
  // Typography
  heading1: 'text-3xl font-bold text-text-primary',
  heading2: 'text-2xl font-semibold text-text-primary',
  heading3: 'text-xl font-semibold text-text-primary',
  body: 'text-base text-text-primary',
  caption: 'text-sm text-text-tertiary',
  
  // Buttons
  buttonPrimary: 'btn-primary',
  buttonSecondary: 'btn-secondary',
  buttonGhost: 'bg-transparent text-text-secondary hover:text-text-primary transition-colors duration-normal',
  
  // Cards
  card: 'glass-card',
  cardVenue: 'card-venue',
  
  // Form elements
  input: 'bg-background-secondary border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-tertiary focus:border-primary-500 transition-colors duration-normal',
  searchBar: 'search-bar',
  
  // Navigation
  navTab: 'flex flex-col items-center justify-center gap-1 text-text-tertiary p-2 transition-colors duration-normal',
  navTabActive: 'flex flex-col items-center justify-center gap-1 text-text-primary p-2',
  
  // States
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'opacity-75 animate-pulse',
  
  // Spacing
  sectionSpacing: 'mb-8',
  elementSpacing: 'mb-6',
  
  // Effects
  glassEffect: 'glass-effect',
  backdropBlur: 'backdrop-blur-glass',
  
  // Animations
  transition: 'transition-all duration-normal ease-in-out',
  hoverScale: 'hover:scale-105 transition-transform duration-normal',
  
  // Gradients
  gradientPrimary: 'bg-gradient-primary',
  gradientSecondary: 'bg-gradient-secondary',
  gradientText: 'gradient-text-primary',
}

// Responsive utilities based on design system breakpoints
export const responsive = {
  mobile: 'max-w-container mx-auto',
  desktop: 'lg:max-w-none lg:mx-0',
}

// Icon color mappings for consistency
export const iconColors = {
  primary: 'text-primary-500',
  secondary: 'text-text-secondary',
  tertiary: 'text-text-tertiary',
  accent: 'text-accent-teal',
  warning: 'text-accent-yellow',
  error: 'text-accent-red',
  success: 'text-accent-green',
}

// Export commonly used class combinations for quick access
export default {
  colorMappings,
  componentMappings,
  replaceHardcodedColors,
  designSystemClasses,
  responsive,
  iconColors,
}