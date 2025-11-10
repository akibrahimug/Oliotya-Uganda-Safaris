# Nambi Uganda Safaris - Database Setup Guide

## Overview
This guide will help you set up the PostgreSQL database for Nambi Uganda Safaris using Vercel Postgres (recommended) or a local PostgreSQL instance.

## What's Been Configured

### ✅ Completed
1. **Prisma ORM** installed and configured
2. **Database Schema** created with 6 tables:
   - `destinations` - Store all trips/tours
   - `bookings` - Trip bookings with payment tracking
   - `contact_inquiries` - Contact form submissions
   - `newsletter_subscriptions` - Email subscriptions
   - `users` - User profiles (Clerk integration)
   - `user_favorites` - Saved/liked destinations
3. **Environment variables** template created in `.env.local`
4. **Prisma Client** utility created at `lib/db.ts`

### Database Schema Features
- **Enums** for booking status, payment status, inquiry status, subscription status
- **Indexes** for performance on frequently queried fields
- **Relations** between tables with foreign keys
- **Timestamps** for all records (createdAt, updatedAt)
- **Unique constraints** for confirmation numbers, emails where needed
- **Cascade deletes** for user favorites when users/destinations are deleted

## Setup Options

### Option 1: Vercel Postgres (Recommended)

#### Why Vercel Postgres?
- ✅ Zero configuration, works seamlessly with Next.js
- ✅ Automatic connection pooling
- ✅ Free tier available (60 hours compute time/month)
- ✅ No infrastructure management needed
- ✅ Perfect for serverless deployments

#### Steps:
1. **Create a Vercel account** (if you haven't):
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Link your project to Vercel**:
   ```bash
   vercel link
   ```

3. **Create a Vercel Postgres database**:
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a name (e.g., "nambi-uganda-safaris-db")
   - Click "Create"

4. **Get your database credentials**:
   - In the database dashboard, go to ".env.local" tab
   - Copy both `DATABASE_URL` and `DIRECT_URL`
   - These will look like:
     ```
     DATABASE_URL="postgres://default:xxx@xxx-pooler.aws.neon.tech/verceldb?sslmode=require"
     DIRECT_URL="postgres://default:xxx@xxx.aws.neon.tech/verceldb?sslmode=require"
     ```

5. **Update your `.env.local` file**:
   Replace the placeholder database URLs with your actual URLs from Vercel

6. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

7. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

---

### Option 2: Local PostgreSQL

#### Prerequisites:
- PostgreSQL 14+ installed locally
- Database user with CREATE DATABASE privileges

#### Steps:
1. **Start PostgreSQL** (if not running):
   ```bash
   # macOS with Homebrew
   brew services start postgresql@14

   # Linux
   sudo systemctl start postgresql

   # Windows
   # Use pgAdmin or start from Services
   ```

2. **Create database**:
   ```bash
   psql -U postgres
   CREATE DATABASE fox_adventures;
   \q
   ```

3. **Update `.env.local`**:
   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/fox_adventures"
   DIRECT_URL="postgresql://postgres:yourpassword@localhost:5432/fox_adventures"
   ```

4. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

---

## Verify Setup

### Check database connection:
```bash
npx prisma db push
```

### Open Prisma Studio (visual database browser):
```bash
npx prisma studio
```
This opens at http://localhost:5555 and lets you view/edit data

### Run the seed script (after we create it):
```bash
npx prisma db seed
```

---

## Next Steps

After database setup is complete, we need to:

1. **Create seed script** to migrate hardcoded destinations data
2. **Build API routes** for:
   - GET /api/destinations (list all)
   - GET /api/destinations/[id] (get one)
   - POST /api/bookings (create booking)
   - POST /api/contact (submit inquiry)
   - POST /api/newsletter/subscribe
3. **Update frontend** to call these APIs instead of using hardcoded data
4. **Add Stripe** for payment processing
5. **Enable Clerk** authentication

---

## Useful Prisma Commands

```bash
# Create a new migration after schema changes
npx prisma migrate dev --name your_migration_name

# Apply migrations to production
npx prisma migrate deploy

# Generate Prisma Client after schema changes
npx prisma generate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Open database browser
npx prisma studio

# Format schema file
npx prisma format
```

---

## Troubleshooting

### Error: "Can't reach database server"
- Check that DATABASE_URL is correct in `.env.local`
- For local PostgreSQL, ensure service is running
- For Vercel Postgres, check internet connection

### Error: "Environment variable not found"
- Ensure `.env.local` file exists
- Restart your development server after adding environment variables
- Check for typos in variable names

### Error: "Prisma Client not generated"
- Run `npx prisma generate`
- Restart your IDE/editor

---

## Database Schema Reference

### Destinations Table
```typescript
{
  id: number
  name: string
  category: string
  country: string
  price: Decimal
  rating: number
  duration: string
  groupSize: number
  minTravelers?: number
  maxTravelers?: number
  description: string
  image: string
  createdAt: Date
  updatedAt: Date
}
```

### Bookings Table
```typescript
{
  id: number
  confirmationNumber: string (unique)
  userId?: string // Clerk user ID
  firstName: string
  lastName: string
  email: string
  phone: string
  destinationId: number
  numberOfTravelers: number
  specialRequests?: string
  travelDateFrom: Date
  travelDateTo: Date
  pricePerPerson: Decimal
  totalPrice: Decimal
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED'
  paymentIntentId?: string // Stripe
  stripeCustomerId?: string
  createdAt: Date
  updatedAt: Date
}
```

### Contact Inquiries Table
```typescript
{
  id: number
  name: string
  email: string
  subject: string
  message: string
  status: 'NEW' | 'RESPONDED' | 'RESOLVED'
  responseNotes?: string
  createdAt: Date
  updatedAt: Date
}
```

### Newsletter Subscriptions Table
```typescript
{
  id: number
  email: string (unique)
  status: 'ACTIVE' | 'UNSUBSCRIBED'
  subscribedAt: Date
  unsubscribedAt?: Date
}
```

### Users Table (Clerk)
```typescript
{
  id: string // Clerk user ID
  email: string (unique)
  firstName?: string
  lastName?: string
  phone?: string
  profileImageUrl?: string
  createdAt: Date
  updatedAt: Date
}
```

### User Favorites Table
```typescript
{
  id: number
  userId: string
  destinationId: number
  createdAt: Date
}
```

---

## Security Notes

- **Never commit** `.env.local` to version control (already in `.gitignore`)
- **Use environment variables** for all sensitive data
- **Enable SSL** for production database connections
- **Regularly backup** your database
- **Use Prisma migrations** to track schema changes

---

## Support

For issues or questions:
1. Check Prisma documentation: https://www.prisma.io/docs
2. Vercel Postgres docs: https://vercel.com/docs/storage/vercel-postgres
3. Check the error message carefully - Prisma provides helpful errors

---

**Status:** ✅ Database schema ready. Waiting for database URL configuration.

**Next:** Once you've set up your database and added the URLs to `.env.local`, run:
```bash
npx prisma migrate dev --name init
npx prisma generate
```
