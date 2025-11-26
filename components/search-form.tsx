"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFormProps {
  onSearch?: () => void;
}

interface Package {
  id: number;
  name: string;
  slug: string;
  category: string;
  duration: string;
  price: number;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch packages on mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/cms/packages");
      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }
      const data = await response.json();
      setPackages(data.packages || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (selectedPackage) {
      // Navigate to the selected package page
      router.push(`/package/${selectedPackage}`);
    } else if (onSearch) {
      // Trigger callback if provided
      onSearch();
    }
  };

  return (
    <div className="relative -mt-20 z-30 container mx-auto px-4 lg:px-8">
      <div className="bg-card rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row gap-4 items-end max-w-2xl mx-auto">
          <div className="flex-1 space-y-2 w-full">
            <Label
              htmlFor="package-select"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <MapPin className="h-4 w-4 text-primary" />
              Safari Packages
            </Label>
            <Select
              value={selectedPackage}
              onValueChange={setSelectedPackage}
              disabled={loading}
            >
              <SelectTrigger
                id="package-select"
                className="w-full h-12 bg-transparent font-semibold text-base"
              >
                <SelectValue
                  placeholder={loading ? "Loading packages..." : "Select a safari package"}
                />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.slug}>
                    {pkg.name} - {pkg.duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSearch}
            disabled={!selectedPackage || loading}
            size="default"
            className="px-8 bg-primary hover:bg-primary/90 font-semibold text-base whitespace-nowrap sm:w-auto w-full"
          >
            <Search className="h-5 w-5 mr-2" />
            Explore Safari
          </Button>
        </div>
      </div>
    </div>
  );
}
