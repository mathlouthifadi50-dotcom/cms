# Strapi API Documentation

## Overview

This Strapi instance provides a headless CMS with the following content types and features:

- PostgreSQL database
- i18n plugin for multilingual content
- Email notifications via NodeMailer
- Custom contact form endpoint with SMTP integration

## Content Types

### Global Settings (Single Type)
**Endpoint:** `GET /api/global-settings`

Site-wide configuration including:
- Site identity (name, logo, favicon)
- Navigation menus (header/footer)
- Social media links
- Theme tokens (light/dark palettes)
- Default SEO settings
- SMTP configuration references

### Pages (Collection)
**Endpoints:**
- `GET /api/pages` - List all pages
- `GET /api/pages/:id` - Get single page
- `GET /api/pages?locale=en` - Get localized pages

Localized dynamic pages with:
- Slug and metadata
- Hero section overrides
- Dynamic zones with section components
- Relations to services and blog posts
- SEO metadata

### Services (Collection)
**Endpoints:**
- `GET /api/services` - List all services
- `GET /api/services/:id` - Get single service
- `GET /api/services?locale=en` - Get localized services

Service offerings with:
- Title, slug, description, rich content
- Category relationship
- Media galleries
- CTA buttons
- Pricing information
- SEO fields

### Service Categories (Collection)
**Endpoints:**
- `GET /api/service-categories` - List all categories
- `GET /api/service-categories/:id` - Get single category

Categories for organizing services with localization support.

### Blog Posts (Collection)
**Endpoints:**
- `GET /api/blog-posts` - List all posts
- `GET /api/blog-posts/:id` - Get single post
- `GET /api/blog-posts?locale=en` - Get localized posts

Blog articles with:
- Title, slug, excerpt, rich content
- Author and publication date
- Tags and reading time
- Media galleries
- Related posts
- SEO metadata

### Contact Submissions (Collection)
**Endpoints:**
- `POST /api/contact-submissions` - Submit contact form (public)
- `GET /api/contact-submissions` - List submissions (authenticated)
- `GET /api/contact-submissions/:id` - Get single submission (authenticated)

Contact form submissions with:
- Name, email, subject, message
- Optional phone and company
- Status tracking (new, read, replied, archived)
- IP address and user agent logging
- Automatic email notifications via SMTP

## Section Components

Dynamic zone components for page builder:

### sections.hero
Hero section with title, subtitle, background image, CTA buttons, and alignment options.

### sections.features
Features grid/list/carousel with feature items, configurable columns.

### sections.parallax
Parallax scrolling section with background image and overlay.

### sections.cta
Call-to-action section with title, description, buttons, and styling options.

### sections.testimonials
Testimonials section with customer reviews, ratings, and layout options.

## Email Notifications

The contact form endpoint automatically:
1. Saves submission to database
2. Sends notification email to configured recipient
3. Sends auto-reply confirmation to submitter
4. Uses NodeMailer with SMTP configuration from environment variables

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# Strapi
STRAPI_HOST=0.0.0.0
STRAPI_PORT=1337
STRAPI_APP_KEYS=your-app-keys-here
STRAPI_API_TOKEN_SALT=your-api-token-salt
STRAPI_ADMIN_JWT_SECRET=your-admin-jwt-secret
STRAPI_JWT_SECRET=your-jwt-secret

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SENDER_NAME=Your App Name
SMTP_SENDER_EMAIL=noreply@yourapp.com
```

## Permissions

### Public Access
- Read access to: global-settings, pages, services, service-categories, blog-posts
- POST access to: contact-submissions

### Authenticated Access
- Full CRUD operations on contact-submissions (for admins)
- Managed through Strapi RBAC

## Localization

All content types except contact submissions support i18n:
- Default locale: English (en)
- Additional locales can be added via Strapi admin
- Use `?locale=xx` query parameter to fetch localized content

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build admin panel
pnpm build

# Start production server
pnpm start
```

## Testing Contact Form

```bash
curl -X POST http://localhost:1337/api/contact-submissions \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Test Message",
      "message": "This is a test message",
      "phone": "555-0100",
      "company": "Test Corp"
    }
  }'
```

This will:
1. Create a contact submission entry
2. Send notification email to the configured recipient
3. Send auto-reply to john@example.com
4. Return success response with submission data
