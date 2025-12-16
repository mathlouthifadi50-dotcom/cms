const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::global-setting.global-setting', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async update(ctx) {
    const { data, meta } = await super.update(ctx);
    return { data, meta };
  },

  async delete(ctx) {
    const { data, meta } = await super.delete(ctx);
    return { data, meta };
  },
}));
