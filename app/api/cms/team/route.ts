import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// GET - Fetch all team members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    // For CMS mode, show all including inactive
    // For public mode, show only active members
    const where = mode === "cms" ? {} : { active: true };

    const teamMembers = await prisma.teamMember.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ teamMembers });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// POST - Create new team member
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, role, bio, image, years, specialties, displayOrder, active } = body;

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        bio,
        image,
        years,
        specialties: specialties || [],
        displayOrder: displayOrder ?? 0,
        active: active ?? true,
      },
    });

    // Create audit log
    await prisma.cMSAuditLog.create({
      data: {
        action: "CREATE",
        entityType: "team_member",
        entityId: teamMember.id,
        userId,
        userName: "Admin User",
      },
    });

    return NextResponse.json({ teamMember });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}

// PATCH - Update team member
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, role, bio, image, years, specialties, displayOrder, active } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (bio !== undefined) updateData.bio = bio;
    if (image !== undefined) updateData.image = image;
    if (years !== undefined) updateData.years = years;
    if (specialties !== undefined) updateData.specialties = specialties;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (active !== undefined) updateData.active = active;

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: updateData,
    });

    // Create audit log
    await prisma.cMSAuditLog.create({
      data: {
        action: "UPDATE",
        entityType: "team_member",
        entityId: teamMember.id,
        userId,
        userName: "Admin User",
      },
    });

    return NextResponse.json({ teamMember });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

// DELETE - Delete team member
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

    await prisma.teamMember.delete({
      where: { id },
    });

    // Create audit log
    await prisma.cMSAuditLog.create({
      data: {
        action: "DELETE",
        entityType: "team_member",
        entityId: id,
        userId,
        userName: "Admin User",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
