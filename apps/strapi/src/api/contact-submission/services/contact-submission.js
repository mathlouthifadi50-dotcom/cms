const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::contact-submission.contact-submission', ({ strapi }) => ({
  async sendEmail(submission) {
    try {
      // Get global settings for email configuration
      const globalSettings = await strapi.entityService.findMany('api::global-setting.global-setting', {
        fields: ['contactRecipientEmail', 'smtpFromName', 'smtpFromEmail'],
      });

      const recipientEmail = globalSettings?.contactRecipientEmail || process.env.SMTP_USERNAME;
      const fromName = globalSettings?.smtpFromName || process.env.SMTP_SENDER_NAME || 'Website Contact Form';
      const fromEmail = globalSettings?.smtpFromEmail || process.env.SMTP_SENDER_EMAIL;

      if (!recipientEmail) {
        throw new Error('No recipient email configured');
      }

      // Send email to admin/site owner
      await strapi.plugins['email'].services.email.send({
        to: recipientEmail,
        from: fromEmail,
        replyTo: submission.email,
        subject: `New Contact Form Submission: ${submission.subject}`,
        text: `
You have received a new contact form submission:

Name: ${submission.name}
Email: ${submission.email}
${submission.phone ? `Phone: ${submission.phone}` : ''}
${submission.company ? `Company: ${submission.company}` : ''}
Subject: ${submission.subject}

Message:
${submission.message}

---
Submission ID: ${submission.id}
Submitted at: ${submission.createdAt}
IP Address: ${submission.ipAddress || 'Unknown'}
        `,
        html: `
<h2>New Contact Form Submission</h2>
<p>You have received a new contact form submission:</p>

<table style="border-collapse: collapse; width: 100%; max-width: 600px;">
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${submission.name}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
    <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${submission.email}">${submission.email}</a></td>
  </tr>
  ${submission.phone ? `
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${submission.phone}</td>
  </tr>
  ` : ''}
  ${submission.company ? `
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${submission.company}</td>
  </tr>
  ` : ''}
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Subject</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${submission.subject}</td>
  </tr>
</table>

<h3>Message:</h3>
<p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 4px;">${submission.message}</p>

<hr style="margin: 20px 0;" />
<p style="font-size: 12px; color: #666;">
  <strong>Submission ID:</strong> ${submission.id}<br />
  <strong>Submitted at:</strong> ${submission.createdAt}<br />
  <strong>IP Address:</strong> ${submission.ipAddress || 'Unknown'}
</p>
        `,
      });

      // Send auto-reply to submitter
      await strapi.plugins['email'].services.email.send({
        to: submission.email,
        from: fromEmail,
        subject: `We received your message: ${submission.subject}`,
        text: `
Hi ${submission.name},

Thank you for contacting us! We have received your message and will get back to you as soon as possible.

Here's a copy of your message:

Subject: ${submission.subject}
Message: ${submission.message}

Best regards,
${fromName}
        `,
        html: `
<h2>Thank you for contacting us!</h2>
<p>Hi ${submission.name},</p>
<p>We have received your message and will get back to you as soon as possible.</p>

<h3>Your message:</h3>
<p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 4px;">${submission.message}</p>

<p>Best regards,<br />${fromName}</p>
        `,
      });

      strapi.log.info(`Contact form email sent successfully for submission ${submission.id}`);
      return true;
    } catch (error) {
      strapi.log.error('Error sending contact form email:', error);
      throw error;
    }
  },
}));
