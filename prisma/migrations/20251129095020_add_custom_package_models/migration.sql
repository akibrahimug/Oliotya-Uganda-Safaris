-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MODERATE', 'CHALLENGING');

-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('PACKAGE', 'DESTINATION');

-- CreateEnum
CREATE TYPE "CustomPackageStatus" AS ENUM ('PENDING', 'QUOTED', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_destinationId_fkey";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "adminNotes" TEXT,
ADD COLUMN     "bookingType" "BookingType" NOT NULL DEFAULT 'DESTINATION',
ADD COLUMN     "country" TEXT,
ADD COLUMN     "packageId" INTEGER,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentReference" TEXT,
ALTER COLUMN "destinationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "destinations" ADD COLUMN     "bestTimeDescription" TEXT,
ADD COLUMN     "cultureDescription" TEXT,
ADD COLUMN     "cultureExperiences" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "drySeasonDescription" TEXT,
ADD COLUMN     "drySeasonTitle" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gallery2Images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "geographyClimate" TEXT,
ADD COLUMN     "geographyDescription" TEXT,
ADD COLUMN     "historyContent" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "historyTitle" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "wetSeasonDescription" TEXT,
ADD COLUMN     "wetSeasonTitle" TEXT,
ADD COLUMN     "wildlifeBirds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "wildlifeDescription" TEXT,
ADD COLUMN     "wildlifeFlora" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "wildlifeMammals" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "packages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" TEXT,
    "image" TEXT NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "gallery2Images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "itinerary" JSONB NOT NULL,
    "included" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "excluded" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "minTravelers" INTEGER NOT NULL,
    "maxTravelers" INTEGER NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'MODERATE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_packages" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "destinations" JSONB NOT NULL,
    "duration" TEXT,
    "numberOfPeople" INTEGER NOT NULL,
    "travelDate" TIMESTAMP(3),
    "specialRequests" TEXT,
    "budget" DECIMAL(10,2),
    "status" "CustomPackageStatus" NOT NULL DEFAULT 'PENDING',
    "quotedPrice" DECIMAL(10,2),
    "quoteNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_bundles" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "numberOfPeople" INTEGER NOT NULL,
    "travelDate" TIMESTAMP(3),
    "specialRequests" TEXT,
    "status" "CustomPackageStatus" NOT NULL DEFAULT 'PENDING',
    "quotedPrice" DECIMAL(10,2),
    "quoteNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_bundle_items" (
    "id" SERIAL NOT NULL,
    "bundleId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "package_bundle_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_images" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "category" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "usedIn" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_destinations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Uganda',
    "description" TEXT NOT NULL,
    "shortDesc" TEXT,
    "heroImage" TEXT NOT NULL,
    "gallery" JSONB NOT NULL,
    "history" TEXT,
    "geography" TEXT,
    "climate" TEXT,
    "wildlife" TEXT,
    "keyWildlife" JSONB,
    "flora" JSONB,
    "cultural" JSONB,
    "bestTime" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "category" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "years" TEXT NOT NULL,
    "specialties" JSONB NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_section" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cms_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience_section" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "stat1Value" TEXT NOT NULL,
    "stat1Label" TEXT NOT NULL,
    "stat2Value" TEXT NOT NULL,
    "stat2Label" TEXT NOT NULL,
    "badgeText" TEXT NOT NULL,
    "backgroundText" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experience_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_guide_section" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mapImage" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_guide_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_section" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages_hero" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations_hero" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destinations_hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations_cta" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "buttonLink" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destinations_cta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_story_section" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleHighlight" TEXT NOT NULL,
    "paragraph1" TEXT NOT NULL,
    "paragraph2" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "buttonLink" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_story_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_community_section" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleHighlight" TEXT NOT NULL,
    "paragraph1" TEXT NOT NULL,
    "paragraph2" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "buttonLink" TEXT NOT NULL,
    "feature1Title" TEXT NOT NULL,
    "feature1Description" TEXT NOT NULL,
    "feature2Title" TEXT NOT NULL,
    "feature2Description" TEXT NOT NULL,
    "feature3Title" TEXT NOT NULL,
    "feature3Description" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_community_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_stats" (
    "id" TEXT NOT NULL,
    "stat1Number" TEXT NOT NULL,
    "stat1Label" TEXT NOT NULL,
    "stat2Number" TEXT NOT NULL,
    "stat2Label" TEXT NOT NULL,
    "stat3Number" TEXT NOT NULL,
    "stat3Label" TEXT NOT NULL,
    "stat4Number" TEXT NOT NULL,
    "stat4Label" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_values" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_hero" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_cta" (
    "id" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "headingHighlight" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "button1Text" TEXT NOT NULL,
    "button1Link" TEXT NOT NULL,
    "button2Text" TEXT NOT NULL,
    "button2Link" TEXT NOT NULL,
    "footerText" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_cta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_hero" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_info" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "office" TEXT NOT NULL,
    "businessHours" JSONB NOT NULL,
    "quickResponse" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "linkText" TEXT NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_confirmation_main_hero" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_confirmation_main_hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_confirmation_hero" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "importantNotice" TEXT NOT NULL,
    "paymentDeadline" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_confirmation_hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_confirmation_steps" (
    "id" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "extraInfo" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_confirmation_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_confirmation_contact" (
    "id" TEXT NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "responseTime" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_confirmation_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_confirmation_next_steps" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "emailStep" JSONB NOT NULL,
    "paymentStep" JSONB NOT NULL,
    "contactStep" JSONB NOT NULL,
    "confirmStep" JSONB NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_confirmation_next_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_confirmation_security" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "points" TEXT[],
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_confirmation_security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_confirmation_gallery" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_confirmation_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_templates" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "greeting" TEXT NOT NULL,
    "introText" TEXT NOT NULL,
    "nextStepsTitle" TEXT,
    "nextStepsText" TEXT,
    "signatureText" TEXT NOT NULL,
    "footerText" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#059669',
    "accentColor" TEXT NOT NULL DEFAULT '#3b82f6',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_package_hero" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_package_hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_package_content" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_package_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "packages_slug_key" ON "packages"("slug");

-- CreateIndex
CREATE INDEX "packages_slug_idx" ON "packages"("slug");

-- CreateIndex
CREATE INDEX "packages_category_idx" ON "packages"("category");

-- CreateIndex
CREATE INDEX "packages_featured_idx" ON "packages"("featured");

-- CreateIndex
CREATE INDEX "packages_popular_idx" ON "packages"("popular");

-- CreateIndex
CREATE INDEX "packages_active_idx" ON "packages"("active");

-- CreateIndex
CREATE INDEX "packages_displayOrder_idx" ON "packages"("displayOrder");

-- CreateIndex
CREATE INDEX "custom_packages_userId_idx" ON "custom_packages"("userId");

-- CreateIndex
CREATE INDEX "custom_packages_status_idx" ON "custom_packages"("status");

-- CreateIndex
CREATE INDEX "custom_packages_createdAt_idx" ON "custom_packages"("createdAt");

-- CreateIndex
CREATE INDEX "package_bundles_userId_idx" ON "package_bundles"("userId");

-- CreateIndex
CREATE INDEX "package_bundles_status_idx" ON "package_bundles"("status");

-- CreateIndex
CREATE INDEX "package_bundles_createdAt_idx" ON "package_bundles"("createdAt");

-- CreateIndex
CREATE INDEX "package_bundle_items_bundleId_idx" ON "package_bundle_items"("bundleId");

-- CreateIndex
CREATE INDEX "package_bundle_items_packageId_idx" ON "package_bundle_items"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "package_bundle_items_bundleId_packageId_key" ON "package_bundle_items"("bundleId", "packageId");

-- CreateIndex
CREATE INDEX "cms_images_category_idx" ON "cms_images"("category");

-- CreateIndex
CREATE INDEX "cms_images_createdAt_idx" ON "cms_images"("createdAt");

-- CreateIndex
CREATE INDEX "hero_slides_displayOrder_idx" ON "hero_slides"("displayOrder");

-- CreateIndex
CREATE INDEX "hero_slides_active_idx" ON "hero_slides"("active");

-- CreateIndex
CREATE UNIQUE INDEX "cms_destinations_slug_key" ON "cms_destinations"("slug");

-- CreateIndex
CREATE INDEX "cms_destinations_slug_idx" ON "cms_destinations"("slug");

-- CreateIndex
CREATE INDEX "cms_destinations_category_idx" ON "cms_destinations"("category");

-- CreateIndex
CREATE INDEX "cms_destinations_region_idx" ON "cms_destinations"("region");

-- CreateIndex
CREATE INDEX "cms_destinations_featured_idx" ON "cms_destinations"("featured");

-- CreateIndex
CREATE INDEX "cms_destinations_active_idx" ON "cms_destinations"("active");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key");

-- CreateIndex
CREATE INDEX "site_settings_key_idx" ON "site_settings"("key");

-- CreateIndex
CREATE INDEX "site_settings_category_idx" ON "site_settings"("category");

-- CreateIndex
CREATE INDEX "team_members_displayOrder_idx" ON "team_members"("displayOrder");

-- CreateIndex
CREATE INDEX "team_members_active_idx" ON "team_members"("active");

-- CreateIndex
CREATE INDEX "faqs_category_idx" ON "faqs"("category");

-- CreateIndex
CREATE INDEX "faqs_displayOrder_idx" ON "faqs"("displayOrder");

-- CreateIndex
CREATE INDEX "faqs_active_idx" ON "faqs"("active");

-- CreateIndex
CREATE INDEX "cms_audit_logs_userId_idx" ON "cms_audit_logs"("userId");

-- CreateIndex
CREATE INDEX "cms_audit_logs_entityType_idx" ON "cms_audit_logs"("entityType");

-- CreateIndex
CREATE INDEX "cms_audit_logs_createdAt_idx" ON "cms_audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "about_values_displayOrder_idx" ON "about_values"("displayOrder");

-- CreateIndex
CREATE INDEX "about_values_active_idx" ON "about_values"("active");

-- CreateIndex
CREATE INDEX "ContactResource_displayOrder_idx" ON "ContactResource"("displayOrder");

-- CreateIndex
CREATE INDEX "ContactResource_active_idx" ON "ContactResource"("active");

-- CreateIndex
CREATE INDEX "booking_confirmation_steps_stepNumber_idx" ON "booking_confirmation_steps"("stepNumber");

-- CreateIndex
CREATE INDEX "booking_confirmation_steps_displayOrder_idx" ON "booking_confirmation_steps"("displayOrder");

-- CreateIndex
CREATE INDEX "booking_confirmation_steps_active_idx" ON "booking_confirmation_steps"("active");

-- CreateIndex
CREATE UNIQUE INDEX "email_templates_type_key" ON "email_templates"("type");

-- CreateIndex
CREATE INDEX "email_templates_type_idx" ON "email_templates"("type");

-- CreateIndex
CREATE INDEX "email_templates_active_idx" ON "email_templates"("active");

-- CreateIndex
CREATE INDEX "bookings_packageId_idx" ON "bookings"("packageId");

-- CreateIndex
CREATE INDEX "bookings_bookingType_idx" ON "bookings"("bookingType");

-- CreateIndex
CREATE INDEX "destinations_featured_idx" ON "destinations"("featured");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_packages" ADD CONSTRAINT "custom_packages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_bundles" ADD CONSTRAINT "package_bundles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_bundle_items" ADD CONSTRAINT "package_bundle_items_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "package_bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_bundle_items" ADD CONSTRAINT "package_bundle_items_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
