# Clerk Authentication Setup Guide

## Overview
Clerk authentication has been **fully integrated** into the Oliotya Safaris application. User data syncs automatically between Clerk and your database via webhooks.

## ✅ What's Already Done

### 1. Code Integration (Complete)
- ✅ Clerk and Svix packages installed
- ✅ ClerkProvider enabled in `/app/layout.tsx`
- ✅ Authentication UI enabled in `/components/header.tsx`
  - Sign In/Sign Up buttons for unauthenticated users
  - UserButton with avatar for authenticated users
  - Mobile menu authentication UI
- ✅ Webhook endpoint created at `/app/api/webhooks/clerk/route.ts`
- ✅ Database schema supports users (see `prisma/schema.prisma`)

### 2. How It Works

```
User Signs Up → Clerk → Webhook → Database → User Record Created
User Updates Profile → Clerk → Webhook → Database → User Updated
User Deletes Account → Clerk → Webhook → Database → User Deleted (cascades to favorites)
```

## 🔧 Configuration Steps

### Step 1: Get Clerk API Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application (or select existing)
3. Go to **API Keys** section
4. Copy the following keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_` or `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)

### Step 2: Update Environment Variables

Open `.env.local` and replace the placeholder values:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
CLERK_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE  # Get this in Step 3
```

**Important**: The keys you mentioned adding should be placed here.

### Step 3: Set Up Clerk Webhook

#### 3.1: Deploy or Use ngrok (for local testing)

**Option A: Production (Vercel/Deployed)**
- Your webhook URL will be: `https://your-domain.com/api/webhooks/clerk`

**Option B: Local Development with ngrok**
```bash
# Install ngrok (if not installed)
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3002

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

#### 3.2: Configure Webhook in Clerk Dashboard

1. In Clerk Dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Enter your webhook URL:
   - Production: `https://your-domain.com/api/webhooks/clerk`
   - Local (ngrok): `https://abc123.ngrok.io/api/webhooks/clerk`

4. Select the following events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`

5. Click **Create**
6. Copy the **Signing Secret** (starts with `whsec_`)
7. Add it to `.env.local`:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
   ```

### Step 4: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

The app will now run on `http://localhost:3002` with Clerk authentication enabled.

## 🎯 Testing the Integration

### Test 1: Sign Up Flow

1. Navigate to `http://localhost:3002`
2. Click **Sign Up** in the header
3. Create a new account
4. Check the terminal - you should see:
   ```
   ✅ User created in database: user_xxxxx
   ```
5. Verify in database:
   ```bash
   npx prisma studio
   ```
   - Open the `User` table
   - You should see your new user

### Test 2: Webhook Verification

1. In Clerk Dashboard, go to **Webhooks** → Your endpoint
2. Click **Testing** tab
3. Send a test `user.created` event
4. Check terminal for success message
5. Check **Attempts** tab in Clerk dashboard - should show 200 OK

### Test 3: Sign In/Out Flow

1. Sign out using the UserButton (click avatar → Sign Out)
2. You should see Sign In/Sign Up buttons again
3. Click **Sign In** and log back in
4. UserButton should appear with your avatar

## 📊 Database User Model

When a user signs up, the following data is synced to your database:

```prisma
model User {
  id              String    @id          // Clerk user ID (e.g., "user_2abc123")
  email           String    @unique
  firstName       String?
  lastName        String?
  phone           String?
  profileImageUrl String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  favorites       UserFavorite[]
  // Future: bookings with userId will link here
}
```

## 🔐 Using Auth in Your App

### Server Components / Server Actions

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

// Get just the user ID
const { userId } = await auth();

// Get full user object from Clerk
const user = await currentUser();

// Example: Create booking with user
if (userId) {
  const booking = await prisma.booking.create({
    data: {
      userId,  // Links to your database User
      // ... other fields
    },
  });
}
```

### Client Components

```typescript
'use client';
import { useUser } from '@clerk/nextjs';

export function MyComponent() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  return <div>Hello {user.firstName}!</div>;
}
```

### Protect Routes

```typescript
// app/profile/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch user's data from database
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    include: { favorites: true },
  });

  return <div>...</div>;
}
```

## 🎨 UI Components Available

### Header (Already Integrated)
- Desktop: Sign In/Sign Up buttons → UserButton when signed in
- Mobile: Authentication section in mobile menu

### Custom Components You Can Add

```typescript
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';

// Show different content based on auth state
<SignedIn>
  <div>Content for signed-in users</div>
</SignedIn>

<SignedOut>
  <SignInButton mode="modal">
    <button>Sign In</button>
  </SignInButton>
</SignedOut>
```

## 🔄 User Sync Details

### When webhook fires:

**user.created**
- New user record created in database
- Uses `upsert` for safety (idempotent)

**user.updated**
- User record updated in database
- If user doesn't exist, creates them (handles edge cases)

**user.deleted**
- User deleted from database
- Cascades to `UserFavorite` table (automatic cleanup)

### Webhook Security
- ✅ Signature verification via Svix
- ✅ Rejects invalid signatures (400 error)
- ✅ Logs all webhook events to console
- ✅ Handles errors gracefully

## 🚨 Troubleshooting

### Issue: "Please add CLERK_WEBHOOK_SECRET to .env.local"

**Solution**: Add the webhook signing secret from Clerk Dashboard to `.env.local`

### Issue: Webhook returns 400 error

**Causes**:
1. Wrong `CLERK_WEBHOOK_SECRET`
2. Webhook URL mismatch
3. Ngrok tunnel expired (restart ngrok)

**Solution**:
1. Verify signing secret in `.env.local`
2. Check webhook URL in Clerk Dashboard
3. Restart ngrok and update webhook URL

### Issue: User not appearing in database

**Check**:
1. Webhook endpoint is reachable (test with Clerk dashboard)
2. Database connection is working (`npx prisma studio`)
3. Check terminal for error messages
4. Look at **Attempts** tab in Clerk webhook dashboard

### Issue: Can't sign in locally

**Solution**: Make sure you've added the keys to `.env.local` and restarted the dev server

## 📝 Next Steps

### 1. Link Guest Bookings to Users (Optional)

When a guest creates an account, link their previous bookings:

```typescript
// app/actions/user-actions.ts
'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function linkGuestBookings() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) return;

  // Find guest bookings with this email
  await prisma.booking.updateMany({
    where: {
      email: user.emailAddresses[0].emailAddress,
      userId: null,
    },
    data: {
      userId,
    },
  });
}
```

### 2. Implement User Favorites

```typescript
// app/actions/favorite-actions.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function toggleFavorite(destinationId: number) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Must be signed in' };
  }

  const existing = await prisma.userFavorite.findUnique({
    where: {
      userId_destinationId: { userId, destinationId },
    },
  });

  if (existing) {
    await prisma.userFavorite.delete({ where: { id: existing.id } });
    return { action: 'removed' };
  } else {
    await prisma.userFavorite.create({ data: { userId, destinationId } });
    return { action: 'added' };
  }
}
```

### 3. Create User Profile Page

```typescript
// app/profile/page.tsx
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export default async function ProfilePage() {
  const { userId } = await auth();

  const userData = await prisma.user.findUnique({
    where: { id: userId! },
    include: {
      favorites: {
        include: { destination: true },
      },
    },
  });

  return (
    <div>
      <h1>Welcome {userData?.firstName}</h1>
      {/* Display favorites, bookings, etc. */}
    </div>
  );
}
```

## 📚 Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Webhooks Guide](https://clerk.com/docs/users/sync-data-to-your-backend)
- [Prisma Documentation](https://www.prisma.io/docs)

## ✅ Checklist

Before deploying to production:

- [ ] Added all Clerk keys to `.env.local`
- [ ] Webhook configured in Clerk Dashboard
- [ ] Tested sign up flow
- [ ] Tested sign in flow
- [ ] Verified user sync to database
- [ ] Tested webhook with Clerk's test feature
- [ ] Added production webhook URL when deployed
- [ ] Switched to production Clerk keys (`pk_live_`, `sk_live_`)

---

## Summary

**Clerk authentication is fully integrated and ready to use!**

Just add your API keys from the Clerk Dashboard to `.env.local`, set up the webhook, and you're ready to go. The integration automatically syncs all user data to your PostgreSQL database, enabling you to build features like user favorites, personalized experiences, and user-specific bookings.

The webhook endpoint at `/app/api/webhooks/clerk/route.ts` handles all the database synchronization automatically - you don't need to modify it.
