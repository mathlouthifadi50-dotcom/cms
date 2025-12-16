'use client';

/**
 * Enhanced Features Section with Staggered Animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AnimatedContainer, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedCard,
  useInViewMotion 
} from '@/components/animated';
import { ANIMATION_TOKENS, ANIMATION_CONFIG, shouldReduceMotion } from '@/lib/animations';

interface Feature {
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

interface FeaturesProps {
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
    features?: Feature[];
    layout?: 'grid' | 'list' | 'alternating';
    animation?: 'fadeInUp' | 'fadeInScale' | 'slideInLeft' | 'slideInRight';
  };
}

export function Features({ data }: FeaturesProps) {
  const { ref, inView, hasAnimated } = useInViewMotion({
    threshold: ANIMATION_CONFIG.viewport.once,
    triggerOnce: true,
    animation: 'fadeInUp',
    enabled: !shouldReduceMotion(),
  });

  const layout = data.layout || 'grid';
  const animation = data.animation || 'fadeInUp';

  return (
    <section ref={ref} className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {(data.title || data.subtitle || data.description) && (
          <AnimatedContainer animation="fadeInUp" delay={0.2}>
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
          </AnimatedContainer>
        )}

        {/* Features Grid/List */}
        {data.features && data.features.length > 0 && (
          <StaggerContainer staggerDelay={ANIMATION_CONFIG.stagger.medium}>
            {layout === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.features.map((feature, index) => (
                  <StaggerItem key={index} animation={animation} delay={index * 0.1}>
                    <FeatureCard feature={feature} index={index} />
                  </StaggerItem>
                ))}
              </div>
            )}

            {layout === 'list' && (
              <div className="space-y-8 max-w-4xl mx-auto">
                {data.features.map((feature, index) => (
                  <StaggerItem key={index} animation="slideInLeft" delay={index * 0.1}>
                    <FeatureListItem feature={feature} index={index} />
                  </StaggerItem>
                ))}
              </div>
            )}

            {layout === 'alternating' && (
              <div className="space-y-16">
                {data.features.map((feature, index) => (
                  <StaggerItem
                    key={index}
                    animation={index % 2 === 0 ? 'slideInLeft' : 'slideInRight'}
                    delay={index * 0.2}
                  >
                    <FeatureAlternating feature={feature} index={index} reverse={index % 2 === 1} />
                  </StaggerItem>
                ))}
              </div>
            )}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}

// Feature Card Component
function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <AnimatedCard className="p-8 h-full group" hover>
      <div className="flex flex-col h-full">
        {/* Icon/Image */}
        {feature.image ? (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
          </motion.div>
        ) : feature.icon ? (
          <motion.div
            className="mb-6 text-blue-600 dark:text-blue-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          >
            <div className="w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <span className="text-2xl">{feature.icon}</span>
            </div>
          </motion.div>
        ) : null}

        <motion.h3
          className="text-xl font-bold mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
        >
          {feature.title}
        </motion.h3>
        
        <motion.p
          className="text-gray-600 dark:text-gray-300 flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
        >
          {feature.description}
        </motion.p>
      </div>
    </AnimatedCard>
  );
}

// Feature List Item Component
function FeatureListItem({ feature, index }: { feature: Feature; index: number }) {
  return (
    <AnimatedCard className="flex items-center p-6 group">
      {/* Icon */}
      <div className="flex-shrink-0 mr-6">
        {feature.image ? (
          <motion.img
            src={feature.image}
            alt={feature.title}
            className="w-12 h-12 object-cover rounded"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          />
        ) : feature.icon ? (
          <motion.div
            className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          >
            <span className="text-xl">{feature.icon}</span>
          </motion.div>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-grow">
        <motion.h3
          className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
        >
          {feature.title}
        </motion.h3>
        
        <motion.p
          className="text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
        >
          {feature.description}
        </motion.p>
      </div>
    </AnimatedCard>
  );
}

// Feature Alternating Layout Component
function FeatureAlternating({ 
  feature, 
  index, 
  reverse = false 
}: { 
  feature: Feature; 
  index: number; 
  reverse?: boolean; 
}) {
  return (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
      {/* Image */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
      >
        {feature.image ? (
          <img
            src={feature.image}
            alt={feature.title}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-6xl">
            {feature.icon || '⚡'}
          </div>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
      >
        <AnimatedCard className="p-8">
          <motion.h3
            className="text-2xl md:text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
          >
            {feature.title}
          </motion.h3>
          
          <motion.p
            className="text-gray-600 dark:text-gray-300 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
          >
            {feature.description}
          </motion.p>
        </AnimatedCard>
      </motion.div>
    </div>
  );
}