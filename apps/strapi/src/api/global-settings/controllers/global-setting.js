const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::global-settings.global-setting');
