#!/usr/bin/env ts-node
/**
 * Sync R2 images to CMS database
 * This script reads all images from R2 and adds them to the CMS database
 */
import { prisma } from "../lib/db";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
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

interface ImageToSync {
  filename: string;
  url: string;
  category: string;
}

async function listR2Images(): Promise<ImageToSync[]> {
  console.log(`Listing objects from bucket: ${BUCKET_NAME}`);

  // Try both possible prefixes
  const prefixes = [`${BUCKET_NAME}/images/`, "images/", ""];

  for (const prefix of prefixes) {
    console.log(`Trying prefix: "${prefix}"`);

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix || undefined,
    });

    try {
      const response = await r2Client.send(command);
      console.log(`  KeyCount: ${response.KeyCount || 0}`);

      if (response.Contents && response.Contents.length > 0) {
        console.log(`✅ Found ${response.Contents.length} objects with prefix "${prefix}"`);

        const images: ImageToSync[] = [];

        for (const object of response.Contents) {
          if (object.Key && !object.Key.endsWith("/")) {
            // Extract just the filename from the full key path
            const filename = object.Key.split("/").pop() || object.Key;
            const url = `${PUBLIC_URL}/${object.Key}`;

            // Infer category from filename
            let category = "other";
            const lowerFilename = filename.toLowerCase();

            if (lowerFilename.includes("logo")) category = "about";
            else if (lowerFilename.includes("placeholder")) category = "other";
            else if (lowerFilename.includes("team") || lowerFilename.includes("guide") || lowerFilename.includes("manager")) category = "team";
            else if (lowerFilename.includes("gorilla") || lowerFilename.includes("bwindi")) category = "destination";
            else if (lowerFilename.includes("murchison") || lowerFilename.includes("falls")) category = "destination";
            else if (lowerFilename.includes("uganda") || lowerFilename.includes("kampala")) category = "destination";
            else if (lowerFilename.includes("safari") || lowerFilename.includes("park")) category = "destination";

            images.push({ filename, url, category });
          }
        }

        return images;
      }
    } catch (error: any) {
      console.log(`  Error with prefix "${prefix}": ${error.message}`);
    }
  }

  console.log("❌ No images found with any prefix");
  return [];
}

async function getImageMetadata(url: string): Promise<{ width: number; height: number; format: string; fileSize: number }> {
  try {
    // Fetch image from URL
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const metadata = await sharp(buffer).metadata();

    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || "webp",
      fileSize: buffer.length,
    };
  } catch (error) {
    console.error(`Error getting metadata for ${url}:`, error);
    // Return defaults if we can't fetch metadata
    return {
      width: 0,
      height: 0,
      format: "webp",
      fileSize: 0,
    };
  }
}

async function syncImagesToDatabase(): Promise<void> {
  console.log("\n🔄 Syncing R2 images to CMS database...\n");

  // Get all images from R2
  const r2Images = await listR2Images();
  console.log(`Found ${r2Images.length} images in R2\n`);

  // Get existing images from database
  const existingImages = await prisma.cMSImage.findMany({
    select: { filename: true },
  });
  const existingFilenames = new Set(existingImages.map((img: { filename: string }) => img.filename));

  let added = 0;
  let skipped = 0;

  for (const image of r2Images) {
    if (existingFilenames.has(image.filename)) {
      console.log(`⏭️  Skipped (already exists): ${image.filename}`);
      skipped++;
      continue;
    }

    try {
      // Get image metadata
      console.log(`📊 Fetching metadata: ${image.filename}...`);
      const metadata = await getImageMetadata(image.url);

      // Generate alt text from filename
      const altText = image.filename
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/-/g, " ")        // Replace hyphens with spaces
        .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize words

      // Create database entry
      await prisma.cMSImage.create({
        data: {
          filename: image.filename,
          url: image.url,
          altText,
          category: image.category,
          width: metadata.width,
          height: metadata.height,
          fileSize: metadata.fileSize,
          format: metadata.format,
        },
      });

      console.log(`✅ Added: ${image.filename} (${image.category})`);
      added++;
    } catch (error) {
      console.error(`❌ Failed to add ${image.filename}:`, error);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("Sync Summary");
  console.log("=".repeat(70));
  console.log(`Total R2 Images: ${r2Images.length}`);
  console.log(`Added to Database: ${added}`);
  console.log(`Skipped (existing): ${skipped}`);
  console.log("=".repeat(70));
}

// Main execution
async function main() {
  try {
    await syncImagesToDatabase();
    console.log("\n✅ Sync complete!");
  } catch (error) {
    console.error("\n❌ Sync failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
