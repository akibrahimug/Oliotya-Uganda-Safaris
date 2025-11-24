import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactFormSchema } from "@/lib/validations/contact";
import { contactRateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeObject } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

/**
 * POST /api/contact
 * Submit contact inquiry
 */
export async function POST(request: NextRequest) {
  // try {
  //   // Rate limiting
  //   const ip = getClientIp(request.headers);
  //   const { success } = await contactRateLimit.limit(ip);
  //
  //   if (!success) {
  //     return NextResponse.json(
  //       { error: "Too many requests. Please try again in an hour." },
  //       { status: 429 }
  //     );
  //   }
  //
  //   const body = await request.json();
  //
  //   // Honeypot check
  //   if (body.website) {
  //     return NextResponse.json(
  //       { error: "Invalid submission" },
  //       { status: 400 }
  //     );
  //   }
  //
  //   // Sanitize input before validation
  //   const sanitizedBody = sanitizeObject(body);
  //
  //   // Validate input
  //   const validatedData = contactFormSchema.parse(sanitizedBody);
  //
  //   // Create contact inquiry
  //   const inquiry = await prisma.contactInquiry.create({
  //     data: {
  //       name: validatedData.name,
  //       email: validatedData.email,
  //       subject: validatedData.subject,
  //       message: validatedData.message,
  //     },
  //   });
  //
  //   // TODO: Send emails
  //   // - Send confirmation to customer
  //   // - Send notification to admin
  //
  //   return NextResponse.json({
  //     success: true,
  //     inquiry: {
  //       id: inquiry.id,
  //     },
  //     message: "Thank you for contacting us. We'll get back to you soon!",
  //   });
  // } catch (error: any) {
  //   console.error("Error creating contact inquiry:", error);

    // if (error.name === "ZodError") {
    //   return NextResponse.json(
    //     { error: "Validation failed", details: error.errors },
    //     { status: 400 }
    //   );
    // }

    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  // }
}
