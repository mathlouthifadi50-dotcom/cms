module.exports = {
  register({ strapi }) {
    // Register custom functionality if needed
  },
  
  async bootstrap({ strapi }) {
    // Configure default locales for i18n
    const i18nPlugin = strapi.plugin('i18n');
    if (i18nPlugin) {
      const locales = await i18nPlugin.services.locales.find();
      
      // Ensure English is the default locale
      const englishLocale = locales.find(locale => locale.code === 'en');
      if (englishLocale && !englishLocale.isDefault) {
        await i18nPlugin.services.locales.update(englishLocale.id, {
          isDefault: true,
        });
      }
      
      strapi.log.info('i18n locales configured');
    }

    // Configure public permissions for content types
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (publicRole) {
      const contentTypes = [
        'api::global-setting.global-setting',
        'api::page.page',
        'api::service.service',
        'api::service-category.service-category',
        'api::blog-post.blog-post',
      ];

      const permissions = [];
      
      // Public read permissions for content
      for (const contentType of contentTypes) {
        permissions.push({
          action: `${contentType}.find`,
          subject: null,
          role: publicRole.id,
        });
        permissions.push({
          action: `${contentType}.findOne`,
          subject: null,
          role: publicRole.id,
        });
      }

      // Public POST permission for contact submissions
      permissions.push({
        action: 'api::contact-submission.contact-submission.create',
        subject: null,
        role: publicRole.id,
      });

      // Check and create permissions if they don't exist
      for (const permission of permissions) {
        const existing = await strapi.query('plugin::users-permissions.permission').findOne({
          where: {
            action: permission.action,
            role: permission.role,
          },
        });

        if (!existing) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              ...permission,
              enabled: true,
            },
          });
        } else if (!existing.enabled) {
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: existing.id },
            data: { enabled: true },
          });
        }
      }

      strapi.log.info('Public permissions configured');
    }
  },
};
