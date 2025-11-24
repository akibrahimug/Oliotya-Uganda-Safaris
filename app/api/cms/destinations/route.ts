import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/cms/destinations
 * Get all destinations with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: any = {};
    if (category && category !== "all") {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch destinations with pagination
    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        take: limit,
        skip: offset,
      }),
      prisma.destination.count({ where }),
    ]);

    // Convert Decimal fields to numbers for JSON serialization
    const serializedDestinations = destinations.map(dest => ({
      ...dest,
      price: Number(dest.price),
    }));

    return NextResponse.json({
      destinations: serializedDestinations,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cms/destinations
 * Create a new destination
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      category,
      country,
      price,
      rating,
      duration,
      groupSize,
      minTravelers,
      maxTravelers,
      description,
      image,
      images,
    } = body;

    // Create destination
    const destination = await prisma.destination.create({
      data: {
        name,
        category,
        country: country || "Uganda",
        price,
        rating: rating || 5,
        duration,
        groupSize,
        minTravelers: minTravelers || null,
        maxTravelers: maxTravelers || null,
        description,
        image,
        images: images || [],
      },
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "CREATE",
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

    return NextResponse.json({ destination: serializedDestination }, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}
