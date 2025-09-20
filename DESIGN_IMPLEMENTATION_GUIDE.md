# ClubViz Design System Implementation Guide

## Quick Start

### 1. Import Design System
```typescript
// In your component files
import { designSystem, tokens } from './design-system';

// In your CSS files
@import './styles/design-system.css';
```

### 2. Font Integration
The design system uses **Poppins** as the primary font family. It's already integrated via Google Fonts in the CSS file.

```css
/* Automatically loaded in design-system.css */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
```

## Component Implementation Examples

### Button Components
```tsx
// Primary Button
const PrimaryButton = ({ children, ...props }) => (
  <button 
    className="btn btn-primary"
    style={{
      background: tokens.color.gradients.primaryHero,
      fontFamily: tokens.font.fontFamily.primary,
      fontWeight: tokens.font.fontWeights.semibold,
    }}
    {...props}
  >
    {children}
  </button>
);

// Secondary Button
const SecondaryButton = ({ children, ...props }) => (
  <button 
    className="btn btn-secondary"
    style={{
      background: tokens.color.background.glass,
      fontFamily: tokens.font.fontFamily.primary,
    }}
    {...props}
  >
    {children}
  </button>
);
```

### Card Components
```tsx
const Card = ({ children, variant = 'primary' }) => (
  <div 
    className={`card ${variant === 'glass' ? 'card-glass' : ''}`}
    style={{
      background: variant === 'glass' 
        ? 'rgba(255, 255, 255, 0.05)' 
        : tokens.color.background.glass,
      borderRadius: tokens.radius['2xl'],
      padding: tokens.space[6],
    }}
  >
    {children}
  </div>
);
```

### Typography Components
```tsx
const Typography = ({ 
  variant = 'body', 
  weight = 'regular', 
  color = 'primary',
  children 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1': return { fontSize: tokens.font.fontSizes['4xl'], fontWeight: tokens.font.fontWeights.bold };
      case 'h2': return { fontSize: tokens.font.fontSizes['3xl'], fontWeight: tokens.font.fontWeights.semibold };
      case 'h3': return { fontSize: tokens.font.fontSizes['2xl'], fontWeight: tokens.font.fontWeights.semibold };
      case 'body': return { fontSize: tokens.font.fontSizes.base, fontWeight: tokens.font.fontWeights[weight] };
      case 'caption': return { fontSize: tokens.font.fontSizes.sm, fontWeight: tokens.font.fontWeights.regular };
      default: return { fontSize: tokens.font.fontSizes.base };
    }
  };

  return (
    <span 
      style={{
        fontFamily: tokens.font.fontFamily.primary,
        color: tokens.color.text[color],
        ...getVariantStyles(),
      }}
    >
      {children}
    </span>
  );
};
```

## Tailwind CSS Configuration

Update your `tailwind.config.js` to use the design system:

```javascript
const { designSystem } = require('./design-system');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'primary': ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: designSystem.colors.primary,
        purple: designSystem.colors.purple,
        pink: designSystem.colors.pink,
        dark: designSystem.colors.dark,
        background: designSystem.colors.background,
        text: designSystem.colors.text,
        accent: designSystem.colors.accent,
        semantic: designSystem.colors.semantic,
      },
      backgroundImage: {
        'gradient-primary': designSystem.colors.gradients.primaryHero,
        'gradient-secondary': designSystem.colors.gradients.secondaryHero,
        'gradient-card': designSystem.colors.gradients.cardOverlay,
        'gradient-glass': designSystem.colors.gradients.glassEffect,
      },
      spacing: designSystem.spacing,
      borderRadius: designSystem.borderRadius,
      boxShadow: designSystem.shadows,
      zIndex: designSystem.zIndex,
      fontSize: designSystem.typography.fontSizes,
      fontWeight: designSystem.typography.fontWeights,
      lineHeight: designSystem.typography.lineHeights,
    },
  },
  plugins: [],
};
```

## CSS-in-JS Implementation (Styled Components)

```typescript
import styled from 'styled-components';
import { designSystem } from './design-system';

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' | 'ghost' }>`
  font-family: ${designSystem.typography.fontFamily.primary};
  font-size: ${designSystem.typography.fontSizes.base};
  font-weight: ${designSystem.typography.fontWeights.semibold};
  border-radius: ${designSystem.borderRadius.xl};
  padding: ${designSystem.spacing[3]} ${designSystem.spacing[6]};
  border: none;
  cursor: pointer;
  transition: all ${designSystem.animations.duration.normal} ${designSystem.animations.easing.easeInOut};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${designSystem.spacing[2]};

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${designSystem.colors.gradients.primaryHero};
          color: ${designSystem.colors.text.primary};
          box-shadow: ${designSystem.shadows.lg};
        `;
      case 'secondary':
        return `
          background: ${designSystem.colors.background.glass};
          color: ${designSystem.colors.text.primary};
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${designSystem.colors.text.secondary};
          border: 1px solid transparent;
        `;
      default:
        return '';
    }
  }}

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${designSystem.shadows.xl};
  }
`;

const StyledCard = styled.div<{ variant?: 'primary' | 'glass' }>`
  background: ${props => 
    props.variant === 'glass' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : designSystem.colors.background.glass
  };
  border-radius: ${designSystem.borderRadius['2xl']};
  padding: ${designSystem.spacing[6]};
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: ${designSystem.shadows.glass};
`;
```

## Usage Guidelines

### Colors
```scss
// Use semantic color names when possible
.success-message {
  color: var(--color-success);
}

.error-message {
  color: var(--color-error);
}

// Use the gradient system for hero elements
.hero-section {
  background: var(--gradient-primary-hero);
}

// Use glass effect for cards and modals
.modal {
  background: var(--color-bg-glass);
  backdrop-filter: blur(20px);
}
```

### Typography
```scss
// Use Poppins for all text
.heading {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
}

.body-text {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
}
```

### Spacing
```scss
// Use consistent spacing scale
.container {
  padding: var(--space-6);
  margin-bottom: var(--space-8);
}

.card {
  gap: var(--space-4);
}
```

## Responsive Design

```scss
/* Mobile First Approach */
.container {
  max-width: 100%;
  padding: 0 var(--space-4);
}

/* Desktop */
@media (min-width: 429px) {
  .container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--space-6);
  }
}
```

## Animation Guidelines

```scss
/* Use consistent timing and easing */
.button {
  transition: all var(--duration-normal) var(--easing-ease-in-out);
}

.modal {
  animation: fadeIn var(--duration-normal) var(--easing-ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Accessibility Considerations

```scss
/* Ensure proper contrast ratios */
.button:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Provide hover states for interactive elements */
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Best Practices

### 1. Use Design Tokens
Always use the design system tokens instead of hardcoded values:
```scss
/* ✅ Good */
padding: var(--space-4);
color: var(--color-text-primary);

/* ❌ Bad */
padding: 16px;
color: #ffffff;
```

### 2. Maintain Consistency
Use the same components and patterns across similar use cases:
```tsx
// ✅ Good - Consistent button usage
<PrimaryButton>Book Now</PrimaryButton>
<PrimaryButton>Confirm Booking</PrimaryButton>

// ❌ Bad - Mixing different button styles for same action
<PrimaryButton>Book Now</PrimaryButton>
<CustomStyledButton>Confirm Booking</CustomStyledButton>
```

### 3. Layer System
Respect the z-index scale for layering:
```scss
.modal-backdrop {
  z-index: var(--z-overlay);
}

.modal-content {
  z-index: var(--z-modal);
}
```

### 4. Glass Morphism Implementation
For the signature glass effect used throughout the app:
```scss
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-glass);
}
```

This implementation guide ensures consistent application of the ClubViz design system across all components and screens.