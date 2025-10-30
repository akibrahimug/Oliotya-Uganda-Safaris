"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Calendar, Users, Heart } from "lucide-react";

const destinations = [
  {
    id: 1,
    name: "Bwindi Impenetrable Forest",
    location: "Southwestern Uganda",
    category: "Gorilla Trekking",
    price: 1450.84,
    rating: 5.0,
    reviews: 234,
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Home to half of the world's mountain gorillas. Experience unforgettable gorilla trekking in ancient rainforest.",
    duration: "3-5 days",
    groupSize: "2-8 people",
  },
  {
    id: 2,
    name: "Murchison Falls National Park",
    location: "Northwestern Uganda",
    category: "Wildlife Safari",
    price: 897.31,
    rating: 4.9,
    reviews: 189,
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Uganda's largest national park featuring the world's most powerful waterfall and abundant wildlife.",
    duration: "2-4 days",
    groupSize: "4-12 people",
  },
  {
    id: 3,
    name: "Queen Elizabeth National Park",
    location: "Western Uganda",
    category: "Wildlife Safari",
    price: 1203.0,
    rating: 4.8,
    reviews: 156,
    image: "/queen-elizabeth-national-park-tree-climbing-lions.jpg",
    description:
      "Famous for tree-climbing lions and diverse ecosystems from savannah to wetlands.",
    duration: "2-3 days",
    groupSize: "4-10 people",
  },
  {
    id: 4,
    name: "Kibale Forest National Park",
    location: "Western Uganda",
    category: "Primate Tracking",
    price: 890.0,
    rating: 4.9,
    reviews: 201,
    image: "/kibale-forest-chimpanzee-tracking-uganda.jpg",
    description:
      "The primate capital of the world with 13 species including habituated chimpanzees.",
    duration: "2-3 days",
    groupSize: "2-6 people",
  },
  {
    id: 5,
    name: "Lake Mburo National Park",
    location: "Western Uganda",
    category: "Wildlife Safari",
    price: 450.84,
    rating: 4.7,
    reviews: 98,
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Compact savannah park with zebras, impalas, and over 350 bird species.",
    duration: "1-2 days",
    groupSize: "2-8 people",
  },
  {
    id: 6,
    name: "Jinja - Source of the Nile",
    location: "Eastern Uganda",
    category: "Adventure Sports",
    price: 675.5,
    rating: 4.8,
    reviews: 167,
    image: "/jinja-source-of-nile-white-water-rafting.jpg",
    description:
      "Adventure capital with world-class white water rafting, bungee jumping, and kayaking.",
    duration: "1-3 days",
    groupSize: "4-15 people",
  },
  {
    id: 7,
    name: "Rwenzori Mountains",
    location: "Western Uganda",
    category: "Mountain Trekking",
    price: 1850.0,
    rating: 4.9,
    reviews: 87,
    image: "/placeholder.svg?height=400&width=600",
    description:
      "The legendary Mountains of the Moon with snow-capped peaks and glaciers near the equator.",
    duration: "7-10 days",
    groupSize: "2-6 people",
  },
  {
    id: 8,
    name: "Sipi Falls",
    location: "Eastern Uganda",
    category: "Nature & Hiking",
    price: 320.5,
    rating: 4.7,
    reviews: 143,
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Three stunning waterfalls on Mount Elgon's foothills with coffee tours and hiking.",
    duration: "1-2 days",
    groupSize: "2-10 people",
  },
  {
    id: 9,
    name: "Kampala City Tour",
    location: "Central Uganda",
    category: "Cultural Experience",
    price: 450.0,
    rating: 4.6,
    reviews: 112,
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Explore Uganda's vibrant capital with historical sites, markets, and cultural landmarks.",
    duration: "1 day",
    groupSize: "4-20 people",
  },
];

function DestinationsContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const travelers = searchParams.get("travelers");

  return (
    <>
      <div className="relative h-96 bg-gradient-to-r from-secondary to-secondary/80">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1920')] bg-cover bg-center opacity-20" />
        <div className="relative container mx-auto px-4 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-secondary-foreground mb-4 animate-fade-in-up">
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
            <Button variant="default">All Destinations</Button>
            <Button variant="outline">Gorilla Trekking</Button>
            <Button variant="outline">Wildlife Safari</Button>
            <Button variant="outline">Adventure Sports</Button>
            <Button variant="outline">Cultural Tours</Button>
            <Button variant="outline">Mountain Trekking</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest, index) => (
              <Card
                key={dest.id}
                className="group hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Badge className="absolute top-4 left-4 z-10 bg-secondary text-secondary-foreground">
                      {dest.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <img
                      src={dest.image || "/placeholder.svg"}
                      alt={dest.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {dest.location}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {dest.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-semibold">{dest.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({dest.reviews} reviews)
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {dest.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{dest.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{dest.groupSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          From
                        </span>
                        <div className="text-2xl font-bold text-primary">
                          ${dest.price.toFixed(2)}
                        </div>
                      </div>
                      <Button className="group/btn">
                        Book Now
                        <span className="ml-2 transition-transform group-hover/btn:translate-x-1">
                          →
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
