"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronRight, MapPin, Clock, Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { allDestinations } from "@/lib/destinations-data";
import type { SearchFilters } from "@/app/page";

interface PopularPlacesProps {
  filters: SearchFilters | null;
}

export function PopularPlaces({ filters }: PopularPlacesProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [filteredPlaces, setFilteredPlaces] = useState(allDestinations);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filters) {
      setFilteredPlaces(allDestinations);
      return;
    }

    const filtered = allDestinations.filter((place) => {
      // Filter by destination name (case-insensitive partial match)
      const matchesDestination =
        place.name.toLowerCase().includes(filters.destination.toLowerCase()) ||
        place.category
          .toLowerCase()
          .includes(filters.destination.toLowerCase());

      // Filter by number of travelers
      const matchesTravelers =
        (!place.minTravelers || filters.travelers >= place.minTravelers) &&
        (!place.maxTravelers || filters.travelers <= place.maxTravelers);

      return matchesDestination && matchesTravelers;
    });

    setFilteredPlaces(filtered);
  }, [filters]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollWidth = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;
      const progress = (currentScroll / scrollWidth) * 100;
      setScrollProgress(progress);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [filteredPlaces]);

  return (
    <section id="search-results" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {filters
              ? `Found ${filteredPlaces.length} Matching Packages`
              : "Popular packages"}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {filters ? (
              <>
                Showing packages for {filters.travelers} traveler
                {filters.travelers > 1 ? "s" : ""} to{" "}
                <span className="font-semibold text-foreground">
                  {filters.destination}
                </span>
                {filters.dateRange?.from && (
                  <>
                    {" "}
                    • {format(filters.dateRange.from, "MMM dd")}
                    {filters.dateRange.to &&
                      ` - ${format(filters.dateRange.to, "MMM dd, yyyy")}`}
                  </>
                )}
              </>
            ) : (
              "The most beautiful places in Uganda range from mountain gorilla sanctuaries and wildlife reserves to vibrant cities bustling with culture and adventure."
            )}
          </p>
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">
              No packages found matching your search criteria.
            </p>
            <p className="text-muted-foreground">
              Try adjusting your destination or number of travelers.
            </p>
          </div>
        ) : (
          <>
            <div
              ref={containerRef}
              className="flex gap-8 overflow-x-auto scroll-smooth py-8 px-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollSnapType: "x mandatory",
              }}
            >
              {filteredPlaces.map((place, index) => (
                <Card
                  key={place.id}
                  className="shrink-0 w-[360px] group transition-all duration-500 animate-fade-in-up border-0 bg-background overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    scrollSnapAlign: "center",
                    boxShadow: "0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-start justify-between">
                        <Badge className="bg-primary text-primary-foreground shadow-lg backdrop-blur-sm">
                          {place.category}
                        </Badge>
                        <Badge className="bg-background/90 text-foreground shadow-lg backdrop-blur-sm">
                          <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
                          {place.rating}
                        </Badge>
                      </div>
                      <img
                        src={place.image || "/placeholder.svg"}
                        alt={place.name}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-inter text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {place.name}
                        </h3>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{place.country}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{place.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span>Max {place.groupSize} people</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            From
                          </p>
                          <span className="text-2xl font-bold text-primary">
                            ${place.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {" "}
                            /person
                          </span>
                        </div>
                        <Link
                          href={
                            filters
                              ? `/trip/${place.id}?travelers=${filters.travelers}${
                                  filters.dateRange?.from
                                    ? `&dateFrom=${filters.dateRange.from.toISOString()}`
                                    : ""
                                }${
                                  filters.dateRange?.to
                                    ? `&dateTo=${filters.dateRange.to.toISOString()}`
                                    : ""
                                }`
                              : `/trip/${place.id}`
                          }
                        >
                          <Button
                            size="lg"
                            className="group/btn shadow-lg hover:shadow-xl"
                          >
                            Explore
                            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Scroll Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mt-8 mb-12">
              {Array.from({ length: Math.min(filteredPlaces.length, 5) }).map(
                (_, index) => {
                  const isActive =
                    scrollProgress >= index * (100 / Math.min(filteredPlaces.length, 5)) &&
                    scrollProgress < (index + 1) * (100 / Math.min(filteredPlaces.length, 5));
                  return (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? "w-8 bg-primary"
                          : "w-1.5 bg-muted-foreground/30"
                      }`}
                    />
                  );
                }
              )}
            </div>

            <div className="mt-16 bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="font-inter text-2xl font-bold mb-3">
                  Discover More Adventures
                </h3>
                <p className="text-muted-foreground mb-6">
                  Explore our complete collection of safari experiences, cultural tours, and wildlife adventures across Uganda
                </p>
                <Link href="/destinations">
                  <Button size="lg" className="text-base px-8 shadow-lg hover:shadow-xl group">
                    View All Trips
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
