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
  const user = await currentUser();

  // Require authentication
  if (!user) {
    redirect("/sign-in?redirect_url=/cms");
  }

  // Check if user is admin (via publicMetadata or organization role)
  const isAdmin =
    user.publicMetadata?.role === "admin" ||
    user.organizationMemberships?.some(
      (org) =>
        org.role === "org:admin" ||
        org.permissions?.includes("org:sys_memberships:manage")
    );

  // Redirect non-admin users
  if (!isAdmin) {
    redirect("/?error=unauthorized");
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <CMSSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <CMSHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
