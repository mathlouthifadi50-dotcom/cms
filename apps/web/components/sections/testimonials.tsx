'use client';

/**
 * Enhanced Testimonials Section with Carousel and Animations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StaggerContainer, 
  StaggerItem, 
  AnimatedCard,
  useInViewMotion 
} from '@/components/animated';
import { ANIMATION_CONFIG, shouldReduceMotion } from '@/lib/animations';

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  image?: string;
  rating?: number;
}

interface TestimonialsProps {
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
    testimonials?: Testimonial[];
    layout?: 'grid' | 'carousel' | 'single';
    autoplay?: boolean;
    autoplayDelay?: number;
  };
}

export function Testimonials({ data }: TestimonialsProps) {
  const { ref, inView } = useInViewMotion({
    threshold: ANIMATION_CONFIG.viewport.once,
    triggerOnce: true,
    animation: 'fadeInUp',
    enabled: !shouldReduceMotion(),
  });

  const layout = data.layout || 'grid';
  const autoplay = data.autoplay && !shouldReduceMotion();

  return (
    <section ref={ref} className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {(data.title || data.subtitle || data.description) && (
          <div className="text-center mb-16">
            {data.subtitle && (
              <motion.p
                className="text-blue-600 dark:text-blue-400 font-semibold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {data.subtitle}
              </motion.p>
            )}
            
            {data.title && (
              <motion.h2
                className="text-3xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {data.title}
              </motion.h2>
            )}
            
            {data.description && (
              <motion.p
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {data.description}
              </motion.p>
            )}
          </div>
        )}

        {/* Testimonials Content */}
        {data.testimonials && data.testimonials.length > 0 && (
          <>
            {layout === 'grid' && <TestimonialsGrid testimonials={data.testimonials} inView={inView} />}
            
            {layout === 'carousel' && (
              <TestimonialsCarousel 
                testimonials={data.testimonials} 
                autoplay={autoplay}
                autoplayDelay={data.autoplayDelay}
              />
            )}
            
            {layout === 'single' && <SingleTestimonial testimonials={data.testimonials} />}
          </>
        )}
      </div>
    </section>
  );
}

// Testimonials Grid Layout
function TestimonialsGrid({ 
  testimonials, 
  inView 
}: { 
  testimonials: Testimonial[]; 
  inView: boolean; 
}) {
  return (
    <StaggerContainer staggerDelay={ANIMATION_CONFIG.stagger.medium}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <StaggerItem key={index} animation="fadeInUp" delay={index * 0.1}>
            <AnimatedCard className="p-8 h-full" hover>
              <TestimonialContent testimonial={testimonial} />
            </AnimatedCard>
          </StaggerItem>
        ))}
      </div>
    </StaggerContainer>
  );
}

// Testimonials Carousel Layout
function TestimonialsCarousel({ 
  testimonials, 
  autoplay = false, 
  autoplayDelay = 5000 
}: { 
  testimonials: Testimonial[]; 
  autoplay?: boolean; 
  autoplayDelay?: number; 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, testimonials.length]);

  if (shouldReduceMotion()) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <TestimonialContent testimonial={testimonials[0]} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <AnimatedCard className="p-8">
              <TestimonialContent testimonial={testimonials[currentIndex]} />
            </AnimatedCard>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        {testimonials.length > 1 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              aria-label="Previous testimonial"
            >
              ←
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex 
                      ? 'bg-blue-600 dark:bg-blue-400' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Single Testimonial Layout
function SingleTestimonial({ testimonials }: { testimonials: Testimonial[] }) {
  const testimonial = testimonials[0];
  
  return (
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <AnimatedCard className="p-12" hover>
          <TestimonialContent testimonial={testimonial} large />
        </AnimatedCard>
      </motion.div>
    </div>
  );
}

// Testimonial Content Component
function TestimonialContent({ 
  testimonial, 
  large = false 
}: { 
  testimonial: Testimonial; 
  large?: boolean; 
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Quote */}
      <motion.blockquote
        className={`text-gray-700 dark:text-gray-300 italic mb-6 flex-grow ${
          large ? 'text-lg md:text-xl' : 'text-base'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        "{testimonial.quote}"
      </motion.blockquote>

      {/* Rating Stars */}
      {testimonial.rating && (
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              className={`mx-1 ${
                i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'
              }`}
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: 0.5 + i * 0.1,
                type: 'spring',
                stiffness: 200 
              }}
            >
              ⭐
            </motion.span>
          ))}
        </motion.div>
      )}

      {/* Author Info */}
      <motion.div
        className="flex items-center justify-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {testimonial.image && (
          <motion.img
            src={testimonial.image}
            alt={testimonial.author}
            className="w-12 h-12 rounded-full object-cover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          />
        )}
        
        <div className="text-center">
          <div className={`font-bold ${large ? 'text-lg' : 'text-base'}`}>
            {testimonial.author}
          </div>
          {(testimonial.role || testimonial.company) && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {[testimonial.role, testimonial.company].filter(Boolean).join(', ')}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}