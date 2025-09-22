# Design System Implementation Guide

This guide shows how to use the ClubViz design system with Tailwind CSS classes, ensuring no hardcoded values are used.

## Quick Reference

### Color Replacements

#### ❌ Hardcoded (Old)
```tsx
className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white"
```

#### ✅ Design System (New)
```tsx
className="bg-background-primary text-text-primary"
```

### Common Pattern Replacements

#### Background Colors
| Hardcoded | Design System | Purpose |
|-----------|---------------|---------|
| `bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900` | `bg-background-primary` | Main page background |
| `bg-blue-500/10` | `glass-effect` | Glass morphism effect |
| `bg-white/10` | `glass-effect` | Alternative glass effect |
| `bg-black/80` | `bg-background-secondary/80` | Overlay backgrounds |

#### Text Colors
| Hardcoded | Design System | Purpose |
|-----------|---------------|---------|
| `text-white` | `text-text-primary` | Primary text |
| `text-white/80` | `text-text-secondary` | Secondary text |
| `text-white/70` | `text-text-tertiary` | Tertiary text |
| `text-white/50` | `text-text-disabled` | Disabled text |
| `text-blue-400` | `text-primary-500` | Primary brand color |
| `text-red-400` | `text-accent-red` | Error/favorite states |
| `text-yellow-400` | `text-accent-yellow` | Warning/rating states |

#### Borders
| Hardcoded | Design System | Purpose |
|-----------|---------------|---------|
| `border-blue-500/20` | `border-primary-500/20` | Primary borders |
| `border-white/20` | `border-border` | Standard borders |

## Component Patterns

### Search Bar
```tsx
// ❌ Old
<div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl flex items-center px-5 py-4 border border-blue-500/20 shadow-lg">

// ✅ New  
<div className="search-bar flex items-center">
```

### Glass Card
```tsx
// ❌ Old
<div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/20 shadow-lg">

// ✅ New
<div className="glass-card">
```

### Primary Button
```tsx
// ❌ Old
<button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold transition-colors">

// ✅ New
<button className="btn-primary">
```

### Secondary Button
```tsx
// ❌ Old
<button className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-2xl">

// ✅ New
<button className="btn-secondary">
```

## Color System Usage

### Brand Colors (Teal Theme)
```tsx
// Primary brand colors
className="bg-primary-500"      // Main teal
className="bg-primary-400"      // Lighter teal
className="bg-primary-600"      // Darker teal

// Cyan accents
className="bg-cyan-500"         // Secondary cyan
className="text-cyan-400"       // Light cyan text
```

### Background Colors
```tsx
className="bg-background-primary"    // #0a0a0a - Main dark background
className="bg-background-secondary"  // #1a1a1a - Card backgrounds
className="bg-background-tertiary"   // #2a2a2a - Hover states
className="bg-background-glass"      // Glass morphism background
```

### Text Colors
```tsx
className="text-text-primary"        // #ffffff - Main text
className="text-text-secondary"      // #e5e5e5 - Secondary text
className="text-text-tertiary"       // #a3a3a3 - Muted text
className="text-text-disabled"       // #6b7280 - Disabled text
```

### Accent Colors
```tsx
className="text-accent-teal"         // #14b8a6 - Primary accent
className="text-accent-cyan"         // #06b6d4 - Secondary accent
className="text-accent-red"          // #ef4444 - Error/favorites
className="text-accent-yellow"       // #f59e0b - Warnings/ratings
className="text-accent-green"        // #10b981 - Success states
```

## Gradients

### Background Gradients
```tsx
className="bg-gradient-primary"      // Teal to cyan gradient
className="bg-gradient-secondary"    // Darker teal gradient
className="bg-gradient-card-overlay" // Card overlay gradient
```

### Text Gradients
```tsx
className="gradient-text-primary"    // Gradient text effect
```

## Custom Utilities

### Glass Effects
```tsx
className="glass-effect"             // Basic glass morphism
className="glass-card"               // Glass card with proper styling
```

### Navigation
```tsx
className="nav-tab-bar"              // Bottom navigation bar
className="search-bar"               // Search input styling
```

## Spacing and Layout

### Container
```tsx
className="max-w-container mx-auto px-6"  // Responsive container (428px max)
```

### Common Spacing
```tsx
className="mb-8"                     // Section spacing
className="mb-6"                     // Element spacing
className="p-6"                      // Standard padding
className="px-6"                     // Horizontal padding
```

## Typography

### Headings
```tsx
className="text-3xl font-bold text-text-primary"     // H1
className="text-2xl font-semibold text-text-primary" // H2
className="text-xl font-semibold text-text-primary"  // H3
```

### Body Text
```tsx
className="text-base text-text-primary"              // Normal text
className="text-sm text-text-tertiary"               // Small text
```

## Animations and Transitions

### Standard Transitions
```tsx
className="transition-colors duration-normal"        // Color transitions
className="transition-all duration-normal ease-in-out" // All properties
className="hover:scale-105 transition-transform duration-normal" // Hover effects
```

### Durations (from design system)
- `duration-fast` - 150ms
- `duration-normal` - 300ms  
- `duration-slow` - 500ms

## Usage with Design Utils

Import the utility functions:
```tsx
import { designSystemClasses, replaceHardcodedColors } from '@/lib/design-utils'

// Use pre-defined combinations
<div className={designSystemClasses.page}>
  <h1 className={designSystemClasses.heading1}>Title</h1>
  <button className={designSystemClasses.buttonPrimary}>Click me</button>
</div>

// Or replace hardcoded classes programmatically
const oldClassName = "bg-blue-500/10 text-white"
const newClassName = replaceHardcodedColors(oldClassName) // "glass-effect text-text-primary"
```

## Validation Checklist

Before committing code, ensure:
- [ ] No hardcoded color values (blue, slate, white, etc.)
- [ ] Using design system color tokens
- [ ] Consistent spacing from design system
- [ ] Proper typography classes
- [ ] Glass effects use design system utilities
- [ ] Transitions use design system durations
- [ ] Gradients use design system definitions

## Examples

### Complete Page Example
```tsx
export default function ExamplePage() {
  return (
    <main className="bg-background-primary text-text-primary min-h-screen">
      <header className="px-6 py-6">
        <h1 className="text-2xl font-semibold text-text-primary">Page Title</h1>
      </header>
      
      <div className="px-6 mb-8">
        <div className="search-bar flex items-center">
          <SearchIcon className="text-text-tertiary mr-3" />
          <span className="text-text-tertiary">Search...</span>
        </div>
      </div>
      
      <div className="px-6 space-y-6">
        <div className="glass-card">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Card Title</h2>
          <p className="text-text-secondary">Card content...</p>
          <button className="btn-primary mt-4">Action</button>
        </div>
      </div>
    </main>
  )
}
```

### Icon Usage
```tsx
import { iconColors } from '@/lib/design-utils'

<MapPin className={iconColors.primary} />     // Primary brand color
<Heart className={iconColors.error} />        // Error/favorite color  
<Star className={iconColors.warning} />       // Warning/rating color
```