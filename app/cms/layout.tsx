import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CMSSidebar } from "@/components/cms/cms-sidebar";
import { CMSHeader } from "@/components/cms/cms-header";

export const metadata = {
  title: "CMS - Nambi Uganda Safaris",
  description: "Content Management System",
};

// Force dynamic rendering for all CMS routes
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // First check if user is authenticated using auth()
  const { userId } = await auth();

  // Require authentication
  if (!userId) {
    redirect("/sign-in?redirect_url=/cms");
  }

  // Now get full user details
  let user;
  try {
    user = await currentUser();
  } catch (error) {
    console.error("Error fetching current user:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    redirect("/?error=auth_error");
  }

  if (!user) {
    console.error("User authenticated but currentUser() returned null");
    redirect("/sign-in?redirect_url=/cms");
  }

  // Check if user is admin (via publicMetadata or organization role)
  let isAdmin = false;

  try {
    const isAdminViaMetadata = user.publicMetadata?.role === "admin";
    const isAdminViaOrg =
      Array.isArray((user as any).organizationMemberships) &&
      (user as any).organizationMemberships.some(
        (org: any) =>
          org.role === "org:admin" ||
          (Array.isArray(org.permissions) && org.permissions.includes("org:sys_memberships:manage"))
      );

    isAdmin = isAdminViaMetadata || isAdminViaOrg;

    console.log("Admin check:", {
      userId: user.id,
      isAdminViaMetadata,
      isAdminViaOrg,
      isAdmin,
      publicMetadataRole: user.publicMetadata?.role,
      orgMembershipsCount: (user as any).organizationMemberships?.length || 0,
    });
  } catch (error) {
    console.error("Error checking admin permissions:", error);
    console.error("User data:", {
      id: user.id,
      hasPublicMetadata: !!user.publicMetadata,
      hasOrgMemberships: !!(user as any).organizationMemberships,
    });
  }

  // Redirect non-admin users
  if (!isAdmin) {
    console.warn("User is not admin, redirecting:", userId);
    redirect("/?error=unauthorized");
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Sidebar */}
      <CMSSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:mt-0 mt-16">
        {/* Header */}
        <CMSHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
