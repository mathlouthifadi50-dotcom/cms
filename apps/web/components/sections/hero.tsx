'use client';

/**
 * Enhanced Hero Section with Animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton, AnimatedText, AnimatedContainer, useScrollParallax } from '@/components/animated';
import { ANIMATION_TOKENS, shouldReduceMotion } from '@/lib/animations';

interface HeroProps {
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    parallaxSpeed?: number;
  };
}

export function Hero({ data }: HeroProps) {
  const parallaxSpeed = data.parallaxSpeed || 0.3;
  const { elementRef, isParallaxActive } = useScrollParallax({
    speed: parallaxSpeed,
    enabled: !shouldReduceMotion(),
  });

  const backgroundStyle = data.backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${data.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: isParallaxActive ? 'fixed' : 'scroll',
      }
    : {};

  if (shouldReduceMotion()) {
    return (
      <section
        ref={elementRef}
        className="min-h-screen flex items-center justify-center py-20 px-4 text-center text-white relative"
        style={backgroundStyle}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {data.subtitle}
            </p>
          )}
          {data.description && (
            <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
              {data.description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {data.ctaText && (
              <a href={data.ctaLink || '#'}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                  {data.ctaText}
                </button>
              </a>
            )}
            {data.secondaryCtaText && (
              <a href={data.secondaryCtaLink || '#'}>
                <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors">
                  {data.secondaryCtaText}
                </button>
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={elementRef}
      className="min-h-screen flex items-center justify-center py-20 px-4 text-center text-white relative overflow-hidden"
      style={backgroundStyle}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatedContainer animation="fadeInUp" delay={0.2}>
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: 'easeOut',
            }}
          >
            <AnimatedText
              text={data.title || 'Welcome to our platform'}
              delay={0.6}
              duration={1.2}
            />
          </motion.h1>
        </AnimatedContainer>

        {(data.subtitle || data.description) && (
          <AnimatedContainer animation="fadeInUp" delay={0.8}>
            {data.subtitle && (
              <motion.p
                className="text-xl md:text-2xl mb-8 opacity-90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                {data.subtitle}
              </motion.p>
            )}
            
            {data.description && (
              <motion.p
                className="text-lg mb-12 opacity-80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                {data.description}
              </motion.p>
            )}
          </AnimatedContainer>
        )}

        {(data.ctaText || data.secondaryCtaText) && (
          <AnimatedContainer animation="fadeInUp" delay={1.4}>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              {data.ctaText && (
                <AnimatedButton variant="primary" size="lg">
                  <a href={data.ctaLink || '#'}>
                    {data.ctaText}
                  </a>
                </AnimatedButton>
              )}
              
              {data.secondaryCtaText && (
                <AnimatedButton variant="outline" size="lg">
                  <a href={data.secondaryCtaLink || '#'}>
                    {data.secondaryCtaText}
                  </a>
                </AnimatedButton>
              )}
            </motion.div>
          </AnimatedContainer>
        )}

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}