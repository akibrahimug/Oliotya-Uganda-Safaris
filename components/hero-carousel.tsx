"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getImageSrc, getBlurDataURL } from "@/lib/image-utils"

interface HeroSlide {
  id: string | number
  title: string
  subtitle: string
  description: string
  image: string
  displayOrder: number
}

interface HeroCarouselProps {
  initialSlides?: HeroSlide[]
}

export function HeroCarousel({ initialSlides }: HeroCarouselProps = {}) {
  const hasInitialSlides = Array.isArray(initialSlides)
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides ?? [])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [loading, setLoading] = useState(!hasInitialSlides)

  // Fetch slides from API only if server didn't provide them
  useEffect(() => {
    if (hasInitialSlides) return

    async function fetchSlides() {
      try {
        const response = await fetch("/api/hero-slides")
        if (!response.ok) throw new Error("Failed to fetch slides")
        const data = await response.json()
        setSlides(data)
      } catch (error) {
        console.error("Error fetching hero slides:", error)
        // Fallback to empty array if fetch fails
        setSlides([])
      } finally {
        setLoading(false)
      }
    }
    fetchSlides()
  }, [hasInitialSlides])

  useEffect(() => {
    if (slides.length === 0) return
    setCurrentSlide((prev) => prev % slides.length)
  }, [slides.length])

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="relative h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] w-full overflow-hidden bg-muted animate-pulse" />
    )
  }

  // Show empty state if no slides
  if (slides.length === 0) {
    return (
      <div className="relative h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] w-full overflow-hidden bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No hero slides available</p>
      </div>
    )
  }

  const activeSlide = slides[currentSlide]

  return (
    <div className="relative h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] w-full overflow-hidden">
      <div key={activeSlide.id} className="absolute inset-0 transition-opacity duration-700 opacity-100">
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/50 to-transparent z-10" />
        <Image
          src={getImageSrc(activeSlide.image)}
          alt={activeSlide.subtitle}
          fill
          priority={currentSlide === 0}
          loading={currentSlide === 0 ? "eager" : "lazy"}
          fetchPriority={currentSlide === 0 ? "high" : "auto"}
          sizes="100vw"
          quality={72}
          className="object-cover"
          placeholder="blur"
          blurDataURL={getBlurDataURL()}
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl animate-fade-in-up space-y-2 md:space-y-3 lg:space-y-4">
              <p className="text-background/90 text-xs md:text-sm lg:text-base animate-fade-in-up animation-delay-200">
                {activeSlide.title}
              </p>
              <h1 className="font-serif text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-background animate-fade-in-up animation-delay-400 leading-tight">
                {activeSlide.subtitle}
              </h1>
              <p className="text-background/90 text-xs md:text-sm lg:text-base max-w-xl leading-relaxed animate-fade-in-up animation-delay-600">
                {activeSlide.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-28 sm:bottom-32 md:bottom-36 lg:bottom-40 left-4 lg:left-8 z-30 hidden md:block">
        <div className="flex items-baseline gap-0.5 md:gap-1">
          <span className="text-background font-bold text-2xl md:text-3xl lg:text-4xl font-inter tabular-nums">
            {String(currentSlide + 1).padStart(2, "0")}
          </span>
          <span className="text-background/60 text-sm md:text-base lg:text-lg font-inter tabular-nums">
            /{String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className="h-11 w-11 -m-2 flex items-center justify-center rounded-full"
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              className={`h-1.5 md:h-2 rounded-full transition-all ${
                index === currentSlide ? "w-6 md:w-8 bg-primary" : "w-1.5 md:w-2 bg-muted"
              }`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute right-6 md:right-8 bottom-1/4 z-30 hidden lg:block">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-background text-xs tracking-widest [writing-mode:vertical-lr]">Scroll down</span>
          <div className="w-px h-12 md:h-16 bg-muted" />
        </div>
      </div>
    </div>
  )
}
