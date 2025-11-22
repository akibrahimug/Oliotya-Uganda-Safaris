"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface VideoSectionProps {
  data?: {
    title: string;
    description: string;
    videoUrl: string;
  };
}

export function VideoSection({ data }: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Default fallback data
  const sectionData = data || {
    title: "Experience Uganda",
    description: "Watch our journey through the Pearl of Africa and discover what makes Uganda a unique destination",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  };

  // Split title to highlight last word
  const titleWords = sectionData.title.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const titleBeforeLastWord = titleWords.slice(0, -1).join(" ");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intersection Observer for autoplay on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch((error) => {
              console.log("Autoplay prevented:", error);
            });
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: 0.5, // Play when 50% of video is visible
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {titleBeforeLastWord} <span className="text-primary">{lastWord}</span>
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {sectionData.description}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            className="w-full h-auto"
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source
              src={sectionData.videoUrl}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Play/Pause Overlay Button */}
          <button
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-foreground/20 hover:bg-foreground/30 transition-all group"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            <div className="w-20 h-20 rounded-full bg-background/90 flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-xl">
              {isPlaying ? (
                <Pause className="h-10 w-10 text-primary" fill="currentColor" />
              ) : (
                <Play
                  className="h-10 w-10 text-primary ml-1"
                  fill="currentColor"
                />
              )}
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
