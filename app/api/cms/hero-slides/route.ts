import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { heroSlideSchema } from "@/lib/validations/hero-slide";

/**
 * GET /api/cms/hero-slides
 * Get all hero slides
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slides = await prisma.heroSlide.findMany({
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ slides });
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero slides" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cms/hero-slides
 * Create a new hero slide
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = heroSlideSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Get the next display order if not provided
    let displayOrder = data.displayOrder;
    if (displayOrder === undefined) {
      const lastSlide = await prisma.heroSlide.findFirst({
        orderBy: { displayOrder: "desc" },
      });
      displayOrder = (lastSlide?.displayOrder ?? -1) + 1;
    }

    // Create slide
    const slide = await prisma.heroSlide.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        image: data.image,
        displayOrder,
        active: data.active ?? true,
      },
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "CREATE",
        entityType: "hero_slide",
        entityId: slide.id,
        userId,
        userName: "Admin User",
      },
    });

    return NextResponse.json({ slide }, { status: 201 });
  } catch (error) {
    console.error("Error creating hero slide:", error);
    return NextResponse.json(
      { error: "Failed to create hero slide" },
      { status: 500 }
    );
  }
}
