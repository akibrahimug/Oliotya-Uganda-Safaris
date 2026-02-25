import { SearchForm } from "@/components/search-form";
import { TourGuideSection } from "@/components/tour-guide-section";
import { ExperienceSection } from "@/components/experience-section";
import { DeferredHomeSections } from "@/components/deferred-home-sections";

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
  return (
    <>
      <SearchForm />
      <TourGuideSection data={tourGuideData || undefined} />
      <DeferredHomeSections videoData={videoData} />
      <ExperienceSection data={experienceData || undefined} />
    </>
  );
}
