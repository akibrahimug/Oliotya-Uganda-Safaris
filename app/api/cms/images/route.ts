import { NextRequest, NextResponse } from "next/server";

// Ensure Node runtime, not edge
export const runtime = "nodejs";

// Avoid static optimization
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { uploadToR2 } from "@/lib/r2";
import {
  imageUploadSchema,
  SUPPORTED_IMAGE_FORMATS,
  MAX_IMAGE_SIZE,
} from "@/lib/validations/image";
import sharp from "sharp";

/**
 * GET /api/cms/images
 * List all images with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: "insensitive" } },
        { altText: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch images with pagination
    const [images, total] = await Promise.all([
      prisma.cMSImage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.cMSImage.count({ where }),
    ]);

    return NextResponse.json({
      images,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cms/images
 * Upload a new image to R2 and save metadata to database
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const altText = formData.get("altText") as string | null;
    const category = formData.get("category") as string | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported file type. Supported formats: JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF, SVG`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds 10MB limit` },
        { status: 400 }
      );
    }

    // Validate metadata
    const validationResult = imageUploadSchema.safeParse({
      altText: altText || undefined,
      category: category || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid metadata", details: validationResult.error },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let finalBuffer: Buffer;
    let finalFormat: string;
    let finalFileName: string;
    let finalContentType: string;
    let width: number = 0;
    let height: number = 0;

    // Check if file is SVG - don't process, just upload as-is
    if (file.type === "image/svg+xml") {
      finalBuffer = buffer;
      finalFormat = "svg";
      const timestamp = Date.now();
      const sanitizedName = file.name
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/[^a-z0-9]/gi, "-") // Replace special chars
        .toLowerCase();
      finalFileName = `${sanitizedName}-${timestamp}.svg`;
      finalContentType = "image/svg+xml";

      // SVG dimensions are often not relevant, set to 0
      width = 0;
      height = 0;

      console.log(`SVG uploaded: ${file.name}`);
      console.log(`  Size: ${(buffer.length / 1024).toFixed(1)} KB`);
    } else if (file.type === "image/webp" && file.name.endsWith(".webp")) {
      // File is already WebP (pre-compressed on client), skip re-processing
      const image = sharp(buffer);
      const metadata = await image.metadata();

      // Check if already reasonably sized (max 3840px)
      const maxDimension = 3840;
      const needsResize = (metadata.width && metadata.width > maxDimension) ||
                          (metadata.height && metadata.height > maxDimension);

      if (needsResize) {
        // Only resize if still too large
        const resizedBuffer = await image
          .resize(maxDimension, maxDimension, {
            withoutEnlargement: true,
            fit: 'inside',
          })
          .webp({ quality: 85, effort: 3 }) // Lower effort since already compressed
          .toBuffer();

        finalBuffer = resizedBuffer;
        const resizedMetadata = await sharp(resizedBuffer).metadata();
        width = resizedMetadata.width || 0;
        height = resizedMetadata.height || 0;

        console.log(`Pre-compressed WebP resized: ${file.name}`);
        console.log(`  Original: ${(buffer.length / 1024).toFixed(1)} KB (${metadata.width}x${metadata.height})`);
        console.log(`  Resized: ${(resizedBuffer.length / 1024).toFixed(1)} KB (${width}x${height})`);
      } else {
        // Already optimal, use as-is
        finalBuffer = buffer;
        width = metadata.width || 0;
        height = metadata.height || 0;

        console.log(`Pre-compressed WebP uploaded as-is: ${file.name}`);
        console.log(`  Size: ${(buffer.length / 1024).toFixed(1)} KB (${width}x${height})`);
      }

      finalFormat = "webp";
      const timestamp = Date.now();
      const sanitizedName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase();
      finalFileName = `${sanitizedName}-${timestamp}.webp`;
      finalContentType = "image/webp";
    } else {
      // Process raster images with sharp
      const image = sharp(buffer);
      const metadata = await image.metadata();

      // Intelligent image optimization
      let processedImage = image;

      // Resize if image is too large (max 3840px width for 4K displays)
      const maxWidth = 3840;
      const maxHeight = 3840;

      if (metadata.width && metadata.width > maxWidth) {
        processedImage = processedImage.resize(maxWidth, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      } else if (metadata.height && metadata.height > maxHeight) {
        processedImage = processedImage.resize(null, maxHeight, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      }

      // Convert to WebP with optimized quality settings
      // effort 6 provides best compression (0-6, where 6 is slowest but best)
      const optimizedBuffer = await processedImage
        .webp({
          quality: 85,           // Good quality with better compression (80-90 recommended)
          effort: 6,             // Maximum compression effort
          smartSubsample: true   // Better color quality
        })
        .toBuffer();

      // Get updated metadata after processing
      const processedMetadata = await sharp(optimizedBuffer).metadata();

      // Generate filename
      const timestamp = Date.now();
      const sanitizedName = file.name
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/[^a-z0-9]/gi, "-") // Replace special chars
        .toLowerCase();

      finalBuffer = optimizedBuffer;
      finalFormat = "webp";
      finalFileName = `${sanitizedName}-${timestamp}.webp`;
      finalContentType = "image/webp";
      width = processedMetadata.width || metadata.width || 0;
      height = processedMetadata.height || metadata.height || 0;

      // Calculate compression ratio
      const originalSize = buffer.length;
      const optimizedSize = optimizedBuffer.length;
      const compressionRatio = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

      console.log(`Image optimized: ${file.name}`);
      console.log(`  Original: ${(originalSize / 1024).toFixed(1)} KB`);
      console.log(`  Optimized: ${(optimizedSize / 1024).toFixed(1)} KB`);
      console.log(`  Saved: ${compressionRatio}%`);
    }

    // Upload to R2
    const imageUrl = await uploadToR2({
      file: finalBuffer,
      fileName: finalFileName,
      contentType: finalContentType,
      folder: "cms-images",
    });

    // Save to database
    const cmsImage = await prisma.cMSImage.create({
      data: {
        filename: finalFileName,
        url: imageUrl,
        altText: altText || null,
        category: category || null,
        width,
        height,
        fileSize: finalBuffer.length,
        format: finalFormat,
      },
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "CREATE",
        entityType: "image",
        entityId: cmsImage.id,
        userId,
        userName: "Admin User", // TODO: Get from Clerk user
      },
    });

    return NextResponse.json(
      {
        success: true,
        image: cmsImage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
