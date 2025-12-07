# Vercel Deploy Hook - Production Debugging Checklist

## Current Status
- ✅ Environment variable is set in Vercel
- ✅ Branch is set to `master`
- ❌ Deploy hook is still not triggering in production

## Step-by-Step Debugging

### Step 1: Verify Environment Variable in Production

Deploy your latest code and visit these URLs in **production** (while logged in to CMS):

```
https://your-production-domain.com/api/debug-env
https://your-production-domain.com/api/test-deploy-hook
```

**Expected Response from `/api/debug-env`**:
```json
{
  "deployHook": {
    "configured": true,
    "urlPrefix": "https://api.vercel.com/v1/integrations/deploy/...",
    "urlLength": 100+,
    "startsWithHttps": true,
    "containsVercel": true
  },
  "recommendation": "✅ Environment variable is available..."
}
```

**If `configured: false`**:
- The environment variable is NOT available in production runtime
- Solution: Redeploy after Step 2

### Step 2: Verify Vercel Environment Variable Settings

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Check these things:

1. **Variable Name**: Must be exactly `VERCEL_DEPLOY_HOOK_URL` (case-sensitive)

2. **Variable Value**: Should look like:
   ```
   https://api.vercel.com/v1/integrations/deploy/prj_XXXXX/YYYYY
   ```

3. **Environment Selection**: Must have **Production** checked ✓
   ```
   ☐ Development
   ☐ Preview
   ☑ Production  <-- THIS MUST BE CHECKED
   ```

4. **No Extra Spaces**: Make sure there are no leading/trailing spaces in the value

5. **Variable is Saved**: Click "Save" button after entering

### Step 3: Redeploy (Critical!)

Environment variables are baked into the build. You MUST redeploy:

1. Go to: Deployments tab
2. Click on the latest deployment
3. Click the three dots (...) → **Redeploy**
4. Wait for deployment to complete (~2-5 minutes)
5. Verify the new deployment is live

### Step 4: Test Again

After redeployment:

1. Visit: `https://your-domain.com/api/debug-env`
2. Verify `configured: true`
3. Visit: `https://your-domain.com/api/test-deploy-hook` (POST request)
4. Or publish CMS content and check Vercel function logs

### Step 5: Check Vercel Function Logs

When you publish CMS content in production:

1. Go to Vercel Dashboard → Deployments
2. Click on the current deployment
3. Go to **Functions** tab
4. Find the API route (e.g., `/api/cms/contact-hero`)
5. Look for this output:

**Success**:
```
====== VERCEL DEPLOY HOOK DEBUG ======
   Environment: production
   Vercel Env: production
   Hook URL exists: true
🚀 Triggering Vercel deployment...
   Hook URL prefix: https://api.vercel.com/v1/integrations/deploy/...
   Hook URL length: 107 characters
   Hook URL valid: true
   Request completed in 234ms
   Response status: 200 OK
✅ Vercel deployment triggered successfully
   Job ID: dpl_XXXXXXXXXXXXX
   Job State: PENDING
======================================
```

**Failure** (env var not set):
```
====== VERCEL DEPLOY HOOK DEBUG ======
   Environment: production
   Vercel Env: production
   Hook URL exists: false
⚠️  VERCEL_DEPLOY_HOOK_URL is not set
======================================
```

### Step 6: Verify Deploy Hook URL is Valid

Test the deploy hook URL manually with curl:

```bash
curl -X POST "YOUR_DEPLOY_HOOK_URL_HERE"
```

**Expected Success Response**:
```json
{
  "job": {
    "id": "dpl_XXXXXXXXXXXXX",
    "state": "PENDING",
    "createdAt": 1234567890
  }
}
```

**Failure Responses**:

404 Not Found:
```json
{
  "error": {
    "code": "not_found",
    "message": "The deploy hook was not found"
  }
}
```
→ **Solution**: Create a new deploy hook in Vercel

400 Bad Request:
```json
{
  "error": {
    "code": "bad_request",
    "message": "Invalid deploy hook URL"
  }
}
```
→ **Solution**: Check the URL format

### Step 7: Recreate Deploy Hook (If Needed)

If the hook URL doesn't work:

1. Go to: Settings → Git → Deploy Hooks
2. Delete the old hook (if exists)
3. Create a new hook:
   - Name: "CMS Content Update"
   - Branch: `master` (your production branch)
   - Click "Create Hook"
4. Copy the NEW URL
5. Update `VERCEL_DEPLOY_HOOK_URL` in Environment Variables
6. **Redeploy** (critical!)

## Common Issues & Solutions

### Issue 1: "Hook URL exists: false" in logs
**Cause**: Environment variable not available at runtime
**Solution**:
1. Verify it's set in Vercel dashboard
2. Ensure "Production" is checked
3. **Redeploy** the application

### Issue 2: "404 Not Found" when testing hook
**Cause**: Deploy hook was deleted or URL is wrong
**Solution**: Create a new deploy hook (Step 7)

### Issue 3: Hook triggers but shows old code
**Cause**: Deploy hook triggers new build, but ISR cache not cleared
**Solution**:
- The deploy hook creates a full new build
- Wait 2-5 minutes for build to complete
- Check Vercel Deployments tab for new deployment

### Issue 4: Works locally but not in production
**Cause**: Local `.env.local` has the variable, but Vercel doesn't
**Solution**:
1. Don't rely on local env for production testing
2. Always test in actual production after deploying
3. Use `/api/debug-env` endpoint to verify

### Issue 5: "Network timeout" or fetch errors
**Cause**: Vercel serverless function timeout or network issue
**Solution**:
- Check Vercel function execution time in logs
- Verify deploy hook URL is correct
- Check Vercel status page for outages

## Verification Checklist

Before contacting support, verify:

- [ ] Environment variable name is exactly `VERCEL_DEPLOY_HOOK_URL`
- [ ] "Production" environment is checked in Vercel
- [ ] Deploy hook URL starts with `https://api.vercel.com`
- [ ] No spaces in the environment variable value
- [ ] You've redeployed after setting the variable
- [ ] `/api/debug-env` shows `configured: true` in production
- [ ] Deploy hook URL works when tested with curl
- [ ] Vercel function logs show the debug output
- [ ] You're testing in actual production, not preview

## Expected Timeline

After setting environment variable and redeploying:

1. **Immediate**: `/api/debug-env` should show `configured: true`
2. **When publishing**: Deploy hook triggers within 1-2 seconds
3. **Build starts**: Shows in Deployments tab within 5-10 seconds
4. **Build completes**: 2-5 minutes depending on project size
5. **Live**: New content visible on site

## Still Not Working?

If you've completed all steps and it's still not working, provide these details:

1. Response from `/api/debug-env` in production
2. Vercel function logs when publishing content
3. curl test result of deploy hook URL
4. Screenshot of Vercel environment variable settings
5. Confirmation that you've redeployed after setting the variable

## Quick Test Script

Run this after deploying:

```bash
# 1. Test env var is available (must be logged in)
curl https://your-domain.com/api/debug-env

# 2. Test manual trigger (must be logged in)
curl -X POST https://your-domain.com/api/test-deploy-hook

# 3. Test deploy hook directly
curl -X POST "YOUR_DEPLOY_HOOK_URL"

# 4. Check Vercel deployments
# Visit: https://vercel.com/your-team/your-project/deployments
```

All three should return success responses.
