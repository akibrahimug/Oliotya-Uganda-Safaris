"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { SearchFilters } from "@/app/page"

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [destination, setDestination] = useState("Kampala")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [travelers, setTravelers] = useState(2)

  const handleSearch = () => {
    onSearch({
      destination,
      checkIn,
      checkOut,
      travelers,
    })

    const resultsSection = document.getElementById("search-results")
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="relative -mt-20 z-30 container mx-auto px-4 lg:px-8">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <Label htmlFor="destination" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              Destination
            </Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where to?"
              className="h-12 text-base font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              Check in
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-12 justify-start text-left font-semibold bg-transparent">
                  {checkIn ? format(checkIn, "dd MMM yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              Check out
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-12 justify-start text-left font-semibold bg-transparent">
                  {checkOut ? format(checkOut, "dd MMM yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  initialFocus
                  disabled={(date) => (checkIn ? date < checkIn : false)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelers" className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-primary" />
              Travellers
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="travelers"
                type="number"
                min="1"
                value={travelers}
                onChange={(e) => setTravelers(Number.parseInt(e.target.value) || 1)}
                className="h-12 text-base font-semibold flex-1"
              />
              <Button onClick={handleSearch} size="icon" className="h-12 w-12 bg-primary hover:bg-primary/90">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
