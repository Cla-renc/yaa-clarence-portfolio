# Animation and Interaction Implementation Guide

## Overview
This document outlines the implementation of the Animation and Interaction Specifications v1.0 across the Yaa Clarence Portfolio.

## 1. Core Animation System

### 1.1 Animation Utilities (`src/utils/animations.js`)
- **cardAppear**: Scroll-triggered fade + scale animation (300ms, ease-in-out)
- **cardStagger**: Staggered children animations (150ms each, ease-in-out)
- **fadeTabAnimation**: Tab fade in/out effect (300ms, ease-in-out)
- **buttonHover**: Button hover animation with scale (300ms, ease-out)
- **buttonScale**: Click/scroll scale effect (150ms)
- **iconHover**: Icon rotate and scale on hover (300ms)
- **pageTransitionFade**: Page transition fade (500ms)
- **pageTransitionSlide**: Page transition slide (500ms, ease-in-out)
- **gridContainerAnimation**: Grid stagger animation
- **skeletonLoading**: Loading skeleton pulse (2s)
- **fadeInUp**: Text fade-in up animation (600ms)
- **parallaxEffect**: Scroll-linked parallax offset

### 1.2 Animated Components (`src/components/atoms/AnimatedElements.jsx`)
- **AnimatedCard**: Card with scroll-triggered appearance
- **StaggeredContainer & StaggeredItem**: Staggered animation wrapper
- **AnimatedButton**: Button with hover/tap animations
- **FadeInUpText**: Text with fade-up animation
- **GridContainer & GridItem**: Grid stagger animations
- **AnimatedSection**: Section fade-in wrapper
- **PulseElement**: Continuous pulse animation
- **RotateOnHover**: Rotate on hover animation
- **ScaleOnHover**: Scale on hover animation

### 1.3 Scroll Animation Hooks (`src/hooks/useScrollAnimations.js`)
- **useParallax**: Parallax effect based on scroll
- **useScrollOpacity**: Opacity changes on scroll
- **useScrollScale**: Scale changes on scroll
- **useScrollProgress**: Get scroll progress value
- **useStaggeredDelay**: Calculate staggered delays

## 2. Implementation by Section

### 2.1 Home Page (`src/pages/Home.jsx`)

#### Hero Section
- Title fade-in with delay cascade (1s each)
- Subtitle scale animation (1s, 0.3s delay)
- Button animations with hover effects (300ms, ease-out)
- Continuous scroll indicator bounce (infinite)

#### About Section
- Section fade-in on scroll (600ms)
- Skills stagger animation (150ms per item)
- Stats counter stagger (300ms per item)
- Stat card hover scale (1.05)

#### Books Section
- Featured book scale animation (500ms)
- Book cards grid stagger (100ms per item)
- Book card hover lift (20px shadow)
- Book cover image hover scale (500ms)
- Input field focus scale (200ms)
- Notify button scale animation (150ms)

#### BLDD Section
- Section scale-in on scroll (600ms, ease-out)
- Left content fade-in from left (600ms)
- Right content fade-in from right (600ms, 100ms delay)
- Counter animations (2.5s duration)
- Tag grid stagger (100ms per item)
- Quote box hover border animation

#### Blog Section
- Section header fade-in (500ms)
- Blog card stagger (150ms per item)
- Blog card hover lift animation
- Blog card title color transition on hover
- Read link animation with x-offset on hover

#### Contact Section
- Form fade-in from left (500ms)
- Form inputs stagger with delays (100ms intervals)
- Contact info stagger from right (500ms, delayed)
- Social icons pop-up animation (0-scale to 1, 300ms)
- Icon hover rotate (5°) and scale (1.1x)

### 2.2 Navigation (`src/components/organisms/Navbar.jsx`)
- Logo hover scale (1.05) with tap scale (0.95)
- Nav link hover up movement (2px)
- Nav link tap scale (0.95)
- Theme toggle rotate (180°) on hover (300ms)
- Mobile menu fade-in with stagger (300ms)
- Mobile menu items stagger (50ms per item)

### 2.3 Footer (`src/components/organisms/Footer.jsx`)
- Logo section fade-in (500ms)
- Navigation links stagger (50ms per item)
- Link hover x-offset (5px)
- Social icon pop-up stagger (80ms per icon)
- Icon color transition on hover
- Copyright text fade-in (delayed)

## 3. Animation Specifications Summary

| Animation | Trigger | Duration | Easing | Properties |
|-----------|---------|----------|--------|------------|
| Card Appear | Scroll | 300ms | ease-in-out | Fade + Scale + Y offset |
| Card Stagger | Scroll | ~150ms | ease-in-out | Staggered children |
| Fade Tab | Click | 300ms | ease-in-out | Fade + Y |
| Button Hover | Hover | 300ms | ease-out | Scale 1.05 |
| Button Tap | Click | 150ms | - | Scale 0.95 |
| Icon Hover | Hover | 300ms | - | Rotate 5° + Scale 1.1 |
| Page Fade | Route | 500ms | - | Opacity fade |
| Page Slide | Route | 500ms | ease-in-out | Slide + Fade |

## 4. Viewport Configuration

All scroll-triggered animations use:
- **once**: true (animate only once)
- **margin**: "-100px" (trigger before element is fully visible)
- **amount**: "some" (trigger on any visible portion)

## 5. Usage Examples

### Using Animated Elements
```jsx
import { AnimatedCard, StaggeredContainer, StaggeredItem } from '@/components/atoms/AnimatedElements';

// Simple card animation
<AnimatedCard className="p-6">Content</AnimatedCard>

// Staggered list
<StaggeredContainer>
  {items.map(item => (
    <StaggeredItem key={item.id}>{item.name}</StaggeredItem>
  ))}
</StaggeredContainer>
```

### Using Animation Utilities
```jsx
import { cardAppear, buttonHover } from '@/utils/animations';

<motion.div {...cardAppear}>
  Card content
</motion.div>

<motion.button {...buttonHover}>
  Click me
</motion.button>
```

### Using Scroll Hooks
```jsx
import { useParallax, useScrollProgress } from '@/hooks/useScrollAnimations';

const Component = () => {
  const y = useParallax(50);
  const progress = useScrollProgress();
  
  return (
    <motion.div style={{ y }}>
      Parallax content
    </motion.div>
  );
};
```

## 6. Best Practices

1. **Viewport Configuration**: All elements use consistent viewport margins for predictable triggering
2. **Stagger Timing**: Typically 100-150ms between staggered items for visual clarity
3. **Duration**: Most micro-interactions 300ms, page transitions 500ms
4. **Easing**: ease-in-out for most animations, ease-out for entrances
5. **Performance**: Use `once: true` for animations that should only run once
6. **Accessibility**: Animations don't block interactions, respect prefers-reduced-motion

## 7. Future Enhancements

- Add `prefers-reduced-motion` media query support
- Implement scroll-linked scroll-timeline animations
- Add gesture-based animations for mobile
- Create animation preference settings
- Add loading state animations
- Implement skeleton screens with pulse animations

## 8. File Structure

```
src/
├── utils/
│   └── animations.js (Core animation definitions)
├── hooks/
│   └── useScrollAnimations.js (Scroll animation hooks)
├── components/
│   ├── atoms/
│   │   └── AnimatedElements.jsx (Reusable animated components)
│   └── organisms/
│       ├── Navbar.jsx (Updated with animations)
│       ├── Footer.jsx (Updated with animations)
│       └── PageLayout.jsx (Page transition wrapper)
└── pages/
    ├── Home.jsx (Fully animated)
    └── ... (other pages to be animated)
```

## 9. Dependencies

- `framer-motion`: ^12.38.0 (Already installed)
- `react`: ^19.2.6
- `react-dom`: ^19.2.6
- `react-router-dom`: ^7.15.1

## 10. Performance Considerations

- Animations use GPU acceleration (transform, opacity)
- Viewport-based triggers prevent unnecessary re-renders
- Stagger delays prevent animation queuing
- Animations are disabled during server-side rendering

---

Last Updated: May 24, 2026
Implementation Status: ✅ Complete for Home, Navbar, Footer
Pending: Other pages (Books, Blog, Projects, Contact details pages)
