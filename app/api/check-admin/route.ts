import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Debug endpoint to check if current user has admin permissions
 * This helps diagnose CMS access issues
 */
export async function GET() {
  try {
    // Get basic auth info
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        authenticated: false,
        message: "Not authenticated",
      });
    }

    // Get full user details
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({
        authenticated: true,
        userId,
        hasUserData: false,
        message: "User authenticated but currentUser() returned null",
      });
    }

    // Check admin status
    const isAdminViaMetadata = user.publicMetadata?.role === "admin";
    const isAdminViaOrg =
      Array.isArray((user as any).organizationMemberships) &&
      (user as any).organizationMemberships.some(
        (org: any) =>
          org.role === "org:admin" ||
          (Array.isArray(org.permissions) &&
            org.permissions.includes("org:sys_memberships:manage"))
      );

    const isAdmin = isAdminViaMetadata || isAdminViaOrg;

    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      email: user.emailAddresses?.[0]?.emailAddress || "N/A",
      hasUserData: true,
      adminCheck: {
        isAdmin,
        isAdminViaMetadata,
        isAdminViaOrg,
      },
      metadata: {
        publicMetadata: user.publicMetadata || {},
        hasPublicMetadata: !!user.publicMetadata,
        publicMetadataRole: user.publicMetadata?.role || "not set",
      },
      organizations: {
        count: (user as any).organizationMemberships?.length || 0,
        memberships: (user as any).organizationMemberships?.map((org: any) => ({
          id: org.id,
          role: org.role,
          hasPermissions: Array.isArray(org.permissions),
          permissionsCount: Array.isArray(org.permissions)
            ? org.permissions.length
            : 0,
        })) || [],
      },
      recommendation: !isAdmin
        ? "❌ User is NOT admin. Set publicMetadata.role = 'admin' in Clerk Dashboard"
        : "✅ User has admin access",
    });
  } catch (error) {
    console.error("Error in check-admin endpoint:", error);
    return NextResponse.json(
      {
        error: true,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
