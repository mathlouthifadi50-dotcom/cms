/**
 * Animation Components
 * Reusable animated UI components
 */

'use client';

import React, { forwardRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_TOKENS, shouldReduceMotion } from '@/lib/animations';

// Re-export animation hooks for convenience
export { useInViewMotion, useScrollParallax } from '@/lib/hooks/animations';

// Base animated container
export interface AnimatedContainerProps {
  animation?: keyof typeof ANIMATION_TOKENS.section;
  delay?: number;
  stagger?: boolean;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ className, animation = 'fadeInUp', delay = 0, stagger = false, children, id, style }, ref) => {
    if (shouldReduceMotion()) {
      return <div ref={ref} className={cn(className)} id={id} style={style}>{children}</div>;
    }

    const animationConfig = ANIMATION_TOKENS.section[animation];

    return (
      <motion.div
        ref={ref}
        initial={animationConfig.initial}
        animate={animationConfig.animate}
        transition={{ 
          duration: animationConfig.transition.duration,
          delay,
          ease: 'easeOut'
        }}
        className={cn(className)}
        id={id}
        style={style}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedContainer.displayName = 'AnimatedContainer';

// Animated text with typewriter effect
export interface AnimatedTextProps {
  text: string;
  delay?: number;
  duration?: number;
  reveal?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const AnimatedText = forwardRef<HTMLSpanElement, AnimatedTextProps>(
  ({ className, text, delay = 0, duration = 2, reveal = true, id, style }, ref) => {
    if (shouldReduceMotion()) {
      return <span ref={ref} className={cn(className)} id={id} style={style}>{text}</span>;
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
        id={id}
        style={style}
      >
        {text}
      </motion.span>
    );
  }
);

AnimatedText.displayName = 'AnimatedText';

// Animated button with hover and tap effects
export interface AnimatedButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  form?: string;
  name?: string;
  value?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    animate = true, 
    children,
    id,
    type,
    disabled,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    form,
    name,
    value,
    ...ariaProps
  }, ref) => {
    const baseClassName = cn(
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
    );

    if (shouldReduceMotion()) {
      return (
        <button
          ref={ref}
          className={baseClassName}
          id={id}
          type={type}
          disabled={disabled}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onFocus={onFocus}
          onBlur={onBlur}
          form={form}
          name={name}
          value={value}
          {...ariaProps}
        >
          {children}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={animate ? { scale: 1.02 } : undefined}
        whileTap={animate ? { scale: 0.98 } : undefined}
        className={baseClassName}
        id={id}
        type={type}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        form={form}
        name={name}
        value={value}
        {...ariaProps}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

// Animated card component
export interface AnimatedCardProps {
  animation?: 'fadeInUp' | 'fadeInScale' | 'slideInLeft' | 'slideInRight';
  delay?: number;
  hover?: boolean;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, animation = 'fadeInUp', delay = 0, hover = true, children, id, style }, ref) => {
    if (shouldReduceMotion()) {
      return (
        <div
          ref={ref}
          className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
          id={id}
          style={style}
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
        transition={{ 
          duration: animationConfig.transition.duration,
          delay,
          ease: 'easeOut'
        }}
        whileHover={hover ? { scale: 1.02 } : undefined}
        className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
        id={id}
        style={style}
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
export interface StaggerContainerProps {
  staggerDelay?: number;
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ className, staggerDelay = 0.1, children, id, style }, ref) => {
    if (shouldReduceMotion()) {
      return <div ref={ref} className={cn(className)} id={id} style={style}>{children}</div>;
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
        id={id}
        style={style}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerContainer.displayName = 'StaggerContainer';

// Staggered item component
export interface StaggerItemProps {
  animation?: keyof typeof ANIMATION_TOKENS.section;
  delay?: number;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ className, animation = 'fadeInUp', delay = 0, children, id, style }, ref) => {
    if (shouldReduceMotion()) {
      return <div ref={ref} className={cn(className)} id={id} style={style}>{children}</div>;
    }

    const animationConfig = ANIMATION_TOKENS.section[animation];

    return (
      <motion.div
        ref={ref}
        variants={{
          hidden: animationConfig.initial,
          visible: {
            ...animationConfig.animate,
            transition: {
              duration: animationConfig.transition.duration,
              ease: 'easeOut'
            },
          },
        }}
        className={cn(className)}
        id={id}
        style={style}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerItem.displayName = 'StaggerItem';