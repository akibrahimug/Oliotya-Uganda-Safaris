"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
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

  const nextDestination = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredDestinations.length)
  }

  const prevDestination = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredDestinations.length) % filteredDestinations.length)
  }

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
                    <Badge className="absolute top-6 left-6 z-10 bg-secondary text-secondary-foreground">
                      {dest.category}
                    </Badge>
                    <Badge className="absolute top-6 right-6 z-10 bg-accent text-accent-foreground">
                      {dest.rating}.0
                    </Badge>
                    <img
                      src={dest.image || "/placeholder.svg"}
                      alt={dest.name}
                      className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <p className="text-sm mb-2 opacity-90">{dest.country}</p>
                      <h3 className="font-serif text-4xl font-bold mb-4">{dest.name}</h3>
                      <p className="text-white/90 mb-6 leading-relaxed max-w-2xl">{dest.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">${dest.price.toFixed(2)}</span>
                        <Link href="/destinations">
                          <Button size="lg" className="bg-primary hover:bg-primary/90">
                            Explore
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={prevDestination}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg bg-background"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextDestination}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg bg-background"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

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
