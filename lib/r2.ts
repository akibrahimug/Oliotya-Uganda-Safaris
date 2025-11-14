import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Cloudflare R2 configuration
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

export interface UploadImageOptions {
  file: Buffer;
  fileName: string;
  contentType: string;
  folder?: string;
}

/**
 * Upload an image to Cloudflare R2
 */
export async function uploadToR2({
  file,
  fileName,
  contentType,
  folder = "images",
}: UploadImageOptions): Promise<string> {
  // Use the bucket name as prefix to match the migration script structure
  const key = folder ? `${BUCKET_NAME}/${folder}/${fileName}` : `${BUCKET_NAME}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable", // Cache for 1 year
  });

  await r2Client.send(command);

  return `${PUBLIC_URL}/${key}`;
}

/**
 * Delete an image from Cloudflare R2
 */
export async function deleteFromR2(fileUrl: string): Promise<void> {
  // Extract the key from the full URL
  const key = fileUrl.replace(`${PUBLIC_URL}/`, "");

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Get the public URL for an R2 object
 */
export function getR2PublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}
