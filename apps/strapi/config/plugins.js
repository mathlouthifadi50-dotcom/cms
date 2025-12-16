module.exports = ({ env }) => ({
  // Enable i18n plugin for content localization
  i18n: {
    enabled: true,
  },
  
  // Email plugin configuration using NodeMailer
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_SENDER_EMAIL', 'noreply@strapi.io'),
        defaultReplyTo: env('SMTP_SENDER_EMAIL', 'noreply@strapi.io'),
      },
    },
  },
});
