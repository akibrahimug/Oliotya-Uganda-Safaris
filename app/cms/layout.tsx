import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CMSSidebar } from "@/components/cms/cms-sidebar";
import { CMSHeader } from "@/components/cms/cms-header";

export const metadata = {
  title: "CMS - Nambi Uganda Safaris",
  description: "Content Management System",
};

export default async function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const user = await currentUser();

    // Require authentication
    if (!user) {
      redirect("/sign-in?redirect_url=/cms");
    }

    // Check if user is admin (via publicMetadata or organization role)
    const isAdminViaMetadata = user.publicMetadata?.role === "admin";
    const isAdminViaOrg =
      Array.isArray(user.organizationMemberships) &&
      user.organizationMemberships.some(
        (org) =>
          org.role === "org:admin" ||
          (Array.isArray(org.permissions) && org.permissions.includes("org:sys_memberships:manage"))
      );

    const isAdmin = isAdminViaMetadata || isAdminViaOrg;

    // Redirect non-admin users
    if (!isAdmin) {
      redirect("/?error=unauthorized");
    }
  } catch (error) {
    console.error("CMS Layout Error:", error);
    redirect("/?error=cms_error");
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
