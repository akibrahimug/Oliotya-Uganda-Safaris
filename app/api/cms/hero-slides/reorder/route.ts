import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { heroSlideReorderSchema } from "@/lib/validations/hero-slide";

/**
 * PATCH /api/cms/hero-slides/reorder
 * Reorder hero slides
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = heroSlideReorderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error },
        { status: 400 }
      );
    }

    // Update display orders in a transaction
    await prisma.$transaction(
      validationResult.data.slides.map((slide) =>
        prisma.heroSlide.update({
          where: { id: slide.id },
          data: { displayOrder: slide.displayOrder },
        })
      )
    );

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "UPDATE",
        entityType: "hero_slide",
        entityId: "multiple",
        userId,
        userName: "Admin User",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Slides reordered successfully",
    });
  } catch (error) {
    console.error("Error reordering hero slides:", error);
    return NextResponse.json(
      { error: "Failed to reorder hero slides" },
      { status: 500 }
    );
  }
}
