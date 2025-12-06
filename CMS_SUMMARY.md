# Oliotya Safaris CMS - Summary & Quick Start

## What We've Analyzed

I've completed a comprehensive analysis of your Oliotya Safaris application and created a complete CMS plan. Here's what was discovered:

### Content Inventory

**Total Editable Elements: ~180+**

| Category | Count | Priority |
|----------|-------|----------|
| Text Blocks | ~120+ | High |
| Images | 30+ unique | High |
| Packages | 12+ entries | Critical |
| Destinations | 10+ entries | Critical |
| Team Members | 3 entries | Medium |
| FAQs | 6 entries | Medium |
| Hero Carousel | 5 slides | Critical |
| Navigation Links | 10+ | Low |
| Contact Info | 6 fields | High |

---

## MVP CMS Scope (Start Small)

### Phase 1 Features (2 weeks)

**Core Management:**
1. **Image Gallery** - Upload, replace, delete images with R2 integration
2. **Hero Carousel Editor** - Edit 5 homepage carousel slides
3. **Packages CRUD** - Full management of safari packages
4. **Destinations CRUD** - Full management of destinations
5. **Global Settings** - Company info, contact details, social links

**Why This Covers 80% of Needs:**
- These are the most dynamic sections that change frequently
- Packages and Destinations are your main revenue drivers
- Images need constant updating for marketing
- Hero carousel is your first impression

---

## Documents Created

### 1. CMS_CONTENT_STRUCTURE.md
**Complete content inventory** including:
- All 12 pages analyzed
- Every text field, image, and data structure
- File paths and line numbers
- Organized by page and section

### 2. CMS_IMPLEMENTATION_PLAN.md
**Development roadmap** with:
- Visual mockups of CMS screens
- Database schema (Prisma models)
- API routes structure
- Authentication strategy
- 10-day implementation timeline
- Tech stack details

### 3. This Summary Document
Quick reference for getting started

---

## CMS Features Overview

### Dashboard Home
```
Quick Stats:
- Total Images: 32
- Total Packages: 12
- Total Destinations: 10
- Recent Updates feed
```

### Main Sections

**1. IMAGES GALLERY**
- Grid view with thumbnails
- Upload multiple images (drag & drop)
- Filter by category, date, usage
- Edit modal with:
  - Replace image
  - Update alt text
  - Set category
  - View usage locations
  - Delete with confirmation

**2. PAGES**
- Home Page → Hero Carousel Editor (5 slides)
- About Page → Story, Team, Stats, Values
- Contact Page → Info, FAQs
- Other pages...

**3. CONTENT COLLECTIONS**

**Packages:**
- List view (table with search/filter)
- Full editor with:
  - Basic info (name, category, price, duration)
  - Media (hero image + gallery)
  - Description (rich text editor)
  - Highlights (array editor)
  - Day-by-day itinerary (repeater)
  - Inclusions/Exclusions (lists)
  - Group size & difficulty
  - Status toggles (active, featured, popular)

**Destinations:**
- Similar to Packages but with:
  - Region selector
  - Wildlife/Flora lists
  - Cultural experiences
  - Best time to visit
  - History & geography sections

**4. GLOBAL SETTINGS**
- Company Information
  - Name, Logo, Tagline
- Contact Details
  - Email, Phone, Address, Hours
- Social Media
  - Facebook, Instagram, Twitter URLs

---

## Database Models (Prisma)

### New Models to Add

```prisma
model Image {
  id          String   @id @default(cuid())
  filename    String
  url         String
  altText     String?
  category    String?
  width       Int
  height      Int
  fileSize    Int
  format      String
  usedIn      Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Package {
  id           String   @id @default(cuid())
  name         String
  slug         String   @unique
  category     String
  duration     String
  price        Float
  description  String   @db.Text
  heroImage    String
  gallery      Json
  highlights   Json
  itinerary    Json
  included     Json
  excluded     Json
  minTravelers Int
  maxTravelers Int
  difficulty   String
  featured     Boolean  @default(false)
  popular      Boolean  @default(false)
  active       Boolean  @default(true)
  // ... more fields
}

model Destination {
  // Similar structure to Package
}

model HeroSlide {
  id          String   @id @default(cuid())
  title       String
  subtitle    String
  description String
  image       String
  displayOrder Int
  active      Boolean  @default(true)
  // ... more fields
}

model SiteSettings {
  id    String @id @default(cuid())
  key   String @unique
  value Json
}
```

---

## API Structure

```
/api/cms/
  ├── images/
  │   ├── GET, POST /
  │   ├── PUT, DELETE /[id]
  │   └── POST /[id]/replace
  │
  ├── packages/
  │   ├── GET, POST /
  │   └── GET, PUT, DELETE /[id]
  │
  ├── destinations/
  │   └── (same as packages)
  │
  ├── hero-slides/
  │   └── CRUD + reorder endpoint
  │
  └── settings/
      └── GET, PUT operations
```

---

## Authentication

Using **Clerk** (already set up):

```typescript
// Protect CMS routes
const { userId } = auth();
if (!userId) return Response("Unauthorized", { status: 401 });

// Check admin role
const user = await clerkClient.users.getUser(userId);
const isAdmin = user.publicMetadata.role === "admin";
```

### Access Levels
- **Admin**: Full access
- **Editor**: Can edit but not delete
- **Viewer**: Read-only

---

## Migration Strategy

### From Static to Dynamic

**Current State:**
```typescript
// Static data in lib/packages-data.ts
export const allPackages = [
  { id: 1, name: "14-Day Grand Tour", ... }
]
```

**After CMS:**
```typescript
// Dynamic data from database
export async function getPackages() {
  const packages = await prisma.package.findMany({
    where: { active: true },
    orderBy: { displayOrder: 'asc' }
  });
  return packages;
}
```

### Migration Steps
1. Run migration to create CMS tables
2. Create seed script to move static data → database
3. Update components to fetch from database
4. Keep static data as fallback during transition
5. Test thoroughly
6. Remove static data files

---

## Tech Stack (Using Existing)

✅ **Already Have:**
- Next.js 15 (App Router)
- PostgreSQL + Prisma
- Clerk Auth
- Cloudflare R2
- Radix UI + TailwindCSS
- React Hook Form + Zod

📦 **Need to Add:**
- Rich text editor (Tiptap recommended)
- Drag & drop (dnd-kit)
- Image cropper (optional)

---

## Development Timeline

### Week 1: Foundation + Images
**Days 1-2**: Database & API
- Create Prisma models
- Run migrations
- Build API routes
- Add auth middleware

**Days 3-4**: CMS Layout
- Dashboard layout
- Navigation sidebar
- Basic routing

**Days 5-7**: Image Management
- Image gallery view
- Upload functionality
- Edit modal
- R2 integration
- Replace/delete operations

### Week 2: Content Editors
**Days 8-9**: Hero Carousel
- Slide list view
- Slide editor
- Reorder functionality
- Image picker integration

**Days 10-11**: Packages
- List view with search/filter
- Package editor form
- Itinerary repeater
- Save/publish

**Days 12-13**: Destinations
- Similar to packages
- Destination-specific fields

**Day 14**: Settings & Polish
- Global settings editor
- Testing & bug fixes
- Responsive design
- Documentation

---

## File Structure

```
app/
  ├── cms/                    # CMS routes
  │   ├── layout.tsx          # CMS layout with auth
  │   ├── page.tsx            # Dashboard home
  │   ├── images/
  │   │   └── page.tsx        # Image gallery
  │   ├── pages/
  │   │   └── home/
  │   │       └── hero/page.tsx  # Hero editor
  │   ├── packages/
  │   │   ├── page.tsx        # Package list
  │   │   ├── new/page.tsx    # New package
  │   │   └── [id]/page.tsx   # Edit package
  │   ├── destinations/
  │   │   └── ...             # Similar to packages
  │   └── settings/
  │       └── page.tsx        # Global settings
  │
  └── api/
      └── cms/                # CMS API routes
          ├── images/
          ├── packages/
          ├── destinations/
          ├── hero-slides/
          └── settings/

components/
  └── cms/                    # CMS-specific components
      ├── image-picker.tsx
      ├── rich-text-editor.tsx
      ├── itinerary-editor.tsx
      └── ...

prisma/
  └── schema.prisma           # Add CMS models

lib/
  └── cms/
      ├── queries.ts          # Database queries
      └── validations.ts      # Zod schemas
```

---

## Quick Start Commands

```bash
# 1. Review the documents
cat CMS_CONTENT_STRUCTURE.md
cat CMS_IMPLEMENTATION_PLAN.md

# 2. When ready to start development:
# Add Prisma models (see CMS_IMPLEMENTATION_PLAN.md)
# Then run:
npx prisma migrate dev --name add_cms_models
npx prisma generate

# 3. Install additional dependencies
npm install @tiptap/react @tiptap/starter-kit @dnd-kit/core @dnd-kit/sortable --legacy-peer-deps

# 4. Create CMS routes structure
mkdir -p app/cms/{images,pages,packages,destinations,settings}
mkdir -p app/api/cms/{images,packages,destinations,hero-slides,settings}

# 5. Start development server
npm run dev
```

---

## Next Actions

**Choose your starting point:**

### Option A: Database First (Recommended)
1. Add Prisma models from CMS_IMPLEMENTATION_PLAN.md
2. Run migrations
3. Create seed script to migrate static data
4. Build API routes

### Option B: UI First (Visual Progress)
1. Create CMS layout and navigation
2. Build image gallery (read-only first)
3. Create package list view
4. Add API routes after

### Option C: Hybrid Approach
1. Add Prisma models + migrations (1 day)
2. Build CMS dashboard + navigation (1 day)
3. Implement features one by one
   - Images → Hero → Packages → Destinations → Settings

---

## Key Benefits

**For Content Managers:**
- ✅ No code changes needed for content updates
- ✅ Visual interface for all edits
- ✅ Preview before publishing
- ✅ Image management in one place
- ✅ No deployment required for content changes

**For Developers:**
- ✅ Centralized content management
- ✅ Type-safe with Prisma
- ✅ Versioned content (via database)
- ✅ Easy to extend with new fields
- ✅ Secure with Clerk auth

**For Business:**
- ✅ Faster content updates
- ✅ Reduced developer dependency
- ✅ Better SEO (dynamic meta tags)
- ✅ A/B testing capability
- ✅ Analytics integration ready

---

## Cost Impact

**Additional Resources Needed:**
- ✅ Database: Already have PostgreSQL
- ✅ Storage: Already have R2
- ✅ Auth: Already have Clerk

**New Dependencies:**
- Tiptap (rich text): Free
- dnd-kit (drag/drop): Free
- Total added cost: **$0**

---

## Questions?

All the details are in:
1. **CMS_CONTENT_STRUCTURE.md** - What can be edited
2. **CMS_IMPLEMENTATION_PLAN.md** - How to build it
3. **This summary** - Quick reference

Let me know which part you'd like to implement first!
