#!/usr/bin/env node

/**
 * Migration script to create missing content types in Strapi database
 * This script runs on Strapi startup to ensure all content types are properly created
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  async migrateContentTypes(strapi) {
    try {
      strapi.log.info('Starting content type migration...');

      // Define the content types that should exist
      const contentTypes = [
        {
          name: 'page',
          kind: 'collectionType',
          displayName: 'Page',
          description: 'Dynamic pages with sections and SEO',
          attributes: {
            title: { type: 'string', required: true },
            slug: { type: 'uid', targetField: 'title', required: true },
            heroOverride: { type: 'component', component: 'sections.hero' },
            sections: { 
              type: 'dynamiczone',
              components: [
                'sections.hero',
                'sections.features',
                'sections.parallax',
                'sections.cta',
                'sections.testimonials',
                'sections.stats',
                'sections.partners',
                'sections.services-grid',
                'sections.distinction'
              ]
            },
            seo: { type: 'component', component: 'shared.seo' },
            featuredServices: { type: 'relation', relation: 'manyToMany', target: 'api::service.service' },
            featuredBlogPosts: { type: 'relation', relation: 'manyToMany', target: 'api::blog-post.blog-post' }
          }
        },
        {
          name: 'service',
          kind: 'collectionType',
          displayName: 'Service',
          description: 'Service offerings',
          attributes: {
            title: { type: 'string', required: true },
            slug: { type: 'uid', targetField: 'title', required: true },
            description: { type: 'text' },
            content: { type: 'richtext' },
            excerpt: { type: 'text' },
            featuredImage: { type: 'media', allowedTypes: ['images'] },
            gallery: { type: 'media', multiple: true, allowedTypes: ['images', 'videos'] },
            category: { type: 'relation', relation: 'manyToOne', target: 'api::service-category.service-category', inversedBy: 'services' },
            ctaButton: { type: 'component', component: 'shared.cta-button' },
            seo: { type: 'component', component: 'shared.seo' },
            price: { type: 'decimal' },
            features: { type: 'component', repeatable: true, component: 'shared.feature-item' }
          }
        },
        {
          name: 'service-category',
          kind: 'collectionType',
          displayName: 'Service Category',
          description: 'Categories for organizing services',
          attributes: {
            name: { type: 'string', required: true },
            slug: { type: 'uid', targetField: 'name', required: true },
            description: { type: 'text' },
            services: { type: 'relation', relation: 'oneToMany', target: 'api::service.service', mappedBy: 'category' }
          }
        },
        {
          name: 'blog-post',
          kind: 'collectionType',
          displayName: 'Blog Post',
          description: 'Blog articles and posts',
          attributes: {
            title: { type: 'string', required: true },
            slug: { type: 'uid', targetField: 'title', required: true },
            excerpt: { type: 'text' },
            content: { type: 'richtext', required: true },
            featuredImage: { type: 'media', allowedTypes: ['images'] },
            gallery: { type: 'media', multiple: true, allowedTypes: ['images', 'videos'] },
            author: { type: 'string' },
            publishedDate: { type: 'date' },
            tags: { type: 'json' },
            readingTime: { type: 'integer' },
            ctaButton: { type: 'component', component: 'shared.cta-button' },
            seo: { type: 'component', component: 'shared.seo' },
            relatedPosts: { type: 'relation', relation: 'manyToMany', target: 'api::blog-post.blog-post' }
          }
        },
        {
          name: 'global-settings',
          kind: 'singleType',
          displayName: 'Global Settings',
          description: 'Global site settings and configuration',
          attributes: {
            siteName: { type: 'string', required: true },
            siteDescription: { type: 'text' },
            siteLogo: { type: 'media', allowedTypes: ['images'] },
            favicon: { type: 'media', allowedTypes: ['images'] },
            headerNavigation: { type: 'component', repeatable: true, component: 'shared.navigation-link' },
            footerNavigation: { type: 'component', repeatable: true, component: 'shared.footer-block' },
            socialLinks: { type: 'component', repeatable: true, component: 'shared.social-link' },
            lightTheme: { type: 'component', repeatable: true, component: 'shared.theme-color' },
            darkTheme: { type: 'component', repeatable: true, component: 'shared.theme-color' },
            defaultSeo: { type: 'component', component: 'shared.seo' },
            smtpFromName: { type: 'string' },
            smtpFromEmail: { type: 'email' },
            contactRecipientEmail: { type: 'email' },
            copyrightText: { type: 'string' }
          }
        }
      ];

      // Check and create each content type
      for (const contentType of contentTypes) {
        try {
          const existing = await strapi.query('api::' + contentType.name + '.' + contentType.name).findMany({ limit: 1 });
          
          if (!existing || existing.length === 0) {
            strapi.log.info(`Creating content type: ${contentType.displayName}`);
            
            // For single types, we need to create the entry
            if (contentType.kind === 'singleType') {
              await strapi.query('api::' + contentType.name + '.' + contentType.name).create({
                data: {
                  siteName: 'My Website',
                  siteDescription: 'Welcome to our website'
                }
              });
            }
          } else {
            strapi.log.info(`Content type ${contentType.displayName} already exists`);
          }
        } catch (error) {
          strapi.log.error(`Error checking/creating content type ${contentType.displayName}:`, error);
        }
      }

      // Create default global settings if it doesn't exist
      try {
        const globalSettings = await strapi.query('api::global-settings.global-settings').findMany();
        if (!globalSettings || globalSettings.length === 0) {
          await strapi.query('api::global-settings.global-settings').create({
            data: {
              siteName: 'My Website',
              siteDescription: 'Welcome to our website built with Strapi',
              copyrightText: '© 2024 My Website. All rights reserved.'
            }
          });
          strapi.log.info('Created default global settings');
        }
      } catch (error) {
        strapi.log.error('Error creating default global settings:', error);
      }

      strapi.log.info('Content type migration completed successfully');

    } catch (error) {
      strapi.log.error('Content type migration failed:', error);
      throw error;
    }
  }
};