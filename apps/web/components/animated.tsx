/**
 * Animation Components
 * Reusable animated UI components
 */

'use client';

import React, { forwardRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_TOKENS, shouldReduceMotion } from '@/lib/animations';

// Base animated container
export interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: keyof typeof ANIMATION_TOKENS.section;
  delay?: number;
  stagger?: boolean;
  children?: React.ReactNode;
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ className, animation = 'fadeInUp', delay = 0, stagger = false, children, ...props }, ref) => {
    if (shouldReduceMotion()) {
      return <div ref={ref} className={cn(className)} {...props}>{children}</div>;
    }

    const animationConfig = ANIMATION_TOKENS.section[animation];

    return (
      <motion.div
        ref={ref}
        initial={animationConfig.initial}
        animate={animationConfig.animate}
        transition={{ 
          ...animationConfig.transition, 
          delay,
          ease: 'easeOut' as any
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedContainer.displayName = 'AnimatedContainer';

// Animated text with typewriter effect
export interface AnimatedTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  delay?: number;
  duration?: number;
  reveal?: boolean;
}

export const AnimatedText = forwardRef<HTMLSpanElement, AnimatedTextProps>(
  ({ className, text, delay = 0, duration = 2, reveal = true, ...props }, ref) => {
    if (shouldReduceMotion()) {
      return <span ref={ref} className={cn(className)} {...props}>{text}</span>;
    }

    return (
      <motion.span
        ref={ref}
        initial={reveal ? { opacity: 0, y: 20 } : false}
        animate={reveal ? { opacity: 1, y: 0 } : false}
        transition={{ 
          duration: reveal ? duration * 0.6 : 0,
          delay: delay,
          ease: 'easeOut'
        }}
        className={cn(className)}
        {...props}
      >
        {text}
      </motion.span>
    );
  }
);

AnimatedText.displayName = 'AnimatedText';

// Animated button with hover and tap effects
export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  children?: React.ReactNode;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = 'primary', size = 'md', animate = true, children, ...props }, ref) => {
    if (shouldReduceMotion()) {
      return (
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
            {
              'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
              'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
              'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
              'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            },
            {
              'h-8 px-3 text-sm': size === 'sm',
              'h-10 px-4 py-2': size === 'md',
              'h-12 px-8': size === 'lg',
            },
            className
          )}
          {...props}
        >
          {children}
        </button>
      );
    }

    const motionProps = animate ? ANIMATION_TOKENS.micro.hover : {};

    return (
      <motion.button
        ref={ref}
        whileHover={animate ? {
          ...ANIMATION_TOKENS.micro.hover,
          transition: { duration: 0.2, ease: 'easeOut' }
        } : undefined}
        whileTap={animate ? {
          ...ANIMATION_TOKENS.micro.tap,
          transition: { duration: 0.2, ease: 'easeIn' }
        } : undefined}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-12 px-8': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

// Animated card component
export interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: 'fadeInUp' | 'fadeInScale' | 'slideInLeft' | 'slideInRight';
  delay?: number;
  hover?: boolean;
  children?: React.ReactNode;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, animation = 'fadeInUp', delay = 0, hover = true, children, ...props }, ref) => {
    if (shouldReduceMotion()) {
      return (
        <div
          ref={ref}
          className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    const animationConfig = ANIMATION_TOKENS.section[animation];

    return (
      <motion.div
        ref={ref}
        initial={animationConfig.initial}
        animate={animationConfig.animate}
        transition={{ ...animationConfig.transition, delay }}
        whileHover={hover ? ANIMATION_TOKENS.micro.hover : undefined}
        className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

// Animated image with parallax effect
export interface AnimatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  parallax?: boolean;
  speed?: number;
  alt?: string;
  src: string;
}

export const AnimatedImage = forwardRef<HTMLImageElement, AnimatedImageProps>(
  ({ className, parallax = false, speed = 0.5, alt, src, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn('transition-transform duration-300', className)}
        style={parallax ? { transform: 'translate3d(0, 0, 0)' } : undefined}
        {...props}
      />
    );
  }
);

AnimatedImage.displayName = 'AnimatedImage';

// Staggered container for animating lists
export interface StaggerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  staggerDelay?: number;
  children: React.ReactNode;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ className, staggerDelay = 0.1, children, ...props }, ref) => {
    if (shouldReduceMotion()) {
      return <div ref={ref} className={cn(className)} {...props}>{children}</div>;
    }

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: staggerDelay,
            },
          },
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerContainer.displayName = 'StaggerContainer';

// Staggered item component
export interface StaggerItemProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: keyof typeof ANIMATION_TOKENS.section;
  delay?: number;
  children?: React.ReactNode;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ className, animation = 'fadeInUp', delay = 0, children, ...props }, ref) => {
    if (shouldReduceMotion()) {
      return <div ref={ref} className={cn(className)} {...props}>{children}</div>;
    }

    const animationConfig = ANIMATION_TOKENS.section[animation];

    return (
      <motion.div
        ref={ref}
        variants={{
          hidden: animationConfig.initial,
          visible: {
            ...animationConfig.animate,
            transition: animationConfig.transition,
          },
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerItem.displayName = 'StaggerItem';