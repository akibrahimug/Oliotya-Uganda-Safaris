
# Oliotya Safaris

A modern web application for a Uganda safari tour company, built with Next.js, React, and TypeScript. This full-stack application features a complete content management system, database integration, and cloud storage capabilities.

## 🌟 Features

- **Modern Web Framework**: Built with Next.js 15.2.4 and React 18
- **Type Safety**: Full TypeScript implementation
- **Database Integration**: PostgreSQL with Prisma ORM
- **Cloud Storage**: AWS S3 integration for media management
- **UI Components**: Comprehensive Radix UI component library
- **Styling**: TailwindCSS with custom animations
- **Testing**: Jest and React Testing Library setup
- **Content Management**: Built-in CMS for managing safari content
- **Authentication**: Ready for integration with authentication providers
- **Analytics**: Vercel Analytics integration
- **Form Handling**: React Hook Form with validation
- **Charts & Visualizations**: Recharts integration

## 🛠 Tech Stack

### Frontend
- **Next.js 15.2.4** - React framework with SSR/SSG
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Lucide React** - Icon library

### Backend & Database
- **Prisma** - Database ORM
- **Vercel Postgres** - PostgreSQL database
- **AWS S3** - Cloud storage

### Development & Testing
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **ts-node** - TypeScript execution environment

## 📋 Prerequisites

- Node.js (version 18 or higher)
- Yarn package manager
- PostgreSQL database
- AWS S3 bucket (for file storage)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oliotya-safaris-safaris
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Database
   DATABASE_URL="your-postgres-connection-string"
   
   # AWS S3
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="your-aws-region"
   AWS_BUCKET_NAME="your-s3-bucket-name"
   
   # Next.js
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure
