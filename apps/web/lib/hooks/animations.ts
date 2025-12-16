/**
 * Custom hooks for animations
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ANIMATION_CONFIG, gsapUtils, shouldReduceMotion } from '../animations';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook for scroll-driven parallax animations
 * Provides React-friendly context management for GSAP ScrollTrigger
 */
export const useScrollParallax = (
  options: {
    speed?: number;
    startOffset?: string;
    endOffset?: string;
    enabled?: boolean;
  } = {}
) => {
  const { speed = 0.5, startOffset = 'top bottom', endOffset = 'bottom top', enabled = true } = options;
  const elementRef = useRef<HTMLElement>(null);
  const [isParallaxActive, setIsParallaxActive] = useState(false);

  const setupParallax = useCallback(() => {
    if (!elementRef.current || !enabled || shouldReduceMotion()) return;

    try {
      const parallaxAnimation = gsapUtils.setupParallax(
        elementRef.current,
        speed,
        startOffset,
        endOffset
      );
      setIsParallaxActive(true);

      return () => {
        if (parallaxAnimation) {
          parallaxAnimation.kill();
        }
      };
    } catch (error) {
      console.warn('Parallax setup failed:', error);
    }
  }, [speed, startOffset, endOffset, enabled]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const cleanup = setupParallax();
    return cleanup;
  }, [setupParallax]);

  return { elementRef, isParallaxActive };
};

/**
 * Hook for in-view motion animations
 * Provides smooth entrance animations when elements come into viewport
 */
export const useInViewMotion = (
  options: {
    threshold?: number;
    triggerOnce?: boolean;
    delay?: number;
    stagger?: number;
    animation?: 'fadeInUp' | 'fadeInScale' | 'slideInLeft' | 'slideInRight';
    enabled?: boolean;
  } = {}
) => {
  const {
    threshold = ANIMATION_CONFIG.viewport.once,
    triggerOnce = true,
    delay = 0,
    stagger = 0,
    animation = 'fadeInUp',
    enabled = true,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold,
    triggerOnce,
  });

  // Combine refs
  const setRefs = useCallback(
    (node: HTMLElement) => {
      elementRef.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!elementRef.current || !enabled || shouldReduceMotion()) return;

    if (inView && (!triggerOnce || !hasAnimated)) {
      try {
        let animationTween: any;

        switch (animation) {
          case 'fadeInScale':
            animationTween = gsapUtils.reveal(elementRef.current, delay);
            break;
          case 'slideInLeft':
            animationTween = gsap.fromTo(
              elementRef.current,
              {
                opacity: 0,
                x: -ANIMATION_CONFIG.distances.medium,
              },
              {
                opacity: 1,
                x: 0,
                duration: ANIMATION_CONFIG.durations.normal,
                ease: ANIMATION_CONFIG.easings.easeOutCubic,
                delay,
                scrollTrigger: {
                  trigger: elementRef.current,
                  start: 'top 85%',
                  once: triggerOnce,
                },
              }
            );
            break;
          case 'slideInRight':
            animationTween = gsap.fromTo(
              elementRef.current,
              {
                opacity: 0,
                x: ANIMATION_CONFIG.distances.medium,
              },
              {
                opacity: 1,
                x: 0,
                duration: ANIMATION_CONFIG.durations.normal,
                ease: ANIMATION_CONFIG.easings.easeOutCubic,
                delay,
                scrollTrigger: {
                  trigger: elementRef.current,
                  start: 'top 85%',
                  once: triggerOnce,
                },
              }
            );
            break;
          default:
            animationTween = gsapUtils.reveal(elementRef.current, delay);
        }

        if (triggerOnce) {
          setHasAnimated(true);
        }

        return () => {
          if (animationTween && animationTween.kill) {
            animationTween.kill();
          }
        };
      } catch (error) {
        console.warn('In-view animation setup failed:', error);
      }
    }
  }, [inView, animation, delay, triggerOnce, hasAnimated, enabled]);

  return { ref: setRefs, inView, hasAnimated };
};

/**
 * Hook for staggered animations on multiple elements
 */
export const useStaggeredAnimation = (
  elements: HTMLElement[] | null,
  options: {
    animation?: any;
    staggerDelay?: number;
    enabled?: boolean;
  } = {}
) => {
  const { animation, staggerDelay = ANIMATION_CONFIG.stagger.medium, enabled = true } = options;

  useEffect(() => {
    if (!elements || !enabled || shouldReduceMotion()) return;

    try {
      const timeline = gsapUtils.createStaggerTimeline(
        elements,
        animation || {
          from: { opacity: 0, y: ANIMATION_CONFIG.distances.medium },
          to: { opacity: 1, y: 0 },
        },
        staggerDelay
      );

      return () => {
        if (timeline) {
          timeline.kill();
        }
      };
    } catch (error) {
      console.warn('Staggered animation setup failed:', error);
    }
  }, [elements, animation, staggerDelay, enabled]);
};

/**
 * Hook for intersection observer with custom threshold
 */
export const useIntersectionObserver = (
  options: {
    threshold?: number | number[];
    root?: Element | null;
    rootMargin?: string;
    triggerOnce?: boolean;
  } = {}
) => {
  const {
    threshold = ANIMATION_CONFIG.viewport.once,
    root = null,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const { ref, inView, entry } = useInView({
    threshold,
    root,
    rootMargin,
    triggerOnce,
  });

  return { ref, inView, entry, elementRef };
};

/**
 * Hook for safe GSAP context management
 * Automatically handles cleanup and SSR safety
 */
export const useGSAPContext = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const createTimeline = useCallback((defaults?: gsap.TimelineVars) => {
    if (!isClient || shouldReduceMotion()) return null;
    return gsap.timeline(defaults);
  }, [isClient]);

  const createTween = useCallback((targets: gsap.Target, vars: gsap.TweenVars) => {
    if (!isClient || shouldReduceMotion()) return null;
    return gsap.to(targets, vars);
  }, [isClient]);

  return { isClient, createTimeline, createTween };
};

/**
 * Hook for motion preferences detection
 */
export const useMotionPreferences = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMotionPreference = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    // Initial check
    checkMotionPreference();

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkMotionPreference);

    return () => {
      mediaQuery.removeEventListener('change', checkMotionPreference);
    };
  }, []);

  return { prefersReducedMotion };
};