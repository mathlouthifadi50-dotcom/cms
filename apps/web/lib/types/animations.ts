/**
 * Type definitions for the animation system
 */

import { ComponentType, ElementType, Ref, ForwardRefRenderFunction } from 'react';

// Re-export common types from libraries
export type { Variants } from 'framer-motion';

// Animation configuration types
export interface AnimationConfig {
  durations: {
    instant: number;
    fast: number;
    normal: number;
    slow: number;
    slower: number;
  };
  easings: Record<string, string>;
  stagger: {
    small: number;
    medium: number;
    large: number;
    extraLarge: number;
  };
  distances: {
    small: number;
    medium: number;
    large: number;
    extraLarge: number;
  };
  viewport: {
    once: number;
    partially: number;
  };
}

// Animation token types
export interface AnimationToken {
  initial: Record<string, any>;
  animate: Record<string, any>;
  transition: {
    duration?: number;
    ease?: string | string[];
    delay?: number;
    stagger?: number;
  };
}

export interface MicroInteractionToken {
  scale?: number;
  transition: {
    duration?: number;
    ease?: string | string[];
  };
}

export interface SectionTokens {
  fadeInUp: AnimationToken;
  fadeInScale: AnimationToken;
  slideInLeft: AnimationToken;
  slideInRight: AnimationToken;
}

export interface MicroTokens {
  hover: MicroInteractionToken;
  tap: MicroInteractionToken;
  focus: MicroInteractionToken;
}

export interface CardToken extends AnimationToken {
  stagger: {
    initial: Record<string, any>;
    animate: Record<string, any>;
    transition: {
      duration?: number;
      ease?: string | string[];
      delay?: number;
    };
  };
}

export interface ParallaxToken {
  speed: number;
  ease: string;
}

// Hook option types
export interface UseScrollParallaxOptions {
  speed?: number;
  startOffset?: string;
  endOffset?: string;
  enabled?: boolean;
}

export interface UseInViewMotionOptions {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  stagger?: number;
  animation?: 'fadeInUp' | 'fadeInScale' | 'slideInLeft' | 'slideInRight';
  enabled?: boolean;
}

export interface UseStaggeredAnimationOptions {
  animation?: any;
  staggerDelay?: number;
  enabled?: boolean;
}

export interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Component prop types
export interface AnimatedContainerProps {
  animation?: keyof SectionTokens;
  delay?: number;
  stagger?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface AnimatedTextProps {
  text: string;
  delay?: number;
  duration?: number;
  reveal?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface AnimatedButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface AnimatedCardProps {
  animation?: 'fadeInUp' | 'fadeInScale' | 'slideInLeft' | 'slideInRight';
  delay?: number;
  hover?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface AnimatedImageProps {
  parallax?: boolean;
  speed?: number;
  alt?: string;
  src: string;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface StaggerContainerProps {
  staggerDelay?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface StaggerItemProps {
  animation?: keyof SectionTokens;
  delay?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

// Hook return types
export interface UseScrollParallaxReturn {
  elementRef: Ref<HTMLElement>;
  isParallaxActive: boolean;
}

export interface UseInViewMotionReturn {
  ref: Ref<HTMLElement>;
  inView: boolean;
  hasAnimated: boolean;
}

export interface UseIntersectionObserverReturn {
  ref: Ref<HTMLElement>;
  inView: boolean;
  entry?: IntersectionObserverEntry;
  elementRef: Ref<HTMLElement>;
}

export interface UseGSAPContextReturn {
  isClient: boolean;
  createTimeline: (defaults?: any) => any | null;
  createTween: (targets: any, vars: any) => any | null;
}

export interface UseMotionPreferencesReturn {
  prefersReducedMotion: boolean;
}

// GSAP utility types
export interface GSAPUtils {
  createStaggerTimeline: (
    elements: HTMLElement[],
    animation: any,
    staggerDelay: number
  ) => any;
  setupParallax: (
    element: HTMLElement,
    speed: number,
    startOffset: string,
    endOffset: string
  ) => any;
  reveal: (element: HTMLElement, delay: number) => any;
}

// Section data types for animated components
export interface HeroSectionData {
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  parallaxSpeed?: number;
}

export interface FeatureData {
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface FeaturesSectionData {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: FeatureData[];
  layout?: 'grid' | 'list' | 'alternating';
  animation?: 'fadeInUp' | 'fadeInScale' | 'slideInLeft' | 'slideInRight';
}

export interface TestimonialData {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  image?: string;
  rating?: number;
}

export interface TestimonialsSectionData {
  title?: string;
  subtitle?: string;
  description?: string;
  testimonials?: TestimonialData[];
  layout?: 'grid' | 'carousel' | 'single';
  autoplay?: boolean;
  autoplayDelay?: number;
}

export interface CTASectionData {
  title?: string;
  description?: string;
  subtitle?: string;
  link?: {
    href: string;
    label: string;
  };
  secondaryLink?: {
    href: string;
    label: string;
  };
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  parallaxSpeed?: number;
  style?: 'default' | 'minimal' | 'gradient' | 'parallax';
}

// Utility types
export type AnimationType = keyof SectionTokens;
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type LayoutType = 'grid' | 'list' | 'alternating' | 'carousel' | 'single';
export type CTAStyle = 'default' | 'minimal' | 'gradient' | 'parallax';

// Helper type for merging refs
export type MergeRefs<T> = (...args: (Ref<T> | undefined)[]) => void;

// Component ref forwarding type
export type AnimatedComponentRef<T extends HTMLElement = HTMLElement> = ForwardRefRenderFunction<
  T,
  AnimatedContainerProps
>;