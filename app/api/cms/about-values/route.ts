import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const values = await prisma.aboutValue.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ values });
  } catch (error) {
    console.error("Error fetching values:", error);
    return NextResponse.json(
      { error: "Failed to fetch values" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const value = await prisma.aboutValue.create({
      data: body,
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: "CREATE",
        entityType: "about_value",
        entityId: value.id,
        userId,
        userName: "Admin User",
      },
    });

    revalidatePath("/about");

    return NextResponse.json({ value });
  } catch (error) {
    console.error("Error creating value:", error);
    return NextResponse.json(
      { error: "Failed to create value" },
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
    const { id, ...updateData } = body;

    const value = await prisma.aboutValue.update({
      where: { id },
      data: updateData,
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: "UPDATE",
        entityType: "about_value",
        entityId: value.id,
        userId,
        userName: "Admin User",
      },
    });

    revalidatePath("/about");

    return NextResponse.json({ value });
  } catch (error) {
    console.error("Error updating value:", error);
    return NextResponse.json(
      { error: "Failed to update value" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.aboutValue.delete({
      where: { id },
    });

    await prisma.cMSAuditLog.create({
      data: {
        action: "DELETE",
        entityType: "about_value",
        entityId: id,
        userId,
        userName: "Admin User",
      },
    });

    revalidatePath("/about");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting value:", error);
    return NextResponse.json(
      { error: "Failed to delete value" },
      { status: 500 }
    );
  }
}
