# Animation Guidelines

## Overview

This document describes the animation system integrated into the web application, covering Framer Motion and GSAP usage, performance considerations, accessibility features, and guidelines for extending the system.

## Animation Stack

### Primary Libraries

- **Framer Motion**: For micro-interactions, entrance animations, and React component animations
- **GSAP (GreenSock Animation Platform)**: For complex scroll-driven animations and parallax effects
- **ScrollTrigger**: GSAP plugin for scroll-synchronized animations

### Core Philosophy

The animation system is designed around these core principles:

1. **Performance First**: All animations run at 60fps and don't block the main thread
2. **Accessibility**: Respects user preferences for reduced motion
3. **Progressive Enhancement**: Animations enhance the experience but don't break functionality
4. **Consistency**: Uses centralized motion tokens and easing curves
5. **React-Friendly**: Properly handles concurrent rendering and SSR

## When to Use Framer Motion vs GSAP

### Use Framer Motion for:

- **Micro-interactions**: Button hovers, focus states, tap animations
- **Entrance animations**: Fade-in effects, slide-in animations, reveal effects
- **Component-level animations**: Modal transitions, dropdown menus, tabs
- **Staggered animations**: Lists and grids where items animate sequentially
- **Page transitions**: Route changes and layout transitions
- **Declarative animations**: When you want React to manage the animation state

**Example:**
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
>
  Content here
</motion.div>
```

### Use GSAP for:

- **Scroll-driven animations**: Parallax scrolling, scroll-triggered reveals
- **Complex timeline animations**: Multi-step sequences with precise control
- **Performance-critical animations**: When you need maximum performance
- **SVG animations**: Path morphing, complex SVG transformations
- **Background animations**: Large-scale background effects
- **Imperative animations**: When you need fine-grained control

**Example:**
```tsx
import { useScrollParallax } from '@/lib/hooks/animations';

const { elementRef } = useScrollParallax({ speed: 0.5 });

<div ref={elementRef}>
  Parallax content
</div>
```

## Animation Tokens and Configuration

### Centralized Configuration (`/lib/animations.ts`)

All animation timing, easing, and distances are centralized for consistency:

```typescript
export const ANIMATION_CONFIG = {
  durations: {
    instant: 0,
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    slower: 0.8,
  },
  easings: {
    easeOut: 'power2.out',
    easeIn: 'power2.in',
    // ... more easing curves
  },
  distances: {
    small: 20,
    medium: 40,
    large: 80,
    // ... more distances
  },
};
```

### Animation Tokens (`ANIMATION_TOKENS`)

Predefined animation configurations for common patterns:

```typescript
export const ANIMATION_TOKENS = {
  section: {
    fadeInUp: {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.4,
        ease: 'power3.out',
      },
    },
    // ... more tokens
  },
  micro: {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    // ... more micro-interactions
  },
};
```

## Available Hooks

### `useScrollParallax`

For scroll-driven parallax effects:

```tsx
const { elementRef, isParallaxActive } = useScrollParallax({
  speed: 0.5,           // Movement speed (0.1-1)
  startOffset: 'top bottom',  // When animation starts
  endOffset: 'bottom top',    // When animation ends
  enabled: true          // Enable/disable based on preferences
});

<div ref={elementRef}>
  Content with parallax effect
</div>
```

### `useInViewMotion`

For entrance animations when elements come into view:

```tsx
const { ref, inView, hasAnimated } = useInViewMotion({
  threshold: 0.3,           // Trigger when 30% visible
  triggerOnce: true,         // Only animate once
  delay: 0,                  // Animation delay
  animation: 'fadeInUp',     // Animation type
  enabled: !shouldReduceMotion()
});

<div ref={ref}>
  Content that animates on scroll
</div>
```

### `useStaggeredAnimation`

For animating multiple elements in sequence:

```tsx
const { elementRefs } = useRefArray(3); // Custom hook for multiple refs

useStaggeredAnimation(elementRefs, {
  animation: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 }
  },
  staggerDelay: 0.1,
  enabled: !shouldReduceMotion()
});
```

### `useMotionPreferences`

Detect and respond to user motion preferences:

```tsx
const { prefersReducedMotion } = useMotionPreferences();

if (prefersReducedMotion) {
  return <StaticContent />;
}
```

## Performance Guidelines

### 1. Respect Reduced Motion

Always check user preferences:

```tsx
import { shouldReduceMotion } from '@/lib/animations';

if (shouldReduceMotion()) {
  return <NonAnimatedComponent />;
}
```

### 2. Use CSS Transforms Over Positioning

```tsx
// ✅ Good - Uses transforms
<motion.div
  animate={{ x: 100, y: 50 }}
  style={{ transform: 'translate3d(0, 0, 0)' }} // Force hardware acceleration
/>

// ❌ Bad - Causes layout thrashing
<motion.div
  animate={{ left: 100, top: 50 }}
/>
```

### 3. Optimize Scroll Animations

```tsx
// Use appropriate scroll triggers
gsapUtils.setupParallax(element, {
  speed: 0.3,              // Slower = better performance
  startOffset: 'top 80%',   // Trigger when element is mostly visible
  endOffset: 'bottom 20%',  // End when mostly scrolled past
});
```

### 4. Avoid Overlapping Animations

```tsx
// ✅ Good - Sequential animations
<StaggerContainer staggerDelay={0.1}>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
  <StaggerItem>Item 3</StaggerItem>
</StaggerContainer>

// ❌ Bad - Multiple animations fighting each other
<motion.div animate={{ y: 0 }} whileHover={{ y: -5 }}>
  <motion.div animate={{ y: 0 }} whileInView={{ y: -10 }}>Conflicting</motion.div>
</motion.div>
```

### 5. Use will-change Sparingly

```tsx
// ✅ Good - Add during animation, remove after
useEffect(() => {
  element.current.style.willChange = 'transform';
  
  return () => {
    element.current.style.willChange = '';
  };
}, []);

// ❌ Bad - Always on
<div style={{ willChange: 'transform' }}>
```

## SSR and Streaming Considerations

### Server-Side Rendering Safety

```tsx
'use client';

import { useEffect, useState } from 'react';

export function AnimatedComponent() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <StaticFallback />;
  }
  
  return <motion.div>Animation here</motion.div>;
}
```

### RSC Boundary Management

```tsx
// components/animated-wrapper.tsx (Client Component)
'use client';
import { motion } from 'framer-motion';

export function AnimatedWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

// app/page.tsx (Server Component)
import { AnimatedWrapper } from '@/components/animated-wrapper';

export default function Page() {
  return (
    <AnimatedWrapper>
      <ServerRenderedContent />
    </AnimatedWrapper>
  );
}
```

## Accessibility Features

### 1. Reduced Motion Support

All animations automatically disable when `prefers-reduced-motion: reduce` is set:

```tsx
// Automatic fallback
const { elementRef } = useScrollParallax({ enabled: !shouldReduceMotion() });

// Manual check
if (shouldReduceMotion()) {
  return <StaticComponent />;
}
```

### 2. Focus Management

```tsx
// Ensure focus isn't stolen by animations
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  // Don't animate tabindex changes
>
  Button
</motion.button>
```

### 3. Screen Reader Considerations

```tsx
// Don't animate content that should be announced
<div aria-live="polite">
  {shouldReduceMotion() ? (
    <StaticMessage />
  ) : (
    <AnimatedMessage />
  )}
</div>
```

## Testing Animation Performance

### 1. Performance Monitoring

```tsx
// Add to development builds
if (process.env.NODE_ENV === 'development') {
  // Monitor animation performance
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > 16.67) { // Over 60fps threshold
        console.warn('Slow animation:', entry);
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure'] });
}
```

### 2. Accessibility Testing

```typescript
// Test reduced motion behavior
describe('Animations respect reduced motion', () => {
  it('disables animations when prefers-reduced-motion is set', () => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    Object.defineProperty(mediaQuery, 'matches', { value: true });
    
    const { container } = render(<AnimatedComponent />);
    expect(container.querySelector('[data-animation-disabled]')).toBeTruthy();
  });
});
```

## Adding New Animations

### 1. Extend Animation Tokens

```typescript
// lib/animations.ts
export const ANIMATION_TOKENS = {
  // ... existing tokens
  custom: {
    bounceIn: {
      initial: { scale: 0, opacity: 0 },
      animate: { 
        scale: 1, 
        opacity: 1,
        transition: {
          type: 'spring',
          damping: 15,
          stiffness: 300,
        }
      },
    },
  },
};
```

### 2. Create Custom Hook

```typescript
// lib/hooks/animations.ts
export const useBounceAnimation = (options = {}) => {
  const { elementRef } = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!elementRef.current || shouldReduceMotion()) return;
    
    return gsap.fromTo(
      elementRef.current,
      ANIMATION_TOKENS.custom.bounceIn.initial,
      ANIMATION_TOKENS.custom.bounceIn.animate
    );
  }, []);
  
  return { elementRef };
};
```

### 3. Add Component Support

```tsx
// components/animated.tsx
export const BouncyContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        {...ANIMATION_TOKENS.custom.bounceIn}
        className={cn(className)}
        {...props}
      />
    );
  }
);
```

## Common Patterns

### Page Transitions

```tsx
// app/layout.tsx
import { motion } from 'framer-motion';

export default function Layout({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
```

### Loading States

```tsx
const { isLoading } = useSomeData();
const { prefersReducedMotion } = useMotionPreferences();

if (isLoading) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : 0.3,
        repeat: prefersReducedMotion ? 0 : Infinity,
        repeatType: 'reverse'
      }}
    >
      Loading...
    </motion.div>
  );
}
```

### Interactive Cards

```tsx
<AnimatedCard
  whileHover={{ 
    y: -5,
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)' 
  }}
  transition={{ duration: 0.2 }}
>
  Card content
</AnimatedCard>
```

## Troubleshooting

### Animation Not Triggering

1. Check if `shouldReduceMotion()` is returning true
2. Ensure the ref is properly attached
3. Verify the element is actually in the viewport
4. Check for JavaScript errors in console

### Performance Issues

1. Use `transform` and `opacity` only for animations
2. Add `style={{ transform: 'translate3d(0, 0, 0)' }}` for GPU acceleration
3. Reduce animation complexity on mobile devices
4. Use `will-change` CSS property sparingly

### SSR Issues

1. Ensure all animation components have `'use client'` directive
2. Add loading states that don't rely on animations
3. Use proper ref management for client-side only functionality

### Accessibility Issues

1. Test with `prefers-reduced-motion: reduce`
2. Ensure animations don't interfere with keyboard navigation
3. Don't animate content that's being read by screen readers
4. Provide alternatives for complex animations

## Future Extensibility

### Adding New Animation Libraries

1. Install the library: `npm add [library-name]`
2. Create a new hook in `/lib/hooks/animations.ts`
3. Add configuration to `/lib/animations.ts`
4. Update this documentation

### Extending Section Components

1. Add animation props to existing section interfaces
2. Use existing hooks where appropriate
3. Ensure reduced motion support
4. Update documentation with new patterns

### Performance Monitoring

Consider implementing:
- Animation performance metrics
- User experience analytics for animation impact
- A/B testing for animation effectiveness
- Automatic animation quality degradation on low-end devices

---

This animation system is designed to be both powerful and accessible, providing a smooth user experience while respecting user preferences and device capabilities. When in doubt, prioritize performance and accessibility over visual complexity.