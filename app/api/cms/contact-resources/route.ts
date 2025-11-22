import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// GET - Fetch all contact resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    const where = mode === "cms" ? {} : { active: true };

    const resources = await prisma.contactResource.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ resources });
  } catch (error) {
    console.error("Error fetching contact resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact resources" },
      { status: 500 }
    );
  }
}

// POST - Create new contact resource
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, icon, linkText, linkUrl, isExternal, displayOrder, active } = body;

    const resource = await prisma.contactResource.create({
      data: {
        title,
        description,
        icon,
        linkText,
        linkUrl,
        isExternal: isExternal || false,
        displayOrder: displayOrder || 0,
        active: active !== undefined ? active : true,
      },
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: "CREATE",
        entityType: "contact_resource",
        entityId: resource.id,
        userId,
        userName: "Admin User",
      },
    });

    revalidatePath("/contact");
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: "POST" })
        .catch(err => console.error("Failed to trigger deployment:", err));
    }

    return NextResponse.json({ resource });
  } catch (error) {
    console.error("Error creating contact resource:", error);
    return NextResponse.json(
      { error: "Failed to create contact resource" },
      { status: 500 }
    );
  }
}

// PATCH - Update contact resource
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, icon, linkText, linkUrl, isExternal, displayOrder, active } = body;

    const resource = await prisma.contactResource.update({
      where: { id },
      data: {
        title,
        description,
        icon,
        linkText,
        linkUrl,
        isExternal,
        displayOrder,
        active,
      },
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: "UPDATE",
        entityType: "contact_resource",
        entityId: resource.id,
        userId,
        userName: "Admin User",
      },
    });

    revalidatePath("/contact");
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: "POST" })
        .catch(err => console.error("Failed to trigger deployment:", err));
    }

    return NextResponse.json({ resource });
  } catch (error) {
    console.error("Error updating contact resource:", error);
    return NextResponse.json(
      { error: "Failed to update contact resource" },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact resource
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 }
      );
    }

    await prisma.contactResource.delete({
      where: { id },
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: "DELETE",
        entityType: "contact_resource",
        entityId: id,
        userId,
        userName: "Admin User",
      },
    });

    revalidatePath("/contact");
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: "POST" })
        .catch(err => console.error("Failed to trigger deployment:", err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact resource:", error);
    return NextResponse.json(
      { error: "Failed to delete contact resource" },
      { status: 500 }
    );
  }
}
