import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { customPackageSchema } from "@/lib/validations/custom-package";
import {
  handleAPIError,
  createSuccessResponse,
  APIError,
} from "@/lib/api-errors";
import { customPackageRateLimit } from "@/lib/rate-limit";
import { sendEmail, ADMIN_EMAIL } from "@/lib/email";
import { render } from "@react-email/components";
import CustomPackageNotificationEmail from "@/emails/custom-package-notification";
import CustomPackageConfirmationEmail from "@/emails/custom-package-confirmation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    console.log("Custom package API called");

    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      console.log("No user ID found - unauthorized");
      throw new APIError(401, "Unauthorized", "AUTH_REQUIRED");
    }

    // Ensure user exists in database (create if missing)
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        console.log(`User ${userId} not found in database, creating...`);
        // Create user record (we'll update with full details from webhook later)
        await prisma.user.create({
          data: {
            id: userId,
            email: "temp@example.com", // Will be updated by webhook
          },
        });
        console.log(`✅ User ${userId} created in database`);
      }
    } catch (userError) {
      console.error("Error ensuring user exists:", userError);
      // Continue anyway - the user creation might succeed
    }

    // Rate limiting
    const { success } = await customPackageRateLimit.limit(userId);
    if (!success) {
      console.log("Rate limit exceeded");
      throw new APIError(
        429,
        "Too many custom package requests. Please try again in an hour.",
        "RATE_LIMIT_EXCEEDED"
      );
    }

    // Parse request body
    const body = await req.json();
    console.log("Received body:", body);

    // Honeypot check
    if (body.website) {
      throw new APIError(400, "Invalid submission", "INVALID_SUBMISSION");
    }

    // Validate data with Zod (provides sanitization through trimming and regex validation)
    console.log("Validating data...");
    const validatedData = customPackageSchema.parse(body);
    console.log("Validation passed:", validatedData);

    // Calculate total duration from destinations
    const totalDays = validatedData.destinations.reduce(
      (sum, dest) => sum + dest.days,
      0
    );
    const duration = `${totalDays} Days`;

    // Create custom package
    const customPackage = await prisma.customPackage.create({
      data: {
        userId,
        name: validatedData.name,
        contactName: validatedData.contactName,
        email: validatedData.email,
        phone: validatedData.phone,
        destinations: validatedData.destinations,
        duration,
        numberOfPeople: validatedData.numberOfPeople,
        travelDate: validatedData.travelDate
          ? new Date(validatedData.travelDate)
          : null,
        budget: validatedData.budget || null,
        specialRequests: validatedData.specialRequests || null,
        status: "PENDING",
      },
    });

    // Send email notifications (fire and forget)
    sendCustomPackageEmails({
      id: customPackage.id,
      name: customPackage.name,
      contactName: customPackage.contactName,
      email: customPackage.email,
      phone: customPackage.phone,
      destinations: customPackage.destinations,
      duration: duration,
      numberOfPeople: customPackage.numberOfPeople,
      travelDate: customPackage.travelDate,
      budget: customPackage.budget ? Number(customPackage.budget) : null,
      specialRequests: customPackage.specialRequests,
    }).catch((error: any) =>
      console.error("Error sending custom package emails:", error)
    );

    return createSuccessResponse(
      {
        packageId: customPackage.id,
        message: "Custom package request submitted successfully",
      },
      201
    );
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function GET(req: Request) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      throw new APIError(401, "Unauthorized", "AUTH_REQUIRED");
    }

    // Fetch user's custom packages
    const customPackages = await prisma.customPackage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return createSuccessResponse({ packages: customPackages });
  } catch (error) {
    return handleAPIError(error);
  }
}

// Helper function to send custom package emails
async function sendCustomPackageEmails(customPackage: {
  id: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  destinations: any;
  duration: string;
  numberOfPeople: number;
  travelDate: Date | null;
  budget: number | null;
  specialRequests: string | null;
}) {
  try {
    // Send notification to admin
    const adminHtml = await render(
      CustomPackageNotificationEmail({
        packageId: customPackage.id,
        name: customPackage.name,
        contactName: customPackage.contactName,
        email: customPackage.email,
        phone: customPackage.phone,
        destinations: customPackage.destinations,
        duration: customPackage.duration,
        numberOfPeople: customPackage.numberOfPeople,
        travelDate: customPackage.travelDate?.toISOString() || null,
        budget: customPackage.budget,
        specialRequests: customPackage.specialRequests,
      })
    );

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Custom Package Request: ${customPackage.name}`,
      html: adminHtml,
      replyTo: customPackage.email,
    });

    // Send confirmation to customer
    const customerHtml = await render(
      CustomPackageConfirmationEmail({
        contactName: customPackage.contactName,
        name: customPackage.name,
        numberOfPeople: customPackage.numberOfPeople,
        duration: customPackage.duration,
      })
    );

    await sendEmail({
      to: customPackage.email,
      subject: "Custom Package Request Received - Oliotya Safaris",
      html: customerHtml,
    });
  } catch (error) {
    console.error("Failed to send custom package emails:", error);
    throw error;
  }
}
