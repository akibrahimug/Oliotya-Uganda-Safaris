import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * GET /api/cms/destinations-hero
 * Get the destinations hero section content
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    let section;

    if (mode === "cms" && userId) {
      section = await prisma.destinationsHero.findFirst({
        orderBy: { updatedAt: "desc" },
      });
    } else {
      section = await prisma.destinationsHero.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      });
    }

    if (!section) {
      return NextResponse.json(
        { error: "Destinations hero section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Error fetching destinations hero section:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations hero section" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/destinations-hero
 * Update the destinations hero section content
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { image, title, subtitle, description, publish } = body;

    const existing = await prisma.destinationsHero.findFirst();

    if (!existing) {
      return NextResponse.json(
        { error: "Destinations hero section not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      image,
      title,
      subtitle,
      description,
    };

    if (publish) {
      updateData.status = "PUBLISHED";
      updateData.publishedAt = new Date();
    } else {
      updateData.status = "DRAFT";
    }

    const updated = await prisma.destinationsHero.update({
      where: { id: existing.id },
      data: updateData,
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: publish ? "PUBLISH" : "UPDATE",
        entityType: "destinations_hero",
        entityId: updated.id,
        userId,
        userName: "Admin User",
      },
    });

    if (publish) {
      revalidatePath("/destinations");
    }

    return NextResponse.json({ section: updated, published: publish });
  } catch (error) {
    console.error("Error updating destinations hero section:", error);
    return NextResponse.json(
      { error: "Failed to update destinations hero section" },
      { status: 500 }
    );
  }
}
