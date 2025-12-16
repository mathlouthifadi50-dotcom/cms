const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact-submission.contact-submission', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { name, email, subject, message, phone, company } = ctx.request.body.data || ctx.request.body;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        return ctx.badRequest('Missing required fields: name, email, subject, message');
      }

      // Get IP address and user agent from request
      const ipAddress = ctx.request.ip || ctx.request.headers['x-forwarded-for'] || ctx.request.socket.remoteAddress;
      const userAgent = ctx.request.headers['user-agent'];

      // Create the submission
      const submission = await strapi.service('api::contact-submission.contact-submission').create({
        data: {
          name,
          email,
          subject,
          message,
          phone,
          company,
          ipAddress,
          userAgent,
          status: 'new',
          emailSent: false,
        },
      });

      // Send email notification
      try {
        await strapi.service('api::contact-submission.contact-submission').sendEmail(submission);
        
        // Update submission to mark email as sent
        await strapi.entityService.update('api::contact-submission.contact-submission', submission.id, {
          data: {
            emailSent: true,
          },
        });
      } catch (emailError) {
        strapi.log.error('Failed to send email notification:', emailError);
        // Continue even if email fails - submission is saved
      }

      return ctx.created({
        data: submission,
        message: 'Contact submission received successfully',
      });
    } catch (error) {
      strapi.log.error('Error creating contact submission:', error);
      return ctx.internalServerError('An error occurred while processing your submission');
    }
  },

  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
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
