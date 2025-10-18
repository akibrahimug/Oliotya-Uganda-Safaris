"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { allDestinations } from "@/lib/destinations-data"
import type { SearchFilters } from "@/app/page"

interface PopularPlacesProps {
  filters: SearchFilters | null
}

export function PopularPlaces({ filters }: PopularPlacesProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [filteredPlaces, setFilteredPlaces] = useState(allDestinations)

  useEffect(() => {
    if (!filters) {
      setFilteredPlaces(allDestinations)
      return
    }

    const filtered = allDestinations.filter((place) => {
      // Filter by destination name (case-insensitive partial match)
      const matchesDestination =
        place.name.toLowerCase().includes(filters.destination.toLowerCase()) ||
        place.category.toLowerCase().includes(filters.destination.toLowerCase())

      // Filter by number of travelers
      const matchesTravelers =
        (!place.minTravelers || filters.travelers >= place.minTravelers) &&
        (!place.maxTravelers || filters.travelers <= place.maxTravelers)

      return matchesDestination && matchesTravelers
    })

    setFilteredPlaces(filtered)
  }, [filters])

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("places-container")
    if (container) {
      const scrollAmount = 350
      const newPosition = direction === "left" ? scrollPosition - scrollAmount : scrollPosition + scrollAmount
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  return (
    <section id="search-results" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {filters ? `Found ${filteredPlaces.length} Matching Packages` : "Popular Places"}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {filters
              ? `Showing packages for ${filters.travelers} traveler${filters.travelers > 1 ? "s" : ""} in ${filters.destination}`
              : "The most beautiful places in Uganda range from mountain gorilla sanctuaries and wildlife reserves to vibrant cities bustling with culture and adventure."}
          </p>
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">No packages found matching your search criteria.</p>
            <p className="text-muted-foreground">Try adjusting your destination or number of travelers.</p>
          </div>
        ) : (
          <>
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full shadow-lg bg-background"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <div
                id="places-container"
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {filteredPlaces.map((place, index) => (
                  <Card
                    key={place.id}
                    className="flex-shrink-0 w-80 group hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Badge className="absolute top-4 right-4 z-10 bg-accent text-accent-foreground">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {place.rating}
                        </Badge>
                        <img
                          src={place.image || "/placeholder.svg"}
                          alt={place.name}
                          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-serif text-2xl font-bold mb-2">{place.name}</h3>
                        <p className="text-muted-foreground mb-4">{place.category}</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          {place.duration} • Max {place.groupSize} people
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">${place.price.toFixed(2)}</span>
                          <Link href="/destinations">
                            <Button variant="outline" className="group/btn bg-transparent">
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

              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full shadow-lg bg-background"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                View All
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
