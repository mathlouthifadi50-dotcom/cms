# Monorepo: Next.js Frontend + Strapi CMS

A modern monorepo setup powered by pnpm and Turborepo, containing a Next.js frontend application and Strapi CMS backend.

## 📁 Repository Structure

```
monorepo/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── strapi/       # Strapi CMS backend
├── packages/
│   └── config/       # Shared configuration (ESLint, Prettier, TypeScript)
├── .env.example      # Example environment variables
├── pnpm-workspace.yaml
├── turbo.json        # Turborepo pipeline configuration
└── package.json      # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment files and configure them:
   ```bash
   # Copy root environment file
   cp .env.example .env
   
   # Copy app-specific environment files
   cp apps/web/.env.example apps/web/.env
   cp apps/strapi/.env.example apps/strapi/.env
   ```

### Development Commands

#### Run All Applications
```bash
pnpm dev
```

#### Run Specific Applications
```bash
# Next.js frontend (http://localhost:3000)
pnpm dev:web

# Strapi CMS (http://localhost:1337)
pnpm dev:cms
```

#### Build Applications
```bash
# Build all applications
pnpm build

# Build specific applications
pnpm build:web
pnpm build:cms
```

#### Code Quality
```bash
# Lint all code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type check all code
pnpm type-check
```

#### Maintenance
```bash
# Clean build artifacts
pnpm clean

# Clean everything including node_modules
pnpm clean:all

# Reinstall all dependencies
pnpm install:all
```

## 🛠️ Development Workflow

### Adding Dependencies

#### Root Dependencies (for workspace management)
```bash
pnpm add -w <package>
```

#### App-Specific Dependencies
```bash
# For Next.js app
cd apps/web && pnpm add <package>

# For Strapi app  
cd apps/strapi && pnpm add <package>
```

#### Shared Dependencies (for multiple apps)
```bash
pnpm add --filter web <package>
pnpm add --filter strapi <package>
```

### Code Organization

- **Shared configurations** are maintained in `packages/config/`
- **ESLint configuration** references the shared config from packages
- **TypeScript configurations** extend from the base config in packages
- **Environment variables** follow the 12-factor app methodology

### Turborepo Pipeline

The `turbo.json` file defines the build pipeline:

- **Build tasks** depend on building dependencies first (`^build`)
- **Dev tasks** are cached and persistent for hot reloading
- **Lint tasks** depend on successful builds
- **Clean tasks** bypass cache for fresh starts

## 🌐 Applications

### Next.js Frontend (`apps/web`)

A modern React application using:
- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint and Prettier for code quality

**Key Scripts:**
```bash
cd apps/web
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

### Strapi CMS (`apps/strapi`)

A headless CMS built with Strapi:
- SQLite for development (easily switchable to PostgreSQL)
- RESTful API with GraphQL support
- Role-based access control
- Plugin ecosystem for extended functionality

**Key Scripts:**
```bash
cd apps/strapi
pnpm dev        # Start Strapi development server
pnpm build      # Build admin panel
pnpm start      # Start production server
```

## 🔧 Configuration

### Shared Config Package (`packages/config`)

Contains shared linting, formatting, and TypeScript configurations used across all applications.

**Contents:**
- `eslint.config.js` - ESLint configuration
- `prettier.config.js` - Prettier code formatter config
- `tsconfig.json` - Base TypeScript configuration

### Environment Variables

#### Root `.env`
Contains database, SMTP, and security configurations used by both applications.

#### App-specific `.env` files
- `apps/web/.env` - Next.js specific variables
- `apps/strapi/.env` - Strapi specific variables

## 🚀 Deployment

### Build for Production
```bash
# Build all applications
pnpm build

# Applications will be built in their respective directories:
# - apps/web/.next/     (Next.js build output)
# - apps/strapi/build/  (Strapi admin panel)
```

### Docker Deployment (Optional)
Each app can be containerized independently for deployment.

## 🤝 Contributing

1. Create a new branch for your feature/fix
2. Make your changes following the established code style
3. Run `pnpm lint:fix` to fix any linting issues
4. Run `pnpm type-check` to ensure TypeScript correctness
5. Submit a pull request

## 📝 Notes

- The monorepo uses pnpm workspaces for efficient dependency management
- Turborepo provides fast, cached builds and deployments
- Shared configurations ensure consistency across applications
- Environment variables are properly separated by concern
