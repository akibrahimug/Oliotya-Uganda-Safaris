"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollIndicator } from "@/components/scroll-indicator"
import { MapPin } from "lucide-react"
import Link from "next/link"
import type { SearchFilters } from "@/lib/types"

interface ExploreDestinationsProps {
  filters: SearchFilters | null
}

interface Destination {
  id: number
  name: string
  category: string
  country: string
  image: string
  description: string
  minTravelers: number | null
  maxTravelers: number | null
}

export function ExploreDestinations({ filters }: ExploreDestinationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0) // Start at first card
  const [allDestinations, setAllDestinations] = useState<Destination[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Fetch featured destinations from database
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch("/api/cms/destinations")
        if (!response.ok) throw new Error("Failed to fetch destinations")
        const data = await response.json()
        const featuredDests = data.destinations.filter((dest: any) => dest.featured === true)
        setAllDestinations(featuredDests)
        setFilteredDestinations(featuredDests.slice(0, 3))
      } catch (error) {
        console.error("Error fetching destinations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  useEffect(() => {
    if (!filters || allDestinations.length === 0) {
      setFilteredDestinations(allDestinations.slice(0, 3))
      setCurrentIndex(0) // Reset to first card
      setIsInitialized(false)
      return
    }

    const filtered = allDestinations.filter((dest) => {
      const matchesDestination =
        dest.name.toLowerCase().includes(filters.destination?.toLowerCase() || '') ||
        dest.category.toLowerCase().includes(filters.destination?.toLowerCase() || '')

      const matchesTravelers =
        (!dest.minTravelers || (filters.travelers || 1) >= dest.minTravelers) &&
        (!dest.maxTravelers || (filters.travelers || 1) <= dest.maxTravelers)

      return matchesDestination && matchesTravelers
    })

    const limitedFiltered = (filtered.length > 0 ? filtered : allDestinations).slice(0, 3)
    setFilteredDestinations(limitedFiltered)
    setCurrentIndex(Math.floor(limitedFiltered.length / 2))
    setIsInitialized(false)
  }, [filters, allDestinations])

  // Initialize scroll to middle card on mount
  useEffect(() => {
    if (!isInitialized && filteredDestinations.length > 0) {
      const container = containerRef.current
      if (!container) return

      // Wait for the DOM to settle
      setTimeout(() => {
        const middleIndex = Math.floor(filteredDestinations.length / 2)
        const cardWidth = container.offsetWidth + 24 // full width + gap
        container.scrollLeft = cardWidth * middleIndex
        setIsInitialized(true)
      }, 100)
    }
  }, [filteredDestinations, isInitialized])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.offsetWidth + 24 // full width + gap
      const newIndex = Math.round(scrollLeft / cardWidth)
      setCurrentIndex(newIndex)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToIndex = (index: number) => {
    const container = containerRef.current
    if (!container) return

    const cardWidth = container.offsetWidth + 24
    container.scrollTo({
      left: cardWidth * index,
      behavior: "smooth",
    })
  }

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Explore Destinations</h2>
            <div className="w-20 h-1 bg-accent mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Loading destinations...</p>
          </div>
        </div>
      </section>
    )
  }

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
          {/* Left fade overlay */}
          <div
            className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to right, hsl(var(--muted) / 0.3) 0%, transparent 100%)",
            }}
          />

          {/* Right fade overlay */}
          <div
            className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to left, hsl(var(--muted) / 0.3) 0%, transparent 100%)",
            }}
          />

          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingLeft: "calc((100% - 100%) / 2 + 15%)",
              paddingRight: "calc((100% - 100%) / 2 + 15%)",
            }}
          >
            {filteredDestinations.map((dest, index) => (
              <div
                key={dest.id}
                className="shrink-0 w-full snap-center"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
                  <Badge className="absolute top-6 left-6 z-10 bg-primary text-primary-foreground shadow-lg backdrop-blur-sm">
                    {dest.category}
                  </Badge>
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                    <div className="flex items-center gap-2 mb-2 opacity-90">
                      <MapPin className="h-4 w-4" />
                      <p className="text-sm">{dest.country}</p>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3">{dest.name}</h3>
                    <p className="text-background/90 mb-4 line-clamp-2 text-sm leading-relaxed">
                      {dest.description}
                    </p>
                    <Link href={`/destination/${dest.id}`}>
                      <Button size="sm" className="bg-background text-foreground hover:bg-background/90">
                        Explore
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <ScrollIndicator
              total={filteredDestinations.length}
              current={currentIndex}
              onDotClick={scrollToIndex}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
