"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { allDestinations } from "@/lib/destinations-data";
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

export default function DestinationPage() {
  const params = useParams();
  const destinationId = Number.parseInt(params.id as string);
  const destination = allDestinations.find((dest) => dest.id === destinationId);

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
          src={destination.image || "/placeholder.svg"}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <Badge className="bg-primary text-primary-foreground mb-4">
            {destination.category}
          </Badge>
          <h1 className="font-inter text-5xl md:text-6xl font-bold text-background mb-4">
            {destination.name}
          </h1>
          <div className="flex items-center gap-4 text-background/90">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{destination.country}</span>
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
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {destination.description}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Known for its stunning natural beauty and rich biodiversity, {destination.name}
              stands as one of Uganda's most treasured destinations. This remarkable location
              offers visitors a unique glimpse into the heart of Africa's natural wonders and
              cultural heritage.
            </p>
          </div>

          {/* History & Background */}
          <div className="mb-12 bg-muted/30 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Landmark className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-inter text-3xl font-bold mb-4">
                  History & Background
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    {destination.name} has a rich history that dates back centuries. The area
                    has been inhabited by local communities who have lived in harmony with
                    nature, developing sustainable practices that continue to influence
                    conservation efforts today.
                  </p>
                  <p>
                    Over the years, the region has evolved into a protected area, recognized
                    for its ecological significance and its role in preserving Uganda's natural
                    heritage. The establishment of conservation programs has helped protect the
                    unique flora and fauna found here, making it a sanctuary for both wildlife
                    and cultural traditions.
                  </p>
                  <p>
                    Today, {destination.name} represents a perfect blend of natural conservation
                    and cultural preservation, offering insights into both Uganda's past and its
                    commitment to sustainable tourism for the future.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Geography & Climate */}
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
                        The landscape features diverse terrain including forests, mountains,
                        valleys, and waterways. This varied topography creates unique
                        ecosystems that support an incredible array of wildlife and plant species.
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
                        The region experiences a tropical climate with distinct wet and dry
                        seasons. The best time to visit is during the dry seasons (June-August
                        and December-February) when wildlife viewing is optimal and trails are
                        more accessible.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Wildlife & Nature */}
          <div className="mb-12 bg-primary/5 rounded-2xl p-8 border border-primary/20">
            <div className="flex items-start gap-4 mb-6">
              <TreePine className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-inter text-3xl font-bold mb-4">
                  Wildlife & Nature
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    {destination.name} is home to an extraordinary variety of wildlife species.
                    From majestic primates to colorful bird species, the biodiversity here is
                    remarkable. The area serves as a critical habitat for several endangered
                    species, making conservation efforts particularly important.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Key Wildlife</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>Primates including mountain gorillas and chimpanzees</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>Large mammals like elephants and buffalo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>Over 300 species of birds</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Flora</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>Ancient tropical rainforests</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>Rare medicinal plants and herbs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>Diverse ecosystem supporting unique biodiversity</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Local Culture & Communities */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <Users className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-inter text-3xl font-bold mb-4">
                  Local Culture & Communities
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    The indigenous communities surrounding {destination.name} have a deep
                    connection to the land. Their traditional knowledge and practices have
                    been instrumental in preserving the area's natural resources for generations.
                  </p>
                  <p>
                    Visitors have the opportunity to engage with local communities through
                    cultural experiences, learning about traditional customs, crafts, and daily
                    life. These interactions provide meaningful connections and support local
                    livelihoods through community-based tourism initiatives.
                  </p>
                  <div className="bg-background rounded-lg p-6 mt-6">
                    <h4 className="font-semibold text-foreground mb-3">Cultural Experiences</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Traditional storytelling and folklore sessions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Local craft demonstrations and workshops</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Traditional dance and music performances</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Community-led nature walks</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Time to Visit */}
          <div className="mb-12 bg-muted/30 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <Calendar className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-inter text-3xl font-bold mb-4">
                  Best Time to Visit
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    While {destination.name} can be visited year-round, certain seasons offer
                    optimal conditions for different activities:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-background rounded-lg p-5">
                      <h4 className="font-semibold text-foreground mb-2">
                        Dry Season (June - August, December - February)
                      </h4>
                      <p className="text-sm">
                        Best for wildlife viewing, trekking, and photography. Trails are drier
                        and animals gather around water sources, making them easier to spot.
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-5">
                      <h4 className="font-semibold text-foreground mb-2">
                        Wet Season (March - May, September - November)
                      </h4>
                      <p className="text-sm">
                        Ideal for bird watching as migratory species arrive. The landscape is
                        lush and green, offering stunning scenery. Fewer tourists mean a more
                        intimate experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20 text-center">
            <h3 className="font-inter text-2xl font-bold mb-3">
              Ready to Experience {destination.name}?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Explore our carefully curated tour packages designed to showcase the best
              of this incredible destination while supporting local communities and conservation efforts.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href={`/trip/${destinationId}`}>
                <Button size="lg" className="shadow-lg hover:shadow-xl">
                  View Tour Details
                </Button>
              </Link>
              <Link href={`/trip/${destinationId}/book`}>
                <Button size="lg" variant="outline">
                  See Our Packages
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
