# Clerk Authentication Integration with Database

## Overview
This document explains how Clerk user authentication syncs with our PostgreSQL database through webhooks.

## Architecture

### Data Flow
```
User Signs Up → Clerk → Webhook → Our Database → User Record Created
User Updates Profile → Clerk → Webhook → Our Database → User Record Updated
User Deletes Account → Clerk → Webhook → Our Database → User Record Deleted (Cascade)
```

## Why Webhooks?

**Clerk is the source of truth** for authentication, but we need user data in our database for:
1. **Bookings**: Link bookings to user accounts
2. **Favorites**: Store user's favorite destinations
3. **Analytics**: Track user behavior and preferences
4. **Relationships**: Connect users to their data (foreign keys)

## Implementation Strategy

### 1. Clerk Webhook Events We Handle

- `user.created` - New user signs up
- `user.updated` - User updates profile
- `user.deleted` - User deletes account

### 2. Database User Model (Already Created)

```prisma
model User {
  id              String    @id // Clerk user ID (e.g., "user_2abc123")
  email           String    @unique
  firstName       String?
  lastName        String?
  phone           String?
  profileImageUrl String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  favorites       UserFavorite[]
}
```

### 3. Clerk User ID Usage in Bookings

Bookings support both:
- **Guest checkout** (`userId` is null)
- **Authenticated users** (`userId` contains Clerk ID)

```typescript
// Guest booking
const booking = await prisma.booking.create({
  data: {
    userId: null, // Guest
    email: "guest@example.com",
    // ...
  },
});

// Authenticated user booking
const { userId } = await auth(); // Clerk helper
const booking = await prisma.booking.create({
  data: {
    userId: userId, // Clerk user ID
    email: user.email,
    // ...
  },
});
```

## Setup Instructions

### Step 1: Install Clerk Package

Already installed, but verify:
```bash
npm list @clerk/nextjs
```

### Step 2: Get Clerk Credentials

1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to "API Keys"
4. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### Step 3: Set Up Webhook

1. In Clerk Dashboard, go to "Webhooks"
2. Click "Add Endpoint"
3. Enter your webhook URL:
   ```
   https://your-domain.com/api/webhooks/clerk
   ```
4. Select events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the **Signing Secret** (starts with `whsec_`)

### Step 4: Add to Environment Variables

Update `.env.local`:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Clerk URLs (already set)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Step 5: Enable Clerk in Layout

Uncomment the ClerkProvider in `/app/layout.tsx` (lines 50-60)

### Step 6: Enable Auth UI in Header

Uncomment the Clerk components in `/components/header.tsx` (lines 147-176)

## Webhook Implementation

The webhook endpoint is at: `/app/api/webhooks/clerk/route.ts`

### Security Features:
- ✅ Webhook signature verification (Svix)
- ✅ Idempotent operations (safe to retry)
- ✅ Error handling and logging
- ✅ Type-safe with TypeScript

### What It Does:

**user.created**
```typescript
// Extract data from Clerk webhook
const { id, email_addresses, first_name, last_name, image_url } = evt.data;

// Create user in our database
await prisma.user.create({
  data: {
    id: id, // Clerk user ID
    email: email_addresses[0].email_address,
    firstName: first_name,
    lastName: last_name,
    profileImageUrl: image_url,
  },
});
```

**user.updated**
```typescript
// Update existing user
await prisma.user.update({
  where: { id: evt.data.id },
  data: {
    email: evt.data.email_addresses[0].email_address,
    firstName: evt.data.first_name,
    lastName: evt.data.last_name,
    profileImageUrl: evt.data.image_url,
  },
});
```

**user.deleted**
```typescript
// Delete user (cascades to favorites)
await prisma.user.delete({
  where: { id: evt.data.id },
});
```

## Using Clerk in Server Actions

### Get Current User

```typescript
'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function createBooking(data: any) {
  // Option 1: Just get user ID
  const { userId } = await auth();

  // Option 2: Get full user object
  const user = await currentUser();

  if (userId) {
    // User is authenticated
    const booking = await prisma.booking.create({
      data: {
        userId: userId, // Link to Clerk user
        email: user?.emailAddresses[0].emailAddress,
        // ...
      },
    });
  } else {
    // Guest checkout
    const booking = await prisma.booking.create({
      data: {
        userId: null,
        // ...
      },
    });
  }
}
```

### Link Guest Bookings to User

When a guest creates an account or logs in:

```typescript
'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function linkGuestBookingsToUser() {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Not authenticated' };
  }

  // Get user email from Clerk
  const user = await currentUser();
  const email = user?.emailAddresses[0].emailAddress;

  // Link all guest bookings with this email to the user
  await prisma.booking.updateMany({
    where: {
      email: email,
      userId: null, // Guest bookings only
    },
    data: {
      userId: userId, // Link to Clerk user
    },
  });

  return { success: true };
}
```

## Protecting Routes

### Server-Side Protection

```typescript
// /app/profile/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch user's bookings
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: { destination: true },
  });

  return (
    // Render profile with bookings
  );
}
```

### Client-Side Protection

```typescript
'use client';

import { useUser } from '@clerk/nextjs';

export default function FavoritesButton({ destinationId }: { destinationId: number }) {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return (
      <Link href="/sign-in">
        <Button>Sign in to save favorites</Button>
      </Link>
    );
  }

  return (
    <Button onClick={() => addToFavorites(destinationId)}>
      Save to Favorites
    </Button>
  );
}
```

## User Favorites Implementation

```typescript
// /app/actions/favorite-actions.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function toggleFavorite(destinationId: number) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Must be signed in' };
  }

  // Check if already favorited
  const existing = await prisma.userFavorite.findUnique({
    where: {
      userId_destinationId: {
        userId,
        destinationId,
      },
    },
  });

  if (existing) {
    // Remove favorite
    await prisma.userFavorite.delete({
      where: { id: existing.id },
    });
    return { success: true, action: 'removed' };
  } else {
    // Add favorite
    await prisma.userFavorite.create({
      data: {
        userId,
        destinationId,
      },
    });
    return { success: true, action: 'added' };
  }
}

export async function getUserFavorites() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const favorites = await prisma.userFavorite.findMany({
    where: { userId },
    include: {
      destination: true,
    },
  });

  return favorites.map(f => f.destination);
}
```

## Database Queries with User Context

### Get User's Bookings

```typescript
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

// In a Server Component or Server Action
const { userId } = await auth();

const bookings = await prisma.booking.findMany({
  where: { userId },
  include: {
    destination: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
});
```

### Get User's Favorites

```typescript
const favorites = await prisma.userFavorite.findMany({
  where: { userId },
  include: {
    destination: true,
  },
});
```

### Check if User Favorited a Destination

```typescript
const isFavorited = await prisma.userFavorite.findUnique({
  where: {
    userId_destinationId: {
      userId,
      destinationId,
    },
  },
});

return !!isFavorited;
```

## Testing the Integration

### 1. Test User Creation

```bash
# Sign up a new user through Clerk UI
# Check your database:
npx prisma studio
# Look in the "users" table - you should see the new user
```

### 2. Test Webhook Locally

Use Clerk's webhook testing feature:
1. Go to Webhooks in Clerk Dashboard
2. Click your webhook
3. Click "Send Test Event"
4. Check your logs

### 3. Test with ngrok (for local development)

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3002

# Use the ngrok URL in Clerk webhook settings
https://abc123.ngrok.io/api/webhooks/clerk
```

## Troubleshooting

### Webhook Not Firing

1. Check webhook URL is correct
2. Verify signing secret is in `.env.local`
3. Check Clerk Dashboard > Webhooks > Attempts for errors
4. Look at server logs for errors

### User Not Syncing

1. Check webhook endpoint is accessible (not blocked by firewall)
2. Verify `CLERK_WEBHOOK_SECRET` is correct
3. Check Prisma connection (can it write to database?)
4. Look for errors in webhook logs

### Database Errors

```typescript
// Handle unique constraint violations
try {
  await prisma.user.create({ data: userData });
} catch (error) {
  if (error.code === 'P2002') {
    // User already exists, use upsert instead
    await prisma.user.upsert({
      where: { id: userData.id },
      update: userData,
      create: userData,
    });
  }
}
```

## Migration Guide

### Current State → With Clerk

**Before (Guest-only):**
```typescript
const booking = await prisma.booking.create({
  data: {
    userId: null,
    email: formData.email,
    // ...
  },
});
```

**After (Supports both):**
```typescript
const { userId } = await auth();

const booking = await prisma.booking.create({
  data: {
    userId: userId || null, // Authenticated or guest
    email: formData.email,
    // ...
  },
});
```

## Security Considerations

1. **Always verify webhook signatures** - Prevents fake webhook calls
2. **Use auth() on server** - Never trust client-side auth state
3. **Validate user permissions** - Check user owns the resource
4. **Handle deleted users gracefully** - Cascade deletes configured in schema

## Summary

### Clerk stores:
- Authentication credentials
- Email verification
- Session management
- OAuth tokens

### Our database stores:
- User profile copy (for queries)
- Bookings
- Favorites
- Analytics data

### Sync happens via:
- Clerk webhooks (automatic)
- Real-time when needed
- Idempotent operations (safe)

**Next Steps:**
1. Set up Clerk account and get API keys
2. Configure webhook endpoint
3. Enable ClerkProvider in layout
4. Test user creation flow
5. Implement favorites feature
