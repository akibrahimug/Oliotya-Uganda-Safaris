import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * GET /api/cms/custom-package-hero
 * Get the custom package hero section content
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    let section;

    if (mode === "cms" && userId) {
      section = await prisma.customPackageHero.findFirst({
        orderBy: { updatedAt: "desc" },
      });
    } else {
      section = await prisma.customPackageHero.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      });
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Error fetching custom package hero section:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom package hero section" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/custom-package-hero
 * Update the custom package hero section content
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { image, title, subtitle, description, publish } = body;

    const existing = await prisma.customPackageHero.findFirst();

    if (!existing) {
      const created = await prisma.customPackageHero.create({
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
          entityType: "custom_package_hero",
          entityId: created.id,
          userId,
          userName: "Admin User",
        },
      });

      if (publish) {
        revalidatePath("/build-package");
      }

      return NextResponse.json({ section: created, published: publish });
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

    const updated = await prisma.customPackageHero.update({
      where: { id: existing.id },
      data: updateData,
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: publish ? "PUBLISH" : "UPDATE",
        entityType: "custom_package_hero",
        entityId: updated.id,
        userId,
        userName: "Admin User",
      },
    });

    if (publish) {
      revalidatePath("/build-package");
    }

    return NextResponse.json({ section: updated, published: publish });
  } catch (error) {
    console.error("Error updating custom package hero section:", error);
    return NextResponse.json(
      { error: "Failed to update custom package hero section" },
      { status: 500 }
    );
  }
}
