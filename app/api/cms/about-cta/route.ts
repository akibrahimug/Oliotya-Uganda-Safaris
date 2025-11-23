import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { triggerVercelDeployAsync } from "@/lib/vercel-deploy";

// GET - Fetch about CTA section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    const where = mode === "cms" ? {} : { status: "PUBLISHED" as const };

    const section = await prisma.aboutCTA.findFirst({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Error fetching about CTA section:", error);
    return NextResponse.json(
      { error: "Failed to fetch about CTA section" },
      { status: 500 }
    );
  }
}

// PATCH - Update about CTA section
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      badge,
      heading,
      headingHighlight,
      description,
      button1Text,
      button1Link,
      button2Text,
      button2Link,
      footerText,
      publish
    } = body;

    const existing = await prisma.aboutCTA.findFirst();

    if (!existing) {
      // Create if doesn't exist
      const section = await prisma.aboutCTA.create({
        data: {
          badge,
          heading,
          headingHighlight,
          description,
          button1Text,
          button1Link,
          button2Text,
          button2Link,
          footerText,
          status: publish ? "PUBLISHED" : "DRAFT",
          publishedAt: publish ? new Date() : null,
        },
      });

      await prisma.cMSAuditLog.create({
        data: {
          action: publish ? "PUBLISH" : "CREATE",
          entityType: "about_cta",
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
      badge,
      heading,
      headingHighlight,
      description,
      button1Text,
      button1Link,
      button2Text,
      button2Link,
      footerText,
    };

    if (publish) {
      updateData.status = "PUBLISHED";
      updateData.publishedAt = new Date();
    } else {
      updateData.status = "DRAFT";
    }

    const updated = await prisma.aboutCTA.update({
      where: { id: existing.id },
      data: updateData,
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: publish ? "PUBLISH" : "UPDATE",
        entityType: "about_cta",
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
    console.error("Error updating about CTA section:", error);
    return NextResponse.json(
      { error: "Failed to update about CTA section" },
      { status: 500 }
    );
  }
}
