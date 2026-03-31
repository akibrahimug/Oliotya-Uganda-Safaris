"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Edit, Trash2 } from "lucide-react";

interface Destination {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  country: string;
  region?: string | null;
}

interface DestinationsGridProps {
  destinations: Destination[];
  editable?: boolean;
  onDestinationClick?: (id: string | number) => void;
  onDestinationDelete?: (id: string | number) => void;
}

export function DestinationsGrid({
  destinations,
  editable = false,
  onDestinationClick,
  onDestinationDelete,
}: DestinationsGridProps) {
  if (destinations.length === 0) {
    return (
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No destinations found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((dest, index) => (
          <div key={dest.id} className="relative group">
            <Link
              href={editable ? "#" : `/destination/${dest.id}`}
              onClick={(e) => {
                if (editable) e.preventDefault();
              }}
              className="block animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground shadow-lg backdrop-blur-sm">
                  {dest.category}
                </Badge>

                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/40 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                  <div className="flex items-center gap-2 mb-2 opacity-90">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm">{dest.region || dest.country}</p>
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-background/90 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {dest.description}
                  </p>
                  {!editable && (
                    <Button size="sm" className="bg-background text-foreground hover:bg-background/90">
                      Explore
                    </Button>
                  )}
                </div>
              </div>
            </Link>

            {editable && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20">
                <Button
                  size="sm"
                  variant="secondary"
                  className="shadow-lg"
                  onClick={() => onDestinationClick?.(dest.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {onDestinationDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="shadow-lg"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${dest.name}"?\n\nThis action cannot be undone.`)) {
                        onDestinationDelete(dest.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
