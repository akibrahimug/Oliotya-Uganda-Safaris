import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { packageSchema } from "@/lib/validations/package";

/**
 * GET /api/cms/packages
 * Get all packages with optional filtering
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
    const featured = searchParams.get("featured");
    const active = searchParams.get("active");
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
    if (featured === "true") {
      where.featured = true;
    }
    if (active === "true") {
      where.active = true;
    } else if (active === "false") {
      where.active = false;
    }

    // Fetch packages with pagination
    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where,
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
      }),
      prisma.package.count({ where }),
    ]);

    return NextResponse.json({
      packages,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cms/packages
 * Create a new package
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = packageSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if slug already exists
    const existingPackage = await prisma.package.findUnique({
      where: { slug: data.slug },
    });

    if (existingPackage) {
      return NextResponse.json(
        { error: "A package with this slug already exists" },
        { status: 409 }
      );
    }

    // Validate travelers count
    if (data.maxTravelers < data.minTravelers) {
      return NextResponse.json(
        { error: "Maximum travelers must be greater than minimum travelers" },
        { status: 400 }
      );
    }

    // Create package
    const packageData = await prisma.package.create({
      data: {
        name: data.name,
        slug: data.slug,
        category: data.category,
        duration: data.duration,
        price: data.price,
        description: data.description,
        shortDesc: data.shortDesc || null,
        image: data.image,
        images: data.images || [],
        highlights: data.highlights || [],
        itinerary: data.itinerary as any,
        included: data.included || [],
        excluded: data.excluded || [],
        minTravelers: data.minTravelers,
        maxTravelers: data.maxTravelers,
        difficulty: data.difficulty,
        featured: data.featured ?? false,
        popular: data.popular ?? false,
        active: data.active ?? true,
        displayOrder: data.displayOrder ?? 0,
      },
    });

    // Log the action
    await prisma.cMSAuditLog.create({
      data: {
        action: "CREATE",
        entityType: "package",
        entityId: packageData.id.toString(),
        userId,
        userName: "Admin User",
      },
    });

    return NextResponse.json({ package: packageData }, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}
