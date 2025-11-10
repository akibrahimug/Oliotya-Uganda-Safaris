import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/hero-slides - Public endpoint for active hero slides
export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: {
        active: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        image: true,
        displayOrder: true,
      },
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch slides" },
      { status: 500 }
    );
  }
}
