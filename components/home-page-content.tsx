import { SearchForm } from "@/components/search-form";
import { TourGuideSection } from "@/components/tour-guide-section";
import { ExperienceSection } from "@/components/experience-section";
import { DeferredHomeSections } from "@/components/deferred-home-sections";

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

interface Destination {
  id: number;
  name: string;
  category: string;
  country: string;
  image: string;
  description: string;
  minTravelers: number | null;
  maxTravelers: number | null;
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
  packages: Package[];
  destinations: Destination[];
}

export function HomePageContent({
  experienceData,
  tourGuideData,
  videoData,
  packages,
  destinations,
}: HomePageContentProps) {
  return (
    <>
      <SearchForm packages={packages} />
      <TourGuideSection data={tourGuideData || undefined} />
      <DeferredHomeSections
        videoData={videoData}
        packages={packages.filter((pkg) => pkg.popular)}
        destinations={destinations}
      />
      <ExperienceSection data={experienceData || undefined} />
    </>
  );
}
