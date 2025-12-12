import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Public endpoint to check system health and diagnose issues
 */
export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    database: "unknown",
    env: {
      hasClerkPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      hasClerkSecretKey: !!process.env.CLERK_SECRET_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasR2Config: !!process.env.R2_ACCESS_KEY_ID,
      nodeEnv: process.env.NODE_ENV,
    },
    api: {
      packages: "not_tested",
      destinations: "not_tested",
      heroSlides: "not_tested",
      settings: "not_tested",
    },
  };

  // Check database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch (error) {
    checks.database = `error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }

  // Test public API endpoints
  try {
    const packagesCount = await prisma.package.count();
    checks.api.packages = `ok (${packagesCount} packages)`;
  } catch (error) {
    checks.api.packages = `error: ${error instanceof Error ? error.message : "Unknown"}`;
  }

  try {
    const destinationsCount = await prisma.destination.count();
    checks.api.destinations = `ok (${destinationsCount} destinations)`;
  } catch (error) {
    checks.api.destinations = `error: ${error instanceof Error ? error.message : "Unknown"}`;
  }

  try {
    const slidesCount = await prisma.heroSlide.count({ where: { active: true } });
    checks.api.heroSlides = `ok (${slidesCount} slides)`;
  } catch (error) {
    checks.api.heroSlides = `error: ${error instanceof Error ? error.message : "Unknown"}`;
  }

  try {
    const settingsCount = await prisma.siteSettings.count();
    checks.api.settings = `ok (${settingsCount} settings)`;
  } catch (error) {
    checks.api.settings = `error: ${error instanceof Error ? error.message : "Unknown"}`;
  }

  return NextResponse.json(checks);
}
