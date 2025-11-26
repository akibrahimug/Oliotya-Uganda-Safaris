"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
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
import Link from "next/link";

interface Destination {
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
}

export default function DestinationPage() {
  const params = useParams();
  const destinationId = Number.parseInt(params.id as string);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestination();
  }, [destinationId]);

  const fetchDestination = async () => {
    try {
      const response = await fetch(`/api/destinations/${destinationId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch destination");
      }
      const data = await response.json();
      setDestination(data.destination);
    } catch (error) {
      console.error("Error fetching destination:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!destination) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h1 className="font-inter text-4xl font-bold mb-4">
              Destination Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The destination you're looking for doesn't exist.
            </p>
            <Link href="/destinations">
              <Button size="lg">View All Destinations</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
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

      {/* Main Content */}
      <section className="py-16 container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="mb-12">
            <h2 className="font-inter text-4xl font-bold mb-6">
              About {destination.name}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Gallery Section 1 */}
          {destination.images && destination.images.length > 0 && (
            <div className="mb-16">
              <h3 className="font-inter text-2xl font-bold mb-6 text-center">
                Experience {destination.name}
              </h3>
              <DestinationGallery images={destination.images} columns={3} />
            </div>
          )}

          {/* History & Background */}
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

          {/* Geography & Climate */}
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

          {/* Wildlife & Nature */}
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

          {/* Local Culture & Communities */}
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

          {/* Best Time to Visit */}
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

          {/* Gallery Section 2 */}
          {destination.gallery2Images && destination.gallery2Images.length > 0 && (
            <div className="mb-16">
              <h3 className="font-inter text-2xl font-bold mb-6 text-center">
                More of {destination.name}
              </h3>
              <DestinationGallery images={destination.gallery2Images} columns={3} />
            </div>
          )}

          {/* Call to Action */}
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
                  View Safari Packages
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Plan Your Trip
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
