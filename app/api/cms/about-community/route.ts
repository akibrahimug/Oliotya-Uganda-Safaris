import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { triggerVercelDeployAsync } from "@/lib/vercel-deploy";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    let section;

    if (mode === "cms" && userId) {
      section = await prisma.aboutCommunitySection.findFirst({
        orderBy: { updatedAt: "desc" },
      });
    } else {
      section = await prisma.aboutCommunitySection.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      });
    }

    if (!section) {
      return NextResponse.json(
        { error: "Community section not found" },
        { status: 404 }
      );
    }

    // Read image via raw SQL so this works even if a stale Prisma client
    // doesn't include the `image` field in the generated model metadata.
    try {
      const imageRows = await prisma.$queryRaw<Array<{ image: string | null }>>`
        SELECT "image"
        FROM "about_community_section"
        WHERE "id" = ${section.id}
        LIMIT 1
      `;
      if (imageRows.length > 0) {
        (section as any).image = imageRows[0].image;
      }
    } catch (imageError) {
      console.warn("Could not load community image via raw query:", imageError);
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Error fetching community section:", error);
    return NextResponse.json(
      { error: "Failed to fetch community section" },
      { status: 500 }
    );
  }
}

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
      feature1Title,
      feature1Description,
      feature2Title,
      feature2Description,
      feature3Title,
      feature3Description,
      publish,
    } = body;
    const existing = await prisma.aboutCommunitySection.findFirst();

    if (!existing) {
      return NextResponse.json(
        { error: "Community section not found" },
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
      feature1Title,
      feature1Description,
      feature2Title,
      feature2Description,
      feature3Title,
      feature3Description,
    };

    if (publish) {
      updateData.status = "PUBLISHED";
      updateData.publishedAt = new Date();
    } else {
      updateData.status = "DRAFT";
    }

    const updated = await prisma.aboutCommunitySection.update({
      where: { id: existing.id },
      data: updateData,
    });

    // Persist image with raw SQL to handle environments where Prisma client
    // metadata is stale and doesn't expose `image` on this model yet.
    if (image !== undefined) {
      await prisma.$executeRaw`
        UPDATE "about_community_section"
        SET "image" = ${image}
        WHERE "id" = ${updated.id}
      `;
      (updated as any).image = image;
    }

    await prisma.cMSAuditLog.create({
      data: {
        action: publish ? "PUBLISH" : "UPDATE",
        entityType: "about_community_section",
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
  } catch (error: any) {
    console.error("Error updating community section:", error);

    if (
      error?.code === "P2022" &&
      typeof error?.meta?.column === "string" &&
      error.meta.column.includes("about_community_section.image")
    ) {
      return NextResponse.json(
        {
          error:
            "Database is missing about_community_section.image. Run Prisma migrations, then retry.",
          code: "MIGRATION_REQUIRED",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update community section" },
      { status: 500 }
    );
  }
}
