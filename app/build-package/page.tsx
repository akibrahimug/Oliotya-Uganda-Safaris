"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { allDestinationsOnly } from "@/lib/destinations-only-data";
import {
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  Users,
  DollarSign,
  Send,
} from "lucide-react";

interface SelectedDestination {
  id: number;
  name: string;
  category: string;
  image: string;
  days: number;
}

export default function BuildPackagePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [selectedDestinations, setSelectedDestinations] = useState<SelectedDestination[]>([]);
  const [packageName, setPackageName] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [travelDate, setTravelDate] = useState("");
  const [budget, setBudget] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in?redirect_url=/build-package");
    return null;
  }

  const toggleDestination = (dest: typeof allDestinationsOnly[0]) => {
    const exists = selectedDestinations.find((d) => d.id === dest.id);
    if (exists) {
      setSelectedDestinations(selectedDestinations.filter((d) => d.id !== dest.id));
    } else {
      setSelectedDestinations([
        ...selectedDestinations,
        {
          id: dest.id,
          name: dest.name,
          category: dest.category,
          image: dest.image,
          days: 2, // Default 2 days per destination
        },
      ]);
    }
  };

  const updateDestinationDays = (id: number, days: number) => {
    setSelectedDestinations(
      selectedDestinations.map((d) =>
        d.id === id ? { ...d, days: Math.max(1, days) } : d
      )
    );
  };

  const totalDays = selectedDestinations.reduce((sum, dest) => sum + dest.days, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDestinations.length === 0) {
      alert("Please select at least one destination");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/custom-packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: packageName || "Custom Safari Package",
          destinations: selectedDestinations,
          duration: `${totalDays} Days`,
          numberOfPeople,
          travelDate: travelDate ? new Date(travelDate) : null,
          budget: budget ? parseFloat(budget) : null,
          specialRequests,
        }),
      });

      if (response.ok) {
        alert("Your custom package request has been submitted! We'll send you a quote soon.");
        router.push("/");
      } else {
        alert("Failed to submit package. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting package:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-32 pb-20 container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-inter text-4xl md:text-5xl font-bold mb-4">
              Build Your Custom Safari Package
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select the destinations you want to visit, customize the duration,
              and we'll create a personalized quote for your dream Uganda adventure.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Destination Selection */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="font-inter text-2xl font-bold mb-4">
                    Step 1: Select Destinations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allDestinationsOnly.map((dest) => {
                      const isSelected = selectedDestinations.some((d) => d.id === dest.id);
                      return (
                        <Card
                          key={dest.id}
                          className={`cursor-pointer transition-all ${
                            isSelected
                              ? "ring-2 ring-primary border-primary"
                              : "hover:shadow-lg"
                          }`}
                          onClick={() => toggleDestination(dest)}
                        >
                          <CardContent className="p-0">
                            <div className="relative h-40">
                              <img
                                src={dest.image}
                                alt={dest.name}
                                className="w-full h-full object-cover"
                              />
                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                                  <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <Badge className="mb-2">{dest.category}</Badge>
                              <h3 className="font-semibold text-lg">{dest.name}</h3>
                              <p className="text-sm text-muted-foreground">{dest.region}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Destinations with Days */}
                {selectedDestinations.length > 0 && (
                  <div>
                    <h2 className="font-inter text-2xl font-bold mb-4">
                      Step 2: Set Duration for Each Destination
                    </h2>
                    <div className="space-y-3">
                      {selectedDestinations.map((dest) => (
                        <Card key={dest.id}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <img
                                src={dest.image}
                                alt={dest.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <h3 className="font-semibold">{dest.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {dest.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateDestinationDays(dest.id, dest.days - 1);
                                  }}
                                >
                                  -
                                </Button>
                                <span className="w-16 text-center font-semibold">
                                  {dest.days} {dest.days === 1 ? "day" : "days"}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateDestinationDays(dest.id, dest.days + 1);
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDestination(dest);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Package Details & Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <Card className="border-2 border-primary/20">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="font-inter text-xl font-bold">Package Summary</h2>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Destinations</span>
                          <span className="font-semibold">
                            {selectedDestinations.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Duration</span>
                          <span className="font-semibold">{totalDays} days</span>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-4">
                        <div>
                          <Label htmlFor="packageName">Package Name (Optional)</Label>
                          <Input
                            id="packageName"
                            placeholder="My Custom Safari"
                            value={packageName}
                            onChange={(e) => setPackageName(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="numberOfPeople">
                            <Users className="h-4 w-4 inline mr-2" />
                            Number of People
                          </Label>
                          <Input
                            id="numberOfPeople"
                            type="number"
                            min="1"
                            max="100"
                            value={numberOfPeople}
                            onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="travelDate">
                            <Calendar className="h-4 w-4 inline mr-2" />
                            Preferred Travel Date
                          </Label>
                          <Input
                            id="travelDate"
                            type="date"
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="budget">
                            <DollarSign className="h-4 w-4 inline mr-2" />
                            Budget per Person (Optional)
                          </Label>
                          <Input
                            id="budget"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="1000.00"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="specialRequests">Special Requests</Label>
                          <Textarea
                            id="specialRequests"
                            placeholder="Any special requirements or preferences..."
                            rows={4}
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting || selectedDestinations.length === 0}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Submitting..." : "Request Quote"}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        We'll review your custom package and send you a detailed quote within 24 hours
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
