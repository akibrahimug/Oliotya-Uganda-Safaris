/**
 * Image utility functions for handling both local and R2 images
 */

const IMAGE_PREFIX = "nambi-uganda-safaris/images";

/**
 * Get the optimized image source
 * Handles both R2 URLs (already complete) and local paths that need conversion
 */
export function getImageSrc(imagePath: string): string {
  // Read R2_PUBLIC_URL dynamically to support test environment changes
  const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

  // If already a full URL (from database/R2), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If R2 is configured and path is local, construct R2 URL
  if (R2_PUBLIC_URL && imagePath.startsWith('/')) {
    // Remove leading slash
    let fileName = imagePath.replace(/^\//, "");

    // Keep SVG as-is, convert other images to webp
    if (fileName.endsWith('.svg')) {
      // SVG files stay as SVG
      return `${R2_PUBLIC_URL}/${IMAGE_PREFIX}/${fileName}`;
    } else if (!fileName.endsWith('.webp')) {
      // Convert non-webp raster images to webp
      fileName = fileName.replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, ".webp");
    }

    return `${R2_PUBLIC_URL}/${IMAGE_PREFIX}/${fileName}`;
  }

  // If it's already a filename (no leading slash), might be from getImageUrl()
  if (R2_PUBLIC_URL && !imagePath.startsWith('/')) {
    return imagePath; // Already processed
  }

  // Fallback to local image
  return imagePath;
}

/**
 * Get image dimensions for Next.js Image component
 */
export function getImageDimensions(aspectRatio: "16:9" | "4:3" | "1:1" | "21:9") {
  const dimensions = {
    "16:9": { width: 1600, height: 900 },
    "4:3": { width: 1200, height: 900 },
    "1:1": { width: 1000, height: 1000 },
    "21:9": { width: 2100, height: 900 },
  };

  return dimensions[aspectRatio];
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(imageSrc: string, widths: number[] = [640, 768, 1024, 1280, 1920]): string {
  return widths.map((width) => `${imageSrc}?w=${width} ${width}w`).join(", ");
}

/**
 * Get blur data URL for placeholder
 */
export function getBlurDataURL(color: string = "#1a1a1a"): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Crect width='8' height='5' fill='${color}' filter='url(%23b)'/%3E%3C/svg%3E`;
}
