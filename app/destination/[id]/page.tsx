import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DestinationGallery } from "@/components/destination-gallery";
import {
  MapPin,
  Globe,
  Landmark,
  Users,
  Calendar,
  TreePine,
  Mountain,
  Waves,
  BookOpen,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getBaseUrl, toAbsoluteUrl } from "@/lib/seo";

type PageProps = {
  params: Promise<{ id: string }>;
};

type DestinationPageData = {
  id: number;
  name: string;
  category: string;
  country: string;
  region: string | null;
  description: string;
  image: string;
  images: string[];
  gallery2Images: string[];
  history: {
    title: string;
    content: string[];
  } | null;
  geography: {
    description: string;
    climate: string;
  } | null;
  wildlife: {
    description: string;
    mammals: string[];
    birds: string[];
    flora: string[];
  } | null;
  culture: {
    description: string;
    experiences: string[];
  } | null;
  bestTimeToVisit: {
    description: string;
    drySeason: {
      title: string;
      description: string;
    };
    wetSeason: {
      title: string;
      description: string;
    };
  } | null;
};

export const revalidate = 300;

function toTextSnippet(value: string, fallback: string): string {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) return fallback;
  return normalized.length > 160 ? `${normalized.slice(0, 157)}...` : normalized;
}

async function getDestinationById(id: number): Promise<DestinationPageData | null> {
  const destination = await prisma.destination.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      category: true,
      country: true,
      region: true,
      description: true,
      image: true,
      images: true,
      gallery2Images: true,
      historyTitle: true,
      historyContent: true,
      geographyDescription: true,
      geographyClimate: true,
      wildlifeDescription: true,
      wildlifeMammals: true,
      wildlifeBirds: true,
      wildlifeFlora: true,
      cultureDescription: true,
      cultureExperiences: true,
      bestTimeDescription: true,
      drySeasonTitle: true,
      drySeasonDescription: true,
      wetSeasonTitle: true,
      wetSeasonDescription: true,
    },
  });

  if (!destination) return null;

  return {
    id: destination.id,
    name: destination.name,
    category: destination.category,
    country: destination.country,
    region: destination.region,
    description: destination.description,
    image: destination.image,
    images: Array.isArray(destination.images) ? destination.images : [],
    gallery2Images: Array.isArray(destination.gallery2Images) ? destination.gallery2Images : [],
    history: destination.historyTitle &&
      Array.isArray(destination.historyContent) &&
      destination.historyContent.length > 0
      ? {
          title: destination.historyTitle,
          content: destination.historyContent,
        }
      : null,
    geography: destination.geographyDescription || destination.geographyClimate
      ? {
          description: destination.geographyDescription || "",
          climate: destination.geographyClimate || "",
        }
      : null,
    wildlife: destination.wildlifeDescription ||
      (Array.isArray(destination.wildlifeMammals) && destination.wildlifeMammals.length > 0) ||
      (Array.isArray(destination.wildlifeBirds) && destination.wildlifeBirds.length > 0) ||
      (Array.isArray(destination.wildlifeFlora) && destination.wildlifeFlora.length > 0)
      ? {
          description: destination.wildlifeDescription || "",
          mammals: Array.isArray(destination.wildlifeMammals) ? destination.wildlifeMammals : [],
          birds: Array.isArray(destination.wildlifeBirds) ? destination.wildlifeBirds : [],
          flora: Array.isArray(destination.wildlifeFlora) ? destination.wildlifeFlora : [],
        }
      : null,
    culture: destination.cultureDescription ||
      (Array.isArray(destination.cultureExperiences) && destination.cultureExperiences.length > 0)
      ? {
          description: destination.cultureDescription || "",
          experiences: Array.isArray(destination.cultureExperiences) ? destination.cultureExperiences : [],
        }
      : null,
    bestTimeToVisit: destination.bestTimeDescription ||
      destination.drySeasonTitle ||
      destination.wetSeasonTitle
      ? {
          description: destination.bestTimeDescription || "",
          drySeason: {
            title: destination.drySeasonTitle || "",
            description: destination.drySeasonDescription || "",
          },
          wetSeason: {
            title: destination.wetSeasonTitle || "",
            description: destination.wetSeasonDescription || "",
          },
        }
      : null,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const destinationId = Number.parseInt(id, 10);
  const baseUrl = getBaseUrl();

  if (!Number.isFinite(destinationId)) {
    return {
      title: "Destination Not Found | Oliotya Uganda Safaris",
      description: "The requested destination could not be found.",
      alternates: {
        canonical: `${baseUrl}/destinations`,
      },
    };
  }

  const destination = await getDestinationById(destinationId);

  if (!destination) {
    return {
      title: "Destination Not Found | Oliotya Uganda Safaris",
      description: "The requested destination could not be found.",
      alternates: {
        canonical: `${baseUrl}/destinations`,
      },
    };
  }

  const description = toTextSnippet(
    destination.description,
    "Explore Uganda's top safari destinations with Oliotya Uganda Safaris."
  );
  const canonical = `${baseUrl}/destination/${destination.id}`;
  const image = toAbsoluteUrl(destination.image, baseUrl);

  return {
    title: `${destination.name} | Destination Guide | Oliotya Uganda Safaris`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: `${destination.name} | Destination Guide`,
      description,
      url: canonical,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: destination.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${destination.name} | Destination Guide`,
      description,
      images: [image],
    },
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { id } = await params;
  const destinationId = Number.parseInt(id, 10);

  if (!Number.isFinite(destinationId)) {
    notFound();
  }

  const destination = await getDestinationById(destinationId);

  if (!destination) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const destinationUrl = `${baseUrl}/destination/${destination.id}`;
  const destinationImage = toAbsoluteUrl(destination.image, baseUrl);
  const destinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.description,
    url: destinationUrl,
    image: [
      destinationImage,
      ...destination.images.slice(0, 3).map((image) => toAbsoluteUrl(image, baseUrl)),
    ],
    touristType: destination.category,
    containedInPlace: destination.country
      ? {
          "@type": "Country",
          name: destination.country,
        }
      : undefined,
    provider: {
      "@type": "Organization",
      name: "Oliotya Uganda Safaris",
      url: baseUrl,
    },
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
      />
      <Header />

      <section className="relative h-[70vh] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="container mx-auto px-4 lg:px-8">
            <Badge className="bg-primary text-primary-foreground mb-4">
              {destination.category}
            </Badge>
            <h1 className="font-inter text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-4">
              {destination.name}
            </h1>
            <div className="flex items-center gap-4 text-background/90">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="text-base md:text-lg">{destination.region}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="font-inter text-4xl font-bold mb-6">
              About {destination.name}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {destination.description}
            </p>
          </div>

          {destination.images.length > 0 && (
            <div className="mb-16">
              <h3 className="font-inter text-2xl font-bold mb-6 text-center">
                Experience {destination.name}
              </h3>
              <DestinationGallery images={destination.images} columns={3} />
            </div>
          )}

          {destination.history && (
            <div className="mb-12 bg-muted/30 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <Landmark className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-inter text-3xl font-bold mb-4">
                    {destination.history.title}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    {destination.history.content.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {destination.geography && (
            <div className="mb-12">
              <div className="flex items-start gap-4 mb-6">
                <Mountain className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="font-inter text-3xl font-bold mb-6">
                    Geography & Climate
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
                          <Globe className="h-5 w-5 text-primary" />
                          Geography
                        </h3>
                        <p className="text-muted-foreground">
                          {destination.geography.description}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
                          <Waves className="h-5 w-5 text-primary" />
                          Climate
                        </h3>
                        <p className="text-muted-foreground">
                          {destination.geography.climate}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}

          {destination.wildlife && (
            <div className="mb-12 bg-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="flex items-start gap-4 mb-6">
                <TreePine className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-inter text-3xl font-bold mb-4">
                    Wildlife & Nature
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{destination.wildlife.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Mammals</h4>
                        <ul className="space-y-2">
                          {destination.wildlife.mammals.map((mammal, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span>{mammal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Birds</h4>
                        <ul className="space-y-2 mb-6">
                          {destination.wildlife.birds.map((bird, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span>{bird}</span>
                            </li>
                          ))}
                        </ul>
                        <h4 className="font-semibold text-foreground mb-2">Flora</h4>
                        <ul className="space-y-2">
                          {destination.wildlife.flora.map((flora, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span>{flora}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {destination.culture && (
            <div className="mb-12">
              <div className="flex items-start gap-4 mb-6">
                <Users className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-inter text-3xl font-bold mb-4">
                    Local Culture & Communities
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{destination.culture.description}</p>
                    <div className="bg-background rounded-lg p-6 mt-6">
                      <h4 className="font-semibold text-foreground mb-3">Cultural Experiences</h4>
                      <ul className="space-y-3">
                        {destination.culture.experiences.map((experience, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{experience}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {destination.bestTimeToVisit && (
            <div className="mb-12 bg-muted/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <Calendar className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-inter text-3xl font-bold mb-4">
                    Best Time to Visit
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{destination.bestTimeToVisit.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-background rounded-lg p-5">
                        <h4 className="font-semibold text-foreground mb-2">
                          {destination.bestTimeToVisit.drySeason.title}
                        </h4>
                        <p className="text-sm">
                          {destination.bestTimeToVisit.drySeason.description}
                        </p>
                      </div>
                      <div className="bg-background rounded-lg p-5">
                        <h4 className="font-semibold text-foreground mb-2">
                          {destination.bestTimeToVisit.wetSeason.title}
                        </h4>
                        <p className="text-sm">
                          {destination.bestTimeToVisit.wetSeason.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {destination.gallery2Images.length > 0 && (
            <div className="mb-16">
              <h3 className="font-inter text-2xl font-bold mb-6 text-center">
                More of {destination.name}
              </h3>
              <DestinationGallery images={destination.gallery2Images} columns={3} />
            </div>
          )}

          <div className="bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20 text-center">
            <h3 className="font-inter text-2xl font-bold mb-3">
              Ready to Experience {destination.name}?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Explore our carefully curated safari packages designed to showcase the best
              of this incredible destination while supporting local communities and conservation efforts.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/packages">
                <Button size="lg" className="shadow-lg hover:shadow-xl">
                  Browse Safari Packages
                </Button>
              </Link>
              <Link href="/build-package">
                <Button size="lg" variant="outline">
                  Request Custom Itinerary
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
