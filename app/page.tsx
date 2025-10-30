"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { HeroCarousel } from "@/components/hero-carousel";
import { SearchForm } from "@/components/search-form";
import { TourGuideSection } from "@/components/tour-guide-section";
import { VideoSection } from "@/components/video-section";
import { PopularPlaces } from "@/components/popular-places";
import { ExploreDestinations } from "@/components/explore-destinations";
import { ExperienceSection } from "@/components/experience-section";
import { Footer } from "@/components/footer";

export interface SearchFilters {
  destination: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
  travelers: number;
}

export default function Home() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(
    null
  );

  return (
    <main className="min-h-screen">
      <Header />
      <HeroCarousel />
      <SearchForm onSearch={setSearchFilters} />
      <TourGuideSection />
      <VideoSection />
      <PopularPlaces filters={searchFilters} />
      <ExploreDestinations filters={searchFilters} />
      <ExperienceSection />
      <Footer />
    </main>
  );
}
