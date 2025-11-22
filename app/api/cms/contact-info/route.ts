import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// GET - Fetch contact info section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    const where = mode === "cms" ? {} : { status: "PUBLISHED" as const };

    const section = await prisma.contactInfo.findFirst({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Error fetching contact info section:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact info section" },
      { status: 500 }
    );
  }
}

// PATCH - Update contact info section
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, phone, whatsapp, office, businessHours, quickResponse, publish } = body;

    const existing = await prisma.contactInfo.findFirst();

    if (!existing) {
      // Create if doesn't exist
      const section = await prisma.contactInfo.create({
        data: {
          email,
          phone,
          whatsapp,
          office,
          businessHours,
          quickResponse,
          status: publish ? "PUBLISHED" : "DRAFT",
          publishedAt: publish ? new Date() : null,
        },
      });

      await prisma.cMSAuditLog.create({
        data: {
          action: publish ? "PUBLISH" : "CREATE",
          entityType: "contact_info",
          entityId: section.id,
          userId,
          userName: "Admin User",
        },
      });

      if (publish) {
        revalidatePath("/contact");
        if (process.env.VERCEL_DEPLOY_HOOK_URL) {
          fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: "POST" })
            .catch(err => console.error("Failed to trigger deployment:", err));
        }
      }

      return NextResponse.json({ section, published: publish });
    }

    const updateData: any = {
      email,
      phone,
      whatsapp,
      office,
      businessHours,
      quickResponse,
    };

    if (publish) {
      updateData.status = "PUBLISHED";
      updateData.publishedAt = new Date();
    } else {
      updateData.status = "DRAFT";
    }

    const updated = await prisma.contactInfo.update({
      where: { id: existing.id },
      data: updateData,
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: publish ? "PUBLISH" : "UPDATE",
        entityType: "contact_info",
        entityId: updated.id,
        userId,
        userName: "Admin User",
      },
    });

    if (publish) {
      revalidatePath("/contact");
      if (process.env.VERCEL_DEPLOY_HOOK_URL) {
        fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: "POST" })
          .catch(err => console.error("Failed to trigger deployment:", err));
      }
    }

    return NextResponse.json({ section: updated, published: publish });
  } catch (error) {
    console.error("Error updating contact info section:", error);
    return NextResponse.json(
      { error: "Failed to update contact info section" },
      { status: 500 }
    );
  }
}
