# How to Enable Clerk Authentication

Clerk authentication has been set up but is currently **disabled** to prevent errors. Follow these steps to enable it when you're ready.

## Prerequisites

1. ✅ Clerk account created at [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. ✅ API keys obtained from Clerk dashboard
3. ✅ `.env.local` file created with your keys
4. ✅ Clerk package installed: `npm install @clerk/nextjs --force`

---

## Step 1: Enable Clerk Provider

**File:** `app/layout.tsx`

### Current (disabled):
```typescript
import { Analytics } from "@vercel/analytics/next"
// import { ClerkProvider } from "@clerk/nextjs" // Commented out until Clerk is set up
```

### Change to (enabled):
```typescript
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
```

### Current (disabled):
```typescript
return (
  <html lang="en" className={inter.variable}>
    <body className="font-inter antialiased">
      {children}
      <Analytics />
    </body>
  </html>
)
```

### Change to (enabled):
```typescript
return (
  <ClerkProvider>
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  </ClerkProvider>
)
```

---

## Step 2: Enable Header Authentication

**File:** `components/header.tsx`

### Uncomment the import:
```typescript
// Current:
// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// Change to:
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
```

### Replace the temporary user icon with Clerk components:

**Remove this:**
```typescript
{/* Temporary user icon - will be replaced with Clerk auth when set up */}
<Button variant="ghost" size="icon" className={...}>
  <User className="h-5 w-5" />
</Button>
```

**Uncomment this:**
```typescript
<SignedIn>
  <UserButton
    appearance={{
      elements: {
        avatarBox: "w-9 h-9",
      },
    }}
  />
</SignedIn>

<SignedOut>
  <Link href="/sign-in">
    <Button variant="ghost" size="sm" className={scrolled ? "text-foreground" : "text-background"}>
      Sign In
    </Button>
  </Link>
  <Link href="/sign-up">
    <Button size="sm" className="bg-primary text-primary-foreground">
      Sign Up
    </Button>
  </Link>
</SignedOut>
```

---

## Step 3: Enable Booking Page Authentication

**File:** `app/trip/[id]/book/page.tsx`

### Find this section:
```typescript
<div className="flex gap-3 mt-3">
  {/* Temporarily disabled - will work when Clerk is set up */}
  <Button variant="outline" size="sm" disabled>
    Sign In
  </Button>
  <Button variant="outline" size="sm" disabled>
    Sign Up
  </Button>
  {/* Uncomment when Clerk is ready: ... */}
</div>
```

### Replace with:
```typescript
<div className="flex gap-3 mt-3">
  <Link href="/sign-in">
    <Button variant="outline" size="sm">
      Sign In
    </Button>
  </Link>
  <Link href="/sign-up">
    <Button variant="outline" size="sm">
      Sign Up
    </Button>
  </Link>
</div>
```

---

## Step 4: Enable Middleware (Route Protection)

**Rename the file:**
```bash
mv middleware.ts.disabled middleware.ts
```

This will activate route protection and Clerk session management.

---

## Step 5: Restart Development Server

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Verification Checklist

After enabling Clerk, verify:

- [ ] No TypeScript errors in terminal
- [ ] `/sign-in` page loads without errors
- [ ] `/sign-up` page loads without errors
- [ ] Header shows "Sign In" and "Sign Up" buttons when logged out
- [ ] Can successfully sign up with email
- [ ] Can successfully sign in with Google (if configured)
- [ ] Header shows user avatar when logged in
- [ ] Clicking avatar shows dropdown menu
- [ ] Can sign out from dropdown menu

---

## Troubleshooting

### "Cannot find module '@clerk/nextjs'"
- Run: `npm install @clerk/nextjs --force`
- Restart dev server

### Environment variables not loading
- Verify `.env.local` exists in root directory
- Check no extra spaces in API keys
- Restart dev server after creating `.env.local`

### Sign-in page shows error
- Check API keys are correct
- Verify you're using test keys (start with `pk_test_` and `sk_test_`)
- Check Clerk dashboard shows application is active

---

## All Files to Update

When enabling Clerk, modify these files:

1. ✅ `app/layout.tsx` - Uncomment ClerkProvider
2. ✅ `components/header.tsx` - Uncomment Clerk imports and components
3. ✅ `app/trip/[id]/book/page.tsx` - Enable sign-in/sign-up links
4. ✅ `middleware.ts.disabled` → `middleware.ts` - Rename to enable

---

## That's it!

Once you complete these steps, Clerk authentication will be fully enabled and your users can:
- Sign up with email or Google
- Sign in to their accounts
- View their profile
- Save their bookings
- Manage their trips

For full setup instructions, see: **CLERK_SETUP.md**
