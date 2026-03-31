import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { BuildPackageClient } from "./build-package-client";
import { prisma } from "@/lib/db";
import { getBaseUrl, toAbsoluteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;

const R2_BASE =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
  "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";

const DEFAULT_HERO = {
  image: `${R2_BASE}/nambi-uganda-safaris/images/uganda-queen-elizabeth-national-park-safari.webp`,
  title: "Create Your Perfect Adventure",
  subtitle: "Custom Safari Packages",
  description:
    "Design your ideal safari experience with our expert team. Choose destinations, activities, and accommodations that match your preferences.",
};

const DEFAULT_CONTENT = {
  title: "Build Your Custom Safari Package",
  subtitle: "",
  description:
    "Select the destinations you want to visit, customize the duration, choose your preferred accommodations, and let our expert team create your perfect safari experience.",
};

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const title = "Build a Custom Safari Package - Oliotya Uganda Safaris";
  const description =
    "Design your perfect Uganda safari. Choose destinations, set your duration, and request a personalised quote from our expert team.";

  const [hero, settings] = await Promise.all([
    prisma.customPackageHero.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      select: { image: true },
    }),
    getSiteSettings(),
  ]);

  const ogImageRaw =
    hero?.image || settings.meta?.ogImage || settings.brand?.logo || "";
  const ogImage = ogImageRaw
    ? toAbsoluteUrl(ogImageRaw, baseUrl)
    : `${baseUrl}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/build-package` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${baseUrl}/build-package`,
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

export default async function BuildPackagePage() {
  const [heroSection, contentSection, destinations] = await Promise.all([
    prisma.customPackageHero.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.customPackageContent.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.destination.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        category: true,
        image: true,
        description: true,
        country: true,
        region: true,
      },
    }),
  ]);

  const heroSlide = heroSection
    ? {
        image: heroSection.image || DEFAULT_HERO.image,
        title: heroSection.title || DEFAULT_HERO.title,
        subtitle: heroSection.subtitle || DEFAULT_HERO.subtitle,
        description: heroSection.description || DEFAULT_HERO.description,
      }
    : DEFAULT_HERO;

  const pageContent = contentSection
    ? {
        title: contentSection.title || DEFAULT_CONTENT.title,
        subtitle: contentSection.subtitle || DEFAULT_CONTENT.subtitle,
        description: contentSection.description || DEFAULT_CONTENT.description,
      }
    : DEFAULT_CONTENT;

  return (
    <main className="min-h-screen">
      <Header />
      <PageHero
        slides={[heroSlide]}
        showCounter={false}
        showDots={false}
        autoPlay={false}
        fallbackImage={DEFAULT_HERO.image}
      />
      <BuildPackageClient
        destinations={destinations}
        pageContent={pageContent}
      />
      <Footer />
    </main>
  );
}
