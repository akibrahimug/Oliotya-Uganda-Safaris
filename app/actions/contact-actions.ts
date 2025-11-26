'use server';

import { headers } from 'next/headers';
import { contactFormSchema } from '@/lib/validations/contact';
import { contactRateLimit, getClientIp } from '@/lib/rate-limit';
import { sanitizeObject } from '@/lib/validations';
import { handleError, handleRateLimitError, handleValidationError, logSecurityEvent } from '@/lib/error-handler';
import { prisma } from '@/lib/db';
import { sendEmail, ADMIN_EMAIL } from '@/lib/email';
import { render } from '@react-email/components';
import ContactNotificationEmail from '@/emails/contact-notification';
import ContactConfirmationEmail from '@/emails/contact-confirmation';

export async function submitContactForm(formData: FormData) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers();
    const ip = getClientIp(headersList);

    // Check rate limit
    const { success, remaining } = await contactRateLimit.limit(ip);

    if (!success) {
      logSecurityEvent({
        type: 'rate_limit',
        ip,
        details: { form: 'contact', remaining },
      });
      return handleRateLimitError(remaining);
    }

    // Extract form data
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      website: formData.get('website') as string, // Honeypot
    };

    // Check honeypot field (bot detection)
    if (rawData.website && rawData.website.trim() !== '') {
      logSecurityEvent({
        type: 'bot_detected',
        ip,
        details: { form: 'contact', honeypot: rawData.website },
      });

      // Fake success to fool bots
      return {
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
      };
    }

    // Validate with Zod
    const validationResult = contactFormSchema.safeParse(rawData);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      logSecurityEvent({
        type: 'validation_error',
        ip,
        details: { form: 'contact', errors },
      });
      return handleValidationError(errors);
    }

    // Sanitize inputs
    const sanitizedData = sanitizeObject(validationResult.data);

    // Save to database
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
      },
    });

    // Send email notifications (don't await - fire and forget to avoid slowing down response)
    sendContactEmails(inquiry).catch(error =>
      console.error('Error sending contact emails:', error)
    );

    return {
      success: true,
      message: 'Thank you! Your message has been sent successfully. We\'ll respond within 24 hours.',
      inquiryId: inquiry.id,
    };
  } catch (error) {
    return handleError(error, 'Contact form submission');
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
      subject: 'Thank you for contacting Fox Adventures',
      html: customerHtml,
    });
  } catch (error) {
    console.error('Failed to send contact emails:', error);
    throw error;
  }
}
