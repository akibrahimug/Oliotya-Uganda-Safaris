import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { packageBundleSchema } from "@/lib/validations";
import { handleAPIError, createSuccessResponse, APIError } from "@/lib/api-errors";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      throw new APIError(401, "Unauthorized", "AUTH_REQUIRED");
    }

    // Rate limiting
    const rateLimitResult = await rateLimit(userId);
    if (!rateLimitResult.success) {
      throw new APIError(
        429,
        `Rate limit exceeded. Try again in ${Math.ceil(rateLimitResult.reset / 1000)} seconds`,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = packageBundleSchema.parse(body);

    // Verify all packages exist
    const packageIds = validatedData.packages.map((pkg) => pkg.packageId);
    const existingPackages = await prisma.package.findMany({
      where: { id: { in: packageIds } },
      select: { id: true },
    });

    if (existingPackages.length !== packageIds.length) {
      throw new APIError(400, "One or more packages not found", "INVALID_PACKAGES");
    }

    // Create package bundle
    const bundle = await prisma.packageBundle.create({
      data: {
        userId,
        name: validatedData.name || "Package Bundle",
        numberOfPeople: validatedData.numberOfPeople,
        travelDate: validatedData.travelDate ? new Date(validatedData.travelDate) : null,
        specialRequests: validatedData.specialRequests || null,
        status: "PENDING",
        packages: {
          create: validatedData.packages.map((pkg) => ({
            packageId: pkg.packageId,
            notes: pkg.notes || null,
          })),
        },
      },
      include: {
        packages: {
          include: {
            package: true,
          },
        },
      },
    });

    // TODO: Send email notification to admin about new bundle request
    // TODO: Send confirmation email to user

    return createSuccessResponse(
      {
        bundleId: bundle.id,
        message: "Package bundle request submitted successfully",
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

    // Fetch user's package bundles
    const bundles = await prisma.packageBundle.findMany({
      where: { userId },
      include: {
        packages: {
          include: {
            package: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return createSuccessResponse({ bundles });
  } catch (error) {
    return handleAPIError(error);
  }
}
