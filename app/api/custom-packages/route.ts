import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { customPackageSchema } from "@/lib/validations";
import {
  handleAPIError,
  createSuccessResponse,
  APIError,
} from "@/lib/api-errors";
// import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      throw new APIError(401, "Unauthorized", "AUTH_REQUIRED");
    }

    // Rate limiting
    // const rateLimitResult = await rateLimit(userId);
    // if (!rateLimitResult.success) {
    //   throw new APIError(
    //     429,
    //     `Rate limit exceeded. Try again in ${Math.ceil(
    //       rateLimitResult.reset / 1000
    //     )} seconds`,
    //     "RATE_LIMIT_EXCEEDED"
    //   );
    // }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = customPackageSchema.parse(body);

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
