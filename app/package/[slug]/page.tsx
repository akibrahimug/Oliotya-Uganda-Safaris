"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DestinationGallery } from "@/components/destination-gallery";
import { BookingButton } from "@/components/booking-button";
import { allPackages, type DifficultyLevel } from "@/lib/packages-data";
import { Clock, Users, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

// Helper function to format difficulty for display
const formatDifficulty = (difficulty: DifficultyLevel): string => {
  return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
};

export default function PackagePage() {
  const params = useParams();
  const packageSlug = params.slug as string;
  const pkg = allPackages.find((p) => p.slug === packageSlug);

  if (!pkg) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h1 className="font-inter text-4xl font-bold mb-4">
              Package Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The package you're looking for doesn't exist.
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

      {/* Main Content */}
      <section className="py-16 container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Overview */}
              <div className="mb-12">
                <h2 className="font-inter text-4xl font-bold mb-6">Overview</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {/* Highlights */}
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

              {/* Gallery */}
              {pkg.images && pkg.images.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-inter text-3xl font-bold mb-6">
                    Package Gallery
                  </h2>
                  <DestinationGallery images={pkg.images} columns={2} />
                </div>
              )}

              {/* Detailed Itinerary */}
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

              {/* What's Included/Excluded */}
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

            {/* Right Column - Booking Card */}
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
