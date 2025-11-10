#!/usr/bin/env ts-node
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
}

async function uploadFile(
  filePath: string,
  fileName: string
): Promise<UploadResult> {
  try {
    const file = readFileSync(filePath);
    const contentType = getContentType(fileName);
    const key = `images/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    });

    await r2Client.send(command);
    const url = `${PUBLIC_URL}/${key}`;

    console.log(`✓ Uploaded: ${fileName} -> ${url}`);
    return { fileName, url, success: true };
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
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

  console.log(`\nScanning ${publicDir} for images...\n`);

  const files = readdirSync(publicDir).filter((file) => {
    const ext = `.${file.toLowerCase().split(".").pop()}`;
    return imageExtensions.includes(ext);
  });

  if (files.length === 0) {
    console.log("No images found in public directory.");
    return;
  }

  console.log(`Found ${files.length} images to upload.\n`);

  const results: UploadResult[] = [];

  for (const file of files) {
    const filePath = join(publicDir, file);
    const stat = statSync(filePath);

    if (stat.isFile()) {
      const result = await uploadFile(filePath, file);
      results.push(result);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("Upload Summary");
  console.log("=".repeat(60));
  console.log(`Total: ${results.length}`);
  console.log(`Success: ${results.filter((r) => r.success).length}`);
  console.log(`Failed: ${results.filter((r) => !r.success).length}`);

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.log("\nFailed uploads:");
    failed.forEach((r) => console.log(`  - ${r.fileName}: ${r.error}`));
  }

  console.log("\n" + "=".repeat(60));
  console.log("\nImage URLs (update your code to use these):");
  console.log("=".repeat(60));
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
