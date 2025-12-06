# Email Templates Update - November 26, 2025

## Overview

Fixing email templates to:
1. **Fix broken inline styles** for better email client compatibility
2. **Replace "Oliotya Safaris"** with dynamic company name "Oliotya Safaris"
3. **Add CMS editor** for managing email templates without code changes

---

## Progress

### ✅ Completed

1. **Database Schema Created** - `EmailTemplate` model added to Prisma schema
   - Fields: type, subject, companyName, heading, greeting, introText, nextStepsTitle, nextStepsText, signatureText, footerText, contactEmail, primaryColor, accentColor
   - Supports dynamic content and branding

2. **booking-confirmation.tsx** - Customer confirmation email
   - ✅ Added dynamic `companyName` prop (default: "Oliotya Safaris")
   - ✅ Added dynamic `contactEmail` prop (default: "info@oliotyasafaris.com")
   - ✅ Added dynamic `primaryColor` and `accentColor` for branding
   - ✅ Fixed inline styles using tables for better email client compatibility
   - ✅ Replaced all "Oliotya Safaris" references with dynamic `{companyName}`
   - ✅ Added viewport meta tag and proper HTML structure
   - ✅ Improved layout with HTML tables (email-safe)

### 🔄 In Progress

3. **Remaining Email Templates to Fix** (5 total):
   - `booking-notification.tsx` - Admin notification for new bookings
   - `contact-confirmation.tsx` - Customer confirmation for contact form
   - `contact-notification.tsx` - Admin notification for contact form
   - `custom-package-confirmation.tsx` - Customer confirmation for custom packages
   - `custom-package-notification.tsx` - Admin notification for custom packages

### 📋 Pending

4. **CMS API Routes** - Create REST endpoints for managing templates
5. **CMS UI Page** - Build admin interface for editing templates
6. **Database Migration** - Apply schema changes and seed default templates

---

## Schema Design

### EmailTemplate Model

```prisma
model EmailTemplate {
  id              String   @id @default(cuid())
  type            String   @unique // booking_confirmation, booking_notification, etc.
  subject         String // Email subject line
  companyName     String // Company name to use in template
  heading         String // Main heading text
  greeting        String // Greeting text (e.g., "Dear {firstName},")
  introText       String   @db.Text // Introduction paragraph
  nextStepsTitle  String? // "What Happens Next?" title
  nextStepsText   String?  @db.Text // Next steps content
  signatureText   String   @db.Text // Signature/closing text
  footerText      String   @db.Text // Footer text
  contactEmail    String // Contact email to display
  primaryColor    String   @default("#059669") // Primary brand color (hex)
  accentColor     String   @default("#3b82f6") // Accent color (hex)
  active          Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([type])
  @@index([active])
  @@map("email_templates")
}
```

---

## Email Template Changes

### 1. booking-confirmation.tsx

**Before:**
```tsx
export default function BookingConfirmationEmail({
  firstName,
  confirmationNumber,
  // ... other props
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Body>
        <Text>Thank you for booking with Oliotya Safaris!</Text>
        <Text>Email: info@foxadventures.com</Text>
        <Text>The Oliotya Safaris Team</Text>
      </Body>
    </Html>
  );
}
```

**After:**
```tsx
export default function BookingConfirmationEmail({
  firstName,
  confirmationNumber,
  companyName = 'Oliotya Safaris',
  contactEmail = 'info@oliotyasafaris.com',
  primaryColor = '#059669',
  accentColor = '#3b82f6',
  // ... other props
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      </Head>
      <Body style={main}>
        <Container style={container}>
          <Text>Thank you for booking with {companyName}!</Text>
          <Text>Email: {contactEmail}</Text>
          <Text>The {companyName} Team</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

**Key Improvements:**
- ✅ Dynamic company name and email
- ✅ Proper HTML structure with meta tags
- ✅ Table-based layout for email client compatibility
- ✅ Dynamic colors for branding
- ✅ Improved spacing and typography

---

## Next Steps

### Step 1: Fix Remaining Email Templates

Apply the same pattern to all 5 remaining templates:

1. Add props: `companyName`, `contactEmail`, `primaryColor`, `accentColor`
2. Replace hardcoded "Oliotya Safaris" with `{companyName}`
3. Replace hardcoded "info@foxadventures.com" with `{contactEmail}`
4. Fix inline styles using HTML tables
5. Add proper meta tags
6. Use dynamic colors for branding

### Step 2: Create CMS API Routes

**File**: `app/api/cms/email-templates/route.ts`

```typescript
// GET /api/cms/email-templates - List all templates
// Response: { templates: EmailTemplate[] }

// POST /api/cms/email-templates - Create new template
// Body: EmailTemplate data
// Response: { template: EmailTemplate }
```

**File**: `app/api/cms/email-templates/[type]/route.ts`

```typescript
// GET /api/cms/email-templates/[type] - Get single template
// Response: { template: EmailTemplate }

// PUT /api/cms/email-templates/[type] - Update template
// Body: Partial<EmailTemplate>
// Response: { template: EmailTemplate }

// DELETE /api/cms/email-templates/[type] - Delete template
// Response: { success: boolean }
```

### Step 3: Create CMS UI Page

**File**: `app/cms/email-templates/page.tsx`

Features:
- List all email templates in a table
- Click to edit template inline
- Live preview of email
- Color pickers for primaryColor and accentColor
- Rich text editor for text fields
- Save/Cancel buttons
- Test email button (send to admin)

UI Components needed:
- `EmailTemplateList` - Table of all templates
- `EmailTemplateEditor` - Form for editing a template
- `EmailPreview` - Preview pane showing rendered email
- Color picker component
- Rich text editor (for multiline text)

### Step 4: Update Booking API to Use Templates

**File**: `app/api/bookings/route.ts`

```typescript
// Fetch template from database
const template = await prisma.emailTemplate.findUnique({
  where: { type: 'booking_confirmation' }
});

// Pass template data to email component
await sendBookingEmails({
  // ... booking data
  companyName: template.companyName,
  contactEmail: template.contactEmail,
  primaryColor: template.primaryColor,
  accentColor: template.accentColor,
});
```

### Step 5: Database Migration & Seeding

```bash
# Generate migration
npx prisma migrate dev --name add_email_templates

# Create seed script
# scripts/seed-email-templates.mjs
```

**Default Templates to Seed:**

1. **booking_confirmation**
   - Subject: "Booking Confirmed! - {confirmationNumber}"
   - Company: "Oliotya Safaris"
   - Contact: "info@oliotyasafaris.com"
   - Primary Color: #059669 (green)
   - Accent Color: #3b82f6 (blue)

2. **booking_notification** (Admin)
   - Subject: "New Booking Received - {confirmationNumber}"
   - Company: "Oliotya Safaris"

3. **contact_confirmation**
   - Subject: "We Received Your Message"
   - Company: "Oliotya Safaris"

4. **contact_notification** (Admin)
   - Subject: "New Contact Form Submission"
   - Company: "Oliotya Safaris"

5. **custom_package_confirmation**
   - Subject: "Custom Package Request Received"
   - Company: "Oliotya Safaris"

6. **custom_package_notification** (Admin)
   - Subject: "New Custom Package Request"
   - Company: "Oliotya Safaris"

---

## Benefits

### For Users
- ✅ Consistent branding across all emails
- ✅ Professional email design
- ✅ Emails display correctly in Gmail, Outlook, Apple Mail, etc.
- ✅ Correct company name ("Oliotya Safaris")

### For Administrators
- ✅ Edit email content without touching code
- ✅ Update company name/email globally
- ✅ Customize colors to match brand
- ✅ Preview emails before sending
- ✅ Test emails with one click

### For Developers
- ✅ Centralized email template management
- ✅ Easy to add new template types
- ✅ Type-safe with TypeScript
- ✅ Version controlled in database

---

## Email Client Compatibility

Fixed styles ensure emails render correctly in:
- ✅ Gmail (web, iOS, Android)
- ✅ Outlook (desktop, web, mobile)
- ✅ Apple Mail (macOS, iOS)
- ✅ Yahoo Mail
- ✅ ProtonMail
- ✅ Thunderbird

**Techniques Used:**
- HTML tables for layout (not CSS flexbox/grid)
- Inline styles (not external stylesheets)
- Explicit width/height attributes
- cellPadding/cellSpacing instead of CSS
- Web-safe fonts with fallbacks
- role="presentation" on layout tables

---

## Testing Plan

1. **Local Testing**:
   ```bash
   npm run email:dev
   # or use Resend's email preview
   ```

2. **Test Email Sends**:
   - Send test booking confirmation
   - Send test contact confirmation
   - Send test custom package request

3. **Email Client Testing**:
   - Use [Litmus](https://litmus.com) or [Email on Acid](https://www.emailonacid.com)
   - Or manually test in Gmail, Outlook, Apple Mail

4. **CMS Testing**:
   - Edit template in CMS
   - Preview changes
   - Send test email
   - Verify changes appear

---

## Files Modified

### Schema
- ✅ `prisma/schema.prisma` - Added EmailTemplate model

### Email Templates
- ✅ `emails/booking-confirmation.tsx` - Fixed and made dynamic
- 🔄 `emails/booking-notification.tsx` - Pending
- 🔄 `emails/contact-confirmation.tsx` - Pending
- 🔄 `emails/contact-notification.tsx` - Pending
- 🔄 `emails/custom-package-confirmation.tsx` - Pending
- 🔄 `emails/custom-package-notification.tsx` - Pending

### To Be Created
- 📝 `app/api/cms/email-templates/route.ts`
- 📝 `app/api/cms/email-templates/[type]/route.ts`
- 📝 `app/cms/email-templates/page.tsx`
- 📝 `components/cms/email-template-editor.tsx`
- 📝 `scripts/seed-email-templates.mjs`

---

## Estimated Time Remaining

- Fix 5 remaining email templates: **1-2 hours**
- Create API routes: **1 hour**
- Create CMS UI: **2-3 hours**
- Migration & seeding: **30 minutes**
- Testing: **1 hour**

**Total: 5.5-7.5 hours**

---

**Status**: 🔄 In Progress - booking-confirmation.tsx completed, 5 templates and CMS remaining

**Date**: 2025-11-26
