import { Header } from "@/components/header";
import { HeroCarousel } from "@/components/hero-carousel";
import { HomePageContent } from "@/components/home-page-content";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import { getBaseUrl, toAbsoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const title = "Oliotya Uganda Safaris - Discover Uganda";
  const description =
    "Experience the Pearl of Africa with Oliotya Uganda Safaris. Explore Uganda's wildlife, mountains, and natural wonders.";

  const [firstSlide, settings] = await Promise.all([
    prisma.heroSlide.findFirst({
      where: { active: true },
      orderBy: { displayOrder: "asc" },
      select: { image: true },
    }),
    getSiteSettings(),
  ]);

  const ogImageRaw = firstSlide?.image || settings.meta?.ogImage || settings.brand?.logo || "";
  const ogImage = ogImageRaw ? toAbsoluteUrl(ogImageRaw, baseUrl) : `${baseUrl}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: baseUrl },
    openGraph: {
      type: "website",
      title,
      description,
      url: baseUrl,
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

export default async function Home() {
  try {
    const [
      experienceSection,
      tourGuideSection,
      videoSection,
      heroSlides,
      siteSettings,
      allActivePackages,
      featuredDestinations,
    ] = await Promise.all([
      prisma.experienceSection.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.tourGuideSection.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.videoSection.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.heroSlide.findMany({
        where: { active: true },
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          title: true,
          subtitle: true,
          description: true,
          image: true,
          displayOrder: true,
        },
      }),
      getSiteSettings(),
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
          minTravelers: true,
          maxTravelers: true,
          difficulty: true,
          popular: true,
        },
      }),
      prisma.destination.findMany({
        where: { featured: true },
        orderBy: { id: "asc" },
        select: {
          id: true,
          name: true,
          category: true,
          country: true,
          image: true,
          description: true,
          minTravelers: true,
          maxTravelers: true,
        },
      }),
    ]);

    const packages = allActivePackages.map((pkg) => ({
      ...pkg,
      price: Number(pkg.price),
    }));

    const siteUrl = getBaseUrl();
    const offerCatalogSchema = {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: "Uganda Safari Packages",
      description: "Expert-guided safari packages across Uganda's most breathtaking national parks and destinations.",
      url: `${siteUrl}/packages`,
      numberOfItems: packages.length,
      itemListElement: packages.map((pkg, index) => ({
        "@type": "Offer",
        position: index + 1,
        name: pkg.name,
        url: `${siteUrl}/package/${pkg.slug}`,
        image: pkg.image,
        price: pkg.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "Oliotya Uganda Safaris",
          url: siteUrl,
        },
      })),
    };

    return (
      <main className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogSchema) }}
        />
        <Header initialSettings={siteSettings} />
        <HeroCarousel initialSlides={heroSlides} />
        <HomePageContent
          experienceData={experienceSection}
          tourGuideData={tourGuideSection}
          videoData={videoSection}
          packages={packages}
          destinations={featuredDestinations}
        />
        <Footer initialSettings={siteSettings} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return (
      <main className="min-h-screen">
        <Header />
        <HeroCarousel />
        <HomePageContent
          experienceData={null}
          tourGuideData={null}
          videoData={null}
          packages={[]}
          destinations={[]}
        />
        <Footer />
      </main>
    );
  }
}
