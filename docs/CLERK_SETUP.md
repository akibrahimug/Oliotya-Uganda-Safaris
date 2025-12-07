# Clerk Authentication Setup Guide

## Overview

Your Oliotya Safaris application now has Clerk authentication integrated! This provides secure sign-in/sign-up with Google, email, and social media options.

## Installation Status

The `@clerk/nextjs` package is being installed. Once complete, you'll need to:

1. **Get Clerk API Keys**
2. **Configure Environment Variables**
3. **Enable Authentication Providers**

---

## Step 1: Create a Clerk Account

1. Go to [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
2. Sign up for a free account (or sign in if you have one)
3. Create a new application
4. Choose "Next.js" as your framework

---

## Step 2: Get Your API Keys

From your Clerk dashboard:

1. Navigate to **API Keys** in the sidebar
2. Copy your keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_...`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_...`)

---

## Step 3: Create .env.local File

Create a `.env.local` file in the root directory (same level as `package.json`):

```bash
# Copy from .env.local.example
cp .env.local.example .env.local
```

Then paste your actual keys:

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE

# Clerk URLs (these are already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

## Step 4: Enable Authentication Providers

In your Clerk Dashboard:

### Enable Google OAuth

1. Go to **User & Authentication** → **Social Connections**
2. Click **Add Provider** → **Google**
3. Follow Clerk's guide to set up Google OAuth:
   - You'll need to create a Google Cloud project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs (Clerk provides these)
4. Toggle Google to **Enabled**

### Enable Email & Password

1. Go to **User & Authentication** → **Email & Password**
2. Toggle **Email address** to **Enabled**
3. Choose authentication strategy:
   - **Password** (traditional)
   - **Email code** (passwordless)
   - **Email link** (magic link)

### Enable Social Media (Optional)

Follow the same process for other providers:

- **Facebook**
- **Twitter/X**
- **GitHub**
- **LinkedIn**
- etc.

---

## Step 5: Verify Installation

Once Clerk is installed and configured:

1. **Restart your dev server:**

   ```bash
   npm run dev
   ```

2. **Test sign-in page:**

   - Navigate to `http://localhost:3000/sign-in`
   - You should see the Clerk sign-in form

3. **Test sign-up page:**
   - Navigate to `http://localhost:3000/sign-up`
   - You should see the Clerk sign-up form

---

## Features Implemented

### ✅ Sign-In Page (`/sign-in`)

- Clean, centered design
- Google OAuth button
- Email/password fields
- "Don't have an account?" link

### ✅ Sign-Up Page (`/sign-up`)

- Welcome message
- Multiple authentication options
- "Already have an account?" link

### ✅ Header Integration

- Shows **UserButton** when signed in (avatar with dropdown)
- Shows **Sign In** and **Sign Up** buttons when signed out
- Adapts to scroll state (transparent/solid)

### ✅ Booking Page Integration

- Prominent reminder to sign up/sign in
- Saves bookings to user account
- Quick access buttons

### ✅ Middleware Protection

- Public routes: Home, About, Destinations, Trips
- Protected routes: Can be added as needed
- Automatic redirect to sign-in for protected pages

---

## Customization

### Change Theme Colors

Edit the sign-in/sign-up pages to match your brand:

```tsx
<SignIn
  appearance={{
    elements: {
      rootBox: "mx-auto",
      card: "shadow-xl",
      formButtonPrimary: "bg-primary hover:bg-primary/90", // Your green
    },
  }}
/>
```

### Customize After Sign-In Redirect

In `.env.local`:

```env
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard  # Redirect to dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding # Redirect to onboarding
```

### Add Protected Routes

In `middleware.ts`:

```typescript
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  // Add more public routes here
]);
```

---

## User Management

### Access User Data

In any server component:

```typescript
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = auth();
  // userId is available
}
```

In client components:

```typescript
import { useUser } from "@clerk/nextjs";

export default function Component() {
  const { user, isLoaded, isSignedIn } = useUser();
  // user data is available
}
```

---

## Troubleshooting

### "Cannot find module '@clerk/nextjs'"

- Wait for npm installation to complete
- Restart your dev server
- Clear `.next` folder: `rm -rf .next`

### Sign-in page not showing

- Verify environment variables are set in `.env.local`
- Check that keys don't have extra spaces
- Restart dev server after adding env vars

### Google OAuth not working

- Verify Google OAuth is enabled in Clerk dashboard
- Check redirect URIs match in Google Cloud Console
- Ensure Google+ API is enabled

### 404 on /sign-in or /sign-up

- Verify file structure: `app/sign-in/[[...sign-in]]/page.tsx`
- Clear `.next` folder and rebuild
- Check middleware.ts is in the root directory

---

## Support

- **Clerk Documentation:** [https://clerk.com/docs](https://clerk.com/docs)
- **Clerk Discord:** [https://clerk.com/discord](https://clerk.com/discord)
- **Next.js Guide:** [https://clerk.com/docs/quickstarts/nextjs](https://clerk.com/docs/quickstarts/nextjs)

---

## Security Notes

✅ **Never commit .env.local** - Already in `.gitignore`
✅ **Use test keys in development** - Production keys for live site
✅ **Enable MFA** - Available in Clerk Pro plan
✅ **Rate limiting** - Built into Clerk
✅ **Session management** - Handled automatically

---

## Next Steps

Once everything is working:

1. **Customize the appearance** to match your brand
2. **Add user profile pages** (`/profile`)
3. **Implement booking history** for logged-in users
4. **Add email notifications** (Clerk has built-in email system)
5. **Enable multi-factor authentication** for added security

Your authentication system is production-ready! 🎉
