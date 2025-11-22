"use client";

import { useState } from "react";
import { SearchForm } from "@/components/search-form";
import { TourGuideSection } from "@/components/tour-guide-section";
import { VideoSection } from "@/components/video-section";
import { PopularPlaces } from "@/components/popular-places";
import { ExploreDestinations } from "@/components/explore-destinations";
import { ExperienceSection } from "@/components/experience-section";

export interface SearchFilters {
  destination: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
  travelers: number;
}

interface HomePageContentProps {
  experienceData: {
    heading: string;
    title: string;
    description: string;
    image: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    badgeText: string;
    backgroundText: string;
  } | null;
  tourGuideData: {
    title: string;
    subtitle: string;
    description: string;
    mapImage: string;
    buttonText: string;
  } | null;
  videoData: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string | null;
  } | null;
}

export function HomePageContent({
  experienceData,
  tourGuideData,
  videoData,
}: HomePageContentProps) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(
    null
  );

  return (
    <>
      <SearchForm onSearch={setSearchFilters} />
      <TourGuideSection data={tourGuideData || undefined} />
      <VideoSection data={videoData || undefined} />
      <PopularPlaces filters={searchFilters} />
      <ExploreDestinations filters={searchFilters} />
      <ExperienceSection data={experienceData || undefined} />
    </>
  );
}
