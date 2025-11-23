import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { triggerVercelDeployAsync } from "@/lib/vercel-deploy";

/**
 * GET /api/cms/experience-section
 * Get the experience section content
 */
export async function GET(request: NextRequest) {
  try {
    // Check if request is from CMS (authenticated) or public (landing page)
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode"); // "cms" or "public"

    let section;

    if (mode === "cms" && userId) {
      // CMS mode: get latest version (can be DRAFT or PUBLISHED)
      section = await prisma.experienceSection.findFirst({
        orderBy: { updatedAt: "desc" },
      });
    } else {
      // Public mode: get only PUBLISHED version
      section = await prisma.experienceSection.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      });
    }

    if (!section) {
      return NextResponse.json(
        { error: "Experience section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Error fetching experience section:", error);
    return NextResponse.json(
      { error: "Failed to fetch experience section" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/experience-section
 * Update the experience section content
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      heading,
      title,
      description,
      image,
      stat1Value,
      stat1Label,
      stat2Value,
      stat2Label,
      badgeText,
      backgroundText,
      publish, // Boolean to determine if we should publish
    } = body;

    // Get existing section
    const existing = await prisma.experienceSection.findFirst();

    if (!existing) {
      return NextResponse.json(
        { error: "Experience section not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      heading,
      title,
      description,
      image,
      stat1Value,
      stat1Label,
      stat2Value,
      stat2Label,
      badgeText,
      backgroundText,
    };

    // If publishing, set status and timestamp
    if (publish) {
      updateData.status = "PUBLISHED";
      updateData.publishedAt = new Date();
    } else {
      // Save as draft
      updateData.status = "DRAFT";
    }

    // Update section
    const updated = await prisma.experienceSection.update({
      where: { id: existing.id },
      data: updateData,
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: publish ? "PUBLISH" : "UPDATE",
        entityType: "experience_section",
        entityId: updated.id,
        userId,
        userName: "Admin User",
      },
    });

    // Revalidate cache and trigger Vercel deployment if published
    if (publish) {
      // Revalidate the home page cache
      revalidatePath("/");

      // Trigger Vercel deployment (fire and forget)
      triggerVercelDeployAsync();
    }

    return NextResponse.json({ section: updated, published: publish });
  } catch (error) {
    console.error("Error updating experience section:", error);
    return NextResponse.json(
      { error: "Failed to update experience section" },
      { status: 500 }
    );
  }
}
