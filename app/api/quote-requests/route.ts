import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { quoteRequestSchema, sanitizeInput } from "@/lib/validations";
import { handleAPIError, createSuccessResponse, APIError } from "@/lib/api-errors";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting (fallback to a default if not available)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "anonymous";

    // Rate limiting
    const rateLimitResult = await rateLimit(ip);
    if (!rateLimitResult.success) {
      throw new APIError(
        429,
        `Rate limit exceeded. Try again in ${Math.ceil(rateLimitResult.reset / 1000)} seconds`,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = quoteRequestSchema.parse(body);

    // Sanitize text inputs to prevent XSS
    const sanitizedName = sanitizeInput(validatedData.name);
    const sanitizedMessage = validatedData.message
      ? sanitizeInput(validatedData.message)
      : "No additional message provided.";

    // Create contact inquiry with quote request details
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: sanitizedName,
        email: validatedData.email,
        subject: `Quote Request: ${sanitizeInput(validatedData.packageName)} - ${validatedData.numberOfPeople} travelers`,
        message: sanitizedMessage,
        status: "NEW",
      },
    });

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to user

    return createSuccessResponse(
      {
        inquiryId: inquiry.id,
        message: "Quote request submitted successfully. We'll contact you within 24 hours.",
      },
      201
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
