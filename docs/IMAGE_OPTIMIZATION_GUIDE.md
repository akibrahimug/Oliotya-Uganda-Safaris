# Image Optimization Guide - Cloudflare R2 + Next.js Image

This project uses **Cloudflare R2** for image storage and **Next.js Image component** for optimization and delivery via Vercel's CDN.

## Why This Approach?

- **Cloudflare R2**: $0 egress fees (vs S3's high costs), cheap storage (~$0.015/GB)
- **Next.js Image**: Automatic optimization, WebP/AVIF conversion, lazy loading, blur placeholders
- **Global CDN**: Fast delivery worldwide via Vercel's Edge Network
- **Cost-effective**: Perfect balance of performance and affordability

## Setup Instructions

### 1. Create Cloudflare R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** from the sidebar
3. Click **Create bucket**
4. Name your bucket (e.g., `nambi-uganda-safaris`)
5. Click **Create bucket**

### 2. Generate R2 API Tokens

1. In R2 dashboard, click **Manage R2 API Tokens**
2. Click **Create API token**
3. Set permissions:
   - **Permission Type**: `Edit` (for read/write access)
   - **Specify bucket**: Select your bucket
4. Click **Create API token**
5. Save the credentials shown:
   - `Access Key ID`
   - `Secret Access Key`
   - `Endpoint URL` (format: `https://<account-id>.r2.cloudflarestorage.com`)

### 3. Configure Public Access (Optional but Recommended)

To allow public access to images:

1. In your bucket settings, go to **Settings**
2. Under **Public Access**, click **Allow Access**
3. Set up a custom domain (recommended) or use the R2.dev subdomain:
   - **Custom domain**: `images.foxadventures.com` (via Cloudflare DNS)
   - **R2.dev subdomain**: `<bucket-name>.<account-id>.r2.dev`

### 4. Update Environment Variables

Edit `.env.local` and add your R2 credentials:

```bash
# Cloudflare R2 Storage
R2_ENDPOINT=https://<your-account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=nambi-uganda-safaris
NEXT_PUBLIC_R2_PUBLIC_URL=https://images.foxadventures.com
```

**Important**: Replace the placeholder values with your actual credentials.

### 5. Migrate Existing Images to R2

Run the migration script to upload all images from `public/` directory to R2:

```bash
npm run migrate:images
```

This will:
- Upload all images from `/public` to R2
- Display upload progress and results
- Show you the new R2 URLs

### 6. Update Next.js Config

The `next.config.mjs` has been configured to allow R2 domains. If you use a custom domain, update the hostname:

```js
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**.r2.cloudflarestorage.com", // R2 default
    },
    {
      protocol: "https",
      hostname: "images.foxadventures.com", // Your custom domain
    },
  ],
}
```

## How It Works

### Image Utility Functions

The `lib/image-utils.ts` provides helper functions:

```typescript
import { getImageSrc, getBlurDataURL } from "@/lib/image-utils"

// Automatically uses R2 URL if configured, falls back to local
const imageSrc = getImageSrc("/my-image.jpg")
```

### Using Next.js Image Component

All images now use the optimized `next/image` component:

```tsx
import Image from "next/image"
import { getImageSrc, getBlurDataURL } from "@/lib/image-utils"

<Image
  src={getImageSrc("/uganda-mountain-gorillas.jpg")}
  alt="Mountain Gorillas"
  width={1200}
  height={800}
  quality={85}
  placeholder="blur"
  blurDataURL={getBlurDataURL()}
  className="object-cover"
/>
```

### Benefits

1. **Automatic Optimization**:
   - WebP/AVIF conversion for modern browsers
   - Responsive images based on device size
   - Lazy loading by default

2. **Fast Loading**:
   - Blur placeholders prevent layout shift
   - Priority loading for above-the-fold images
   - Aggressive caching (1 year TTL)

3. **Global Performance**:
   - R2 stores images cheaply
   - Next.js Image optimizes on-demand
   - Vercel CDN delivers globally

## Uploading New Images

### Via Migration Script

Place images in `/public` and run:
```bash
npm run migrate:images
```

### Programmatically

Use the R2 upload utility:

```typescript
import { uploadToR2 } from "@/lib/r2"

const imageUrl = await uploadToR2({
  file: imageBuffer,
  fileName: "new-image.webp",
  contentType: "image/webp",
  folder: "images",
})
```

## Cost Estimation

### Cloudflare R2
- Storage: $0.015/GB/month
- Class A ops (writes): $4.50/million
- Class B ops (reads): $0.36/million
- **Egress: $0** (free!)

### Vercel (Next.js Image)
- Free tier: 1,000 image optimizations/month
- Pro: $5 per 1,000 additional optimizations
- After optimization, images are cached at edge

### Example Monthly Cost
For 10GB storage, 100K page views, 500K image requests:
- R2 Storage: $0.15
- R2 Operations: ~$0.20
- Vercel Images: $0 (free tier) - $40 (if all are unique)
- **Total**: ~$0.35 - $40/month (vs S3: ~$50-100/month)

## Troubleshooting

### Images not loading from R2

1. Check environment variables are set correctly
2. Verify bucket is publicly accessible
3. Check Next.js config has correct domain pattern
4. Ensure R2 API token has read permissions

### Migration script fails

1. Verify R2 credentials in `.env.local`
2. Check bucket name is correct
3. Ensure API token has write permissions

### Local development

Images will automatically fall back to local `/public` if R2 is not configured. Set `NEXT_PUBLIC_R2_PUBLIC_URL=""` in `.env.local` to use local images.

## Performance Tips

1. **Use WebP format**: Already optimized, smaller file sizes
2. **Compress before upload**: Use tools like Squoosh or TinyPNG
3. **Use appropriate sizes**: Don't upload 4K images if max display is 1920px
4. **Set priority prop**: For above-the-fold images
5. **Use blur placeholders**: Improves perceived performance

## Resources

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Next.js Image Docs](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Vercel Image Optimization](https://vercel.com/docs/image-optimization)
