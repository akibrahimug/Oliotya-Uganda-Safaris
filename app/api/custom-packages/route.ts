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
import { sanitizeObject } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      throw new APIError(401, "Unauthorized", "AUTH_REQUIRED");
    }

    // Rate limiting
    const { success } = await customPackageRateLimit.limit(userId);
    if (!success) {
      throw new APIError(
        429,
        "Too many custom package requests. Please try again in an hour.",
        "RATE_LIMIT_EXCEEDED"
      );
    }

    // Parse and sanitize request body
    const body = await req.json();

    // Honeypot check
    if (body.website) {
      throw new APIError(400, "Invalid submission", "INVALID_SUBMISSION");
    }

    const sanitizedBody = sanitizeObject(body);
    const validatedData = customPackageSchema.parse(sanitizedBody);

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

    // TODO: Send email notification to admin about new custom package request
    // TODO: Send confirmation email to user

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
