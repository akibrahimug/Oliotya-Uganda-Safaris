# CMS Publish & Build Trigger Setup

## Overview
When you click "Save & Publish" in the CMS, it will:
1. Save the content to the database with `PUBLISHED` status
2. Revalidate the Next.js cache
3. Trigger a new Vercel production build (if configured)

## Setting Up Vercel Deploy Hook

To enable automatic production builds when publishing CMS content:

### 1. Create a Deploy Hook in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Git** → **Deploy Hooks**
3. Click **Create Hook**
4. Name it: `CMS Publish Hook`
5. Select branch: `main` (or your production branch)
6. Click **Create Hook**
7. Copy the generated webhook URL (it will look like: `https://api.vercel.com/v1/integrations/deploy/...`)

### 2. Add the Deploy Hook to Your Environment Variables

Add the following to your `.env.local` file:

```bash
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/YOUR_HOOK_ID_HERE
```

### 3. Add to Vercel Environment Variables

1. Go to Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `VERCEL_DEPLOY_HOOK_URL`
   - **Value**: Your deploy hook URL
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**

### 4. Redeploy

After adding the environment variable, trigger a manual deployment so Vercel picks up the new variable.

## How It Works

When you click "Save & Publish" in any CMS section:

```
User clicks "Save & Publish"
    ↓
Content saved to database (status: PUBLISHED)
    ↓
API calls /api/revalidate?path=/&build=true
    ↓
Next.js cache revalidated (instant updates on next request)
    ↓
If VERCEL_DEPLOY_HOOK_URL is set:
  → POST request sent to Vercel Deploy Hook
  → New production build triggered
  → Changes go live in ~2-5 minutes
```

## Without Deploy Hook

If you don't set up the deploy hook:
- Content will still be saved to the database
- Cache will still be revalidated (changes visible on next page load in dev/preview)
- **Production builds must be triggered manually** via:
  - Git push to main branch
  - Manual deployment in Vercel dashboard

## Testing

1. Make a change in the CMS
2. Click "Save & Publish"
3. Check Vercel dashboard for new deployment
4. Wait for deployment to complete (~2-5 minutes)
5. Visit your production site to see changes

## Troubleshooting

### Build Not Triggering

1. Check environment variable is set correctly in Vercel
2. Check the deploy hook URL is correct
3. Look for errors in the API logs
4. Verify the deploy hook is enabled in Vercel settings

### Changes Not Appearing

1. Wait for build to complete (check Vercel dashboard)
2. Clear browser cache
3. Try hard refresh (Ctrl/Cmd + Shift + R)
4. Check if content status is "PUBLISHED" in database
