# Email Integration Setup Guide

This guide will help you set up email notifications for your Fox Adventures website using Resend.

## Overview

Your website now sends professional email notifications for:
- **Contact Form**: Admin notification + customer confirmation
- **Bookings**: Admin notification + customer confirmation with booking details
- **Custom Package Requests**: Admin notification + customer confirmation

## Setup Steps

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (3,000 emails/month free)
3. Verify your email address

### 2. Add and Verify Your Domain

**Option A: Use Your Own Domain (Recommended for Production)**

1. In Resend dashboard, go to **Domains** → **Add Domain**
2. Enter your domain: `foxadventures.com`
3. Add the DNS records they provide to your domain registrar:
   - SPF record
   - DKIM record
   - DMARC record (optional but recommended)
4. Wait for verification (usually 5-15 minutes)
5. Once verified, you can send from `info@foxadventures.com`, `noreply@foxadventures.com`, etc.

**Option B: Use Resend's Testing Domain (For Development)**

- You can use `onboarding@resend.dev` for testing
- Emails will be sent but may land in spam
- Only use this for development/testing

### 3. Get Your API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it: "Fox Adventures Production" (or "Development")
4. Copy the API key (starts with `re_`)

### 4. Configure Environment Variables

Add these to your `.env` file:

```bash
# Resend Email Service
RESEND_API_KEY="re_your_actual_api_key_here"

# Email Configuration
EMAIL_FROM="info@foxadventures.com"  # Must match verified domain
ADMIN_EMAIL="admin@foxadventures.com"  # Where you want to receive notifications
```

**Important Notes:**
- `EMAIL_FROM` must be from your verified domain
- `ADMIN_EMAIL` is where YOU will receive form submissions
- Both can be the same email if you want

### 5. Test the Integration

#### Test Contact Form
1. Go to your contact page
2. Fill out and submit the form
3. Check that:
   - Form submission succeeds
   - You receive an email at `ADMIN_EMAIL`
   - Customer receives confirmation email

#### Test Booking Form
1. Go to a package or destination page
2. Click "Book Now"
3. Fill out booking form
4. Check that:
   - Booking is created successfully
   - You receive booking notification
   - Customer receives booking confirmation with confirmation number

#### Test Custom Package
1. Go to "Build Your Package" page
2. Select destinations and submit
3. Check email notifications

## Email Templates

All email templates are located in `/emails/` directory:

```
emails/
├── contact-notification.tsx       # Admin notification for contact forms
├── contact-confirmation.tsx       # Customer confirmation for contact forms
├── booking-notification.tsx       # Admin notification for bookings
├── booking-confirmation.tsx       # Customer confirmation for bookings
├── custom-package-notification.tsx    # Admin notification for custom packages
└── custom-package-confirmation.tsx    # Customer confirmation for custom packages
```

### Customizing Email Templates

You can customize the email templates by editing the files in `/emails/`. The templates use React and are styled with inline CSS.

Example customization:
```tsx
// Change colors
const primaryColor = '#059669';  // Your brand color

// Update company name
<Text>Thank you for contacting Fox Adventures</Text>

// Modify content
<Text>We'll get back to you within 24 hours.</Text>
```

## Troubleshooting

### Emails Not Sending

1. **Check API Key**: Make sure `RESEND_API_KEY` is correct in `.env`
2. **Check Console**: Look for error messages in terminal/Vercel logs
3. **Verify Domain**: Ensure your domain is verified in Resend
4. **Check Spam**: Emails might be in spam folder initially

### Emails Going to Spam

1. **Verify Domain Properly**: Make sure all DNS records are added
2. **Add DMARC**: This improves deliverability
3. **Warm Up Domain**: Send test emails to yourself first
4. **Check SPF/DKIM**: Use [MXToolbox](https://mxtoolbox.com) to verify DNS records

### Rate Limiting

- Free tier: 3,000 emails/month
- If you need more, upgrade to a paid plan
- Monitor usage in Resend dashboard

## Production Deployment

### Vercel/Netlify

1. Add environment variables in deployment settings:
   ```
   RESEND_API_KEY=re_your_key
   EMAIL_FROM=info@foxadventures.com
   ADMIN_EMAIL=admin@foxadventures.com
   ```

2. Redeploy your application

3. Test all forms in production

### Environment-Specific Emails

You might want different emails for staging vs production:

```bash
# Production .env
EMAIL_FROM="info@foxadventures.com"
ADMIN_EMAIL="admin@foxadventures.com"

# Staging .env
EMAIL_FROM="staging@foxadventures.com"
ADMIN_EMAIL="dev-team@foxadventures.com"
```

## Best Practices

1. **Always Test First**: Use a test email before going live
2. **Monitor Delivery**: Check Resend dashboard for delivery rates
3. **Keep Templates Professional**: Match your brand voice and style
4. **Don't Spam**: Respect email best practices
5. **Handle Failures Gracefully**: The app continues working even if emails fail
6. **Use Reply-To**: Customer emails include reply-to for easy responses

## Advanced Configuration

### Custom Email Subjects

Edit in the respective files:

```typescript
// app/actions/contact-actions.ts
await sendEmail({
  subject: `New Contact: ${inquiry.subject}`,  // Customize this
  ...
});
```

### Multiple Admin Recipients

```typescript
// lib/email.ts
export const ADMIN_EMAILS = [
  'admin@foxadventures.com',
  'sales@foxadventures.com',
];

// Usage
await sendEmail({
  to: ADMIN_EMAILS,  // Array of emails
  ...
});
```

### Email Analytics

Resend provides analytics for:
- Open rates
- Click rates
- Bounce rates
- Spam reports

Access these in your Resend dashboard.

## Support

- **Resend Docs**: https://resend.com/docs
- **React Email Docs**: https://react.email/docs
- **Resend Status**: https://status.resend.com

## Summary

✅ Email integration is now complete for all forms
✅ Beautiful, professional email templates
✅ Automatic notifications to you and customers
✅ Secure and reliable delivery with Resend
✅ Easy to customize and extend

**Next Step**: Get your Resend API key and add it to your `.env` file!
