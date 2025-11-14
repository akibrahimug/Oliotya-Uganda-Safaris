import { z } from "zod";

/**
 * Validation schema for image upload
 */
export const imageUploadSchema = z.object({
  altText: z.string().optional(),
  category: z
    .enum([
      "hero",
      "destination",
      "package",
      "team",
      "gallery",
      "about",
      "other",
    ])
    .optional(),
});

/**
 * Validation schema for image metadata update
 */
export const imageUpdateSchema = z.object({
  altText: z.string().optional(),
  category: z
    .enum([
      "hero",
      "destination",
      "package",
      "team",
      "gallery",
      "about",
      "other",
    ])
    .optional(),
});

/**
 * Supported image formats
 * Sharp can handle all these formats and convert them to WebP
 */
export const SUPPORTED_IMAGE_FORMATS = [
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

/**
 * Max file size: 10MB
 */
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
