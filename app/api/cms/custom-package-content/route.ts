import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * GET /api/cms/custom-package-content
 * Get the custom package content section
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    let section;

    if (mode === "cms" && userId) {
      section = await prisma.customPackageContent.findFirst({
        orderBy: { updatedAt: "desc" },
      });
    } else {
      section = await prisma.customPackageContent.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      });
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Error fetching custom package content section:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom package content section" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/custom-package-content
 * Update the custom package content section
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, subtitle, description, publish } = body;

    const existing = await prisma.customPackageContent.findFirst();

    if (!existing) {
      const created = await prisma.customPackageContent.create({
        data: {
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
          entityType: "custom_package_content",
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

    const updated = await prisma.customPackageContent.update({
      where: { id: existing.id },
      data: updateData,
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: publish ? "PUBLISH" : "UPDATE",
        entityType: "custom_package_content",
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
    console.error("Error updating custom package content section:", error);
    return NextResponse.json(
      { error: "Failed to update custom package content section" },
      { status: 500 }
    );
  }
}
