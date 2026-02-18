import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { newsletterSchema } from "@/lib/validations/newsletter";
import { newsletterRateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeObject } from "@/lib/validations";
import { sendEmail } from "@/lib/email";
import { render } from "@react-email/components";
import SubscribeConfirmationEmail from "@/emails/subscribe-confirmation";

export const dynamic = "force-dynamic";

/**
 * POST /api/newsletter
 * Subscribe to newsletter
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request.headers);
    const { success } = await newsletterRateLimit.limit(ip);

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
        { success: true, message: "Thank you for subscribing!" },
        { status: 200 }
      );
    }

    // Sanitize input before validation
    const sanitizedBody = sanitizeObject(body);

    // Validate input
    const validatedData = newsletterSchema.parse(sanitizedBody);

    // Upsert subscription — if already exists just re-activate it
    const subscription = await prisma.newsletterSubscription.upsert({
      where: { email: validatedData.email },
      update: {
        status: "ACTIVE",
        unsubscribedAt: null,
      },
      create: {
        email: validatedData.email,
        status: "ACTIVE",
      },
    });

    // Send confirmation email (fire and forget)
    sendSubscribeEmail(validatedData.email).catch((error) =>
      console.error("Error sending subscribe confirmation email:", error)
    );

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing! Check your inbox for a confirmation.",
    });
  } catch (error: any) {
    console.error("Error processing newsletter subscription:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}

// Helper to send subscription confirmation email
async function sendSubscribeEmail(email: string) {
  try {
    const customerHtml = await render(
      SubscribeConfirmationEmail({})
    );

    await sendEmail({
      to: email,
      subject: "You're subscribed — welcome aboard!",
      html: customerHtml,
    });
  } catch (error) {
    console.error("Failed to send subscribe confirmation email:", error);
    throw error;
  }
}
