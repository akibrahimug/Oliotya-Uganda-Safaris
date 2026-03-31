"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface DestinationGalleryProps {
  images: string[];
  columns?: 2 | 3 | 4;
}

const COLUMN_SIZES: Record<2 | 3 | 4, string> = {
  2: "(max-width: 768px) 100vw, 50vw",
  3: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  4: "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
};

const GRID_COLS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

export function DestinationGallery({ images, columns = 3 }: DestinationGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className={`grid ${GRID_COLS[columns]} gap-4`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg cursor-pointer h-64 shadow-md hover:shadow-2xl transition-all duration-500"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes={COLUMN_SIZES[columns]}
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300" />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-foreground/95 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-background hover:text-primary transition-colors p-2 rounded-full bg-foreground/50 hover:bg-foreground/70"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative w-full max-w-5xl max-h-[90vh] aspect-video">
            <Image
              src={selectedImage}
              alt="Gallery image fullscreen"
              fill
              className="object-contain rounded-lg shadow-2xl"
              sizes="100vw"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
