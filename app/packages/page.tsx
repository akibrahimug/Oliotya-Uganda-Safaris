"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { PackageCard } from "@/components/package-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { allPackages } from "@/lib/packages-data";

const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PATH = "nambi-uganda-safaris/images";

const heroSlides = [
  {
    image: `${R2_BASE}/${IMAGE_PATH}/uganda-queen-elizabeth-national-park-safari.webp`,
    title: "Discover the Pearl of Africa",
    subtitle: "Safari Packages",
    description:
      "Explore curated safari experiences across Uganda's most breathtaking destinations and national parks.",
  },
];

function DestinationsContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const travelers = searchParams.get("travelers");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories from all packages
  const categories = Array.from(
    new Set(allPackages.map((pkg) => pkg.category))
  );

  // Filter packages based on selected category
  const filteredPackages = selectedCategory
    ? allPackages.filter((pkg) => pkg.category === selectedCategory)
    : allPackages;

  return (
    <>
      <PageHero slides={heroSlides} showCounter={false} showDots={false} autoPlay={false} />
      {destination && (
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Badge className="bg-primary text-primary-foreground text-base px-4 py-2">
            Searching: {destination} • {travelers} travelers
          </Badge>
        </div>
      )}

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-4 mb-12">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              All Packages
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, index) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                slug={pkg.slug}
                name={pkg.name}
                category={pkg.category}
                price={pkg.price}
                duration={pkg.duration}
                maxTravelers={pkg.maxTravelers}
                image={pkg.image}
                difficulty={pkg.difficulty}
                animationDelay={index * 50}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function DestinationsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        }
      >
        <DestinationsContent />
      </Suspense>
      <Footer />
    </main>
  );
}
