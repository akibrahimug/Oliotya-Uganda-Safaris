# Vercel Deploy Hook Troubleshooting Guide

## Issue
The Vercel deploy hook is not triggering deployments in production, even though the environment variable `VERCEL_DEPLOY_HOOK_URL` is set.

## Common Causes

### 1. Environment Variable Not Available at Runtime ❌

**Problem**: Environment variables in Vercel are only available during build time by default, unless explicitly exposed.

**Solution**: Make sure the environment variable is properly configured in Vercel:

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Ensure `VERCEL_DEPLOY_HOOK_URL` is set for:
   - ✅ **Production**
   - ✅ **Preview** (optional)
   - ✅ **Development** (optional)
4. **IMPORTANT**: After adding/changing environment variables, you MUST redeploy your application for them to take effect

### 2. Deploy Hook URL is Incorrect ❌

**Problem**: The deploy hook URL might be malformed or expired.

**Solution**: Create a new deploy hook:

1. Go to **Settings** → **Git**
2. Scroll down to **Deploy Hooks**
3. Click **Create Hook**
4. Give it a name like "CMS Content Update"
5. Select the branch (usually `main` or `master`)
6. Copy the generated URL
7. Update `VERCEL_DEPLOY_HOOK_URL` in Vercel environment variables
8. **Redeploy** your application

### 3. Missing Redeploy After Environment Variable Change ❌

**Problem**: Environment variables are cached during build. Changes won't take effect until you redeploy.

**Solution**:
1. After updating environment variables in Vercel
2. Go to **Deployments**
3. Click on the latest deployment
4. Click **Redeploy** button
5. Wait for deployment to complete

### 4. Network/CORS Issues ❌

**Problem**: Vercel might be blocking the request due to network issues.

**Solution**: The deploy hook should work from server-side code (which it is), but ensure:
- The URL starts with `https://api.vercel.com/v1/integrations/deploy/`
- No firewall rules blocking outbound requests from Vercel

## Testing the Deploy Hook

### Test 1: Check if Environment Variable is Available

Add this temporary API route to test if the env var is available in production:

\`\`\`typescript
// app/api/test-env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasDeployHook: !!process.env.VERCEL_DEPLOY_HOOK_URL,
    hookUrlPrefix: process.env.VERCEL_DEPLOY_HOOK_URL?.substring(0, 50),
  });
}
\`\`\`

Deploy this and visit `https://your-domain.com/api/test-env`

**Expected Result**:
\`\`\`json
{
  "hasDeployHook": true,
  "hookUrlPrefix": "https://api.vercel.com/v1/integrations/deploy/..."
}
\`\`\`

If `hasDeployHook` is `false`, the environment variable is not available at runtime.

### Test 2: Manual Test of Deploy Hook

Test the deploy hook URL directly using curl:

\`\`\`bash
curl -X POST "YOUR_VERCEL_DEPLOY_HOOK_URL"
\`\`\`

**Expected Response**:
\`\`\`json
{
  "job": {
    "id": "...",
    "state": "PENDING",
    "createdAt": 1234567890
  }
}
\`\`\`

If this works, the hook URL is valid.

### Test 3: Check Vercel Logs

In production, after publishing CMS content:

1. Go to Vercel Dashboard → **Deployments**
2. Click on the latest deployment
3. Go to **Functions** tab
4. Find the API route that was called (e.g., `/api/cms/contact-hero`)
5. Check the logs for:
   - ✅ `🚀 Triggering Vercel deployment...`
   - ✅ `✅ Vercel deployment triggered successfully`
   - ❌ `⚠️  VERCEL_DEPLOY_HOOK_URL is not set`
   - ❌ `❌ Failed to trigger Vercel deployment`

## Implementation Details

### Helper Function

The deploy hook is now handled by a centralized helper function in `/lib/vercel-deploy.ts`:

\`\`\`typescript
import { triggerVercelDeployAsync } from "@/lib/vercel-deploy";

// In your API route:
if (publish) {
  revalidatePath("/contact");
  triggerVercelDeployAsync(); // Fire and forget
}
\`\`\`

### Logging

The helper function provides detailed logging:

- ✅ Success: `✅ Vercel deployment triggered successfully`
- ⚠️  Warning: `⚠️  VERCEL_DEPLOY_HOOK_URL is not set`
- ❌ Error: `❌ Failed to trigger Vercel deployment`

All logs include relevant details like job ID and status.

## Step-by-Step Fix

1. **Create Deploy Hook in Vercel**:
   - Settings → Git → Deploy Hooks → Create Hook
   - Name: "CMS Content Update"
   - Branch: `main` (or your production branch)
   - Copy the URL

2. **Set Environment Variable**:
   - Settings → Environment Variables
   - Name: `VERCEL_DEPLOY_HOOK_URL`
   - Value: Paste the hook URL
   - Environment: Production ✓ (and Preview/Development if needed)
   - Save

3. **Redeploy Application**:
   - Deployments → Latest deployment → Redeploy
   - Wait for deployment to complete

4. **Test**:
   - Go to CMS in production
   - Edit any content
   - Click "Save & Publish"
   - Check Vercel logs for deployment trigger
   - Verify a new deployment started in Vercel dashboard

## Why This Happens

Next.js environment variables work differently in production:

- **Build-time variables**: Available during `next build`
- **Runtime variables**: Available when API routes execute

In Vercel:
- Environment variables set in the dashboard are available at **build time**
- They are also available at **runtime** for API routes and server components
- BUT: If you add/change them, you MUST redeploy for changes to take effect

## Alternative: Use Vercel API Token

If the deploy hook continues to fail, you can use Vercel's API with a token instead:

\`\`\`typescript
// Set these in Vercel env vars:
// VERCEL_TOKEN=your_vercel_token
// VERCEL_PROJECT_ID=your_project_id
// VERCEL_TEAM_ID=your_team_id (if using a team)

const response = await fetch(
  \`https://api.vercel.com/v13/deployments\`,
  {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.VERCEL_TOKEN}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: process.env.VERCEL_PROJECT_ID,
      gitSource: {
        type: "github",
        ref: "main", // your branch
      },
    }),
  }
);
\`\`\`

But the deploy hook method is simpler and recommended.

## Additional Resources

- [Vercel Deploy Hooks Documentation](https://vercel.com/docs/deployments/deploy-hooks)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
