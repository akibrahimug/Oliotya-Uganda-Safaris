"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PackageCard } from "@/components/package-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { DifficultyLevel } from "@/prisma/app/generated/prisma-client";

interface Package {
  id: number;
  name: string;
  slug: string;
  category: string;
  duration: string;
  price: number;
  image: string;
  maxTravelers: number;
  difficulty: DifficultyLevel;
}

interface PackagesContentProps {
  packages: Package[];
  categories: string[];
  editable?: boolean;
  onPackageClick?: (id: number) => void;
  onPackageDelete?: (id: number) => void;
}

export function PackagesContent({
  packages,
  categories,
  editable = false,
  onPackageClick,
  onPackageDelete,
}: PackagesContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const travelers = searchParams.get("travelers");
  const selectedCategory = searchParams.get("category");

  function setCategory(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      {destination && (
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Badge className="bg-primary text-primary-foreground text-base px-4 py-2">
            Searching: {destination} • {travelers} travelers
          </Badge>
        </div>
      )}

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-4 mb-12">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setCategory(null)}
            >
              All Packages
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No packages found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div key={pkg.id} className="relative group">
                  <PackageCard
                    id={pkg.id}
                    slug={pkg.slug}
                    name={pkg.name}
                    category={pkg.category}
                    price={pkg.price}
                    duration={pkg.duration}
                    maxTravelers={pkg.maxTravelers}
                    image={pkg.image}
                    difficulty={pkg.difficulty}
                    animationDelay={index * 50}
                  />
                  {editable && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="shadow-lg"
                        onClick={() => onPackageClick?.(pkg.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {onPackageDelete && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="shadow-lg"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${pkg.name}"?\n\nThis action cannot be undone.`)) {
                              onPackageDelete(pkg.id);
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
        </div>
      </section>
    </>
  );
}
