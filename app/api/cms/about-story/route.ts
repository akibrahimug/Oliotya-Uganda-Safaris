import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * GET /api/cms/about-story
 * Get the about story section content
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    let section;

    if (mode === "cms" && userId) {
      section = await prisma.aboutStorySection.findFirst({
        orderBy: { updatedAt: "desc" },
      });
    } else {
      section = await prisma.aboutStorySection.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      });
    }

    if (!section) {
      return NextResponse.json(
        { error: "About story section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Error fetching about story section:", error);
    return NextResponse.json(
      { error: "Failed to fetch about story section" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/about-story
 * Update the about story section content
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
      titleHighlight,
      paragraph1,
      paragraph2,
      buttonText,
      buttonLink,
      image,
      publish,
    } = body;

    const existing = await prisma.aboutStorySection.findFirst();

    if (!existing) {
      return NextResponse.json(
        { error: "About story section not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      heading,
      title,
      titleHighlight,
      paragraph1,
      paragraph2,
      buttonText,
      buttonLink,
      image,
    };

    if (publish) {
      updateData.status = "PUBLISHED";
      updateData.publishedAt = new Date();
    } else {
      updateData.status = "DRAFT";
    }

    const updated = await prisma.aboutStorySection.update({
      where: { id: existing.id },
      data: updateData,
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: publish ? "PUBLISH" : "UPDATE",
        entityType: "about_story_section",
        entityId: updated.id,
        userId,
        userName: "Admin User",
      },
    });

    // Revalidate cache and trigger Vercel deployment if published
    if (publish) {
      revalidatePath("/about");

      if (process.env.VERCEL_DEPLOY_HOOK_URL) {
        fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
          method: "POST",
        }).then(() => {
          console.log("Vercel deployment triggered successfully");
        }).catch(err => {
          console.error("Failed to trigger Vercel deployment:", err);
        });
      } else {
        console.warn("VERCEL_DEPLOY_HOOK_URL not configured");
      }
    }

    return NextResponse.json({ section: updated, published: publish });
  } catch (error) {
    console.error("Error updating about story section:", error);
    return NextResponse.json(
      { error: "Failed to update about story section" },
      { status: 500 }
    );
  }
}
