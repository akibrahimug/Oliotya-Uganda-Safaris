import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { deleteFromR2 } from "@/lib/r2";
import { imageUpdateSchema } from "@/lib/validations/image";

/**
 * GET /api/cms/images/[id]
 * Get a single image by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const image = await prisma.cMSImage.findUnique({
      where: { id: params.id },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ image });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/images/[id]
 * Update image metadata
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = imageUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error },
        { status: 400 }
      );
    }

    // Check if image exists
    const existingImage = await prisma.cMSImage.findUnique({
      where: { id: params.id },
    });

    if (!existingImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Update image
    const updatedImage = await prisma.cMSImage.update({
      where: { id: params.id },
      data: {
        altText: validationResult.data.altText,
        category: validationResult.data.category,
      },
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "UPDATE",
        entityType: "image",
        entityId: params.id,
        userId,
        userName: "Admin User", // TODO: Get from Clerk user
      },
    });

    return NextResponse.json({ image: updatedImage });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/images/[id]
 * Delete an image from R2 and database
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if image exists
    const image = await prisma.cMSImage.findUnique({
      where: { id: params.id },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete from R2
    try {
      await deleteFromR2(image.url);
    } catch (error) {
      console.error("Error deleting from R2:", error);
      // Continue with database deletion even if R2 deletion fails
    }

    // Delete from database
    await prisma.cMSImage.delete({
      where: { id: params.id },
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "DELETE",
        entityType: "image",
        entityId: params.id,
        userId,
        userName: "Admin User", // TODO: Get from Clerk user
      },
    });

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
