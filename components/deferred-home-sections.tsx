"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface DeferredHomeSectionsProps {
  videoData: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string | null;
  } | null;
}

const VideoSection = dynamic(
  () => import("@/components/video-section").then((mod) => mod.VideoSection),
  { ssr: false }
);

const PopularPlaces = dynamic(
  () => import("@/components/popular-places").then((mod) => mod.PopularPlaces),
  { ssr: false }
);

const ExploreDestinations = dynamic(
  () => import("@/components/explore-destinations").then((mod) => mod.ExploreDestinations),
  { ssr: false }
);

export function DeferredHomeSections({ videoData }: DeferredHomeSectionsProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (callback: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIsReady(true), { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }

    const timer = window.setTimeout(() => setIsReady(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <>
        <section className="py-20 bg-muted/30" />
        <section className="py-20 bg-background" />
        <section className="py-20 bg-muted/30" />
      </>
    );
  }

  return (
    <>
      <VideoSection data={videoData || undefined} />
      <PopularPlaces filters={null} />
      <ExploreDestinations filters={null} />
    </>
  );
}
