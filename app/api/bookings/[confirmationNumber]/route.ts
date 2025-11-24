import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/bookings/[confirmationNumber]
 * Get booking by confirmation number
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ confirmationNumber: string }> }
) {
  try {
    const { confirmationNumber } = await params;

    const booking = await prisma.booking.findUnique({
      where: { confirmationNumber },
      include: {
        package: {
          select: {
            name: true,
            duration: true,
            category: true,
            image: true,
          },
        },
        destination: {
          select: {
            name: true,
            duration: true,
            category: true,
            image: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/bookings/[confirmationNumber]
 * Update booking (e.g., add payment reference)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ confirmationNumber: string }> }
) {
  try {
    const { confirmationNumber } = await params;
    const body = await request.json();

    // Only allow updating payment reference for now
    const { paymentReference, paymentMethod } = body;

    if (!paymentReference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.update({
      where: { confirmationNumber },
      data: {
        paymentReference,
        paymentMethod: paymentMethod || "Bank Transfer",
      },
    });

    // TODO: Send payment confirmation email to admin

    return NextResponse.json({
      success: true,
      booking,
      message: "Payment reference updated successfully",
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
