import { VideoSection } from "@/components/video-section";
import { PopularPlaces } from "@/components/popular-places";
import { ExploreDestinations } from "@/components/explore-destinations";

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

interface DeferredHomeSectionsProps {
  videoData: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string | null;
  } | null;
  packages: Package[];
  destinations: Destination[];
}

export function DeferredHomeSections({ videoData, packages, destinations }: DeferredHomeSectionsProps) {
  return (
    <>
      <VideoSection data={videoData || undefined} />
      <PopularPlaces filters={null} initialPackages={packages} />
      <ExploreDestinations filters={null} initialDestinations={destinations} />
    </>
  );
}
