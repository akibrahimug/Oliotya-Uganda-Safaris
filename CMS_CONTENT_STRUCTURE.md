# Nambi Uganda Safaris CMS - Content Structure

## Overview

This document outlines all editable content in the Nambi Uganda Safaris application, organized for CMS management.

## Content Categories

### 1. SITE-WIDE CONTENT (Global Settings)

#### Company Information
- **Company Name**: "Nambi Uganda Safaris Africa"
- **Brand Tagline**: "Experience the Pearl of Africa..."
- **Logo**: `/fox_logo.jpg`

#### Contact Information
- **Email**: `info@foxadventures.com`
- **Phone**: `+256 700 000 000`
- **Location**: "Kampala, Uganda"
- **Business Hours**:
  - Mon-Fri: 8AM - 6PM EAT
  - Saturday: 9AM - 2PM EAT
  - Sunday: Closed

#### Social Media Links
- Facebook URL
- Instagram URL
- Twitter URL

#### Navigation Links
- Home (/)
- About (/about)
- Safari Packages (/packages)
- Destinations (/destinations)
- Contact (/contact)

---

### 2. HOME PAGE CONTENT

#### Hero Carousel (5 Slides)
Each slide has:
- **Image** (WebP format recommended)
- **Title** (e.g., "Discover the Magic of")
- **Subtitle** (e.g., "Uganda")
- **Description** (1-2 sentences)

Current slides:
1. Mountain Gorillas - Bwindi Forest
2. Wildlife Safari Adventures - Queen Elizabeth Park
3. Murchison Falls Natural Wonder
4. Lake Victoria Waters
5. Rwenzori Mountains Peaks

#### Search Form Section
- CTA text and functionality (keep as-is for now)

---

### 3. ABOUT PAGE CONTENT

#### Hero Section
- **Background Image**
- **Title**: "Your trusted partner in About Nambi Uganda Safaris"
- **Description**

#### Our Story Section
- **Section Label**: "OUR STORY"
- **Heading**: "Crafting Unforgettable African Adventures"
- **Paragraph 1** (Company background)
- **Paragraph 2** (Services offered)
- **Story Image**
- **CTA Button Text**: "Explore Our Tours"

#### Community Impact Section (Akaana Foundation)
- **Section Label**: "COMMUNITY IMPACT"
- **Heading**: "Giving Back Through Akaana Foundation"
- **Description Paragraphs** (2)
- **External Link**: Akaana Foundation URL
- **Impact Box 1**: Title + Description
- **Impact Box 2**: Title + Description
- **Impact Box 3**: Title + Description

#### Statistics Section (4 Stats)
- Stat 1: Years of Experience
- Stat 2: Number of Destinations
- Stat 3: Happy Travelers Count
- Stat 4: Satisfaction Rate

#### Team Section
**Team Member 1**:
- Name
- Role/Title
- Photo
- Biography
- Years of Experience
- Specialties (list)

**Team Member 2**:
- Same structure

**Team Member 3**:
- Same structure

#### Values Section (4 Values)
Each value has:
- Icon (keep as-is)
- Title
- Description

#### CTA Section
- Badge Text
- Heading
- Description
- Button 1 Text
- Button 2 Text
- Scrolling Tagline

---

### 4. CONTACT PAGE CONTENT

#### Hero Section
- Background Image
- Title
- Description

#### Contact Information Box
- Email (with link)
- Phone (with link)
- Office Address
- Business Hours (detailed)
- Quick Response Text

#### FAQ Section (6 Questions)
Each FAQ has:
- Question
- Answer (with potential external links)

Current topics:
1. Uganda Visa Requirements
2. Required Vaccinations
3. Best Time to Visit
4. Gorilla Trekking Costs
5. Cancellation Policy
6. Payment Methods

#### Helpful Resources (3 Cards)
Each card has:
- Title
- Description
- Link/Button Text
- URL (internal or external)

#### Before You Reach Out (4 Tips)
Each tip has:
- Number
- Title
- Description

#### Contact Form
- Form Title
- Form Description
- Field Labels (Name, Email, Subject, Message)
- Submit Button Text
- Success Message
- Helper Text

---

### 5. DESTINATIONS PAGE CONTENT

#### Hero Section
- Background Image
- Title
- Subtitle
- Description

#### CTA Section
- Heading
- Description
- Button Text

#### Destination Cards (Dynamic from DB)
Managed in "Destinations" CMS section

---

### 6. PACKAGES PAGE CONTENT

#### Hero Section
- Background Image
- Title
- Subtitle
- Description

#### Filter Section
- "All Packages" button text
- Category filter labels (dynamic from packages)

#### Package Cards (Dynamic from DB)
Managed in "Packages" CMS section

---

### 7. FOOTER CONTENT

#### Newsletter Section
- Title: "Subscribe to Our Newsletter"
- Description
- Email Placeholder Text
- Submit Button Text
- Success Message

#### Quick Links
- Link 1: About Us
- Link 2: Destinations
- Link 3: Tours & Packages
- Link 4: Contact Us

#### Resources Links
- Travel Guide
- FAQs
- Privacy Policy
- Terms & Conditions

#### Get In Touch
- Location
- Phone (with link)
- Email (with link)

#### Copyright
- Copyright Text
- Year (dynamic)

---

## Dynamic Content Collections

### DESTINATIONS COLLECTION

Each destination entry has:

#### Basic Information
- **Name** (e.g., "Bwindi Impenetrable Forest")
- **ID** (unique identifier)
- **Slug** (URL-friendly)
- **Category** (National Park, City, Adventure, Cultural, etc.)
- **Region** (e.g., "Western Uganda", "Central Uganda")
- **Country** (default: Uganda)

#### Media
- **Hero Image** (main destination image)
- **Gallery Images** (array of 4-6 images)

#### Content
- **Short Description** (for cards, ~100 characters)
- **Full Description** (detailed, ~500 words)
- **History & Background** (2-3 paragraphs)
- **Geography Description**
- **Climate Information**
- **Wildlife Description**
- **Key Wildlife List** (array of species)
- **Flora List** (array of plants/trees)
- **Cultural Experiences List** (array of activities)
- **Best Time to Visit** (seasonal information)

#### Metadata
- **Status** (active/inactive)
- **Featured** (boolean)
- **Display Order** (for sorting)

---

### PACKAGES COLLECTION

Each package entry has:

#### Basic Information
- **Name** (e.g., "14-Days North, West & South Uganda")
- **ID** (unique identifier)
- **Slug** (URL-friendly)
- **Category** (Grand Tour, Gorilla Trekking, Wildlife Safari, etc.)
- **Duration** (e.g., "14 Days")
- **Price** (per person, USD)
- **Difficulty Level** (EASY, MODERATE, CHALLENGING)

#### Media
- **Hero Image**
- **Gallery Images** (4-6 images)

#### Content
- **Short Description** (for cards)
- **Full Description** (detailed overview)
- **Highlights** (array of bullet points, 5-10 items)

#### Itinerary (Array of Days)
Each day has:
- Day Number
- Day Title
- Day Description (detailed, ~200 words)

#### Inclusions/Exclusions
- **Included Items** (array, e.g., "Accommodation", "Meals")
- **Excluded Items** (array, e.g., "International flights", "Visa fees")

#### Group Details
- **Min Travelers** (minimum group size)
- **Max Travelers** (maximum group size)

#### Metadata
- **Status** (active/inactive)
- **Featured** (boolean)
- **Popular** (boolean)
- **Display Order**

---

### TRIPS COLLECTION (Alternative View)

Similar to Packages but may have additional fields:
- **Rating** (1-5 stars)
- **Group Size** (max capacity)
- **Images Array** (multiple gallery images)

---

## Image Management Requirements

### Image Categories

1. **Hero Images** (Full-width backgrounds)
   - Recommended size: 1920x1080px
   - Format: WebP (with JPG fallback)
   - Aspect ratio: 16:9

2. **Destination Cards** (Medium images)
   - Recommended size: 800x600px
   - Format: WebP
   - Aspect ratio: 4:3

3. **Gallery Images** (Lightbox/carousel)
   - Recommended size: 1200x800px
   - Format: WebP
   - Aspect ratio: 3:2

4. **Team Photos** (Portraits)
   - Recommended size: 400x400px
   - Format: WebP
   - Aspect ratio: 1:1

5. **Logos & Icons** (Brand assets)
   - Multiple sizes
   - Format: PNG with transparency

### Image Operations Needed
- Upload new image
- Replace existing image
- Delete image
- Crop/resize
- Alt text editing
- Image optimization (automatic)
- R2 storage integration

---

## Content Management Priorities

### Phase 1: Essential (Start Here)
1. **Hero Carousel Content** (5 slides - text + images)
2. **Packages Collection** (12+ packages)
3. **Destinations Collection** (10+ destinations)
4. **Contact Information** (sitewide)
5. **Team Members** (3 members)

### Phase 2: Important
6. **About Page Content** (story, values, stats)
7. **FAQ Section** (6 questions)
8. **Footer Links & Content**
9. **Navigation Links**

### Phase 3: Nice to Have
10. **Newsletter Content**
11. **CTA Sections**
12. **Helper Text & Form Labels**

---

## CMS User Interface Structure

### Dashboard Home
- Quick Stats:
  - Total Images
  - Total Packages
  - Total Destinations
  - Recent Updates

### Navigation Sections

#### 1. IMAGES
- **All Images** (gallery view with thumbnails)
  - Filter by: Category, Page, Upload Date
  - Bulk operations: Delete, Download
  - Individual actions: Edit, Replace, Delete, View Details

#### 2. PAGES
Organized by page:
- **Home Page**
  - Hero Carousel (edit 5 slides)
- **About Page**
  - Hero, Story, Community, Stats, Team, Values, CTA
- **Contact Page**
  - Hero, Contact Info, FAQs, Resources
- **Destinations Page**
  - Hero, CTA
- **Packages Page**
  - Hero

#### 3. COLLECTIONS
- **Destinations**
  - List view (table with name, category, status)
  - Add New Destination button
  - Edit/Delete actions

- **Packages**
  - List view (table with name, category, price, status)
  - Add New Package button
  - Edit/Delete actions

#### 4. GLOBAL SETTINGS
- **Company Information**
  - Name, Logo, Tagline
- **Contact Details**
  - Email, Phone, Address, Hours
- **Social Media**
  - Facebook, Instagram, Twitter URLs
- **Navigation**
  - Menu links and labels

#### 5. FOOTER
- Newsletter section
- Quick Links
- Resources
- Copyright text

---

## Edit Modes

### Text Editor
- Rich text editor (bold, italic, lists, links)
- Preview mode
- Character count
- Save draft/Publish

### Image Editor
- Upload new image
- Replace image
- Crop tool
- Alt text field
- File size info
- Preview

### List Editor (for arrays)
- Add item
- Remove item
- Reorder items (drag & drop)
- Edit individual items

### Itinerary Editor (special)
- Add day
- Remove day
- Reorder days
- Edit day details (title, description)

---

## Database Schema (High-Level)

### Tables Needed

1. **site_settings** (sitewide config)
2. **pages** (static page content)
3. **page_sections** (reusable page blocks)
4. **destinations** (destination collection)
5. **packages** (package collection)
6. **trips** (alternative trip view)
7. **images** (centralized image management)
8. **team_members** (team profiles)
9. **faqs** (FAQ entries)
10. **navigation_items** (menu links)

---

## Next Steps

1. ✅ Identify all editable content (COMPLETE)
2. ⏭️ Design database schema with Prisma
3. ⏭️ Create API endpoints for CRUD operations
4. ⏭️ Build CMS dashboard UI
5. ⏭️ Implement image management
6. ⏭️ Add authentication (Clerk-based)
7. ⏭️ Create content editors (text, image, list)
8. ⏭️ Test and deploy

---

## Total Editable Items Count

| Category | Count |
|----------|-------|
| **Text Blocks** | ~120+ |
| **Images** | 30+ unique images |
| **Destinations** | 10+ entries |
| **Packages** | 12+ entries |
| **Team Members** | 3 entries |
| **FAQs** | 6 entries |
| **Navigation Items** | 10+ links |
| **Social Links** | 3 platforms |

**Total Editable Elements: ~180+**

---

## Recommendation

Start with a **simplified MVP CMS** that covers:
1. Image Gallery Management (upload, replace, delete)
2. Hero Carousel Editor (5 slides)
3. Packages CRUD (full management)
4. Destinations CRUD (full management)
5. Global Settings (contact info, company details)

This covers ~80% of content management needs while keeping development focused.
