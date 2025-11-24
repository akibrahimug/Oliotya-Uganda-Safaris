import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/cms/destinations/[id]
 * Get a single destination
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const destination = await prisma.destination.findUnique({
      where: { id: parseInt(id) },
    });

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    // Convert Decimal to number for JSON serialization
    const serializedDestination = {
      ...destination,
      price: Number(destination.price),
    };

    return NextResponse.json({ destination: serializedDestination });
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/destinations/[id]
 * Update a destination
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id: paramId } = await params;
    const id = parseInt(paramId);

    // Check if destination exists
    const existing = await prisma.destination.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    // Update destination
    const destination = await prisma.destination.update({
      where: { id },
      data: body,
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "UPDATE",
        entityType: "destination",
        entityId: destination.id.toString(),
        userId,
        userName: "Admin User",
      },
    });

    // Convert Decimal to number for JSON serialization
    const serializedDestination = {
      ...destination,
      price: Number(destination.price),
    };

    return NextResponse.json({ destination: serializedDestination });
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json(
      { error: "Failed to update destination" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/destinations/[id]
 * Delete a destination
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: paramId } = await params;
    const id = parseInt(paramId);

    // Check if destination exists
    const existing = await prisma.destination.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    // Delete destination
    await prisma.destination.delete({
      where: { id },
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "DELETE",
        entityType: "destination",
        entityId: id.toString(),
        userId,
        userName: "Admin User",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 }
    );
  }
}
