const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::global-settings.global-setting');
