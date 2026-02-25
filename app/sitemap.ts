import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getBaseUrl } from "@/lib/seo";

export const revalidate = 3600;

const STATIC_ROUTES: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
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

  try {
    const [packages, destinations] = await Promise.all([
      prisma.package.findMany({
        where: { active: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      prisma.destination.findMany({
        select: {
          id: true,
          updatedAt: true,
        },
      }),
    ]);

    const packageEntries: MetadataRoute.Sitemap = packages.map((pkg) => ({
      url: `${baseUrl}/package/${pkg.slug}`,
      lastModified: pkg.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const destinationEntries: MetadataRoute.Sitemap = destinations.map((destination) => ({
      url: `${baseUrl}/destination/${destination.id}`,
      lastModified: destination.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticEntries, ...packageEntries, ...destinationEntries];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticEntries;
  }
}
