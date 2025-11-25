"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/package-card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import type { SearchFilters } from "@/app/page";

interface PopularPlacesProps {
  filters: SearchFilters | null;
}

interface Package {
  id: number;
  name: string;
  slug: string;
  category: string;
  duration: string;
  price: number;
  image: string;
  minTravelers: number;
  maxTravelers: number;
  difficulty: string;
  popular: boolean;
}

export function PopularPlaces({ filters }: PopularPlacesProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch packages from the database
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/cms/packages");
        if (!response.ok) throw new Error("Failed to fetch packages");
        const data = await response.json();
        const popularPkgs = data.packages.filter((pkg: Package) => pkg.popular === true);
        setAllPackages(popularPkgs);
        setFilteredPlaces(popularPkgs);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    if (!filters || allPackages.length === 0) {
      setFilteredPlaces(allPackages);
      return;
    }

    const filtered = allPackages.filter((pkg) => {
      // Filter by package name or category (case-insensitive partial match)
      const matchesDestination =
        pkg.name.toLowerCase().includes(filters.destination.toLowerCase()) ||
        pkg.category
          .toLowerCase()
          .includes(filters.destination.toLowerCase());

      // Filter by number of travelers
      const matchesTravelers =
        filters.travelers >= pkg.minTravelers &&
        filters.travelers <= pkg.maxTravelers;

      return matchesDestination && matchesTravelers;
    });

    setFilteredPlaces(filtered);
  }, [filters, allPackages]);

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

  if (loading) {
    return (
      <section id="search-results" className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
      </section>
    );
  }

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
              {filteredPlaces.map((pkg, index) => {
                return (
                  <div
                    key={pkg.id}
                    className="shrink-0 w-[360px] h-[580px]"
                    style={{ scrollSnapAlign: "center" }}
                  >
                    <PackageCard
                      id={pkg.id}
                      slug={pkg.slug}
                      name={pkg.name}
                      category={pkg.category}
                      price={pkg.price}
                      duration={pkg.duration}
                      maxTravelers={pkg.maxTravelers}
                      image={pkg.image}
                      difficulty={pkg.difficulty}
                      animationDelay={index * 100}
                    />
                  </div>
                );
              })}
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
                <Link href="/packages">
                  <Button size="lg" className="text-base px-8 shadow-lg hover:shadow-xl group">
                    View All Packages
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
