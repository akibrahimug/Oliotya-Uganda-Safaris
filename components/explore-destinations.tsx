"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { allDestinations } from "@/lib/destinations-data"
import type { SearchFilters } from "@/app/page"

interface ExploreDestinationsProps {
  filters: SearchFilters | null
}

export function ExploreDestinations({ filters }: ExploreDestinationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filteredDestinations, setFilteredDestinations] = useState(allDestinations.slice(5, 8))

  useEffect(() => {
    if (!filters) {
      setFilteredDestinations(allDestinations.slice(5, 8))
      setCurrentIndex(0)
      return
    }

    const filtered = allDestinations.filter((dest) => {
      const matchesDestination =
        dest.name.toLowerCase().includes(filters.destination.toLowerCase()) ||
        dest.category.toLowerCase().includes(filters.destination.toLowerCase())

      const matchesTravelers =
        (!dest.minTravelers || filters.travelers >= dest.minTravelers) &&
        (!dest.maxTravelers || filters.travelers <= dest.maxTravelers)

      return matchesDestination && matchesTravelers
    })

    setFilteredDestinations(filtered.length > 0 ? filtered : allDestinations.slice(5, 8))
    setCurrentIndex(0)
  }, [filters])

  const current = filteredDestinations[currentIndex]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Explore Destinations</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            With its unique culture, rich culture, some of the most beautiful beaches in the world, breathtaking
            waterfalls, and adventure for everyone's liking.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="flex gap-6 overflow-hidden">
            {filteredDestinations.map((dest, index) => {
              const offset = index - currentIndex
              const isVisible = Math.abs(offset) <= 1

              return (
                <div
                  key={dest.id}
                  className={`flex-shrink-0 w-full transition-all duration-500 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    transform: `translateX(${offset * 100}%)`,
                  }}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <Badge className="absolute top-6 left-6 z-10 bg-primary text-primary-foreground shadow-lg backdrop-blur-sm">
                      {dest.category}
                    </Badge>
                    <img
                      src={dest.image || "/placeholder.svg"}
                      alt={dest.name}
                      className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-background">
                      <p className="text-sm mb-2 opacity-90">{dest.country}</p>
                      <h3 className="font-serif text-4xl font-bold mb-4">{dest.name}</h3>
                      <p className="text-background/90 mb-6 leading-relaxed max-w-2xl">{dest.description}</p>
                      <div>
                        <Link href={`/destination/${dest.id}`}>
                          <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {filteredDestinations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to destination ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
