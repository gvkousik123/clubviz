# ClubViz Color Palette Reference

## Primary Colors

### Background
```css
/* Main Background - Deep Teal Black */
#031313
rgb(3, 19, 19)
```

### Cards & Components
```css
/* Glassmorphism Base - Dark Teal */
#0e1f1f
rgb(14, 31, 31)
rgba(14, 31, 31, 0.7)  /* With transparency */
```

### Accents
```css
/* Border/Muted Elements */
#1a3030
rgb(26, 48, 48)
```

---

## Gradient (Headers Only)

### Primary Header Gradient
```css
linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)
```
**Teal → Cyan**
- Start: `#14b8a6` (Bright Teal)
- End: `#0891b2` (Deep Cyan)

### Alternative Header Gradient
```css
linear-gradient(to right, #14b8a6 0%, #06b6d4 100%)
```

---

## Text Colors

### Primary Text
```css
#ffffff (White)
rgba(255, 255, 255, 1)
```

### Secondary Text
```css
rgba(255, 255, 255, 0.8)  /* 80% opacity */
```

### Tertiary Text
```css
rgba(255, 255, 255, 0.7)  /* 70% opacity */
```

### Muted Text
```css
rgba(255, 255, 255, 0.5)  /* 50% opacity */
```

---

## Accent Colors

### Teal (Primary Brand)
```css
#14b8a6  /* Teal 500 */
#0d9488  /* Teal 600 */
#0f766e  /* Teal 700 */
```

### Cyan (Secondary Brand)
```css
#06b6d4  /* Cyan 500 */
#0891b2  /* Cyan 600 */
#0e7490  /* Cyan 700 */
```

### Status Colors
```css
/* Success / Live */
#10b981  (Green)

/* Warning / Scheduled */
#f59e0b  (Orange)

/* Error / Offline */
#ef4444  (Red)
```

---

## Border Colors

### Subtle Borders
```css
rgba(255, 255, 255, 0.1)  /* 10% white */
```

### Medium Borders
```css
rgba(255, 255, 255, 0.15) /* 15% white */
border-teal-500/30        /* 30% teal */
```

### Strong Borders
```css
rgba(255, 255, 255, 0.2)  /* 20% white */
border-teal-400/40        /* 40% teal */
```

---

## Glassmorphism Effects

### Light Glass
```css
background: rgba(14, 31, 31, 0.5);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.08);
```

### Standard Glass
```css
background: rgba(14, 31, 31, 0.7);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Strong Glass
```css
background: rgba(14, 31, 31, 0.85);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.15);
```

---

## Genre Tag Gradients

### Primary (Teal)
```css
linear-gradient(135deg, #14b8a6, #0891b2)
```

### Purple-Pink
```css
linear-gradient(to right, #8B5CF6, #EC4899)
```

### Blue-Indigo
```css
linear-gradient(to right, #3B82F6, #6366F1)
```

### Orange-Red
```css
linear-gradient(to right, #F97316, #EF4444)
```

---

## Shadow Effects

### Soft Shadow
```css
box-shadow: 0 4px 20px rgba(20, 184, 166, 0.2);
```

### Glow Effect
```css
box-shadow: 0 0 20px rgba(20, 184, 166, 0.3);
```

### Card Shadow
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
```

---

## Border Radius Scale

### Small
```css
0.75rem  (12px)  /* rounded-xl in Tailwind */
```

### Medium
```css
1rem     (16px)  /* rounded-2xl in Tailwind */
```

### Large
```css
1.25rem  (20px)  /* rounded-[20px] */
```

### Extra Large
```css
1.5rem   (24px)  /* rounded-3xl in Tailwind */
2rem     (32px)  /* rounded-[32px] for headers */
```

---

## Usage Examples

### Full Page Background
```tsx
<div className="min-h-screen bg-[#031313]">
  {/* Content */}
</div>
```

### Header with Gradient
```tsx
<div className="header-gradient rounded-b-[32px]">
  {/* Header content */}
</div>
```

### Glassmorphism Card
```tsx
<div className="glassmorphism p-4 rounded-2xl">
  {/* Card content */}
</div>
```

### Border Example
```tsx
<div className="glassmorphism border border-teal-500/30 rounded-xl">
  {/* Content */}
</div>
```

---

## Color Combinations

### Background + Card
```css
Background: #031313
Card:       rgba(14, 31, 31, 0.7) with blur
Text:       #ffffff
```

### Header + Background
```css
Header:     linear-gradient(135deg, #14b8a6, #0891b2)
Background: #031313
Text:       #ffffff
```

### Card + Border + Text
```css
Card:   rgba(14, 31, 31, 0.7)
Border: rgba(255, 255, 255, 0.1)
Text:   rgba(255, 255, 255, 0.8)
```

---

## Accessibility Notes

### Contrast Ratios
- White text (#ffffff) on #031313: **21:1** ✅ (Excellent)
- White text on #0e1f1f: **19:1** ✅ (Excellent)
- Teal (#14b8a6) on #031313: **8:1** ✅ (Good)

### Best Practices
- Always use white or light text on dark backgrounds
- Ensure minimum 4.5:1 contrast for body text
- Use 3:1 for large text (18px+)
- Test with accessibility tools

---

## Don'ts ❌

### Never Use These Old Colors
```css
#1e2328  /* Old background */
#2d343a  /* Old card */
#0a2e30  /* Old background variant */
#222831  /* Old card variant */
#0d7377  /* Old gradient start */
```

### Never Use Gradient On
- Cards (use glassmorphism instead)
- Regular buttons (unless they're CTAs)
- Text containers
- List items

---

## Color Naming Convention

### CSS Custom Properties
```css
--clubviz-dark-bg: #031313;
--clubviz-dark-card: #0e1f1f;
--clubviz-teal-gradient-start: #14b8a6;
--clubviz-teal-gradient-end: #0891b2;
```

### Tailwind Classes
```css
.bg-[#031313]           /* Background */
.glassmorphism          /* Cards */
.header-gradient        /* Headers only */
.border-teal-500/30     /* Borders */
```

---

## Color Mood & Psychology

### #031313 (Deep Teal Black)
- **Mood**: Sophisticated, mysterious, upscale
- **Use**: Creates intimate nightclub atmosphere
- **Feeling**: Premium, exclusive, modern

### #0e1f1f (Dark Teal) with Glassmorphism
- **Mood**: Elegant, floating, depth
- **Use**: Elevated content, important cards
- **Feeling**: Interactive, touchable, refined

### Teal Gradient
- **Mood**: Energetic, vibrant, modern
- **Use**: Call-to-action, headers, highlights
- **Feeling**: Dynamic, exciting, fresh

---

**Last Updated**: December 2024  
**Design Version**: 2.0 (Standardized)
