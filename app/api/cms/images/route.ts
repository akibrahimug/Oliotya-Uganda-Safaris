import { NextRequest, NextResponse } from "next/server";
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
          error: `Unsupported file type. Supported formats: JPEG, PNG, WebP, AVIF`,
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

    // Process image with sharp
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Convert to WebP for optimization
    const optimizedBuffer = await image
      .webp({ quality: 85 })
      .toBuffer();

    // Generate filename
    const timestamp = Date.now();
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[^a-z0-9]/gi, "-") // Replace special chars
      .toLowerCase();
    const fileName = `${sanitizedName}-${timestamp}.webp`;

    // Upload to R2
    const imageUrl = await uploadToR2({
      file: optimizedBuffer,
      fileName,
      contentType: "image/webp",
      folder: "cms-images",
    });

    // Save to database
    const cmsImage = await prisma.cMSImage.create({
      data: {
        filename: fileName,
        url: imageUrl,
        altText: altText || null,
        category: category || null,
        width: metadata.width || 0,
        height: metadata.height || 0,
        fileSize: optimizedBuffer.length,
        format: "webp",
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
