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
      section = await prisma.aboutStats.findFirst({
        orderBy: { updatedAt: "desc" },
      });
    } else {
      section = await prisma.aboutStats.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      });
    }

    if (!section) {
      return NextResponse.json({ error: "Stats not found" }, { status: 404 });
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
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
    const existing = await prisma.aboutStats.findFirst();

    if (!existing) {
      return NextResponse.json({ error: "Stats not found" }, { status: 404 });
    }

    const updateData: any = { ...body };
    delete updateData.publish;
    delete updateData.id;

    if (body.publish) {
      updateData.status = "PUBLISHED";
      updateData.publishedAt = new Date();
    } else {
      updateData.status = "DRAFT";
    }

    const updated = await prisma.aboutStats.update({
      where: { id: existing.id },
      data: updateData,
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: body.publish ? "PUBLISH" : "UPDATE",
        entityType: "about_stats",
        entityId: updated.id,
        userId,
        userName: "Admin User",
      },
    });

    if (body.publish) {
      revalidatePath("/about");
      triggerVercelDeployAsync();
    }

    return NextResponse.json({ section: updated, published: body.publish });
  } catch (error) {
    console.error("Error updating stats:", error);
    return NextResponse.json(
      { error: "Failed to update stats" },
      { status: 500 }
    );
  }
}
