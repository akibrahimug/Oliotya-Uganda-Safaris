"use client";

import { useState, useEffect } from "react";

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

interface PageHeroProps {
  slides: HeroSlide[];
  showCounter?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  interval?: number;
  fallbackImage?: string;
}

const DEFAULT_FALLBACK_IMAGE =
  "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/uganda-queen-elizabeth-national-park-safari.webp";

export function PageHero({
  slides,
  showCounter = false,
  showDots = true,
  autoPlay = true,
  interval = 8000,
  fallbackImage = DEFAULT_FALLBACK_IMAGE,
}: PageHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setFailedImages({});
  }, [slides]);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [isAutoPlaying, slides.length, interval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/50 to-transparent z-10" />
          <img
            src={failedImages[index] ? fallbackImage : slide.image}
            alt={slide.subtitle}
            className="w-full h-full object-cover"
            onError={
              failedImages[index]
                ? undefined
                : () => setFailedImages((prev) => ({ ...prev, [index]: true }))
            }
          />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-2xl animate-fade-in-up space-y-2 md:space-y-3 lg:space-y-4">
                <p className="text-background/90 text-xs md:text-sm lg:text-base animate-fade-in-up animation-delay-200">
                  {slide.title}
                </p>
                <h1 className="font-serif text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-background animate-fade-in-up animation-delay-400 leading-tight">
                  {slide.subtitle}
                </h1>
                <p className="text-background/90 text-xs md:text-sm lg:text-base max-w-xl leading-relaxed animate-fade-in-up animation-delay-600">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Counter - only show if multiple slides and showCounter is true */}
      {showCounter && slides.length > 1 && (
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
      )}

      {/* Dots - only show if multiple slides and showDots is true */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 md:h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-6 md:w-8 bg-primary"
                  : "w-1.5 md:w-2 bg-muted"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Down Indicator - only show on large screens */}
      <div className="absolute right-6 md:right-8 bottom-1/4 z-30 hidden lg:block">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-background text-xs tracking-widest [writing-mode:vertical-lr]">
            Scroll down
          </span>
          <div className="w-px h-12 md:h-16 bg-muted" />
        </div>
      </div>
    </div>
  );
}
