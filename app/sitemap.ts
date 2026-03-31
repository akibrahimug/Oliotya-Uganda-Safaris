import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getBaseUrl } from "@/lib/seo";

export const revalidate = 3600;

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/packages", changeFrequency: "daily", priority: 0.9 },
  { path: "/destinations", changeFrequency: "daily", priority: 0.9 },
  { path: "/build-package", changeFrequency: "weekly", priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [packagesResult, destinationsResult] = await Promise.allSettled([
    prisma.package.findMany({
      where: { active: true },
      select: {
        slug: true,
      },
    }),
    prisma.destination.findMany({
      select: {
        id: true,
      },
    }),
  ]);

  if (packagesResult.status === "rejected") {
    console.error("Error generating package sitemap entries:", packagesResult.reason);
  }

  if (destinationsResult.status === "rejected") {
    console.error("Error generating destination sitemap entries:", destinationsResult.reason);
  }

  const packageEntries: MetadataRoute.Sitemap =
    packagesResult.status === "fulfilled"
      ? packagesResult.value.map((pkg) => ({
          url: `${baseUrl}/package/${pkg.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        }))
      : [];

  const destinationEntries: MetadataRoute.Sitemap =
    destinationsResult.status === "fulfilled"
      ? destinationsResult.value.map((destination) => ({
          url: `${baseUrl}/destination/${destination.id}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        }))
      : [];

  return [...staticEntries, ...packageEntries, ...destinationEntries];
}
