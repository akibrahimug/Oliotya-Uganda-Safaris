import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/packages
 * Public endpoint to get all active packages
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const popular = searchParams.get("popular");

    // Build where clause - only return active packages for public
    const where: any = { active: true };

    if (category && category !== "all") {
      where.category = category;
    }
    if (featured === "true") {
      where.featured = true;
    }
    if (popular === "true") {
      where.popular = true;
    }

    // Fetch packages
    const packages = await prisma.package.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    // Convert Decimal fields to numbers for JSON serialization
    const serializedPackages = packages.map(pkg => ({
      ...pkg,
      price: Number(pkg.price),
    }));

    return NextResponse.json({ packages: serializedPackages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}
