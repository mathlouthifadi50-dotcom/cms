# Strapi CMS Backend

Headless CMS backend built with Strapi v4, PostgreSQL, and i18n support.

## Features

- 🗄️ **PostgreSQL Database** - Production-ready relational database
- 🌍 **i18n Support** - Multilingual content with localization
- 📧 **Email Integration** - NodeMailer with SMTP for contact forms
- 🎨 **Dynamic Page Builder** - Section-based content architecture
- 🔒 **RBAC Permissions** - Role-based access control
- 📝 **Rich Content Types** - Pages, services, blog posts, and more
- 🎯 **Contact Form** - Custom endpoint with email notifications

## Content Architecture

### Single Types
- **Global Settings** - Site-wide configuration, navigation, theme tokens, SEO defaults

### Collection Types
- **Pages** - Dynamic localized pages with section components
- **Services** - Service offerings with categories, media, and pricing
- **Service Categories** - Hierarchical service organization
- **Blog Posts** - Articles with authors, tags, and SEO
- **Contact Submissions** - Form submissions with email notifications

### Components
- **Section Components** - Hero, Features, Parallax, CTA, Testimonials
- **Shared Components** - Navigation links, social links, SEO, buttons, theme colors

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- SMTP credentials (for email)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Environment Setup

Configure the following in `.env`:

```env
# Database - PostgreSQL connection
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# Strapi - Generate secure random strings
STRAPI_APP_KEYS=generate-random-key-1,generate-random-key-2,generate-random-key-3,generate-random-key-4
STRAPI_API_TOKEN_SALT=generate-random-salt
STRAPI_ADMIN_JWT_SECRET=generate-random-secret
STRAPI_JWT_SECRET=generate-random-jwt-secret

# SMTP - Email service configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SENDER_EMAIL=noreply@yourapp.com
```

**Generate Secure Keys:**
```bash
# Generate random keys for STRAPI_APP_KEYS (need 4)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate salts and secrets
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

### Database Setup

1. Create PostgreSQL database:
```bash
createdb strapi
```

2. Run migrations (automatic on first start):
```bash
pnpm dev
```

### Running Strapi

```bash
# Development mode with auto-reload
pnpm dev

# Build admin panel
pnpm build

# Production mode
pnpm start
```

Strapi will be available at:
- **Admin Panel:** http://localhost:1337/admin
- **API:** http://localhost:1337/api

### First Time Setup

1. Navigate to http://localhost:1337/admin
2. Create your admin account
3. Configure additional locales in Settings > Internationalization
4. Add sample content or run seed script
5. Configure permissions in Settings > Users & Permissions

## Project Structure

```
apps/strapi/
├── config/              # Configuration files
│   ├── admin.js        # Admin panel config
│   ├── database.js     # Database connection
│   ├── middlewares.js  # Middleware stack
│   ├── plugins.js      # Plugin configuration (i18n, email)
│   └── server.js       # Server settings
├── src/
│   ├── api/            # Content type definitions
│   │   ├── blog-post/
│   │   ├── contact-submission/
│   │   ├── global-settings/
│   │   ├── page/
│   │   ├── service/
│   │   └── service-category/
│   ├── components/     # Reusable components
│   │   ├── sections/   # Section components (hero, features, etc.)
│   │   └── shared/     # Shared components (SEO, buttons, etc.)
│   ├── database/
│   │   └── seeds/      # Seed data scripts
│   └── index.js        # Bootstrap and registration
├── .env.example        # Environment template
├── API.md             # API documentation
├── package.json       # Dependencies
└── README.md          # This file
```

## Content Type Details

### Pages
Localized dynamic pages with:
- Unique slug
- Hero section override
- Dynamic zone with multiple section types
- Relations to featured services/blog posts
- SEO metadata

### Services
Service offerings with:
- Categorization
- Rich text content
- Media galleries (images/videos)
- Pricing
- Feature lists
- CTA buttons
- Full SEO support

### Blog Posts
Articles with:
- Rich text editor
- Author attribution
- Tags and categories
- Reading time calculation
- Related posts
- Publication date
- Full SEO support

### Contact Submissions
Form submissions that:
- Persist to database
- Send email to site admin
- Send auto-reply to submitter
- Track status (new, read, replied, archived)
- Log IP and user agent

## Custom Features

### Contact Form Email Service

The contact submission endpoint includes automatic email notifications:

```javascript
// POST /api/contact-submissions
{
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Inquiry",
    "message": "Hello, I'm interested...",
    "phone": "555-0100",      // Optional
    "company": "Acme Corp"    // Optional
  }
}
```

On successful submission:
1. Saves to database
2. Sends notification to admin (from global settings or env)
3. Sends auto-reply to submitter
4. Returns success response

### RBAC Permissions

Configured in `src/index.js` bootstrap:

**Public Role:**
- Read: global-settings, pages, services, service-categories, blog-posts
- Create: contact-submissions

**Authenticated Role:**
- Full CRUD: contact-submissions

## API Endpoints

See [API.md](./API.md) for complete API documentation.

### Quick Reference

```
GET  /api/global-settings              # Site settings
GET  /api/pages?locale=en              # Localized pages
GET  /api/services?populate=*          # Services with relations
GET  /api/blog-posts?sort=publishedDate:desc  # Latest posts
POST /api/contact-submissions          # Submit contact form
```

## Seeding Data

Sample data script located in `src/database/seeds/sample-data.js`.

To seed manually:
1. Open Strapi admin panel
2. Use Content Manager to create entries
3. Or import the seed script in your bootstrap

## Internationalization

Default locale: English (en)

Add locales:
1. Settings > Internationalization > Add Locale
2. Create localized versions of content
3. Query with `?locale=xx` parameter

## Email Configuration

### Gmail Setup

1. Enable 2-factor authentication
2. Generate App Password
3. Use in SMTP_PASSWORD

### Other SMTP Providers

Update `SMTP_HOST` and `SMTP_PORT`:
- **SendGrid:** smtp.sendgrid.net:587
- **Mailgun:** smtp.mailgun.org:587
- **AWS SES:** email-smtp.region.amazonaws.com:587

## Production Deployment

1. Set `NODE_ENV=production`
2. Build admin panel: `pnpm build`
3. Use production database
4. Enable SSL for database if supported
5. Configure secure secrets
6. Run: `pnpm start`

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_* environment variables
- Ensure database exists: `createdb strapi`

### Email Not Sending
- Verify SMTP credentials
- Check firewall/network settings
- Test SMTP connection separately
- Check Strapi logs for errors

### Permission Errors
- Check Settings > Users & Permissions > Roles
- Verify public role has required permissions
- Check API token permissions for authenticated requests

## Development Tips

- Use `pnpm dev` for auto-reload during development
- Check Strapi logs for detailed error messages
- Use `?populate=*` to include relations in API responses
- Test email with a service like Mailtrap for development
- Use the Content-Type Builder for schema changes

## Contributing

When adding new content types:
1. Use Content-Type Builder in admin or create schema files
2. Update permissions in `src/index.js` bootstrap
3. Document in API.md
4. Add sample data to seed script

## Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
- [i18n Plugin](https://docs.strapi.io/dev-docs/plugins/i18n)
- [Email Plugin](https://docs.strapi.io/dev-docs/plugins/email)

## License

Private - Part of monorepo
