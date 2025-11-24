"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Edit, Trash2 } from "lucide-react";

interface DestinationsGridProps {
  editable?: boolean;
  onDestinationClick?: (id: string | number) => void;
  onDestinationDelete?: (id: string | number) => void;
}

interface Destination {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  country: string;
  region?: string;
}

export function DestinationsGrid({ editable = false, onDestinationClick, onDestinationDelete }: DestinationsGridProps = {}) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch destinations from database
  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setError(null);
      const response = await fetch('/api/cms/destinations');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch destinations' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setDestinations(data.destinations || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setError(error instanceof Error ? error.message : 'Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchDestinations} variant="outline">
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 lg:px-8 py-16">
      {destinations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No destinations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, index) => (
          <div key={dest.id} className="relative group">
            <Link
              href={editable ? "#" : `/destination/${dest.id}`}
              onClick={(e) => {
                if (editable) {
                  e.preventDefault();
                }
              }}
              className="block animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground shadow-lg backdrop-blur-sm">
                  {dest.category}
                </Badge>

                <div className="relative h-80 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
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
                    <Button
                      size="sm"
                      className="bg-background text-foreground hover:bg-background/90"
                    >
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
                      if (window.confirm(
                        `Are you sure you want to delete "${dest.name}"?\n\nThis action cannot be undone.`
                      )) {
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
    )}
    </section>
  );
}
