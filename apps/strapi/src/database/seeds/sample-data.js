/**
 * Seed sample data for development and testing
 * Run this manually from the Strapi admin panel or via custom command
 */

async function seedData(strapi) {
  try {
    strapi.log.info('Starting data seeding...');

    // Seed Global Settings
    const existingGlobalSettings = await strapi.entityService.findMany('api::global-setting.global-setting');
    
    if (!existingGlobalSettings) {
      await strapi.entityService.create('api::global-setting.global-setting', {
        data: {
          siteName: 'My Awesome Site',
          siteDescription: 'A modern website built with Next.js and Strapi',
          headerNavigation: [
            { label: 'Home', url: '/', openInNewTab: false },
            { label: 'Services', url: '/services', openInNewTab: false },
            { label: 'Blog', url: '/blog', openInNewTab: false },
            { label: 'Contact', url: '/contact', openInNewTab: false },
          ],
          socialLinks: [
            { platform: 'twitter', url: 'https://twitter.com/example' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/example' },
            { platform: 'github', url: 'https://github.com/example' },
          ],
          lightTheme: [
            { name: 'primary', value: '#3B82F6' },
            { name: 'secondary', value: '#10B981' },
            { name: 'background', value: '#FFFFFF' },
            { name: 'text', value: '#1F2937' },
          ],
          darkTheme: [
            { name: 'primary', value: '#60A5FA' },
            { name: 'secondary', value: '#34D399' },
            { name: 'background', value: '#1F2937' },
            { name: 'text', value: '#F9FAFB' },
          ],
          copyrightText: '© 2024 My Awesome Site. All rights reserved.',
        },
      });
      strapi.log.info('✓ Global settings seeded');
    }

    // Seed Service Categories
    const webCategory = await strapi.entityService.create('api::service-category.service-category', {
      data: {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Professional web development services',
        locale: 'en',
        publishedAt: new Date(),
      },
    });

    const mobileCategory = await strapi.entityService.create('api::service-category.service-category', {
      data: {
        name: 'Mobile Development',
        slug: 'mobile-development',
        description: 'Native and cross-platform mobile app development',
        locale: 'en',
        publishedAt: new Date(),
      },
    });

    strapi.log.info('✓ Service categories seeded');

    // Seed Services
    await strapi.entityService.create('api::service.service', {
      data: {
        title: 'Custom Web Application',
        slug: 'custom-web-application',
        description: 'Build scalable and performant web applications',
        content: '# Custom Web Applications\n\nWe create custom web applications tailored to your business needs.',
        excerpt: 'Professional web application development services',
        category: webCategory.id,
        price: 5000,
        locale: 'en',
        publishedAt: new Date(),
      },
    });

    await strapi.entityService.create('api::service.service', {
      data: {
        title: 'Mobile App Development',
        slug: 'mobile-app-development',
        description: 'Native iOS and Android app development',
        content: '# Mobile App Development\n\nCreate stunning mobile applications for iOS and Android.',
        excerpt: 'Professional mobile app development',
        category: mobileCategory.id,
        price: 7500,
        locale: 'en',
        publishedAt: new Date(),
      },
    });

    strapi.log.info('✓ Services seeded');

    // Seed Blog Posts
    await strapi.entityService.create('api::blog-post.blog-post', {
      data: {
        title: 'Getting Started with Strapi and Next.js',
        slug: 'getting-started-strapi-nextjs',
        excerpt: 'Learn how to build a modern web application using Strapi and Next.js',
        content: '# Getting Started\n\nStrapi and Next.js make a powerful combination for building modern web applications...',
        author: 'John Doe',
        publishedDate: new Date(),
        tags: ['strapi', 'nextjs', 'tutorial'],
        readingTime: 5,
        locale: 'en',
        publishedAt: new Date(),
      },
    });

    await strapi.entityService.create('api::blog-post.blog-post', {
      data: {
        title: 'Best Practices for API Development',
        slug: 'api-development-best-practices',
        excerpt: 'Discover the best practices for building scalable and secure APIs',
        content: '# API Development Best Practices\n\nBuilding a good API requires careful planning and execution...',
        author: 'Jane Smith',
        publishedDate: new Date(),
        tags: ['api', 'backend', 'best-practices'],
        readingTime: 8,
        locale: 'en',
        publishedAt: new Date(),
      },
    });

    strapi.log.info('✓ Blog posts seeded');

    // Seed Sample Page
    await strapi.entityService.create('api::page.page', {
      data: {
        title: 'Home',
        slug: 'home',
        sections: [
          {
            __component: 'sections.hero',
            title: 'Welcome to Our Website',
            subtitle: 'Building amazing digital experiences',
            alignment: 'center',
            overlay: true,
          },
          {
            __component: 'sections.features',
            title: 'Our Features',
            subtitle: 'What makes us different',
            layout: 'grid',
            columns: 3,
          },
        ],
        locale: 'en',
        publishedAt: new Date(),
      },
    });

    strapi.log.info('✓ Sample page seeded');
    strapi.log.info('Data seeding completed successfully!');
  } catch (error) {
    strapi.log.error('Error seeding data:', error);
    throw error;
  }
}

module.exports = seedData;
