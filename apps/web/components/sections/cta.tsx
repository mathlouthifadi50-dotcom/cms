'use client';

/**
 * Enhanced CTA Section with Animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { 
  AnimatedContainer, 
  AnimatedButton, 
  useInViewMotion,
  useScrollParallax
} from '@/components/animated';
import { ANIMATION_CONFIG, shouldReduceMotion } from '@/lib/animations';

interface CTAProps {
  data: {
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
  };
}

export function CTA({ data }: CTAProps) {
  const { ref, inView } = useInViewMotion({
    threshold: ANIMATION_CONFIG.viewport.once,
    triggerOnce: true,
    animation: 'fadeInUp',
    enabled: !shouldReduceMotion(),
  });

  const style = data.style || 'default';
  const parallaxSpeed = data.parallaxSpeed || 0.2;
  const { elementRef, isParallaxActive } = useScrollParallax({
    speed: parallaxSpeed,
    enabled: style === 'parallax' && !shouldReduceMotion(),
  });

  // Combine refs for parallax and animation
  const setRefs = (node: HTMLElement) => {
    ref(node);
    if (elementRef) {
      elementRef.current = node;
    }
  };

  const backgroundStyle = data.backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${data.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: isParallaxActive ? 'fixed' : 'scroll',
      }
    : {};

  const sectionStyle = {
    backgroundColor: data.backgroundColor,
    color: data.textColor,
    ...backgroundStyle,
  };

  if (shouldReduceMotion()) {
    return (
      <section
        ref={setRefs}
        className="py-20 px-4 text-center relative"
        style={sectionStyle}
      >
        <div className="max-w-4xl mx-auto">
          {data.subtitle && (
            <p className="text-lg font-semibold mb-4 opacity-90">
              {data.subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {data.title}
          </h2>
          <p className="mb-8 text-lg opacity-80 max-w-2xl mx-auto">
            {data.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {data.link && (
              <Link 
                href={data.link.href || '#'} 
                className="inline-block bg-background text-foreground px-6 py-3 rounded font-bold hover:opacity-90 transition-opacity"
              >
                {data.link.label}
              </Link>
            )}
            {data.secondaryLink && (
              <Link 
                href={data.secondaryLink.href || '#'} 
                className="inline-block border-2 border-background text-background px-6 py-3 rounded font-bold hover:bg-background hover:text-primary transition-colors"
              >
                {data.secondaryLink.label}
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={setRefs}
      className={`py-20 px-4 text-center relative overflow-hidden ${
        style === 'parallax' ? 'min-h-screen flex items-center' : ''
      }`}
      style={sectionStyle}
    >
      {/* Background Effects */}
      {style === 'gradient' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
      )}
      
      {style === 'parallax' && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
          {/* Floating geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 border border-white/10 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  rotate: [0, 180, 360],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatedContainer animation="fadeInUp" delay={0.2}>
          {data.subtitle && (
            <motion.p
              className="text-lg font-semibold mb-4 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {data.subtitle}
            </motion.p>
          )}
          
          <motion.h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {data.title}
          </motion.h2>
          
          <motion.p
            className="mb-8 text-lg md:text-xl opacity-80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {data.description}
          </motion.p>
        </AnimatedContainer>

        {(data.link || data.secondaryLink) && (
          <AnimatedContainer animation="fadeInUp" delay={1.0}>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              {data.link && (
                <AnimatedButton variant="primary" size="lg">
                  <Link href={data.link.href || '#'}>
                    {data.link.label}
                  </Link>
                </AnimatedButton>
              )}
              
              {data.secondaryLink && (
                <AnimatedButton variant="outline" size="lg">
                  <Link href={data.secondaryLink.href || '#'}>
                    {data.secondaryLink.label}
                  </Link>
                </AnimatedButton>
              )}
            </motion.div>
          </AnimatedContainer>
        )}

        {/* Trust indicators or additional content */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8 text-sm opacity-60"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : false}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : false}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <span className="text-green-400">✓</span>
            <span>30-day free trial</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <span className="text-green-400">✓</span>
            <span>No credit card required</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : false}
            transition={{ duration: 0.6, delay: 2.0 }}
          >
            <span className="text-green-400">✓</span>
            <span>Cancel anytime</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator for parallax style */}
      {style === 'parallax' && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
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
      )}
    </section>
  );
}