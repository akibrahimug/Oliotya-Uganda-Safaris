# Nambi Uganda Safaris

A modern, full-stack safari booking and content management platform for Nambi Uganda Safaris. This platform provides a comprehensive solution for showcasing safari packages, managing bookings, and administering website content.

![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.18-2D3748?style=flat&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [CMS Features](#cms-features)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Image Optimization](#image-optimization)
- [Testing](#testing)
- [Contributing](#contributing)

## ✨ Features

### Public-Facing Website

- **Dynamic Homepage**
  - Hero section with search functionality
  - Popular destinations showcase
  - Featured safari packages
  - Customer testimonials
  - Video introduction section
  - Responsive design optimized for all devices

- **Safari Packages**
  - Browse packages by category (Gorilla Trekking, Wildlife Safari, Cultural Tours, etc.)
  - Detailed package pages with:
    - Full itineraries
    - Pricing and duration
    - Difficulty levels
    - Included/excluded items
    - Photo galleries
  - Package filtering and search
  - Real-time availability

- **Destinations**
  - Comprehensive destination pages
  - Wildlife information
  - Cultural experiences
  - Best time to visit guides
  - Geography and climate details
  - Interactive image galleries

- **About Page**
  - Company story and mission
  - Team member profiles
  - Core values and commitments
  - Statistics and achievements
  - Call-to-action sections

- **Contact Page**
  - Multiple contact methods (phone, email, WhatsApp)
  - Contact form with validation
  - Office location information
  - Business hours
  - FAQ section
  - Resource links

- **Booking System**
  - Multi-step booking process
  - Traveler information collection
  - Special requests handling
  - Email notifications
  - Booking confirmation

### Content Management System (CMS)

- **Dashboard**
  - Quick stats and analytics
  - Recent bookings
  - Content status overview
  - Quick actions

- **Image Management**
  - Bulk image upload (up to 10MB per image)
  - Client-side compression to WebP
  - Automatic optimization
  - Image categorization
  - Alt text and metadata
  - Cloudflare R2 storage integration
  - Image picker for content selection

- **Page Management**
  - **Home Page Editor**
    - Hero section (title, subtitle, image, CTA)
    - Experience section
    - Tour guide section
    - Video section
    - Inline editing
  - **About Page Editor**
    - Hero section
    - Story section
    - Values section
    - Team members
    - Statistics
    - Community section
  - **Contact Page Editor**
    - Hero section
    - Contact information
    - Resources section

- **Packages Management**
  - Create, edit, delete packages
  - Itinerary builder
  - Image galleries
  - Pricing and availability
  - Category management
  - Difficulty settings
  - Featured/popular flags

- **Destinations Management**
  - Full destination CRUD
  - Wildlife information
  - Cultural details
  - Season information
  - Image management

- **Site Settings**
  - **Brand Settings**
    - Site name
    - Logo (with image picker)
    - Tagline
  - **Contact Information**
    - Phone numbers
    - Email addresses
    - Office address
    - WhatsApp number
  - **Social Media Links**
    - Facebook, Instagram, Twitter
    - LinkedIn, YouTube
  - **Newsletter Configuration**
    - Title and description
  - **Footer Content**
    - Description
    - Copyright text

- **FAQs Management**
  - Create and edit FAQs
  - Category organization
  - Display order control

- **Audit Logging**
  - Track all content changes
  - User attribution
  - Timestamp tracking

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js 15.1.3](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Styling**:
  - [Tailwind CSS 3.4](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/) components
  - CSS Modules for scoped styles
- **State Management**: React hooks (useState, useEffect, etc.)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**:
  - Framer Motion
  - CSS transitions
- **Image Optimization**:
  - Client-side WebP compression
  - Canvas API + createImageBitmap
  - Next.js Image component

### Backend

- **Runtime**: Node.js 18+
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Prisma)
- **ORM**: [Prisma 6.18](https://www.prisma.io/)
- **Authentication**: [Clerk](https://clerk.com/)
- **File Storage**: [Cloudflare R2](https://www.cloudflare.com/products/r2/)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/)
- **Email**: (Ready for integration)

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript compiler
- **Testing**: Jest + React Testing Library
- **Git Hooks**: (Ready for Husky setup)

### Deployment

- **Platform**: [Vercel](https://vercel.com/)
- **CDN**: Cloudflare R2 (images and assets)
- **Database Hosting**: Prisma-compatible PostgreSQL
- **Environment**: Production, Staging

## 🏗 Architecture

### Project Structure

```
fox-adventures/
├── app/                          # Next.js App Router
│   ├── (routes)/                # Public routes
│   │   ├── page.tsx            # Homepage
│   │   ├── about/              # About page
│   │   ├── packages/           # Safari packages
│   │   ├── destinations/       # Destinations
│   │   └── contact/            # Contact page
│   ├── cms/                    # CMS routes (protected)
│   │   ├── layout.tsx          # CMS layout with sidebar
│   │   ├── page.tsx            # CMS dashboard
│   │   ├── images/             # Image management
│   │   ├── packages/           # Package management
│   │   ├── destinations/       # Destination management
│   │   ├── pages/              # Page editors
│   │   │   ├── home/
│   │   │   ├── about/
│   │   │   └── contact/
│   │   ├── faqs/               # FAQ management
│   │   └── settings/           # Site settings
│   ├── api/                    # API routes
│   │   ├── cms/                # CMS API endpoints
│   │   │   ├── images/         # Image CRUD
│   │   │   ├── packages/       # Package CRUD
│   │   │   ├── destinations/   # Destination CRUD
│   │   │   ├── settings/       # Settings API
│   │   │   └── */              # Other endpoints
│   │   └── */                  # Public API endpoints
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── cms/                    # CMS-specific components
│   │   ├── editable-wrapper.tsx
│   │   ├── image-picker.tsx
│   │   └── */                  # Modal components
│   ├── header.tsx              # Site header
│   ├── footer.tsx              # Site footer
│   └── */                      # Feature components
├── lib/                        # Utility libraries
│   ├── db.ts                   # Prisma client
│   ├── r2.ts                   # R2 storage utilities
│   ├── image-client.ts         # Client-side compression
│   ├── validations/            # Zod schemas
│   └── utils.ts                # Helper functions
├── prisma/                     # Database
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Migration history
│   └── app/generated/          # Generated Prisma client
├── scripts/                    # Utility scripts
│   ├── seed-*.mjs              # Database seeding
│   └── */                      # Other scripts
├── public/                     # Static assets
├── TESTING.md                  # Testing documentation
└── README.md                   # This file
```

### Database Architecture

The application uses a PostgreSQL database managed by Prisma ORM with the following key models:

- **Content Models**: `Destination`, `Package`, `Booking`, `Review`
- **CMS Models**: `CMSImage`, `CMSDestination`, `CMSAuditLog`
- **Page Models**: `HomeHero`, `AboutHero`, `AboutStory`, `TeamMember`, `ContactHero`, `ContactInfo`
- **Settings**: `SiteSettings` (flexible JSON-based configuration)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL database
- Cloudflare R2 account (for image storage)
- Clerk account (for authentication)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/fox-adventures.git
cd fox-adventures
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_R2_PUBLIC_URL=https://your-bucket.r2.dev
```

4. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npm run seed
```

5. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Seeding

The project includes comprehensive seeding scripts:

```bash
# Seed all data
npm run seed

# Or seed individual collections
node scripts/seed-home-sections.mjs
node scripts/seed-about-sections.mjs
node scripts/seed-packages.mjs
node scripts/seed-destinations.mjs
node scripts/seed-site-settings.mjs
```

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_xxxxx` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_xxxxx` |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID | `abc123` |
| `R2_ACCESS_KEY_ID` | R2 access key | `xxxxx` |
| `R2_SECRET_ACCESS_KEY` | R2 secret key | `xxxxx` |
| `R2_BUCKET_NAME` | R2 bucket name | `nambi-uganda-safaris` |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | Public R2 URL | `https://cdn.example.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page URL | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page URL | `/sign-up` |
| `NODE_ENV` | Environment mode | `development` |

## 📊 Database Schema

### Key Models

#### Package
```prisma
model Package {
  id           Int       @id @default(autoincrement())
  name         String
  slug         String    @unique
  category     String
  duration     String
  price        Decimal
  description  String
  image        String
  images       String[]
  highlights   String[]
  itinerary    Json      // Array of itinerary days
  included     String[]
  excluded     String[]
  difficulty   DifficultyLevel
  featured     Boolean
  popular      Boolean
  active       Boolean
  // ... timestamps and relations
}
```

#### Destination
```prisma
model Destination {
  id          Int      @id @default(autoincrement())
  name        String
  category    String
  country     String
  region      String?
  description String
  image       String
  images      String[]
  // Wildlife, culture, geography sections
  // ... timestamps and relations
}
```

#### SiteSettings
```prisma
model SiteSettings {
  id        String   @id @default(cuid())
  key       String   @unique
  value     Json     // Flexible configuration
  category  String?
  updatedAt DateTime
  updatedBy String?
}
```

See `prisma/schema.prisma` for the complete schema.

## 🎨 CMS Features

### Image Management

The CMS includes a sophisticated image management system:

- **Client-Side Compression**
  - Automatic WebP conversion
  - Progressive quality reduction (85% → 70% → 50%)
  - Maximum 3840px dimension (4K)
  - Smart handling of SVG and animated GIFs
  - Accepts up to 10MB originals
  - Compresses to under 4MB for Vercel compatibility

- **Upload Features**
  - Drag-and-drop interface
  - Bulk uploads (20+ images)
  - Progress tracking per file
  - Real-time compression status
  - Alt text and categorization
  - Image picker for content selection

- **Storage**
  - Cloudflare R2 for fast CDN delivery
  - Automatic optimization on upload
  - Metadata storage in PostgreSQL

### Page Editors

All major pages have inline editors:

- Real-time preview
- Click-to-edit functionality
  - Publish/unpublish workflows
- Image selection from gallery
- Rich text editing
- Undo/redo support

### Audit Trail

Every CMS action is logged:

```typescript
{
  action: "CREATE" | "UPDATE" | "DELETE",
  entityType: "package" | "destination" | "image",
  entityId: string,
  userId: string,
  userName: string,
  timestamp: DateTime
}
```

## 🔌 API Routes

### Public API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/packages` | GET | List all packages |
| `/api/packages/[id]` | GET | Get package details |
| `/api/destinations` | GET | List all destinations |
| `/api/destinations/[id]` | GET | Get destination details |
| `/api/bookings` | POST | Create booking |
| `/api/contact` | POST | Submit contact form |

### CMS API (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cms/images` | GET, POST | Image CRUD |
| `/api/cms/images/[id]` | GET, PATCH, DELETE | Single image operations |
| `/api/cms/packages` | GET, POST | Package management |
| `/api/cms/packages/[id]` | GET, PATCH, DELETE | Package operations |
| `/api/cms/destinations` | GET, POST | Destination management |
| `/api/cms/destinations/[id]` | GET, PATCH, DELETE | Destination operations |
| `/api/cms/settings` | GET, PATCH | Site settings |
| `/api/cms/home-sections/*` | GET, PATCH | Home page sections |
| `/api/cms/about-sections/*` | GET, PATCH | About page sections |

All CMS routes are protected by Clerk authentication.

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Set Environment Variables**

In Vercel dashboard, add all environment variables from `.env.local`.

4. **Configure Build**

```json
{
  "buildCommand": "npx prisma generate && next build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### Database Migration on Deploy

Add to `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### Cloudflare R2 Setup

1. Create an R2 bucket
2. Configure public access
3. Add R2 credentials to environment variables
4. Update `NEXT_PUBLIC_R2_PUBLIC_URL` with your CDN URL

## 🖼 Image Optimization

### Client-Side Compression (`lib/image-client.ts`)

The platform uses a custom compression system that:

1. **Accepts large originals**: Up to 10MB
2. **Compresses intelligently**:
   - Resizes to max 3840px
   - Converts to WebP at 85% quality
   - Falls back to 70%, then 50% if needed
3. **Preserves special formats**:
   - SVG files (no compression)
   - Animated GIFs (preserved)
4. **Stays under limits**: Final size < 4MB

### Server-Side Optimization

After upload, Sharp processes images:

- Further optimization if needed
- Metadata extraction
- Thumbnail generation (future)
- Storage in Cloudflare R2

### Usage

```typescript
import { compressImageToWebp } from '@/lib/image-client';

const result = await compressImageToWebp(file, (progress) => {
  console.log(`Progress: ${progress}%`);
});

console.log(`Original: ${result.originalSize / 1024 / 1024}MB`);
console.log(`Compressed: ${result.compressedSize / 1024 / 1024}MB`);
console.log(`Saved: ${(result.compressionRatio * 100).toFixed(0)}%`);
```

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:coverage
```

### Manual Testing

See `TESTING.md` for comprehensive manual testing checklist covering:
- Image upload and compression
- CMS functionality
- Booking flow
- Mobile responsiveness
- Browser compatibility

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler |
| `npm run seed` | Seed database |
| `npm run migrate` | Run database migrations |
| `npm test` | Run tests |

## 🔧 Configuration

### Tailwind CSS

Tailwind is configured with custom theme in `tailwind.config.ts`:

```typescript
{
  theme: {
    extend: {
      colors: {
        primary: { ... },
        secondary: { ... },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
}
```

### Prisma

Prisma configuration in `prisma/schema.prisma`:

```prisma
generator client {
  provider      = "prisma-client-js"
  output        = "./app/generated/prisma-client"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Next.js

Next.js configuration in `next.config.js`:

```javascript
{
  images: {
    domains: ['your-r2-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    serverActions: true,
  },
}
```

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run tests
   ```bash
   npm test
   ```

4. Commit with conventional commits
   ```bash
   git commit -m "feat: add new feature"
   ```

5. Push and create PR
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write tests for new features
- Document public APIs

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## 👥 Team

- **Developer**: [Your Name]
- **Client**: Nambi Uganda Safaris
- **Project Manager**: [PM Name]

## 📞 Support

For support, email [support@nambiuganda.com](mailto:support@nambiuganda.com) or visit our [support page](https://nambiuganda.com/contact).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Clerk](https://clerk.com/) - Authentication
- [Cloudflare](https://www.cloudflare.com/) - CDN and storage
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel](https://vercel.com/) - Deployment platform

---

**Built with ❤️ for Nambi Uganda Safaris**

*Last updated: January 2025*
