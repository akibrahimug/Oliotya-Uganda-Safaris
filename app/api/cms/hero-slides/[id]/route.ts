import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { heroSlideSchema } from "@/lib/validations/hero-slide";

/**
 * GET /api/cms/hero-slides/[id]
 * Get a single hero slide
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

    const slide = await prisma.heroSlide.findUnique({
      where: { id: params.id },
    });

    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({ slide });
  } catch (error) {
    console.error("Error fetching hero slide:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero slide" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/hero-slides/[id]
 * Update a hero slide
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
    const validationResult = heroSlideSchema.partial().safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error },
        { status: 400 }
      );
    }

    // Check if slide exists
    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id: params.id },
    });

    if (!existingSlide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    // Update slide
    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
      data: validationResult.data,
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "UPDATE",
        entityType: "hero_slide",
        entityId: params.id,
        userId,
        userName: "Admin User",
      },
    });

    return NextResponse.json({ slide });
  } catch (error) {
    console.error("Error updating hero slide:", error);
    return NextResponse.json(
      { error: "Failed to update hero slide" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/hero-slides/[id]
 * Delete a hero slide
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

    // Check if slide exists
    const slide = await prisma.heroSlide.findUnique({
      where: { id: params.id },
    });

    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    // Delete slide
    await prisma.heroSlide.delete({
      where: { id: params.id },
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "DELETE",
        entityType: "hero_slide",
        entityId: params.id,
        userId,
        userName: "Admin User",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Slide deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    return NextResponse.json(
      { error: "Failed to delete hero slide" },
      { status: 500 }
    );
  }
}
