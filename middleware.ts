import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define CMS routes that require admin authentication
const isCMSRoute = createRouteMatcher(["/cms(.*)", "/api/cms(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect CMS routes - require authentication
  if (isCMSRoute(req)) {
    // Require authentication (admin check happens in layout)
    await auth.protect();
  }
  // All other routes are public - no authentication required
  return NextResponse.next();
});

export const config = {
  // Only run Clerk on surfaces that actually use auth. Public marketing pages
  // must NOT be matched: with a Clerk development instance, clerkMiddleware
  // 307-redirects every cookie-less browser navigation (including Googlebot's
  // renderer) to <instance>.clerk.accounts.dev/v1/client/handshake, which is
  // noindexed — this de-indexed the whole site in Google Search Console.
  matcher: [
    "/cms(.*)",
    "/cms-test(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/bundle-packages(.*)",
    "/(api|trpc)(.*)",
  ],
};
