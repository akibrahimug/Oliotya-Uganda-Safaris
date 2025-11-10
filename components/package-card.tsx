import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight, Clock, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageSrc, getBlurDataURL } from "@/lib/image-utils";
import type { DifficultyLevel } from "@/lib/packages-data";

interface PackageCardProps {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  maxTravelers: number;
  image: string;
  difficulty: DifficultyLevel;
  animationDelay?: number;
}

// Helper function to format difficulty for display
const formatDifficulty = (difficulty: DifficultyLevel): string => {
  return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
};

export function PackageCard({
  id,
  slug,
  name,
  category,
  price,
  duration,
  maxTravelers,
  image,
  difficulty,
  animationDelay = 0,
}: PackageCardProps) {
  return (
    <Card
      className="shrink-0 w-full h-full group transition-all duration-500 animate-fade-in-up border-0 bg-background overflow-hidden flex flex-col"
      style={{
        animationDelay: `${animationDelay}ms`,
        boxShadow:
          "0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.08)",
      }}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-start justify-between">
            <Badge className="bg-primary text-primary-foreground shadow-lg backdrop-blur-sm">
              {category}
            </Badge>
            <Badge className="bg-background/90 text-foreground shadow-lg backdrop-blur-sm">
              {formatDifficulty(difficulty)}
            </Badge>
          </div>
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              src={getImageSrc(image)}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
              quality={85}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              placeholder="blur"
              blurDataURL={getBlurDataURL()}
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="p-6 space-y-4 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="font-inter text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {name}
            </h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Max {maxTravelers} people</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">From</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">
                  ${price.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">/person</span>
              </div>
            </div>
            <Link href={`/package/${slug}`}>
              <Button size="lg" className="group/btn shadow-lg hover:shadow-xl">
                Explore
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
