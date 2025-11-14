import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { allDestinationsOnly } from "@/lib/destinations-only-data";
import { MapPin } from "lucide-react";

const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PATH = "nambi-uganda-safaris/images";

const heroSlides = [
  {
    image: `${R2_BASE}/${IMAGE_PATH}/uganda-queen-elizabeth-national-park-safari.webp`,
    title: "Discover the Pearl of Africa",
    subtitle: "Explore Destinations",
    description:
      "Discover Uganda's most breathtaking locations and unique experiences across diverse landscapes and ecosystems.",
  },
];

export default function DestinationsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <PageHero slides={heroSlides} showCounter={false} showDots={false} autoPlay={false} />

        {/* Destinations Grid */}
        <section className="container mx-auto px-4 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allDestinationsOnly.map((dest, index) => (
              <Link
                key={dest.id}
                href={`/destination/${dest.id}`}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground shadow-lg backdrop-blur-sm">
                    {dest.category}
                  </Badge>

                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                    <div className="flex items-center gap-2 mb-2 opacity-90">
                      <MapPin className="h-4 w-4" />
                      <p className="text-sm">{dest.region}</p>
                    </div>
                    <h3 className="font-serif text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-background/90 mb-4 line-clamp-2 text-sm leading-relaxed">
                      {dest.description}
                    </p>
                    <Button
                      size="sm"
                      className="bg-background text-foreground hover:bg-background/90"
                    >
                      Explore
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Browse our curated safari packages and find the perfect journey for you
            </p>
            <Link href="/packages">
              <Button
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                View Safari Packages
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
