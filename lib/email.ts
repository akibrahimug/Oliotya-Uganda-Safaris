import { Resend } from 'resend';

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender email (should be verified in Resend)
export const SENDER_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

// Admin/company email to receive notifications
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@foxadventures.com';

// Email sending helper with error handling
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  try {
    const data = await resend.emails.send({
      from: SENDER_EMAIL,
      to,
      subject,
      html,
      replyTo,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
