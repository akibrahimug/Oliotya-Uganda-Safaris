# CMS Admin Setup Guide

## Overview

The CMS is now protected and **only accessible to admin users**. All other pages on your website are public and don't require authentication.

---

## How to Make a User Admin

There are **two ways** to grant admin access:

### Option 1: Via Clerk Dashboard (Recommended)

1. **Go to Clerk Dashboard**
   - Visit: https://dashboard.clerk.com
   - Select your application

2. **Navigate to Users**
   - Click "Users" in the sidebar
   - Find the user you want to make admin

3. **Set Public Metadata**
   - Click on the user
   - Scroll to "Public Metadata"
   - Click "Edit"
   - Add this JSON:
   ```json
   {
     "role": "admin"
   }
   ```
   - Click "Save"

4. **Done!**
   - The user can now access `/cms`

### Option 2: Via Organization Roles

If you're using Clerk Organizations:

1. **Create an Organization** (if you haven't)
   - Go to Clerk Dashboard → Organizations
   - Create a new organization

2. **Add User as Admin**
   - Go to the organization
   - Click "Members"
   - Invite user or add existing user
   - Set role to "Admin"

3. **Done!**
   - Users with org admin role can access CMS

---

## What's Protected

### CMS Routes (Admin Only)
- `/cms` - Dashboard
- `/cms/images` - Image gallery
- `/cms/packages` - Package management
- `/cms/destinations` - Destination management
- `/cms/pages/*` - Page editors
- `/cms/settings` - Global settings
- `/api/cms/*` - All CMS API endpoints

### Public Routes (No Auth Required)
- `/` - Homepage
- `/about` - About page
- `/contact` - Contact page
- `/destinations` - Destinations listing
- `/destination/[id]` - Destination details
- `/packages` - Packages listing
- `/package/[slug]` - Package details
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- All other public pages

---

## Testing Admin Access

### Test as Admin:
1. Make your user an admin (see above)
2. Sign in at `/sign-in`
3. Navigate to `/cms`
4. You should see the CMS dashboard

### Test as Regular User:
1. Create a test user without admin role
2. Sign in with that user
3. Try to access `/cms`
4. You should be redirected to homepage with error

---

## Current Middleware Configuration

The middleware (`middleware.ts`) now:
- ✅ Only runs for `/cms` and `/api/cms` routes
- ✅ Requires authentication for CMS access
- ✅ Checks for admin role or organization admin permissions
- ✅ All other routes are completely public

---

## Admin Role Check Logic

The CMS checks if user is admin by:

```typescript
const isAdmin =
  user.publicMetadata?.role === "admin" ||  // Check publicMetadata
  user.organizationMemberships?.some(       // OR check org membership
    (org) =>
      org.role === "org:admin" ||           // Check if org admin
      org.permissions?.includes("org:sys_memberships:manage")  // Check permissions
  );
```

---

## Quick Admin Setup Command

For the first admin user, use Clerk Dashboard:

1. Sign up for an account on your site
2. Go to Clerk Dashboard → Users
3. Find your user
4. Edit Public Metadata:
   ```json
   {
     "role": "admin"
   }
   ```
5. Save and refresh the page
6. Go to `/cms` - you're in!

---

## Security Notes

- ✅ Middleware protects all CMS routes
- ✅ API endpoints under `/api/cms` also protected
- ✅ Role check happens server-side
- ✅ Non-admin users cannot bypass protection
- ✅ Public website pages don't require any authentication

---

## Troubleshooting

### "Unauthorized" error when accessing CMS
- Check that user has `role: "admin"` in publicMetadata
- Or check that user is org admin
- Sign out and sign back in

### CMS redirects to homepage
- User is not an admin
- Check publicMetadata in Clerk Dashboard

### Can't access public pages
- This shouldn't happen - middleware only protects `/cms`
- If it does, check middleware.ts config

---

## Next Steps

1. **Make yourself admin** using Clerk Dashboard
2. **Test CMS access** at `/cms`
3. **Start using CMS** to manage content!

The CMS is ready to use! 🎉
