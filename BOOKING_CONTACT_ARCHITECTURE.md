# Booking & Contact System Architecture

## Overview
This document outlines the booking and contact system architecture for Nambi Uganda Safaris.

## Booking Flow

### User Journey
1. User browses packages or destinations
2. User clicks "Book Now" button
3. User fills out booking form with:
   - Personal information (name, email, phone, country)
   - Number of travelers
   - Travel dates
   - Special requests
4. System calculates total price
5. User submits booking
6. System sends confirmation email to user
7. System sends notification email to admin
8. User receives bank transfer details
9. User makes bank transfer
10. User updates booking with payment reference
11. Admin confirms payment and updates booking status

### Booking Types
- **Package Booking**: User books a specific tour package
- **Destination Booking**: User books a custom trip to a destination

### Booking Statuses
- **PENDING**: Initial booking, awaiting payment
- **CONFIRMED**: Payment received and verified by admin
- **CANCELLED**: Booking cancelled by user or admin
- **COMPLETED**: Trip completed

### Payment Methods
- Bank Transfer (primary method for now)
- Future: Stripe integration

## Contact System

### Contact Flow
1. User visits contact page
2. User fills out contact form with:
   - Name
   - Email
   - Subject
   - Message
3. System sends inquiry to admin
4. System sends confirmation to user
5. Admin responds via email
6. Admin marks inquiry as responded/resolved in CMS

### Inquiry Statuses
- **NEW**: New inquiry, not yet responded to
- **RESPONDED**: Admin has responded
- **RESOLVED**: Inquiry fully resolved

## Email Configuration

### Email Provider
- **Recommended**: Resend (https://resend.com)
- **Alternative**: SendGrid, AWS SES

### Email Templates Needed
1. **Booking Confirmation** (to user)
   - Confirmation number
   - Booking details
   - Payment instructions
   - Bank account details

2. **Booking Notification** (to admin)
   - New booking alert
   - Customer details
   - Booking details

3. **Payment Confirmation** (to user)
   - Payment received
   - Booking confirmed
   - Next steps

4. **Contact Inquiry Confirmation** (to user)
   - Thank you message
   - Expected response time

5. **Contact Inquiry Notification** (to admin)
   - New inquiry alert
   - Customer details
   - Message content

### Environment Variables
```
# Email Configuration
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=info@nambiuganda.com
FROM_EMAIL=noreply@nambiuganda.com

# Bank Details for Payment Instructions
BANK_NAME=Your Bank Name
BANK_ACCOUNT_NAME=Nambi Uganda Safaris
BANK_ACCOUNT_NUMBER=1234567890
BANK_SWIFT_CODE=XXXXX
```

## Database Schema

### Booking Table
- id, confirmationNumber
- User info: firstName, lastName, email, phone, country
- Booking info: packageId, destinationId, bookingType
- Travel info: numberOfTravelers, travelDateFrom, travelDateTo
- Pricing: pricePerPerson, totalPrice
- Payment: paymentMethod, paymentReference, paymentStatus
- Status: status (PENDING/CONFIRMED/CANCELLED/COMPLETED)
- Notes: specialRequests, adminNotes

### ContactInquiry Table
- id
- name, email, subject, message
- status (NEW/RESPONDED/RESOLVED)
- responseNotes
- timestamps

## API Routes

### Booking APIs
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking by confirmation number
- `PATCH /api/bookings/:id` - Update booking (add payment reference)
- `GET /api/cms/bookings` - Admin: List all bookings
- `PATCH /api/cms/bookings/:id` - Admin: Update booking status

### Contact APIs
- `POST /api/contact` - Submit contact inquiry
- `GET /api/cms/contact` - Admin: List all inquiries
- `PATCH /api/cms/contact/:id` - Admin: Update inquiry status

## CMS Features

### Booking Management
- View all bookings
- Filter by status, date range, booking type
- Search by customer name, email, confirmation number
- Update booking status
- Add admin notes
- Send email notifications

### Contact Management
- View all inquiries
- Filter by status, date
- Search by name, email, subject
- Add response notes
- Mark as responded/resolved
- Send replies

## Next Steps

1. ✅ Update database schema
2. 🔄 Create validation schemas
3. ⏳ Create API routes
4. ⏳ Create booking form component
5. ⏳ Create contact form component
6. ⏳ Create CMS booking management
7. ⏳ Create CMS contact management
8. ⏳ Set up email system
9. ⏳ Create email templates
10. ⏳ Test entire flow
