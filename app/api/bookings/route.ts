import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { bookingFormSchema } from "@/lib/validations/booking";
import { bookingRateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeObject } from "@/lib/validations";
import { sendEmail, ADMIN_EMAIL } from "@/lib/email";
import { render } from "@react-email/components";
import BookingNotificationEmail from "@/emails/booking-notification";
import BookingConfirmationEmail from "@/emails/booking-confirmation";

export const dynamic = "force-dynamic";

/**
 * POST /api/bookings
 * Create a new booking
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request.headers);
    const { success } = await bookingRateLimit.limit(ip);

    if (!success) {
      return NextResponse.json(
          { error: "Too many requests. Please try again in an hour." },
          { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json(
          { error: "Invalid submission" },
          { status: 400 }
      );
    }

    // Sanitize input before validation
    const sanitizedBody = sanitizeObject(body);

    // Validate input
    const validatedData = bookingFormSchema.parse(sanitizedBody);

    // Fetch package or destination to get pricing
    let pricePerPerson: number;
    let itemName: string;

    if (validatedData.bookingType === "PACKAGE" && validatedData.packageId) {
      const pkg = await prisma.package.findUnique({
        where: { id: validatedData.packageId },
        select: { price: true, name: true, active: true },
      });

      if (!pkg || !pkg.active) {
        return NextResponse.json(
            { error: "Package not found or not available" },
            { status: 404 }
        );
      }

      pricePerPerson = Number(pkg.price);
      itemName = pkg.name;
    } else if (
        validatedData.bookingType === "DESTINATION" &&
        validatedData.destinationId
    ) {
      const destination = await prisma.destination.findUnique({
        where: { id: validatedData.destinationId },
        select: { price: true, name: true },
      });

      if (!destination) {
        return NextResponse.json(
            { error: "Destination not found" },
            { status: 404 }
        );
      }

      pricePerPerson = Number(destination.price);
      itemName = destination.name;
    } else {
      return NextResponse.json(
          { error: "Invalid booking type or missing package/destination ID" },
          { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = pricePerPerson * validatedData.numberOfTravelers;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        country: validatedData.country,
        bookingType: validatedData.bookingType,
        packageId: validatedData.packageId,
        destinationId: validatedData.destinationId,
        numberOfTravelers: validatedData.numberOfTravelers,
        specialRequests: validatedData.specialRequests,
        travelDateFrom: new Date(validatedData.travelDateFrom),
        travelDateTo: new Date(validatedData.travelDateTo),
        pricePerPerson,
        totalPrice,
        paymentMethod: validatedData.paymentMethod || "Bank Transfer",
        paymentReference: validatedData.paymentReference,
      },
      include: {
        package: {
          select: {
            name: true,
            duration: true,
            category: true,
          },
        },
        destination: {
          select: {
            name: true,
            duration: true,
            category: true,
          },
        },
      },
    });

    // Send email notifications (fire and forget)
    sendBookingEmails({
      confirmationNumber: booking.confirmationNumber,
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      phone: booking.phone,
      country: booking.country || '',
      itemName,
      bookingType: booking.bookingType,
      numberOfTravelers: booking.numberOfTravelers,
      travelDateFrom: booking.travelDateFrom,
      travelDateTo: booking.travelDateTo,
      totalPrice,
      specialRequests: booking.specialRequests,
    }).catch((error) =>
        console.error("Error sending booking emails:", error)
    );

    return NextResponse.json({
      success: true,
      booking: {
        confirmationNumber: booking.confirmationNumber,
        id: booking.id,
        totalPrice: booking.totalPrice,
        itemName,
      },
      message: "Booking created successfully",
    });
  } catch (error: any) {
    console.error("Error creating booking:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
          { error: "Validation failed", details: error.errors },
          { status: 400 }
      );
    }

    return NextResponse.json(
        { error: "Failed to create booking. Please try again." },
        { status: 500 }
    );
  }
}

// Helper function to send booking emails
async function sendBookingEmails(booking: {
  confirmationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  itemName: string;
  bookingType: string;
  numberOfTravelers: number;
  travelDateFrom: Date;
  travelDateTo: Date;
  totalPrice: number;
  specialRequests?: string | null;
}) {
  try {
    // Admin notification email
    const adminHtml = await render(
        BookingNotificationEmail({
          confirmationNumber: booking.confirmationNumber,
          firstName: booking.firstName,
          lastName: booking.lastName,
          email: booking.email,
          phone: booking.phone,
          country: booking.country,
          itemName: booking.itemName,
          bookingType: booking.bookingType,
          numberOfTravelers: booking.numberOfTravelers,
          travelDateFrom: booking.travelDateFrom.toISOString(),
          travelDateTo: booking.travelDateTo.toISOString(),
          totalPrice: Number(booking.totalPrice),
          specialRequests: booking.specialRequests || undefined,
        })
    );

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Booking: ${booking.confirmationNumber} - ${booking.itemName}`,
      html: adminHtml,
      replyTo: booking.email,
    });

    // Customer confirmation email
    const customerHtml = await render(
        BookingConfirmationEmail({
          firstName: booking.firstName,
          confirmationNumber: booking.confirmationNumber,
          itemName: booking.itemName,
          numberOfTravelers: booking.numberOfTravelers,
          travelDateFrom: booking.travelDateFrom.toISOString(),
          travelDateTo: booking.travelDateTo.toISOString(),
          totalPrice: Number(booking.totalPrice),
        })
    );

    await sendEmail({
      to: booking.email,
      subject: `Booking Confirmed - ${booking.confirmationNumber}`,
      html: customerHtml,
    });
  } catch (error) {
    console.error("Failed to send booking emails:", error);
    throw error;
  }
}
