/**
 * Core Animation Library
 * Centralizes motion tokens, easing curves, and animation utilities
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation configuration
export const ANIMATION_CONFIG = {
  // Duration presets (in seconds)
  durations: {
    instant: 0,
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    slower: 0.8,
  },

  // Easing curves
  easings: {
    none: 'none',
    easeOut: 'power2.out',
    easeIn: 'power2.in',
    easeInOut: 'power2.inOut',
    easeOutCubic: 'power3.out',
    easeInCubic: 'power3.in',
    easeInOutCubic: 'power3.inOut',
    easeOutQuart: 'power4.out',
    easeInQuart: 'power4.in',
    easeInOutQuart: 'power4.inOut',
    backOut: 'back.out(1.7)',
    backIn: 'back.in(1.7)',
    backInOut: 'back.inOut(1.7)',
    elasticOut: 'elastic.out(1, 0.3)',
    elasticIn: 'elastic.in(1, 0.3)',
    elasticInOut: 'elastic.inOut(1, 0.3)',
  },

  // Stagger delays (in seconds)
  stagger: {
    small: 0.05,
    medium: 0.1,
    large: 0.2,
    extraLarge: 0.3,
  },

  // Distance values for animations (in pixels)
  distances: {
    small: 20,
    medium: 40,
    large: 80,
    extraLarge: 120,
  },

  // Viewport thresholds for animations
  viewport: {
    once: 0.3,
    partially: 0.1,
  },
};

// Animation token definitions
export const ANIMATION_TOKENS = {
  // Page transitions
  page: {
    enter: {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.durations.slow,
      ease: ANIMATION_CONFIG.easings.easeOutCubic,
    },
    exit: {
      opacity: 0,
      y: -30,
      duration: ANIMATION_CONFIG.durations.normal,
      ease: ANIMATION_CONFIG.easings.easeInCubic,
    },
  },

  // Section entrance animations
  section: {
    fadeInUp: {
      initial: { opacity: 0, y: ANIMATION_CONFIG.distances.medium },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: ANIMATION_CONFIG.durations.normal,
        ease: ANIMATION_CONFIG.easings.easeOutCubic,
      },
    },
    fadeInScale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: {
        duration: ANIMATION_CONFIG.durations.normal,
        ease: ANIMATION_CONFIG.easings.backOut,
      },
    },
    slideInLeft: {
      initial: { opacity: 0, x: -ANIMATION_CONFIG.distances.medium },
      animate: { opacity: 1, x: 0 },
      transition: {
        duration: ANIMATION_CONFIG.durations.normal,
        ease: ANIMATION_CONFIG.easings.easeOutCubic,
      },
    },
    slideInRight: {
      initial: { opacity: 0, x: ANIMATION_CONFIG.distances.medium },
      animate: { opacity: 1, x: 0 },
      transition: {
        duration: ANIMATION_CONFIG.durations.normal,
        ease: ANIMATION_CONFIG.easings.easeOutCubic,
      },
    },
  },

  // Micro-interactions
  micro: {
    hover: {
      scale: 1.02,
      transition: {
        duration: ANIMATION_CONFIG.durations.fast,
        ease: ANIMATION_CONFIG.easings.easeOut,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: ANIMATION_CONFIG.durations.fast,
        ease: ANIMATION_CONFIG.easings.easeIn,
      },
    },
    focus: {
      scale: 1.01,
      transition: {
        duration: ANIMATION_CONFIG.durations.fast,
        ease: ANIMATION_CONFIG.easings.easeOut,
      },
    },
  },

  // Card animations
  card: {
    stagger: {
      initial: { opacity: 0, y: ANIMATION_CONFIG.distances.medium },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: ANIMATION_CONFIG.durations.normal,
        ease: ANIMATION_CONFIG.easings.easeOutCubic,
        delay: ANIMATION_CONFIG.stagger.medium,
      },
    },
  },

  // Parallax animations
  parallax: {
    slow: {
      speed: 0.5,
      ease: ANIMATION_CONFIG.easings.none,
    },
    medium: {
      speed: 0.3,
      ease: ANIMATION_CONFIG.easings.none,
    },
    fast: {
      speed: 0.1,
      ease: ANIMATION_CONFIG.easings.none,
    },
  },
};

// Utility functions for animations
export const createStaggerConfig = (items: number) => ({
  stagger: {
    each: ANIMATION_CONFIG.stagger.medium,
    delay: 0,
  },
});

export const createViewConfig = (threshold = ANIMATION_CONFIG.viewport.once) => ({
  threshold,
  rootMargin: '0px 0px -10% 0px',
});

export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// GSAP utility functions
export const gsapUtils = {
  /**
   * Create a GSAP timeline for staggered animations
   */
  createStaggerTimeline: (
    elements: HTMLElement[],
    animation: gsap.TweenVars,
    staggerDelay: number = ANIMATION_CONFIG.stagger.medium
  ) => {
    return gsap.timeline({
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 80%',
        once: true,
      },
    }).fromTo(
      elements,
      animation.from || { opacity: 0, y: 30 },
      {
        ...animation.to,
        opacity: 1,
        y: 0,
        duration: animation.duration || ANIMATION_CONFIG.durations.normal,
        ease: animation.ease || ANIMATION_CONFIG.easings.easeOutCubic,
        stagger: staggerDelay,
      }
    );
  },

  /**
   * Setup parallax animation
   */
  setupParallax: (
    element: HTMLElement,
    speed: number = 0.5,
    startOffset: string = 'top bottom',
    endOffset: string = 'bottom top'
  ) => {
    return gsap.to(element, {
      yPercent: -speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: startOffset,
        end: endOffset,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  },

  /**
   * Create reveal animation
   */
  reveal: (element: HTMLElement, delay: number = 0) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        y: ANIMATION_CONFIG.distances.medium,
      },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.durations.normal,
        ease: ANIMATION_CONFIG.easings.easeOutCubic,
        delay,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          once: true,
        },
      }
    );
  },
};

// Export default config
export default ANIMATION_CONFIG;