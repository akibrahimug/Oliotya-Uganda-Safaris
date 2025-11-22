import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * GET /api/cms/video-section
 * Get the video section content
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    let section;

    if (mode === "cms" && userId) {
      section = await prisma.videoSection.findFirst({
        orderBy: { updatedAt: "desc" },
      });
    } else {
      section = await prisma.videoSection.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      });
    }

    if (!section) {
      return NextResponse.json(
        { error: "Video section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Error fetching video section:", error);
    return NextResponse.json(
      { error: "Failed to fetch video section" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/video-section
 * Update the video section content
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, videoUrl, thumbnailUrl, publish } = body;

    const existing = await prisma.videoSection.findFirst();

    if (!existing) {
      return NextResponse.json(
        { error: "Video section not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      title,
      description,
      videoUrl,
      thumbnailUrl,
    };

    if (publish) {
      updateData.status = "PUBLISHED";
      updateData.publishedAt = new Date();
    } else {
      updateData.status = "DRAFT";
    }

    const updated = await prisma.videoSection.update({
      where: { id: existing.id },
      data: updateData,
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: publish ? "PUBLISH" : "UPDATE",
        entityType: "video_section",
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
    console.error("Error updating video section:", error);
    return NextResponse.json(
      { error: "Failed to update video section" },
      { status: 500 }
    );
  }
}
