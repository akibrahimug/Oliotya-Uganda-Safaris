import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * GET /api/cms/destinations-cta
 * Get the destinations CTA section content
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    let section;

    if (mode === "cms" && userId) {
      section = await prisma.destinationsCTA.findFirst({
        orderBy: { updatedAt: "desc" },
      });
    } else {
      section = await prisma.destinationsCTA.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      });
    }

    if (!section) {
      return NextResponse.json(
        { error: "Destinations CTA section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Error fetching destinations CTA section:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations CTA section" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/destinations-cta
 * Update the destinations CTA section content
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, buttonText, buttonLink, publish } = body;

    const existing = await prisma.destinationsCTA.findFirst();

    if (!existing) {
      return NextResponse.json(
        { error: "Destinations CTA section not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      title,
      description,
      buttonText,
      buttonLink,
    };

    if (publish) {
      updateData.status = "PUBLISHED";
      updateData.publishedAt = new Date();
    } else {
      updateData.status = "DRAFT";
    }

    const updated = await prisma.destinationsCTA.update({
      where: { id: existing.id },
      data: updateData,
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: publish ? "PUBLISH" : "UPDATE",
        entityType: "destinations_cta",
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
    console.error("Error updating destinations CTA section:", error);
    return NextResponse.json(
      { error: "Failed to update destinations CTA section" },
      { status: 500 }
    );
  }
}
