import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, Package, MapPin, Users } from "lucide-react";
import { prisma } from "@/lib/db";

async function DashboardStats() {
  // Fetch stats from database
  const [imagesCount, packagesCount, destinationsCount, teamCount] =
    await Promise.all([
      prisma.cMSImage.count(),
      prisma.package.count(),
      prisma.destination.count(),
      prisma.teamMember.count(),
    ]);

  const stats = [
    {
      title: "Total Images",
      value: imagesCount,
      icon: Image,
      description: "Uploaded images",
    },
    {
      title: "Safari Packages",
      value: packagesCount,
      icon: Package,
      description: "Active packages",
    },
    {
      title: "Destinations",
      value: destinationsCount,
      icon: MapPin,
      description: "Available destinations",
    },
    {
      title: "Team Members",
      value: teamCount,
      icon: Users,
      description: "Active team members",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function RecentActivity() {
  // Fetch recent audit logs
  const recentLogs = await prisma.cMSAuditLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 text-sm border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {log.action} {log.entityType}
                  </p>
                  <p className="text-muted-foreground">
                    by {log.userName || "Unknown"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CMSHomePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Oliotya Safaris CMS. Manage your content from here.
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Recent Activity */}
      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        }
      >
        <RecentActivity />
      </Suspense>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <a
              href="/cms/images"
              className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <Image className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Upload Images</span>
            </a>
            <a
              href="/cms/packages"
              className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <Package className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Add Package</span>
            </a>
            <a
              href="/cms/destinations"
              className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <MapPin className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Add Destination</span>
            </a>
            <a
              href="/cms/pages/home"
              className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <Image className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Edit Hero</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
