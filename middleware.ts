import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define CMS routes that require admin authentication
const isCMSRoute = createRouteMatcher(["/cms(.*)", "/api/cms(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect CMS routes - require admin role
  if (isCMSRoute(req)) {
    // Require authentication and admin role
    await auth.protect();
  }
  // All other routes are public - no authentication required
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
