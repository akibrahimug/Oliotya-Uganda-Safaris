"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DestinationGallery } from "@/components/destination-gallery";
import {
  Users,
  Clock,
  CheckCircle,
  Plane,
  Hotel,
  Eye,
  Info,
} from "lucide-react";
import Link from "next/link";

interface Package {
  id: number;
  name: string;
  slug: string;
  category: string;
  duration: string;
  price: number;
  description: string;
  image: string;
  images: string[];
  gallery2Images: string[];
  highlights: string[];
  itinerary: Array<{ day: number; title: string; description: string }>;
  included: string[];
  excluded: string[];
  minTravelers: number;
  maxTravelers: number;
  difficulty: string;
}

export default function TripDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tripId = Number.parseInt(params.id as string);
  const [trip, setTrip] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackage();
  }, [tripId]);

  const fetchPackage = async () => {
    try {
      const response = await fetch(`/api/packages`);
      if (!response.ok) throw new Error("Failed to fetch packages");

      const data = await response.json();
      const foundPkg = data.packages.find((p: Package) => p.id === tripId);

      setTrip(foundPkg || null);
    } catch (error) {
      console.error("Error fetching package:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get search data from URL params
  const travelers = searchParams.get("travelers");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  // Build booking URL with search data
  const bookingUrl = `/trip/${tripId}/book${travelers || dateFrom || dateTo ? "?" : ""}${
    travelers ? `travelers=${travelers}` : ""
  }${dateFrom ? `${travelers ? "&" : ""}dateFrom=${dateFrom}` : ""}${
    dateTo ? `${travelers || dateFrom ? "&" : ""}dateTo=${dateTo}` : ""
  }`;

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

  if (!trip) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h1 className="font-inter text-4xl font-bold mb-4">
              Trip Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The trip you're looking for doesn't exist.
            </p>
            <Link href="/packages">
              <Button size="lg">View All Packages</Button>
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
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={trip.image}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto bg-gradient-to-t from-background/90 via-background/70 to-transparent">
          <Badge className="bg-primary text-primary-foreground mb-4">
            {trip.category}
          </Badge>
          <h1 className="font-inter text-5xl md:text-6xl font-bold text-foreground mb-4">
            {trip.name}
          </h1>
          <div className="flex items-center gap-6 text-foreground/90">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>{trip.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>{trip.minTravelers}-{trip.maxTravelers} travelers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {trip.images && trip.images.length > 1 && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-inter text-2xl font-bold mb-6">Package Gallery</h2>
            <DestinationGallery images={trip.images} columns={3} />
          </div>
        </section>
      )}

      {/* Image Gallery 2 */}
      {trip.gallery2Images && trip.gallery2Images.length > 1 && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-inter text-2xl font-bold mb-6">More Package Photos</h2>
            <DestinationGallery images={trip.gallery2Images} columns={3} />
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16 container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-inter text-3xl font-bold mb-4">Overview</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {trip.description}
              </p>
            </div>

            {/* Highlights */}
            {trip.highlights && trip.highlights.length > 0 && (
              <div>
                <h2 className="font-inter text-3xl font-bold mb-4">
                  Safari Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {trip.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included */}
            {trip.included && trip.included.length > 0 && (
              <div>
                <h2 className="font-inter text-3xl font-bold mb-4">
                  What's Included
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {trip.included.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="font-inter text-3xl font-bold mb-4">
                Trip Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="font-semibold text-lg">{trip.duration}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Users className="h-5 w-5" />
                    <span className="text-sm">Group Size</span>
                  </div>
                  <p className="font-semibold text-lg">{trip.minTravelers}-{trip.maxTravelers} people</p>
                </div>
              </div>
            </div>

            {/* How to Get There */}
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <Plane className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="font-inter text-2xl font-bold mb-3">
                    How to Get There
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Most international visitors fly into Entebbe International Airport, located about 40km from Kampala. From there, our team will arrange your transportation to {trip.name}. Depending on the location, transfers may involve domestic flights, private vehicles, or boat rides. All transfers and logistics are included in your package for a seamless experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Where to Stay */}
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <Hotel className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="font-inter text-2xl font-bold mb-3">
                    Where to Stay
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We partner with carefully selected accommodations ranging from eco-lodges to luxury safari camps. Your stay will include:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Comfortable rooms with stunning views of the surrounding landscape</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Authentic local hospitality and cuisine</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Strategic locations near key attractions and wildlife areas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Eco-friendly practices supporting local communities</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What You'll See */}
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <Eye className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="font-inter text-2xl font-bold mb-3">
                    What You'll Experience
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {trip.name} offers unforgettable encounters with nature and culture:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Diverse wildlife in their natural habitats</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Breathtaking landscapes and scenic views</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Local communities and cultural experiences</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Unique photo opportunities</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="font-inter text-2xl font-bold mb-3">
                    Important Information
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p><strong className="text-foreground">Best Time to Visit:</strong> Year-round destination with dry seasons (June-August & December-February) being ideal for wildlife viewing</p>
                    <p><strong className="text-foreground">What to Bring:</strong> Comfortable walking shoes, light clothing, sun protection, insect repellent, and camera equipment</p>
                    <p><strong className="text-foreground">Fitness Level:</strong> Moderate - suitable for most travelers with basic fitness</p>
                    <p><strong className="text-foreground">Permits & Requirements:</strong> All necessary permits and entry fees are included. We'll handle visa requirements guidance during booking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    Starting from
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    ${Number(trip.price).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">{trip.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-muted-foreground">Group Size</span>
                    <span className="font-semibold">
                      {trip.minTravelers}-{trip.maxTravelers} people
                    </span>
                  </div>
                </div>

                <Link href={bookingUrl}>
                  <Button className="w-full mb-3" size="lg">
                    See Our Packages
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full" size="lg">
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Trips */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-inter text-3xl font-bold mb-8">Similar Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              // First, get trips in the same category
              const sameCategory = allDestinations.filter(
                (dest) => dest.id !== tripId && dest.category === trip.category
              );

              // If we have enough in the same category, use those
              if (sameCategory.length >= 3) {
                return sameCategory.slice(0, 3);
              }

              // Otherwise, add other trips to make up to 3
              const otherTrips = allDestinations.filter(
                (dest) => dest.id !== tripId && dest.category !== trip.category
              );

              return [...sameCategory, ...otherTrips].slice(0, 3);
            })().map((dest) => (
              <Link key={dest.id} href={`/trip/${dest.id}`}>
                <Card className="group hover:shadow-xl transition-all cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-inter text-xl font-bold mb-2">
                        {dest.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {dest.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          ${dest.price.toFixed(2)}
                        </span>
                        <Badge variant="secondary">{dest.duration}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
