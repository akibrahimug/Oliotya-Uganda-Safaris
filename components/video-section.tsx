"use client";

import { useEffect, useRef, useState } from "react";

interface VideoSectionProps {
  data?: {
    title: string;
    description: string;
    videoUrl: string;
  };
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Remove whitespace
  url = url.trim();

  // Handle different YouTube URL formats
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Check if URL is a direct video file (mp4, webm, etc.)
 */
function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

export function VideoSection({ data }: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [loadEmbeddedVideo, setLoadEmbeddedVideo] = useState(false);

  // Default fallback data
  const sectionData = data || {
    title: "Experience Uganda",
    description: "Watch our journey through the Pearl of Africa and discover what makes Uganda a unique destination",
    videoUrl: "",
  };

  // Split title to highlight last word
  const titleWords = sectionData.title.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const titleBeforeLastWord = titleWords.slice(0, -1).join(" ");

  // Determine video type
  const youtubeId = getYouTubeVideoId(sectionData.videoUrl);
  const isDirectVideo = isDirectVideoUrl(sectionData.videoUrl);
  const hasVideo = !!(youtubeId || isDirectVideo);

  // YouTube embed URL with autoplay parameters
  const youtubeEmbedUrl = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${youtubeId}&controls=1&modestbranding=1&rel=0`
    : null;
  const youtubeThumbnailUrl = youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    : null;

  // Intersection Observer for autoplay on scroll
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Autoplay direct video when in view
          if (isDirectVideo && videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch((err) => {
                console.log("Autoplay prevented:", err);
              });
            } else {
              videoRef.current.pause();
            }
          }

          // Auto-load YouTube iframe only when section is visible.
          if (youtubeEmbedUrl && entry.isIntersecting) {
            setLoadEmbeddedVideo(true);
          }
        });
      },
      {
        threshold: 0.35, // Trigger when section is mostly visible
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isDirectVideo, youtubeEmbedUrl]);

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30">
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

        <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black">
          {!hasVideo ? (
            // Fallback when no video URL is provided
            <div className="aspect-video flex items-center justify-center bg-muted/50">
              <div className="text-center p-8">
                <p className="text-muted-foreground text-lg mb-2">No video configured</p>
                <p className="text-muted-foreground text-sm">
                  Add a YouTube or video URL in the CMS to display content here
                </p>
              </div>
            </div>
          ) : youtubeEmbedUrl ? (
            // YouTube embed (deferred until in-view to balance autoplay with performance)
            <div className="aspect-video relative">
              {loadEmbeddedVideo ? (
                <iframe
                  src={youtubeEmbedUrl}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={sectionData.title}
                />
              ) : (
                <div className="relative w-full h-full">
                  {youtubeThumbnailUrl ? (
                    <img
                      src={youtubeThumbnailUrl}
                      alt={`Video preview: ${sectionData.title}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width={1280}
                      height={720}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/50" />
                  )}
                  <div className="absolute inset-0 bg-foreground/25" />
                </div>
              )}
            </div>
          ) : isDirectVideo ? (
            // Direct video file
            <video
              ref={videoRef}
              className="w-full h-full"
              loop
              muted
              playsInline
              controls
              preload="metadata"
            >
              <source src={sectionData.videoUrl} type="video/mp4" />
              <source src={sectionData.videoUrl} type="video/webm" />
              <source src={sectionData.videoUrl} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          ) : (
            // Invalid URL format
            <div className="aspect-video flex items-center justify-center bg-muted/50">
              <div className="text-center p-8">
                <p className="text-destructive text-lg mb-2">Invalid video URL</p>
                <p className="text-muted-foreground text-sm">
                  Please provide a valid YouTube URL or direct video file URL (.mp4, .webm, .ogg)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
