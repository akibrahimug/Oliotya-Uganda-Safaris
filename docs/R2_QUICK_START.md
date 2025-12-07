# Cloudflare R2 Quick Start Guide

## TL;DR - 5 Minute Setup

### Step 1: Create R2 Bucket (2 minutes)
1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **R2** → **Create bucket**
3. Name: `nambi-uganda-safaris` → **Create**

### Step 2: Get API Credentials (2 minutes)
1. Click **Manage R2 API Tokens** → **Create API token**
2. Permission: **Edit**, Bucket: `nambi-uganda-safaris`
3. Copy:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL

### Step 3: Enable Public Access (1 minute)
1. Open bucket settings
2. **Public Access** → **Allow Access**
3. Note your public URL or set up custom domain

### Step 4: Configure Environment Variables
Update `.env.local`:
```bash
R2_ENDPOINT=https://YOUR-ACCOUNT-ID.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=nambi-uganda-safaris
NEXT_PUBLIC_R2_PUBLIC_URL=https://YOUR-BUCKET.YOUR-ACCOUNT.r2.dev
```

### Step 5: Upload Images
```bash
npm run migrate:images
```

Done! Your images are now:
- Stored in R2 ($0 egress, cheap storage)
- Optimized by Next.js (WebP/AVIF, responsive)
- Delivered globally via Vercel CDN

## What Changed?

### Before
```tsx
<img src="/uganda-gorilla.jpg" alt="Gorilla" />
```

### After
```tsx
import Image from "next/image"
import { getImageSrc, getBlurDataURL } from "@/lib/image-utils"

<Image
  src={getImageSrc("/uganda-gorilla.jpg")}
  alt="Gorilla"
  width={1200}
  height={800}
  placeholder="blur"
  blurDataURL={getBlurDataURL()}
/>
```

## Benefits

| Feature | Before | After |
|---------|--------|-------|
| **Format** | JPG | WebP/AVIF |
| **Lazy Loading** | Manual | Automatic |
| **Responsive** | No | Yes (5+ sizes) |
| **Blur Placeholder** | No | Yes |
| **CDN** | Vercel only | R2 + Vercel Edge |
| **Cost (10GB/month)** | ~$5 | ~$0.35 |

## Cost Comparison

### S3 + CloudFront
- Storage: $2.30/month
- Egress (100GB): $9.00/month
- **Total: ~$11/month**

### Cloudflare R2 (This Setup)
- Storage (10GB): $0.15/month
- Egress: $0/month
- Operations: $0.20/month
- **Total: ~$0.35/month**

### Savings: **96% cheaper!**

## Next Steps

1. **Test locally**: Keep `NEXT_PUBLIC_R2_PUBLIC_URL` empty to use local images
2. **Deploy**: Push to Vercel, add R2 env vars in dashboard
3. **Custom domain** (optional): Set up `images.yourdomain.com` via Cloudflare DNS
4. **Monitor**: Check R2 usage in Cloudflare dashboard

## Troubleshooting

**Images not loading?**
- Verify bucket is public
- Check `.env.local` has correct values
- Restart dev server after env changes

**Migration failed?**
- Ensure API token has write permissions
- Check bucket name matches `.env.local`

**Need help?** See full guide in `IMAGE_OPTIMIZATION_GUIDE.md`
