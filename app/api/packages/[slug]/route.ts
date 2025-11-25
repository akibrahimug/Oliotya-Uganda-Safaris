import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const pkg = await prisma.package.findUnique({
      where: { slug },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    // Convert Decimal to number for JSON serialization
    const serializedPackage = {
      ...pkg,
      price: Number(pkg.price),
    };

    // Return the package data
    return NextResponse.json({ package: serializedPackage });
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}
