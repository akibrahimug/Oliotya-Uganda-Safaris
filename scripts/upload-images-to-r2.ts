#!/usr/bin/env ts-node
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

interface UploadResult {
  fileName: string;
  url: string;
  success: boolean;
  error?: string;
  originalSize?: number;
  optimizedSize?: number;
  compressionRatio?: number;
}

async function optimizeAndUploadFile(
  filePath: string,
  fileName: string
): Promise<UploadResult> {
  try {
    const originalFile = readFileSync(filePath);
    const originalSize = originalFile.length;

    // Process image with sharp
    const image = sharp(originalFile);
    const metadata = await image.metadata();

    let processedImage = image;

    // Resize if image is too large (max 3840px width for 4K displays)
    const maxWidth = 3840;
    const maxHeight = 3840;

    if (metadata.width && metadata.width > maxWidth) {
      processedImage = processedImage.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: "inside",
      });
    } else if (metadata.height && metadata.height > maxHeight) {
      processedImage = processedImage.resize(null, maxHeight, {
        withoutEnlargement: true,
        fit: "inside",
      });
    }

    // Convert to WebP with optimized settings
    // Try different quality levels to find the best balance
    const optimizedBuffer = await processedImage
      .webp({
        quality: 85,           // Good quality with better compression
        effort: 6,             // Maximum compression effort
        smartSubsample: true   // Better color quality
      })
      .toBuffer();

    const optimizedSize = optimizedBuffer.length;
    const compressionRatio = ((1 - optimizedSize / originalSize) * 100);

    // Change extension to .webp
    const webpFileName = fileName.replace(/\.[^/.]+$/, ".webp");
    const key = `images/${webpFileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: optimizedBuffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    });

    await r2Client.send(command);
    const url = `${PUBLIC_URL}/${key}`;

    console.log(`✓ Optimized & Uploaded: ${fileName} -> ${webpFileName}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(1)} KB | Optimized: ${(optimizedSize / 1024).toFixed(1)} KB | Saved: ${compressionRatio.toFixed(1)}%`);

    return {
      fileName: webpFileName,
      url,
      success: true,
      originalSize,
      optimizedSize,
      compressionRatio
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`✗ Failed to upload ${fileName}: ${errorMsg}`);
    return { fileName, url: "", success: false, error: errorMsg };
  }
}

function getContentType(fileName: string): string {
  const ext = fileName.toLowerCase().split(".").pop();
  const types: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  };
  return types[ext || ""] || "application/octet-stream";
}

async function uploadAllImages(): Promise<void> {
  const publicDir = join(process.cwd(), "public");
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff", ".tif", ".avif"];

  console.log(`\nScanning ${publicDir} for images...\n`);

  const files = readdirSync(publicDir).filter((file) => {
    const ext = `.${file.toLowerCase().split(".").pop()}`;
    return imageExtensions.includes(ext) && !file.toLowerCase().endsWith('.svg'); // Skip SVGs
  });

  if (files.length === 0) {
    console.log("No images found in public directory.");
    return;
  }

  console.log(`Found ${files.length} images to optimize and upload.\n`);

  const results: UploadResult[] = [];

  for (const file of files) {
    const filePath = join(publicDir, file);
    const stat = statSync(filePath);

    if (stat.isFile()) {
      const result = await optimizeAndUploadFile(filePath, file);
      results.push(result);
    }
  }

  const successResults = results.filter((r) => r.success);
  const totalOriginalSize = successResults.reduce((sum, r) => sum + (r.originalSize || 0), 0);
  const totalOptimizedSize = successResults.reduce((sum, r) => sum + (r.optimizedSize || 0), 0);
  const totalSavings = totalOriginalSize - totalOptimizedSize;
  const averageCompression = totalOriginalSize > 0
    ? ((totalSavings / totalOriginalSize) * 100)
    : 0;

  console.log("\n" + "=".repeat(70));
  console.log("Upload Summary");
  console.log("=".repeat(70));
  console.log(`Total Images: ${results.length}`);
  console.log(`Successful: ${successResults.length}`);
  console.log(`Failed: ${results.filter((r) => !r.success).length}`);
  console.log(`\nCompression Statistics:`);
  console.log(`  Total Original Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Total Optimized Size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Total Saved: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${averageCompression.toFixed(1)}%)`);

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.log("\nFailed uploads:");
    failed.forEach((r) => console.log(`  - ${r.fileName}: ${r.error}`));
  }

  console.log("\n" + "=".repeat(70));
  console.log("Image URLs (all converted to WebP):");
  console.log("=".repeat(70));
  results
    .filter((r) => r.success)
    .forEach((r) => {
      console.log(`"${r.fileName}" -> "${r.url}"`);
    });
}

// Verify environment variables
function verifyEnvVars(): boolean {
  const required = [
    "R2_ENDPOINT",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "NEXT_PUBLIC_R2_PUBLIC_URL",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((key) => console.error(`  - ${key}`));
    console.error("\nPlease configure these in your .env.local file.");
    return false;
  }

  return true;
}

// Main execution
if (!verifyEnvVars()) {
  process.exit(1);
}

uploadAllImages()
  .then(() => {
    console.log("\n✅ Migration complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
