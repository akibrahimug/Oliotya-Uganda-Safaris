import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { triggerVercelDeployAsync } from "@/lib/vercel-deploy";

// GET - Fetch all FAQs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    const where = mode === "cms" ? {} : { active: true };

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST - Create new FAQ
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { question, answer, category, displayOrder, active } = body;

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: category || null,
        displayOrder: displayOrder || 0,
        active: active !== undefined ? active : true,
      },
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: "CREATE",
        entityType: "faq",
        entityId: faq.id,
        userId,
        userName: "Admin User",
      },
    });

    revalidatePath("/contact");
    triggerVercelDeployAsync();

    return NextResponse.json({ faq });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}

// PATCH - Update FAQ
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, question, answer, category, displayOrder, active } = body;

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        question,
        answer,
        category,
        displayOrder,
        active,
      },
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: "UPDATE",
        entityType: "faq",
        entityId: faq.id,
        userId,
        userName: "Admin User",
      },
    });

    revalidatePath("/contact");
    triggerVercelDeployAsync();

    return NextResponse.json({ faq });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

// DELETE - Delete FAQ
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
        { error: "FAQ ID is required" },
        { status: 400 }
      );
    }

    await prisma.fAQ.delete({
      where: { id },
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: "DELETE",
        entityType: "faq",
        entityId: id,
        userId,
        userName: "Admin User",
      },
    });

    revalidatePath("/contact");
    triggerVercelDeployAsync();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
