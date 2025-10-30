"use client";

import { useState } from "react";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { SearchFilters } from "@/app/page";

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [destination, setDestination] = useState("Kampala");
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>();
  const [travelers, setTravelers] = useState(2);

  const handleSearch = () => {
    onSearch({
      destination,
      dateRange,
      travelers,
    });

    const resultsSection = document.getElementById("search-results");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative -mt-20 z-30 container mx-auto px-4 lg:px-8">
      <div className="bg-card rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <Label
              htmlFor="destination"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <MapPin className="h-4 w-4 text-primary" />
              Safari Packages
            </Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where to?"
              size="lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              Travel Dates
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-semibold bg-transparent"
                >
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd MMM")} -{" "}
                        {format(dateRange.to, "dd MMM yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd MMM yyyy")
                    )
                  ) : (
                    "Select dates"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                  numberOfMonths={2}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="travelers"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Users className="h-4 w-4 text-primary" />
              Number of Travellers
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="travelers"
                type="number"
                min="1"
                value={travelers}
                onChange={(e) =>
                  setTravelers(Number.parseInt(e.target.value) || 1)
                }
                size="lg"
                inputMode="numeric"
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                size="icon"
                className="h-12 w-12 bg-primary hover:bg-primary/90"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
