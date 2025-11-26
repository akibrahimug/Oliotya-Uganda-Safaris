# Testing the Booking Confirmation Flow

## Issue
User is seeing "No confirmation number provided" error when accessing the booking confirmation page.

## Root Cause Analysis

The error occurs when:
1. **Navigating directly to `/booking-confirmation`** without the `?ref=CONF-XXXXX` parameter
2. **Booking API fails** and doesn't return a confirmation number
3. **Browser doesn't preserve the URL parameter** during navigation

## How the Flow Should Work

### Step 1: User Submits Booking Form
```javascript
// components/booking-form.tsx
const response = await fetch("/api/bookings", {
  method: "POST",
  body: JSON.stringify(formData)
});

const data = await response.json();
// data.booking.confirmationNumber = "CONF-XXXXX"
```

### Step 2: Success Toast is Shown
```javascript
toast({
  title: "✅ Booking Successfully Submitted!",
  description: `Confirmation #${data.booking.confirmationNumber}...`,
  duration: 5000,
});
```

### Step 3: Redirect After 1.5 Seconds
```javascript
setTimeout(() => {
  router.push(`/booking-confirmation?ref=${data.booking.confirmationNumber}`);
}, 1500);
```

### Step 4: Booking Confirmation Page Loads
- Checks for `?ref=` parameter in URL
- Fetches booking from `/api/bookings/[confirmationNumber]`
- Displays booking details + CMS content

## Troubleshooting Steps

### 1. Check if Booking Was Created
```bash
# In terminal, check database
npx prisma studio
# Navigate to "booking" table and check if records exist
```

### 2. Test the Booking API Directly
```bash
# Create a test booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+256123456789",
    "country": "Uganda",
    "bookingType": "PACKAGE",
    "packageId": "YOUR_PACKAGE_ID",
    "numberOfTravelers": 2,
    "travelDateFrom": "2025-03-01",
    "travelDateTo": "2025-03-05",
    "specialRequests": "Test booking"
  }'
```

Expected response:
```json
{
  "success": true,
  "booking": {
    "confirmationNumber": "CONF-XXXXX",
    "id": "...",
    "totalPrice": 1000,
    "itemName": "Package Name"
  }
}
```

### 3. Test the Confirmation Page
With the confirmation number from above:
```
http://localhost:3000/booking-confirmation?ref=CONF-XXXXX
```

### 4. Check Browser Console
When submitting a booking:
1. Open browser DevTools (F12)
2. Go to "Console" tab
3. Submit a booking
4. Check for any errors
5. Check "Network" tab for the API response

## Common Issues & Solutions

### Issue 1: No Package/Destination ID
**Symptom**: Booking form submits but returns error
**Fix**: Ensure you're booking from a valid package or destination page

### Issue 2: Database Connection
**Symptom**: API returns 500 error
**Fix**: Check `.env` has correct `DATABASE_URL`

### Issue 3: Rate Limiting
**Symptom**: "Too many requests" error
**Fix**: Wait 1 hour or restart Redis/app

### Issue 4: Validation Errors
**Symptom**: Form won't submit or shows validation error
**Fix**:
- Check all required fields are filled
- Check date formats are correct
- Check email is valid

## Expected Behavior

### ✅ Success Flow:
1. Fill out booking form completely
2. Click "Submit Booking"
3. See success toast: "✅ Booking Successfully Submitted! Confirmation #CONF-12345..."
4. Wait 1.5 seconds
5. Automatically redirect to: `/booking-confirmation?ref=CONF-12345`
6. See booking details with:
   - Hero section (from CMS)
   - Booking details (confirmation number, dates, price)
   - Steps section (from CMS)
   - Contact info (from CMS)
   - Image galleries (from CMS if configured)

### ❌ Error Scenarios:

#### Scenario 1: Missing Confirmation Number
**URL**: `/booking-confirmation` (no `?ref=` parameter)
**Toast**: "❌ Missing Confirmation Number"
**Display**: Error card with:
- Alert icon
- "No Confirmation Number" heading
- Helpful message about checking email
- Buttons: "Return Home" and "Contact Support"

#### Scenario 2: Invalid Confirmation Number
**URL**: `/booking-confirmation?ref=INVALID-123`
**Toast**: "❌ Booking Not Found"
**Display**: Error card with:
- Alert icon
- "Booking Not Found" heading
- Shows the confirmation number searched
- Helpful tips to check email/spam folder

## Quick Test Checklist

- [ ] Navigate to a package page (e.g., `/package/gorilla-trekking`)
- [ ] Click "Book Now"
- [ ] Fill out the booking form completely
- [ ] Submit the form
- [ ] Verify success toast appears with confirmation number
- [ ] Wait for automatic redirect
- [ ] Verify you're on `/booking-confirmation?ref=CONF-XXXXX`
- [ ] Verify booking details display correctly
- [ ] Verify no errors in browser console

## If You're Still Seeing the Error

1. **Clear browser cache and cookies**
2. **Try in incognito/private window**
3. **Check network tab** to see if the booking API call succeeds
4. **Share the API response** from the Network tab
5. **Check server logs** for any errors

## Updated Features (Just Added)

✅ **Toast Notifications**:
- Shows toast when missing confirmation number
- Shows toast when booking not found

✅ **Better Error UI**:
- Card-based error display
- Helpful tips and instructions
- Contact support button
- Shows the confirmation number searched (if provided)

✅ **Error Messages**:
- Clear explanation of what went wrong
- Actionable next steps
- Professional, user-friendly tone
