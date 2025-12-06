# Oliotya Safaris CMS - Implementation Plan

## MVP Scope (Start Small)

### What We'll Build First

**Phase 1 - Core CMS Features (Week 1-2)**
1. Image Gallery Management
2. Hero Carousel Editor
3. Packages CRUD
4. Destinations CRUD
5. Global Settings Editor

This covers the most dynamic content that changes frequently.

---

## CMS Dashboard Structure

```
┌─────────────────────────────────────────────────────────────┐
│  FOX ADVENTURES CMS                    👤 Admin  🔔 📊 ⚙️  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────┐  ┌───────────────────────────────────────┐   │
│  │           │  │                                         │   │
│  │ 📊 Dashboard │  │  DASHBOARD HOME                     │   │
│  │           │  │                                         │   │
│  ├───────────┤  │  Quick Stats:                          │   │
│  │           │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │   │
│  │ 🖼️ Images  │  │  │ 32   │ │ 12   │ │ 10   │ │ 3    │  │   │
│  │           │  │  │Images│ │Packs │ │Dests │ │Users │  │   │
│  ├───────────┤  │  └──────┘ └──────┘ └──────┘ └──────┘  │   │
│  │           │  │                                         │   │
│  │ 📄 Pages   │  │  Recent Updates:                       │   │
│  │  › Home   │  │  • Package "14-Day Grand Tour" edited  │   │
│  │  › About  │  │  • Image "gorilla-1.jpg" uploaded      │   │
│  │  › Contact│  │  • Destination "Bwindi" updated        │   │
│  │           │  │                                         │   │
│  ├───────────┤  └─────────────────────────────────────────┘   │
│  │           │                                               │
│  │ 📦 Content │                                               │
│  │  › Packages│                                               │
│  │  › Dest.  │                                               │
│  │           │                                               │
│  ├───────────┤                                               │
│  │           │                                               │
│  │ ⚙️ Settings│                                               │
│  │           │                                               │
│  └───────────┘                                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Screen-by-Screen Breakdown

### 1. IMAGES GALLERY VIEW

```
┌─────────────────────────────────────────────────────────────┐
│  🖼️ IMAGES GALLERY                          🔍 Search Images │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [+ Upload Images]  [📁 Category ▼]  [📅 Date ▼]  [Delete]  │
│                                                               │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │          │          │          │          │          │   │
│  │  [IMG]   │  [IMG]   │  [IMG]   │  [IMG]   │  [IMG]   │   │
│  │          │          │          │          │          │   │
│  │ gorilla  │ murchison│  safari  │  team-1  │  hero-1  │   │
│  │ ☑️ Edit   │ ☑️ Edit   │ ☑️ Edit   │ ☑️ Edit   │ ☑️ Edit   │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
│                                                               │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │  [IMG]   │  [IMG]   │  [IMG]   │  [IMG]   │  [IMG]   │   │
│  │ lake-vic │ rwenzori │ kampala  │  logo    │  about   │   │
│  │ ☑️ Edit   │ ☑️ Edit   │ ☑️ Edit   │ ☑️ Edit   │ ☑️ Edit   │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
│                                                               │
│  Showing 10 of 32 images               [← 1 2 3 4 →]        │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Thumbnail grid view
- Upload multiple images
- Filter by category, date, usage
- Bulk select and delete
- Search by filename or alt text
- Click to edit/replace

**Click on Image → Edit Modal:**

```
┌─────────────────────────────────────────┐
│  EDIT IMAGE                        ✕    │
├─────────────────────────────────────────┤
│                                          │
│  ┌────────────────┐                     │
│  │                │                     │
│  │   [Preview]    │                     │
│  │   gorilla.jpg  │                     │
│  │                │                     │
│  └────────────────┘                     │
│                                          │
│  Filename: gorilla-trekking.jpg         │
│  Size: 456 KB                           │
│  Dimensions: 1920x1080                  │
│  Uploaded: Jan 5, 2025                  │
│                                          │
│  Alt Text:                              │
│  [Mountain gorillas in Bwindi Forest]   │
│                                          │
│  Category: [Destinations ▼]             │
│                                          │
│  Used in:                               │
│  • Home Hero Carousel (Slide 1)         │
│  • Destinations Page (Card)             │
│                                          │
│  [Replace Image]  [Delete]  [Save]      │
│                                          │
└─────────────────────────────────────────┘
```

---

### 2. HOME PAGE - HERO CAROUSEL EDITOR

```
┌─────────────────────────────────────────────────────────────┐
│  📄 HOME PAGE > HERO CAROUSEL                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [+ Add Slide]  [Preview]  [Save All Changes]               │
│                                                               │
│  ═══════════════════════════════════════════════════════════ │
│  SLIDE 1                                    [↑] [↓] [Delete] │
│  ─────────────────────────────────────────────────────────── │
│                                                               │
│  Background Image:                                           │
│  ┌──────────┐                                                │
│  │ [PREVIEW]│  [Change Image]  [Remove]                      │
│  └──────────┘                                                │
│  uganda-mountain-gorillas-bwindi-forest.jpg                  │
│                                                               │
│  Title (appears above subtitle):                             │
│  [Discover the Magic of________________________]             │
│                                                               │
│  Subtitle (main heading):                                    │
│  [Uganda___________________________________]                 │
│                                                               │
│  Description:                                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │Home to the endangered mountain gorillas, Uganda offers │ │
│  │unforgettable wildlife encounters in pristine rainforest│ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  [⚙️ Advanced: Animation, Display Duration]                  │
│                                                               │
│  ═══════════════════════════════════════════════════════════ │
│  SLIDE 2                                    [↑] [↓] [Delete] │
│  ─────────────────────────────────────────────────────────── │
│  ...                                                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Drag to reorder slides
- Expand/collapse each slide
- Live preview
- Image replacement inline
- Character count for descriptions
- Save all or save individual

---

### 3. PACKAGES MANAGEMENT

**List View:**

```
┌─────────────────────────────────────────────────────────────┐
│  📦 PACKAGES                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [+ Add New Package]  [🔍 Search]  [Filter: All ▼]          │
│                                                               │
│  ┌──┬────────────────────┬──────────┬────────┬──────┬─────┐ │
│  │☑│ Package Name       │ Category │ Price  │Status│ Act │ │
│  ├──┼────────────────────┼──────────┼────────┼──────┼─────┤ │
│  │ │14-Day Grand Tour   │Grand Tour│$5,074  │ 🟢   │ ⚙️✏️│ │
│  │ │Gorilla Trekking 3D │ Gorilla  │$1,200  │ 🟢   │ ⚙️✏️│ │
│  │ │Murchison Safari 5D │ Wildlife │$2,150  │ 🟢   │ ⚙️✏️│ │
│  │ │Lake Victoria Tour  │ Cultural │$  850  │ 🔴   │ ⚙️✏️│ │
│  │ │Rwenzori Trek 7D    │Adventure │$1,800  │ 🟢   │ ⚙️✏️│ │
│  └──┴────────────────────┴──────────┴────────┴──────┴─────┘ │
│                                                               │
│  Showing 5 of 12 packages                 [← 1 2 →]         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Edit Package (Full Editor):**

```
┌─────────────────────────────────────────────────────────────┐
│  ✏️ EDIT PACKAGE: 14-Day Grand Tour                  [Save] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─ Basic Information ────────────────────────────────────┐ │
│  │                                                          │ │
│  │ Package Name:                                           │ │
│  │ [14-Days North, West & South Uganda____________]        │ │
│  │                                                          │ │
│  │ Slug (URL): /package/14-days-uganda                     │ │
│  │                                                          │ │
│  │ Category: [Grand Tour ▼]                                │ │
│  │                                                          │ │
│  │ Duration: [14 Days_____]  Price: [$5,074__] per person │ │
│  │                                                          │ │
│  │ Group Size:  Min [2] travelers  Max [8] travelers       │ │
│  │                                                          │ │
│  │ Difficulty: ◯ Easy  ⦿ Moderate  ◯ Challenging          │ │
│  │                                                          │ │
│  │ Status: ☑️ Active  ☑️ Featured  ☑️ Popular              │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────── │
│                                                               │
│  ┌─ Media ────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │ Hero Image:                                             │ │
│  │ ┌───────┐                                               │ │
│  │ │[IMAGE]│ [Change] [Remove]                             │ │
│  │ └───────┘                                               │ │
│  │                                                          │ │
│  │ Gallery Images: (drag to reorder)                       │ │
│  │ ┌───┐ ┌───┐ ┌───┐ ┌───┐ [+ Add]                        │ │
│  │ │[1]│ │[2]│ │[3]│ │[4]│                                │ │
│  │ └───┘ └───┘ └───┘ └───┘                                │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────── │
│                                                               │
│  ┌─ Description ──────────────────────────────────────────┐ │
│  │                                                          │ │
│  │ Short Description (for cards, ~100 chars):              │ │
│  │ ┌──────────────────────────────────────────────────┐   │ │
│  │ │Experience Uganda's best destinations in two weeks│   │ │
│  │ └──────────────────────────────────────────────────┘   │ │
│  │                                      56/100 characters  │ │
│  │                                                          │ │
│  │ Full Description (detailed):                            │ │
│  │ ┌──────────────────────────────────────────────────┐   │ │
│  │ │ [Rich Text Editor]                                │   │ │
│  │ │ B I U 📎 🔗 • 1. ≡                                │   │ │
│  │ │ ────────────────────────────────────────────────  │   │ │
│  │ │ This comprehensive 14-day journey takes you...    │   │ │
│  │ │                                                    │   │ │
│  │ └──────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────── │
│                                                               │
│  ┌─ Highlights ───────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  [+ Add Highlight]                                      │ │
│  │                                                          │ │
│  │  1. [✓] Mountain gorilla trekking in Bwindi Forest  [✕]│ │
│  │  2. [✓] Safari drives in Queen Elizabeth Park       [✕]│ │
│  │  3. [✓] Boat cruise on the Kazinga Channel          [✕]│ │
│  │  4. [✓] Murchison Falls game drives and boat tour   [✕]│ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────── │
│                                                               │
│  ┌─ Itinerary ────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  [+ Add Day]                                            │ │
│  │                                                          │ │
│  │  ═══ DAY 1 ═════════════════════════      [↑][↓][✕]    │ │
│  │  Title: [Arrival in Kampala______________]              │ │
│  │  Description:                                           │ │
│  │  ┌────────────────────────────────────────────────┐    │ │
│  │  │Meet and greet at Entebbe International Airport │    │ │
│  │  │Transfer to hotel in Kampala. Evening briefing. │    │ │
│  │  └────────────────────────────────────────────────┘    │ │
│  │                                                          │ │
│  │  ═══ DAY 2 ═════════════════════════      [↑][↓][✕]    │ │
│  │  Title: [Transfer to Murchison Falls_____]              │ │
│  │  ...                                                     │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────── │
│                                                               │
│  ┌─ Inclusions ───────────────────────────────────────────┐ │
│  │                                                          │ │
│  │ What's Included:              What's NOT Included:      │ │
│  │ [+ Add]                       [+ Add]                   │ │
│  │                                                          │ │
│  │ • Accommodation        [✕]    • International flights[✕]│ │
│  │ • All meals            [✕]    • Visa fees            [✕]│ │
│  │ • Transport            [✕]    • Travel insurance     [✕]│ │
│  │ • Park entrance fees   [✕]    • Personal expenses    [✕]│ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────── │
│                                                               │
│  [Cancel]                                  [Save Draft][Publish]│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. DESTINATIONS MANAGEMENT

Similar structure to Packages but with destination-specific fields:
- Region selector
- Wildlife/Flora lists
- Cultural experiences
- Best time to visit

---

### 5. GLOBAL SETTINGS

```
┌─────────────────────────────────────────────────────────────┐
│  ⚙️ GLOBAL SETTINGS                                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─ Company Information ─────────────────────────────────┐  │
│  │                                                         │  │
│  │ Company Name:                                          │  │
│  │ [Oliotya Safaris Africa_____________________]           │  │
│  │                                                         │  │
│  │ Tagline:                                               │  │
│  │ [Experience the Pearl of Africa_____________]          │  │
│  │                                                         │  │
│  │ Logo:                                                  │  │
│  │ ┌───────┐                                              │  │
│  │ │[LOGO] │ [Change Logo]                                │  │
│  │ └───────┘                                              │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────  │
│                                                               │
│  ┌─ Contact Information ─────────────────────────────────┐  │
│  │                                                         │  │
│  │ Email:          [info@foxadventures.com________]       │  │
│  │ Phone:          [+256 700 000 000______________]       │  │
│  │ Location:       [Kampala, Uganda_______________]       │  │
│  │                                                         │  │
│  │ Business Hours:                                        │  │
│  │ Mon-Fri: [8:00 AM] to [6:00 PM] EAT                   │  │
│  │ Saturday: [9:00 AM] to [2:00 PM] EAT                  │  │
│  │ Sunday:  [Closed_____________]                         │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────  │
│                                                               │
│  ┌─ Social Media ────────────────────────────────────────┐  │
│  │                                                         │  │
│  │ Facebook:   [https://facebook.com/foxadventures]       │  │
│  │ Instagram:  [https://instagram.com/foxadventures]      │  │
│  │ Twitter:    [https://twitter.com/foxadventures]        │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────  │
│                                                               │
│  [Reset to Defaults]                        [Save Settings]  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Database Schema (Prisma)

```prisma
// CMS-specific models

model Image {
  id          String   @id @default(cuid())
  filename    String
  url         String   // R2 URL
  altText     String?
  category    String?
  width       Int
  height      Int
  fileSize    Int
  format      String   // webp, jpg, png
  usedIn      Json?    // Track where image is used
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
  shortDesc    String?
  heroImage    String
  gallery      Json     // Array of image URLs
  highlights   Json     // Array of strings
  itinerary    Json     // Array of day objects
  included     Json     // Array of strings
  excluded     Json     // Array of strings
  minTravelers Int
  maxTravelers Int
  difficulty   String   // EASY, MODERATE, CHALLENGING
  featured     Boolean  @default(false)
  popular      Boolean  @default(false)
  active       Boolean  @default(true)
  displayOrder Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Destination {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  category      String
  region        String
  country       String   @default("Uganda")
  description   String   @db.Text
  shortDesc     String?
  heroImage     String
  gallery       Json
  history       String?  @db.Text
  geography     String?  @db.Text
  climate       String?  @db.Text
  wildlife      String?  @db.Text
  keyWildlife   Json?    // Array of species
  flora         Json?    // Array of plants
  cultural      Json?    // Array of experiences
  bestTime      String?  @db.Text
  featured      Boolean  @default(false)
  active        Boolean  @default(true)
  displayOrder  Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model HeroSlide {
  id          String   @id @default(cuid())
  title       String
  subtitle    String
  description String
  image       String
  displayOrder Int
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SiteSettings {
  id              String   @id @default(cuid())
  key             String   @unique
  value           Json
  updatedAt       DateTime @updatedAt
}

model TeamMember {
  id          String   @id @default(cuid())
  name        String
  role        String
  bio         String   @db.Text
  image       String
  years       String
  specialties Json     // Array of strings
  displayOrder Int
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model FAQ {
  id          String   @id @default(cuid())
  question    String
  answer      String   @db.Text
  category    String?
  displayOrder Int
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### API Routes Structure

```
/api/cms/
  ├── images/
  │   ├── GET     /                 # List all images
  │   ├── POST    /                 # Upload new image
  │   ├── GET     /[id]             # Get image details
  │   ├── PUT     /[id]             # Update image metadata
  │   ├── DELETE  /[id]             # Delete image
  │   └── POST    /[id]/replace     # Replace image file
  │
  ├── packages/
  │   ├── GET     /                 # List all packages
  │   ├── POST    /                 # Create new package
  │   ├── GET     /[id]             # Get package details
  │   ├── PUT     /[id]             # Update package
  │   ├── DELETE  /[id]             # Delete package
  │   └── PATCH   /[id]/status      # Toggle active status
  │
  ├── destinations/
  │   ├── GET     /                 # List all destinations
  │   ├── POST    /                 # Create new destination
  │   ├── GET     /[id]             # Get destination details
  │   ├── PUT     /[id]             # Update destination
  │   └── DELETE  /[id]             # Delete destination
  │
  ├── hero-slides/
  │   ├── GET     /                 # List all slides
  │   ├── POST    /                 # Create new slide
  │   ├── PUT     /[id]             # Update slide
  │   ├── DELETE  /[id]             # Delete slide
  │   └── PATCH   /reorder          # Reorder slides
  │
  ├── settings/
  │   ├── GET     /                 # Get all settings
  │   ├── PUT     /[key]            # Update specific setting
  │   └── POST    /                 # Batch update settings
  │
  └── team/
      ├── GET     /                 # List team members
      ├── POST    /                 # Add team member
      ├── PUT     /[id]             # Update team member
      └── DELETE  /[id]             # Remove team member
```

---

## Authentication & Authorization

### Role-Based Access
- **Admin**: Full access to all CMS features
- **Editor**: Can edit content but not delete or change settings
- **Viewer**: Read-only access

### Using Clerk
```typescript
// Protect CMS routes
import { auth } from "@clerk/nextjs";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Check if user has admin role
  const user = await clerkClient.users.getUser(userId);
  const isAdmin = user.publicMetadata.role === "admin";

  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }

  // Proceed with CMS operation
}
```

---

## Development Phases

### Phase 1: Foundation (Days 1-3)
- ✅ Set up Prisma models
- ✅ Create API routes
- ✅ Add authentication middleware
- ✅ Basic CMS layout

### Phase 2: Image Management (Days 4-5)
- ✅ Image gallery view
- ✅ Upload functionality (R2 integration)
- ✅ Image editor modal
- ✅ Replace/delete operations

### Phase 3: Content Editors (Days 6-8)
- ✅ Hero Carousel editor
- ✅ Package CRUD interface
- ✅ Destination CRUD interface
- ✅ Rich text editor integration

### Phase 4: Settings & Polish (Days 9-10)
- ✅ Global settings editor
- ✅ Team members management
- ✅ FAQ management
- ✅ Preview functionality
- ✅ Responsive design
- ✅ Testing & bug fixes

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (existing)
- **ORM**: Prisma
- **Auth**: Clerk (existing)
- **Storage**: Cloudflare R2 (existing)
- **UI**: Radix UI + TailwindCSS (existing)
- **Forms**: React Hook Form + Zod (existing)
- **Rich Text**: Tiptap or Slate.js
- **Drag & Drop**: dnd-kit

---

## Next Steps

Would you like me to:
1. ✅ Create the Prisma schema for CMS models?
2. ✅ Build the CMS dashboard layout?
3. ✅ Implement the image gallery first?
4. ✅ Start with hero carousel editor?

Let me know which part you'd like to tackle first!
