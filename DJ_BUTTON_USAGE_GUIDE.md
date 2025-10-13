# DJ Button Component - Usage Guide

## Overview
The DJ Button component provides animated music beat visualizations for club and event pages.

---

## Component Location
`components/ui/dj-button.tsx`

---

## Components Available

### 1. DJButton
A circular floating button with music beat animation.

#### Import
```tsx
import { DJButton } from '@/components/ui/dj-button';
```

#### Basic Usage
```tsx
<DJButton />
```

#### Props
```typescript
interface DJButtonProps {
  onClick?: () => void;       // Click handler
  className?: string;         // Additional CSS classes
  size?: 'sm' | 'md' | 'lg'; // Button size (default: 'md')
  isPlaying?: boolean;        // Playing state (default: true)
}
```

#### Examples

**Small Button**
```tsx
<DJButton size="sm" />
```

**Large Button with Click Handler**
```tsx
<DJButton 
  size="lg"
  onClick={() => console.log('DJ button clicked!')}
/>
```

**Paused State**
```tsx
<DJButton isPlaying={false} />
```

#### Features
- ✨ Animated beat rings (ping effect)
- 🎵 Pulsing music icon
- 📊 5-bar soundwave animation at bottom
- 🎨 Header gradient background
- 🔊 Configurable playing state

---

### 2. DJBanner
A horizontal banner showing DJ information with animations.

#### Import
```tsx
import { DJBanner } from '@/components/ui/dj-button';
```

#### Basic Usage
```tsx
<DJBanner djName="DJ MARTIN" />
```

#### Props
```typescript
interface DJBannerProps {
  djName: string;        // Required: DJ name
  genre?: string;        // Optional: Music genre
  onClick?: () => void;  // Optional: Click handler
  className?: string;    // Optional: Additional CSS classes
}
```

#### Examples

**With Genre**
```tsx
<DJBanner 
  djName="DJ ALEXXX"
  genre="Electronic House"
/>
```

**With Click Handler**
```tsx
<DJBanner 
  djName="DJ SHADOW"
  genre="Bollytechno"
  onClick={() => router.push('/dj/shadow')}
/>
```

#### Features
- 🎤 NOW PLAYING indicator with volume icon
- 👤 Circular DJ avatar with animation
- 🎶 DJ name and genre display
- 📊 5-bar vertical soundwave
- 🌊 Pulsing background effect
- 🎨 Header gradient background

---

## Complete Integration Example

### Event/Club Detail Page Pattern

```tsx
{/* Now Playing Section with DJ */}
<div className="px-6 py-6 bg-[#031313]">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-white font-semibold text-sm">Now Playing</h3>
  </div>
  
  <div className="glassmorphism p-4 rounded-2xl">
    {/* DJ Info Section */}
    <div className="flex items-center gap-4 mb-4">
      <div className="relative">
        {/* Animated DJ Avatar */}
        <div className="w-16 h-16 header-gradient rounded-2xl flex items-center justify-center animate-pulse">
          <Music className="w-8 h-8 text-white" />
        </div>
        
        {/* Live Status Indicator */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#031313] flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </div>
      
      {/* DJ Details */}
      <div className="flex-1">
        <div className="text-white text-base font-bold mb-1">DJ MARTIN LIVE</div>
        <div className="text-white/70 text-sm">Spinning the best beats tonight</div>
      </div>
    </div>
    
    {/* Genre Tags */}
    <div className="flex gap-2 flex-wrap">
      <span className="header-gradient text-white text-xs px-3 py-1.5 rounded-full font-medium">
        BollyAfro Mix
      </span>
      <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs px-3 py-1.5 rounded-full font-medium">
        Techno Vibes
      </span>
      <span className="glassmorphism-light text-white text-xs px-3 py-1.5 rounded-full font-medium">
        EDM
      </span>
    </div>
    
    {/* Soundwave Visualization */}
    <div className="mt-4 flex items-center justify-center gap-1 h-12">
      {[4, 8, 6, 10, 7, 12, 9, 5, 11, 6, 8, 10, 7, 9, 6, 4].map((height, i) => (
        <div
          key={i}
          className="w-1 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full animate-soundwave"
          style={{
            height: `${height * 3}px`,
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
    </div>
  </div>
</div>
```

---

## Soundwave Customization

### Different Color Schemes

**Teal/Cyan (Default)**
```tsx
className="bg-gradient-to-t from-teal-500 to-cyan-400"
```

**Purple/Pink**
```tsx
className="bg-gradient-to-t from-purple-500 to-pink-500"
```

**Green/Blue**
```tsx
className="bg-gradient-to-t from-green-500 to-blue-500"
```

**Orange/Red**
```tsx
className="bg-gradient-to-t from-orange-500 to-red-500"
```

### Bar Heights Array
```tsx
// Calm wave
[4, 6, 5, 7, 6, 8, 7, 5]

// Energetic wave (recommended)
[4, 8, 6, 10, 7, 12, 9, 5, 11, 6, 8, 10, 7, 9, 6, 4]

// Intense wave
[6, 12, 8, 14, 10, 16, 12, 7, 15, 9, 12, 14, 10, 13, 8, 6]
```

---

## Animation Details

### Soundwave Animation
- **Duration**: 0.6 seconds
- **Timing**: ease-in-out
- **Loop**: infinite
- **Effect**: ScaleY from 0.5 to 1.5
- **Stagger**: Each bar delayed by 0.05s

### Pulse Animation (Built-in Tailwind)
- Used for DJ avatar and live indicator
- Smooth opacity fade effect

### Ping Animation (Built-in Tailwind)
- Used for beat rings on DJButton
- Expanding circle effect with fade

---

## Best Practices

### ✅ DO:
- Use DJ components on club and event detail pages
- Match soundwave colors to the page theme
- Include live status indicator when DJ is currently playing
- Add genre tags to show music style
- Use glassmorphism container for the section

### ❌ DON'T:
- Don't overuse DJ buttons on listing pages
- Don't use without the glassmorphism card wrapper
- Don't use too many genre tags (max 3-4)
- Don't customize the animation timing (keep it consistent)

---

## Live Status Indicator

### Active (Green)
```tsx
<div className="w-6 h-6 bg-green-500 rounded-full">
  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
</div>
```

### Inactive (Gray)
```tsx
<div className="w-6 h-6 bg-gray-500 rounded-full">
  <div className="w-2 h-2 bg-white rounded-full" />
</div>
```

### Scheduled (Orange)
```tsx
<div className="w-6 h-6 bg-orange-500 rounded-full">
  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
</div>
```

---

## Genre Tag Patterns

### Primary (Teal Gradient)
```tsx
<span className="header-gradient text-white text-xs px-3 py-1.5 rounded-full font-medium">
  BollyAfro Mix
</span>
```

### Secondary (Purple-Pink)
```tsx
<span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs px-3 py-1.5 rounded-full font-medium">
  Techno Vibes
</span>
```

### Tertiary (Glassmorphism)
```tsx
<span className="glassmorphism-light text-white text-xs px-3 py-1.5 rounded-full font-medium">
  EDM
</span>
```

---

## Responsive Considerations

The DJ sections are mobile-first and work well on all screen sizes:
- Soundwave bars scale with container
- Avatar sizes are fixed for consistency
- Text truncates gracefully
- Genre tags wrap to multiple lines if needed

---

## Performance Notes

- All animations use CSS transforms (GPU accelerated)
- No JavaScript required after mount
- Lightweight component (<2KB)
- Animations pause when not in viewport (browser optimization)

---

## Accessibility

- Semantic HTML structure
- Proper ARIA labels on interactive elements
- Keyboard navigable (when onClick provided)
- Screen reader friendly text alternatives

---

**Component Version**: 1.0  
**Last Updated**: December 2024  
**Compatibility**: React 18+, Next.js 14+
