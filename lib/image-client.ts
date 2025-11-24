/**
 * Client-side image compression utilities
 * Compresses images to WebP before uploading to avoid Vercel's 4.5MB limit
 */

const MAX_DIMENSION = 3840; // 4K
const WEBP_QUALITY = 0.85; // 85%
const MAX_COMPRESSED_SIZE = 4 * 1024 * 1024; // 4MB (under Vercel's 4.5MB limit)

interface CompressionResult {
  blob: Blob;
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Compresses an image file to WebP format
 * @param file - The original image file
 * @param onProgress - Optional callback for progress updates (0-100)
 * @returns Compressed image as File object with metadata
 */
export async function compressImageToWebp(
  file: File,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const originalSize = file.size;

  // Skip SVG files - they're already optimized and small
  if (file.type === "image/svg+xml") {
    const compressedFile = new File([file], file.name, { type: file.type });
    return {
      blob: file,
      file: compressedFile,
      originalSize,
      compressedSize: file.size,
      compressionRatio: 1,
    };
  }

  // Skip animated GIFs - createImageBitmap doesn't preserve animation
  if (file.type === "image/gif") {
    const isAnimated = await isAnimatedGif(file);
    if (isAnimated) {
      const compressedFile = new File([file], file.name, { type: file.type });
      return {
        blob: file,
        file: compressedFile,
        originalSize,
        compressedSize: file.size,
        compressionRatio: 1,
      };
    }
  }

  onProgress?.(10);

  // Load the image
  const imageBitmap = await createImageBitmap(file);
  onProgress?.(30);

  // Calculate new dimensions while maintaining aspect ratio
  let { width, height } = imageBitmap;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  onProgress?.(50);

  // Create canvas and draw resized image
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Use better image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(imageBitmap, 0, 0, width, height);
  imageBitmap.close(); // Free memory

  onProgress?.(70);

  // Convert to WebP blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      "image/webp",
      WEBP_QUALITY
    );
  });

  onProgress?.(90);

  // Check if compressed size exceeds limit
  if (blob.size > MAX_COMPRESSED_SIZE) {
    throw new Error(
      `Compressed image size (${(blob.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size (${(MAX_COMPRESSED_SIZE / (1024 * 1024)).toFixed(2)}MB). Please use a smaller image.`
    );
  }

  // Create a new file with .webp extension
  const newFileName = file.name.replace(/\.[^.]+$/, ".webp");
  const compressedFile = new File([blob], newFileName, {
    type: "image/webp",
  });

  onProgress?.(100);

  const compressedSize = blob.size;
  const compressionRatio = originalSize / compressedSize;

  return {
    blob,
    file: compressedFile,
    originalSize,
    compressedSize,
    compressionRatio,
  };
}

/**
 * Checks if a GIF file is animated
 * @param file - The GIF file to check
 * @returns true if the GIF is animated
 */
async function isAnimatedGif(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer);
      // Check for multiple image blocks in GIF
      let imageCount = 0;
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === 0x00 && arr[i + 1] === 0x21 && arr[i + 2] === 0xf9) {
          imageCount++;
          if (imageCount > 1) {
            resolve(true);
            return;
          }
        }
      }
      resolve(false);
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, Math.min(file.size, 64 * 1024))); // Check first 64KB
  });
}

/**
 * Validates if a file can be compressed
 * @param file - The file to validate
 * @returns Error message if invalid, null if valid
 */
export function validateImageFile(file: File): string | null {
  const maxOriginalSize = 10 * 1024 * 1024; // 10MB

  if (file.size > maxOriginalSize) {
    return `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size (10MB)`;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/svg+xml",
  ];

  if (!allowedTypes.includes(file.type)) {
    return `File type ${file.type} is not supported`;
  }

  return null;
}
