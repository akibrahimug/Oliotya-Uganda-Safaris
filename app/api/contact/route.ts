import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactFormSchema } from "@/lib/validations/contact";
import { contactRateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeObject } from "@/lib/validations";
import { sendEmail, ADMIN_EMAIL } from "@/lib/email";
import { render } from "@react-email/components";
import ContactNotificationEmail from "@/emails/contact-notification";
import ContactConfirmationEmail from "@/emails/contact-confirmation";

export const dynamic = "force-dynamic";

/**
 * POST /api/contact
 * Submit contact inquiry
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request.headers);
    const { success } = await contactRateLimit.limit(ip);

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
        { success: true, message: "Thank you for contacting us. We'll get back to you soon!" },
        { status: 200 }
      );
    }

    // Sanitize input before validation
    const sanitizedBody = sanitizeObject(body);

    // Validate input
    const validatedData = contactFormSchema.parse(sanitizedBody);

    // Create contact inquiry
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    });

    // Send emails (fire and forget to avoid slowing down response)
    sendContactEmails(inquiry).catch(error =>
      console.error("Error sending contact emails:", error)
    );

    return NextResponse.json({
      success: true,
      inquiry: {
        id: inquiry.id,
      },
      message: "Thank you for contacting us. We'll get back to you within 24 hours!",
    });
  } catch (error: any) {
    console.error("Error creating contact inquiry:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

// Helper function to send contact form emails
async function sendContactEmails(inquiry: {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    // Send notification to admin
    const adminHtml = await render(
      ContactNotificationEmail({
        name: inquiry.name,
        email: inquiry.email,
        subject: inquiry.subject,
        message: inquiry.message,
        inquiryId: inquiry.id,
      })
    );

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Contact Form: ${inquiry.subject}`,
      html: adminHtml,
      replyTo: inquiry.email,
    });

    // Send confirmation to customer
    const customerHtml = await render(
      ContactConfirmationEmail({
        name: inquiry.name,
        subject: inquiry.subject,
      })
    );

    await sendEmail({
      to: inquiry.email,
      subject: "Thank you for contacting Fox Adventures",
      html: customerHtml,
    });
  } catch (error) {
    console.error("Failed to send contact emails:", error);
    throw error;
  }
}
