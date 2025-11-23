import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { triggerVercelDeployAsync } from "@/lib/vercel-deploy";

// GET - Fetch about hero section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    const where = mode === "cms" ? {} : { status: "PUBLISHED" as const };

    const section = await prisma.aboutHero.findFirst({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Error fetching about hero section:", error);
    return NextResponse.json(
      { error: "Failed to fetch about hero section" },
      { status: 500 }
    );
  }
}

// PATCH - Update about hero section
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { image, title, subtitle, description, publish } = body;

    const existing = await prisma.aboutHero.findFirst();

    if (!existing) {
      // Create if doesn't exist
      const section = await prisma.aboutHero.create({
        data: {
          image,
          title,
          subtitle,
          description,
          status: publish ? "PUBLISHED" : "DRAFT",
          publishedAt: publish ? new Date() : null,
        },
      });

      await prisma.cMSAuditLog.create({
        data: {
          action: publish ? "PUBLISH" : "CREATE",
          entityType: "about_hero",
          entityId: section.id,
          userId,
          userName: "Admin User",
        },
      });

      if (publish) {
        revalidatePath("/about");
        triggerVercelDeployAsync();
      }

      return NextResponse.json({ section, published: publish });
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

    const updated = await prisma.aboutHero.update({
      where: { id: existing.id },
      data: updateData,
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: publish ? "PUBLISH" : "UPDATE",
        entityType: "about_hero",
        entityId: updated.id,
        userId,
        userName: "Admin User",
      },
    });

    if (publish) {
      revalidatePath("/about");
      triggerVercelDeployAsync();
    }

    return NextResponse.json({ section: updated, published: publish });
  } catch (error) {
    console.error("Error updating about hero section:", error);
    return NextResponse.json(
      { error: "Failed to update about hero section" },
      { status: 500 }
    );
  }
}
