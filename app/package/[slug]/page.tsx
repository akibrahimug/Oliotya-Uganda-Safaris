import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DestinationGallery } from "@/components/destination-gallery";
import { BookingButton } from "@/components/booking-button";
import { Clock, Users, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { getBaseUrl, toAbsoluteUrl } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type ItineraryItem = {
  day: number;
  title: string;
  description: string;
};

type PackagePageData = {
  id: number;
  name: string;
  slug: string;
  category: string;
  duration: string;
  price: number;
  description: string;
  shortDesc: string | null;
  image: string;
  images: string[];
  gallery2Images: string[];
  highlights: string[];
  itinerary: ItineraryItem[];
  included: string[];
  excluded: string[];
  minTravelers: number;
  maxTravelers: number;
  difficulty: string;
};

export const revalidate = 300;

function formatDifficulty(difficulty: string): string {
  return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
}

function toTextSnippet(value: string, fallback: string): string {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) return fallback;
  return normalized.length > 160 ? `${normalized.slice(0, 157)}...` : normalized;
}

function normalizeItinerary(rawItinerary: unknown): ItineraryItem[] {
  if (!Array.isArray(rawItinerary)) return [];

  return rawItinerary
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") return null;
      const item = entry as Record<string, unknown>;
      const day = Number(item.day);
      const title = typeof item.title === "string" ? item.title : "";
      const description = typeof item.description === "string" ? item.description : "";
      return {
        day: Number.isFinite(day) && day > 0 ? day : index + 1,
        title,
        description,
      };
    })
    .filter((item): item is ItineraryItem => Boolean(item && (item.title || item.description)));
}

async function getPackageBySlug(slug: string): Promise<PackagePageData | null> {
  const pkg = await prisma.package.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      duration: true,
      price: true,
      description: true,
      shortDesc: true,
      image: true,
      images: true,
      gallery2Images: true,
      highlights: true,
      itinerary: true,
      included: true,
      excluded: true,
      minTravelers: true,
      maxTravelers: true,
      difficulty: true,
    },
  });

  if (!pkg) return null;

  return {
    ...pkg,
    price: Number(pkg.price),
    images: Array.isArray(pkg.images) ? pkg.images : [],
    gallery2Images: Array.isArray(pkg.gallery2Images) ? pkg.gallery2Images : [],
    highlights: Array.isArray(pkg.highlights) ? pkg.highlights : [],
    itinerary: normalizeItinerary(pkg.itinerary),
    included: Array.isArray(pkg.included) ? pkg.included : [],
    excluded: Array.isArray(pkg.excluded) ? pkg.excluded : [],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  const baseUrl = getBaseUrl();

  if (!pkg) {
    return {
      title: "Package Not Found | Oliotya Uganda Safaris",
      description: "The requested safari package could not be found.",
      alternates: {
        canonical: `${baseUrl}/packages`,
      },
    };
  }

  const description = toTextSnippet(pkg.shortDesc || pkg.description, "Explore Uganda safari packages.");
  const canonical = `${baseUrl}/package/${pkg.slug}`;
  const image = toAbsoluteUrl(pkg.image, baseUrl);

  return {
    title: `${pkg.name} | Oliotya Uganda Safaris`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: `${pkg.name} | Oliotya Uganda Safaris`,
      description,
      url: canonical,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: pkg.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pkg.name} | Oliotya Uganda Safaris`,
      description,
      images: [image],
    },
  };
}

export default async function PackagePage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const packageUrl = `${baseUrl}/package/${pkg.slug}`;
  const packageImage = toAbsoluteUrl(pkg.image, baseUrl);
  const packageSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.name,
    description: pkg.shortDesc || pkg.description,
    url: packageUrl,
    image: [packageImage, ...pkg.images.slice(0, 3).map((image) => toAbsoluteUrl(image, baseUrl))],
    provider: {
      "@type": "Organization",
      name: "Oliotya Uganda Safaris",
      url: baseUrl,
    },
    offers: {
      "@type": "Offer",
      price: pkg.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: packageUrl,
    },
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(packageSchema) }}
      />
      <Header />

      <section className="relative h-[70vh] overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex gap-3 mb-4">
              <Badge className="bg-primary text-primary-foreground">
                {pkg.category}
              </Badge>
              <Badge
                variant="outline"
                className="bg-background/90 text-foreground"
              >
                {formatDifficulty(pkg.difficulty)}
              </Badge>
            </div>
            <h1 className="font-inter text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-4">
              {pkg.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-background/90 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-base md:text-lg">{pkg.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-base md:text-lg">
                  {pkg.minTravelers}-{pkg.maxTravelers} travelers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">${pkg.price}</span>
                <span className="text-base">/ person</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-12">
                <h2 className="font-inter text-4xl font-bold mb-6">Overview</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {pkg.highlights.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-inter text-3xl font-bold mb-6">
                    Safari Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pkg.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pkg.images.length > 1 && (
                <div className="mb-12">
                  <h2 className="font-inter text-3xl font-bold mb-6">
                    Package Gallery
                  </h2>
                  <DestinationGallery images={pkg.images} columns={2} />
                </div>
              )}

              {pkg.gallery2Images.length > 1 && (
                <div className="mb-12">
                  <h2 className="font-inter text-3xl font-bold mb-6">
                    More Package Photos
                  </h2>
                  <DestinationGallery images={pkg.gallery2Images} columns={2} />
                </div>
              )}

              {pkg.itinerary.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-inter text-3xl font-bold mb-6">
                    Detailed Itinerary
                  </h2>
                  <div className="space-y-6">
                    {pkg.itinerary.map((day) => (
                      <div
                        key={day.day}
                        className="bg-muted/30 rounded-2xl p-6 border border-border"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground font-bold">
                              {day.day}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-inter text-xl font-bold mb-3">
                              Day {day.day}: {day.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {day.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-inter text-2xl font-bold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                      What's Included
                    </h3>
                    <ul className="space-y-3">
                      {pkg.included.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-inter text-2xl font-bold mb-4 flex items-center gap-2">
                      <XCircle className="h-6 w-6 text-destructive" />
                      What's Not Included
                    </h3>
                    <ul className="space-y-3">
                      {pkg.excluded.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="border-2 border-primary/20 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <p className="text-sm text-muted-foreground mb-2">
                        Starting from
                      </p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold text-primary">
                          ${pkg.price}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        per person
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">Duration</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {pkg.duration}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">
                            Group Size
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {pkg.minTravelers}-{pkg.maxTravelers} people
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">
                            Difficulty
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDifficulty(pkg.difficulty)}
                        </span>
                      </div>
                    </div>

                    <BookingButton
                      packageName={pkg.name}
                      packageSlug={pkg.slug}
                      maxTravelers={pkg.maxTravelers}
                      price={pkg.price}
                      packageId={pkg.id}
                    />

                    <Link href="/build-package" className="block mt-3">
                      <Button size="lg" variant="outline" className="w-full">
                        Request Custom Itinerary
                      </Button>
                    </Link>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                      Questions? Contact us for a personalized quote
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
