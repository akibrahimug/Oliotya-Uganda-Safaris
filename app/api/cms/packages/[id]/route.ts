import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { packageSchema } from "@/lib/validations/package";

/**
 * GET /api/cms/packages/[id]
 * Get a single package
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
    const packageId = parseInt(id);
    if (isNaN(packageId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 });
    }

    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Convert Decimal to number for JSON serialization
    const serializedPackage = {
      ...packageData,
      price: Number(packageData.price),
    };

    return NextResponse.json({ package: serializedPackage });
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/packages/[id]
 * Update a package
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

    const { id } = await params;
    const packageId = parseInt(id);
    if (isNaN(packageId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = packageSchema.partial().safeParse(body);
    if (!validationResult.success) {
      console.error("Package validation failed:", validationResult.error);
      return NextResponse.json(
        {
          error: "Invalid data",
          details: validationResult.error.format(),
          message: validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if package exists
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!existingPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // If slug is being updated, check for conflicts
    if (data.slug && data.slug !== existingPackage.slug) {
      const conflictingPackage = await prisma.package.findUnique({
        where: { slug: data.slug },
      });

      if (conflictingPackage) {
        return NextResponse.json(
          { error: "A package with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Validate travelers count if provided
    if (
      (data.maxTravelers || data.minTravelers) &&
      (data.maxTravelers || existingPackage.maxTravelers) <
        (data.minTravelers || existingPackage.minTravelers)
    ) {
      return NextResponse.json(
        { error: "Maximum travelers must be greater than minimum travelers" },
        { status: 400 }
      );
    }

    // Update package
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDesc !== undefined) updateData.shortDesc = data.shortDesc;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.highlights !== undefined) updateData.highlights = data.highlights;
    if (data.itinerary !== undefined) updateData.itinerary = data.itinerary;
    if (data.included !== undefined) updateData.included = data.included;
    if (data.excluded !== undefined) updateData.excluded = data.excluded;
    if (data.minTravelers !== undefined) updateData.minTravelers = data.minTravelers;
    if (data.maxTravelers !== undefined) updateData.maxTravelers = data.maxTravelers;
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.popular !== undefined) updateData.popular = data.popular;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;

    const packageData = await prisma.package.update({
      where: { id: packageId },
      data: updateData,
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "UPDATE",
        entityType: "package",
        entityId: packageId.toString(),
        userId,
        userName: "Admin User",
      },
    });

    // Convert Decimal to number for JSON serialization
    const serializedPackage = {
      ...packageData,
      price: Number(packageData.price),
    };

    return NextResponse.json({ package: serializedPackage });
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/packages/[id]
 * Delete a package
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

    const { id } = await params;
    const packageId = parseInt(id);
    if (isNaN(packageId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 });
    }

    // Check if package exists
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Delete package
    await prisma.package.delete({
      where: { id: packageId },
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "DELETE",
        entityType: "package",
        entityId: packageId.toString(),
        userId,
        userName: "Admin User",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}
