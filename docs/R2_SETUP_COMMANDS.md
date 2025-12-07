# Cloudflare R2 Setup - Command Cheat Sheet

## Quick Setup Commands

### 1. Local Testing (Without R2)
```bash
# Keep images local during development
echo 'NEXT_PUBLIC_R2_PUBLIC_URL=' >> .env.local
npm run dev
```

### 2. Migrate Images to R2
```bash
# After configuring R2 credentials
npm run migrate:images
```

### 3. Test Build
```bash
npm run build
npm run start
```

### 4. Deploy to Vercel
```bash
git add .
git commit -m "Add image optimization with Cloudflare R2"
git push origin main
```

## Environment Variables Template

Copy this to your `.env.local`:

```bash
# Cloudflare R2 Storage Configuration
# ====================================

# Your R2 endpoint URL (from Cloudflare dashboard)
# Format: https://<account-id>.r2.cloudflarestorage.com
R2_ENDPOINT=

# R2 Access Key ID (from API token creation)
R2_ACCESS_KEY_ID=

# R2 Secret Access Key (from API token creation)
R2_SECRET_ACCESS_KEY=

# Your bucket name (created in R2 dashboard)
R2_BUCKET_NAME=nambi-uganda-safaris

# Public URL for accessing images
# Option 1 (R2 Dev Domain): https://<bucket-name>.<account-id>.r2.dev
# Option 2 (Custom Domain): https://images.foxadventures.com
NEXT_PUBLIC_R2_PUBLIC_URL=
```

## Vercel Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable Name | Value Source | Environment |
|---------------|--------------|-------------|
| `R2_ENDPOINT` | From Cloudflare | Production, Preview |
| `R2_ACCESS_KEY_ID` | From Cloudflare | Production, Preview |
| `R2_SECRET_ACCESS_KEY` | From Cloudflare | Production, Preview |
| `R2_BUCKET_NAME` | `nambi-uganda-safaris` | Production, Preview |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | Your public URL | Production, Preview |

## Common Commands

```bash
# Install dependencies (if needed)
npm install --legacy-peer-deps

# Check images in public directory
ls -lh public/*.{jpg,jpeg,png,webp,gif}

# Count images to migrate
ls public/*.{jpg,jpeg,png,webp,gif} 2>/dev/null | wc -l

# Run migration with verbose output
npm run migrate:images

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev

# Build for production
npm run build

# Start production server locally
npm run start
```

## Cloudflare CLI (Optional)

For advanced users, install Cloudflare Wrangler:

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create R2 bucket via CLI
wrangler r2 bucket create nambi-uganda-safaris

# List buckets
wrangler r2 bucket list

# Upload file directly
wrangler r2 object put nambi-uganda-safaris/images/test.jpg --file=./public/test.jpg

# Check bucket contents
wrangler r2 object list nambi-uganda-safaris --prefix=images/
```

## Testing Checklist

After setup, verify:

```bash
# 1. Check environment variables
cat .env.local | grep R2

# 2. Test migration
npm run migrate:images

# 3. Start dev server
npm run dev

# 4. Open browser and check:
# - Images load correctly
# - No broken images
# - Console has no errors
# - Network tab shows images from R2 (if configured)

# 5. Build for production
npm run build

# 6. Start production build
npm run start

# 7. Test production build locally
# Open http://localhost:3000
```

## Troubleshooting Commands

```bash
# Check Node.js version (should be 18+)
node -v

# Check npm version
npm -v

# Verify installed packages
npm list @aws-sdk/client-s3 sharp dotenv

# Check TypeScript compilation
npx tsc --noEmit

# Verify Next.js config syntax
node -e "import('./next.config.mjs')"

# Test R2 connection (add to test script)
node -e "
  require('dotenv').config({ path: '.env.local' });
  const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
  const client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  client.send(new ListBucketsCommand({}))
    .then(() => console.log('✅ R2 connection successful'))
    .catch(err => console.error('❌ R2 connection failed:', err.message));
"
```

## Git Commands

```bash
# Check status
git status

# Stage all changes
git add .

# Commit with message
git commit -m "feat: implement Cloudflare R2 image optimization"

# Push to remote
git push origin main

# Create feature branch (alternative)
git checkout -b feat/r2-image-optimization
git push origin feat/r2-image-optimization
```

## Performance Testing

```bash
# Install Lighthouse CLI (optional)
npm install -g lighthouse

# Run Lighthouse audit
lighthouse http://localhost:3000 --view

# Check image optimization
curl -I http://localhost:3000/_next/image?url=%2Fuganda-gorilla.jpg&w=1200&q=75

# Expected headers:
# - cache-control: public, max-age=31536000, immutable
# - content-type: image/webp (or image/avif)
```

## Clean Up

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Clear all caches
rm -rf .next
rm -rf node_modules/.cache

# Reset to clean state
git clean -fdx
npm install --legacy-peer-deps
```

## Cost Monitoring

Check your R2 usage:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to R2
3. Click on your bucket
4. View **Metrics** tab

Track:
- Storage used (GB)
- Class A operations (writes)
- Class B operations (reads)

---

**Quick Reference URLs**:
- R2 Dashboard: https://dash.cloudflare.com → R2
- Vercel Dashboard: https://vercel.com/dashboard
- Next.js Image Docs: https://nextjs.org/docs/app/api-reference/components/image
