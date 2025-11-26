# Vercel Deployment Guide

## Issue Fixed

**Problem**: Build was failing on Vercel with error:
```
Error: Missing API key. Pass it to the constructor `new Resend("re_123")`
```

**Root Cause**: The Resend client was being initialized at module load time during the build process, but environment variables are not available during Vercel's build step - only at runtime.

**Solution**: Modified `lib/email.ts` to use a placeholder API key during build time and validate the real key at runtime.

---

## Required Environment Variables on Vercel

You need to add the following environment variables to your Vercel project:

### 1. Go to Vercel Dashboard
- Navigate to your project
- Go to **Settings** → **Environment Variables**

### 2. Add These Variables

#### Email Configuration (Resend)
```env
RESEND_API_KEY=re_QCtm6KZQ_LBAsv89pQSGe5emRjAgkba1X
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=kasomaibrahim@gmail.com
```

#### Database (Neon PostgreSQL)
```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
DIRECT_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

#### Authentication (Clerk)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

#### Storage (Cloudflare R2)
```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=fox-adventures-images
R2_PUBLIC_URL=https://your-r2-bucket.r2.dev
```

#### CMS & API Configuration
```env
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

#### Optional: Rate Limiting
```env
RATE_LIMIT_REQUESTS=5
RATE_LIMIT_WINDOW_MS=3600000
```

---

## Important: Environment Variable Scopes

For each environment variable, set the appropriate scope:

- **Production**: Required for live site
- **Preview**: Recommended for preview deployments
- **Development**: Optional (local development uses `.env.local`)

**Recommended**: Enable all three scopes for critical variables like `DATABASE_URL`, `RESEND_API_KEY`, and `CLERK_SECRET_KEY`.

---

## Code Changes Made

### `lib/email.ts`

**Before**:
```typescript
export const resend = new Resend(process.env.RESEND_API_KEY);
```

**After**:
```typescript
// Use a placeholder during build time, actual key will be used at runtime
export const resend = new Resend(process.env.RESEND_API_KEY || 'build-time-placeholder');
```

**Added Runtime Validation**:
```typescript
export async function sendEmail({ to, subject, html, replyTo }) {
  try {
    // Validate API key at runtime
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'build-time-placeholder') {
      throw new Error('RESEND_API_KEY is not configured. Please add it to your environment variables.');
    }

    // ... rest of function
  }
}
```

---

## Deployment Steps

### 1. Commit and Push Changes
```bash
git add .
git commit -m "Fix: Handle missing RESEND_API_KEY during build

- Add placeholder for Resend API key during build time
- Add runtime validation for API key
- Fixes Vercel build error"
git push
```

### 2. Configure Environment Variables on Vercel
- Follow the steps in "Required Environment Variables on Vercel" above
- Make sure to add **all** required variables

### 3. Redeploy
- Vercel will automatically redeploy when you push to your main branch
- Or manually trigger a redeploy from Vercel Dashboard

### 4. Verify Deployment
- Check deployment logs for any errors
- Test booking functionality to ensure emails are sent
- Verify all features work correctly

---

## Testing After Deployment

### 1. Check Build Logs
- Look for "✓ Compiled successfully"
- Look for "✓ Generating static pages (37/37)"
- Ensure exit code is 0

### 2. Test Email Functionality
- Submit a test booking
- Check that confirmation emails are sent
- Verify admin receives notification

### 3. Test Database Connection
- View destinations, packages
- Create/edit content in CMS
- Verify data persistence

---

## Common Issues & Solutions

### Issue: "RESEND_API_KEY is not configured"
**Solution**: Add the environment variable in Vercel dashboard and redeploy

### Issue: Database connection errors
**Solution**:
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check Neon database is active
- Verify connection pooling settings

### Issue: Clerk authentication not working
**Solution**:
- Verify all Clerk environment variables are set
- Check that URLs match your deployment domain
- Ensure webhook secret is correct

### Issue: Images not loading from R2
**Solution**:
- Verify R2 credentials are correct
- Check CORS settings on R2 bucket
- Ensure `R2_PUBLIC_URL` is correct

---

## Environment Variable Checklist

Before deploying, ensure all these are set in Vercel:

- [ ] `RESEND_API_KEY`
- [ ] `EMAIL_FROM`
- [ ] `ADMIN_EMAIL`
- [ ] `DATABASE_URL`
- [ ] `DIRECT_URL`
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `R2_ACCOUNT_ID`
- [ ] `R2_ACCESS_KEY_ID`
- [ ] `R2_SECRET_ACCESS_KEY`
- [ ] `R2_BUCKET_NAME`
- [ ] `R2_PUBLIC_URL`
- [ ] `VERCEL_DEPLOY_HOOK_URL` (optional but recommended)
- [ ] `NEXT_PUBLIC_BASE_URL` (optional but recommended)

---

## Local Build Test

To test the build locally before deploying:

```bash
# Build the project
yarn build

# or
npm run build

# Check for any errors in output
# Should see: "✓ Compiled successfully"
```

---

## Vercel-Specific Optimizations

### 1. Edge Runtime for API Routes (Optional)
Some API routes could benefit from Edge runtime for faster response times:

```typescript
export const runtime = 'edge'; // Add to API route files
```

### 2. Prisma Connection Pooling
Already configured in `DATABASE_URL` with connection pooling enabled.

### 3. Static Generation
Most pages are statically generated or server-rendered on demand for optimal performance.

---

## Monitoring & Debugging

### View Logs
- Go to Vercel Dashboard → Deployments → Select deployment → Logs
- Check Function logs for runtime errors
- Look for email sending errors

### Enable Verbose Logging (if needed)
Add to environment variables:
```env
DEBUG=resend:*
PRISMA_DEBUG=1
```

---

## Success Indicators

✅ Build completes with exit code 0
✅ All 37 routes generated successfully
✅ Email test succeeds (send booking confirmation)
✅ CMS is accessible and functional
✅ Database queries work correctly
✅ Images load from R2 bucket

---

## Next Steps After Deployment

1. **Test all functionality** on the live site
2. **Monitor error logs** for the first 24 hours
3. **Set up custom domain** (if not already done)
4. **Configure production email domain** in Resend (replace `onboarding@resend.dev`)
5. **Add monitoring** (Sentry, LogRocket, etc.)
6. **Set up analytics** (Vercel Analytics, Google Analytics)

---

**Date**: 2025-11-26
**Status**: ✅ Build fix verified locally, ready for Vercel deployment
