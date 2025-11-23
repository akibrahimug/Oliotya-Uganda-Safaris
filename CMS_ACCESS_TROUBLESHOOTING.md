# CMS Access Error - Troubleshooting Guide

## Error: `/?error=cms_error`

You're getting this error when trying to access the CMS in production. This guide will help you diagnose and fix the issue.

## What I Just Fixed

1. **Improved error handling** in `/app/cms/layout.tsx`:
   - Better error messages for debugging
   - More detailed console logs
   - Separate auth check from admin check

2. **Added diagnostic endpoint** `/api/check-admin`:
   - Check if you're authenticated
   - Check if you have admin permissions
   - See your Clerk user data

3. **Fixed missing import** in `/app/api/cms/about-hero/route.ts`:
   - This was causing errors when publishing About Hero content

## Step-by-Step Debugging

### Step 1: Deploy the Latest Code

First, deploy the fixes I just made:

```bash
git add .
git commit -m "Fix CMS auth error handling and add diagnostics"
git push
```

Wait for Vercel to deploy (~2-5 minutes).

### Step 2: Check Your Admin Status

After deployment, visit this URL in production **while logged in**:

```
https://fox-adventures.vercel.app/api/check-admin
```

**Expected Response if You're Admin**:
```json
{
  "authenticated": true,
  "userId": "user_XXXXX",
  "email": "your@email.com",
  "hasUserData": true,
  "adminCheck": {
    "isAdmin": true,
    "isAdminViaMetadata": true,
    "isAdminViaOrg": false
  },
  "metadata": {
    "publicMetadata": {
      "role": "admin"
    },
    "publicMetadataRole": "admin"
  },
  "recommendation": "✅ User has admin access"
}
```

**If You See `"isAdmin": false`**:
Your user account doesn't have admin permissions set. Continue to Step 3.

### Step 3: Set Admin Permissions in Clerk

If you're not showing as admin, you need to set this in your Clerk Dashboard:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your project
3. Go to **Users** in the left sidebar
4. Find your user account and click on it
5. Scroll down to **Public metadata**
6. Click **Edit**
7. Add this JSON:
   ```json
   {
     "role": "admin"
   }
   ```
8. Click **Save**

### Step 4: Test CMS Access Again

After setting the admin role:

1. **Sign out** of your production site
2. **Sign back in** (this refreshes your user session)
3. Visit: `https://fox-adventures.vercel.app/api/check-admin`
4. Verify it shows `"isAdmin": true`
5. Try accessing the CMS: `https://fox-adventures.vercel.app/cms`

### Step 5: Check Vercel Function Logs

If you're still getting the error after setting admin permissions:

1. Go to **Vercel Dashboard** → **Deployments**
2. Click on the **current production deployment**
3. Go to the **Functions** tab
4. Find the `/cms` function (or any `/cms/*` route)
5. Look for the console logs

**What to look for**:

**Scenario A: "Error fetching current user"**
```
Error fetching current user: [error message]
Error details: { name: "...", message: "...", stack: "..." }
```
→ This means Clerk authentication is failing. Check your Clerk API keys in Vercel environment variables.

**Scenario B: "User is not admin"**
```
Admin check: {
  userId: "user_XXXXX",
  isAdminViaMetadata: false,
  isAdminViaOrg: false,
  isAdmin: false,
  publicMetadataRole: undefined
}
User is not admin, redirecting: user_XXXXX
```
→ Admin permissions not set. Go back to Step 3.

**Scenario C: "User authenticated but currentUser() returned null"**
```
User authenticated but currentUser() returned null
```
→ Clerk API issue. Check your Clerk environment variables in Vercel.

## Common Issues & Solutions

### Issue 1: "Not authenticated" when you ARE logged in

**Cause**: Clerk session not syncing properly

**Solution**:
1. Clear your browser cookies for the production domain
2. Sign out completely
3. Sign back in
4. Try again

### Issue 2: "isAdmin: false" even after setting metadata

**Cause**: User session is cached

**Solution**:
1. Make sure you set the metadata in Clerk Dashboard
2. **Sign out** of the production site
3. **Sign back in** (this refreshes the session)
4. The new metadata will now be available

### Issue 3: Clerk environment variables missing

**Cause**: Environment variables not set in Vercel

**Solution**:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Make sure these are set for **Production**:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. If missing, add them from your Clerk Dashboard
4. **Redeploy** after adding them

### Issue 4: Works locally but not in production

**Cause**: Different environment variables or Clerk instances

**Solution**:
1. Make sure you're using the same Clerk project for both local and production
2. Check that production environment variables match your local `.env.local`
3. Verify the Clerk publishable key in production starts with `pk_live_` (not `pk_test_`)

## Quick Checklist

Before reporting an issue, verify:

- [ ] Latest code is deployed to production
- [ ] You're logged in to the production site
- [ ] `/api/check-admin` shows `"authenticated": true`
- [ ] `/api/check-admin` shows `"isAdmin": true`
- [ ] Your user metadata in Clerk has `"role": "admin"`
- [ ] You've signed out and back in after setting metadata
- [ ] Clerk environment variables are set in Vercel for Production
- [ ] You're testing on the production domain (not preview)

## What to Report

If you've completed all steps and still getting the error, provide:

1. **Response from `/api/check-admin`** (copy the entire JSON)
2. **Vercel function logs** for `/cms` route
3. **Screenshot of Clerk user metadata** showing the admin role
4. **Error message** you're seeing (the URL parameter)

## Testing Locally

To test locally, make sure your `.env.local` has:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://...

# Cloudflare R2
CLOUDFLARE_R2_ACCOUNT_ID=...
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET_NAME=...
CLOUDFLARE_R2_PUBLIC_DOMAIN=...

# Vercel Deploy Hook (optional for local)
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
```

Then:
```bash
npm run dev
```

Visit: `http://localhost:3000/api/check-admin`

Make sure it shows `"isAdmin": true` locally before testing in production.

## Next Steps After Fixing

Once you can access the CMS successfully:

1. Test publishing content (e.g., Contact Hero)
2. Check if deploy hook triggers (see `DEPLOY_HOOK_STATUS.md`)
3. Verify content updates appear on the live site after deployment

---

**Most Common Solution**: Set `"role": "admin"` in your Clerk user's public metadata, then sign out and sign back in.
