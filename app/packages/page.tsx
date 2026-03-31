import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { PackagesContent } from "@/components/packages-content";
import { prisma } from "@/lib/db";
import { getBaseUrl, toAbsoluteUrl } from "@/lib/seo";

export const revalidate = 60;

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const title = "Safari Packages - Oliotya Uganda Safaris";
  const description =
    "Browse our curated Uganda safari packages — gorilla trekking, wildlife safaris, mountain expeditions, and more. Find your perfect African adventure.";

  const hero = await prisma.packagesHero.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { image: true },
  });

  const ogImage = hero?.image ? toAbsoluteUrl(hero.image, baseUrl) : `${baseUrl}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/packages` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${baseUrl}/packages`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

async function getHeroData() {
  try {
    const heroSection = await prisma.packagesHero.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });

    if (!heroSection) {
      const R2_BASE =
        process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
        "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
      return [
        {
          image: `${R2_BASE}/nambi-uganda-safaris/images/uganda-queen-elizabeth-national-park-safari.webp`,
          title: "Discover the Pearl of Africa",
          subtitle: "Safari Packages",
          description:
            "Explore curated safari experiences across Uganda's most breathtaking destinations and national parks.",
        },
      ];
    }

    return [
      {
        image: heroSection.image,
        title: heroSection.title,
        subtitle: heroSection.subtitle,
        description: heroSection.description,
      },
    ];
  } catch {
    const R2_BASE =
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
      "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
    return [
      {
        image: `${R2_BASE}/nambi-uganda-safaris/images/uganda-queen-elizabeth-national-park-safari.webp`,
        title: "Discover the Pearl of Africa",
        subtitle: "Safari Packages",
        description:
          "Explore curated safari experiences across Uganda's most breathtaking destinations and national parks.",
      },
    ];
  }
}

export default async function PackagesPage({ searchParams }: PageProps) {
  const { category } = await searchParams;

  const [heroSlides, allPackages] = await Promise.all([
    getHeroData(),
    prisma.package.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        duration: true,
        price: true,
        image: true,
        maxTravelers: true,
        difficulty: true,
      },
    }),
  ]);

  const baseUrl = getBaseUrl();
  const categories = Array.from(new Set(allPackages.map((p) => p.category)));
  const packages = (category ? allPackages.filter((p) => p.category === category) : allPackages).map(
    (pkg) => ({ ...pkg, price: Number(pkg.price) })
  );

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Uganda Safari Packages",
    description: "Curated safari packages across Uganda's national parks and destinations",
    url: `${baseUrl}/packages`,
    numberOfItems: allPackages.length,
    itemListElement: allPackages.map((pkg, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: pkg.name,
      url: `${baseUrl}/package/${pkg.slug}`,
      image: pkg.image,
    })),
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Header />
      <PageHero slides={heroSlides} showCounter={false} showDots={false} autoPlay={false} />
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        }
      >
        <PackagesContent packages={packages} categories={categories} />
      </Suspense>
      <Footer />
    </main>
  );
}
