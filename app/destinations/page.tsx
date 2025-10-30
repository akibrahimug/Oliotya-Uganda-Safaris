"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TripCard } from "@/components/trip-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { allDestinations } from "@/lib/destinations-data";

function DestinationsContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const travelers = searchParams.get("travelers");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories from all destinations
  const categories = Array.from(
    new Set(allDestinations.map((dest) => dest.category))
  );

  // Filter destinations based on selected category
  const filteredDestinations = selectedCategory
    ? allDestinations.filter((dest) => dest.category === selectedCategory)
    : allDestinations;

  return (
    <>
      <div className="relative h-96 bg-linear-to-r from-secondary to-secondary/80">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1920')] bg-cover bg-center opacity-20" />
        <div className="relative container mx-auto px-4 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="font-inter text-5xl md:text-6xl font-bold text-secondary-foreground mb-4 animate-fade-in-up">
            Explore Uganda
          </h1>
          <p className="text-secondary-foreground/90 text-xl max-w-2xl animate-fade-in-up animation-delay-200">
            Discover the Pearl of Africa's most breathtaking destinations
          </p>
          {destination && (
            <div className="mt-6 animate-fade-in-up animation-delay-400">
              <Badge className="bg-primary text-primary-foreground text-base px-4 py-2">
                Searching: {destination} • {travelers} travelers
              </Badge>
            </div>
          )}
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-4 mb-12">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              All Destinations
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
            {filteredDestinations.map((dest, index) => (
              <TripCard
                key={dest.id}
                id={dest.id}
                name={dest.name}
                country={dest.country}
                category={dest.category}
                price={dest.price}
                rating={dest.rating}
                duration={dest.duration}
                groupSize={dest.groupSize}
                image={dest.image}
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
