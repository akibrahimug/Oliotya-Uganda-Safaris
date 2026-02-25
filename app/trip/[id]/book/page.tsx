"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { allDestinations } from "@/lib/destinations-data";
import {
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CreditCard,
  Lock,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numberOfTravelers: number | "";
  specialRequests: string;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = Number.parseInt(params.id as string);
  const trip = allDestinations.find((dest) => dest.id === tripId);

  // Get search data from URL params
  const travelersParam = searchParams.get("travelers");
  const dateFromParam = searchParams.get("dateFrom");
  const dateToParam = searchParams.get("dateTo");

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parsedTravelersParam = travelersParam
    ? Number.parseInt(travelersParam, 10)
    : 1;
  const initialTravelers =
    Number.isNaN(parsedTravelersParam) || parsedTravelersParam < 1
      ? 1
      : parsedTravelersParam;
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    numberOfTravelers: initialTravelers,
    specialRequests: "",
  });

  // Store travel dates for display
  const travelDates =
    dateFromParam && dateToParam
      ? {
          from: new Date(dateFromParam),
          to: new Date(dateToParam),
        }
      : null;

  if (!trip) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h1 className="font-inter text-4xl font-bold mb-4">
              Trip Not Found
            </h1>
            <Button onClick={() => router.push("/destinations")}>
              View All Destinations
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const travelerCount =
    personalInfo.numberOfTravelers === "" ? 0 : personalInfo.numberOfTravelers;

  const validatePersonalInfo = () => {
    return (
      personalInfo.firstName.trim() !== "" &&
      personalInfo.lastName.trim() !== "" &&
      personalInfo.email.trim() !== "" &&
      personalInfo.phone.trim() !== "" &&
      travelerCount >= 1 &&
      travelerCount <= 32 &&
      !errors.numberOfTravelers
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && !validatePersonalInfo()) {
      // Add general validation errors if needed
      if (!personalInfo.firstName.trim()) {
        setErrors(prev => ({ ...prev, firstName: "First name is required" }));
      }
      if (!personalInfo.lastName.trim()) {
        setErrors(prev => ({ ...prev, lastName: "Last name is required" }));
      }
      if (!personalInfo.email.trim()) {
        setErrors(prev => ({ ...prev, email: "Email is required" }));
      }
      if (!personalInfo.phone.trim()) {
        setErrors(prev => ({ ...prev, phone: "Phone number is required" }));
      }
      return;
    }
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (
    field: keyof PersonalInfo,
    value: string | number
  ) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific errors when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Validate number of travelers
    if (field === "numberOfTravelers") {
      const numTravelers =
        typeof value === "number"
          ? value
          : value === ""
            ? 0
            : Number.parseInt(value, 10) || 0;

      if (numTravelers > 32) {
        setErrors(prev => ({
          ...prev,
          numberOfTravelers: "This exceeds the maximum number of travelers for this package. Please request a custom package instead."
        }));
      } else if (numTravelers < 1) {
        setErrors(prev => ({
          ...prev,
          numberOfTravelers: "Number of travelers must be at least 1."
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.numberOfTravelers;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!validatePersonalInfo()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        numberOfTravelers: travelerCount,
        specialRequests: personalInfo.specialRequests,
        tripId: trip.id,
        tripName: trip.name,
        totalPrice,
        travelDateFrom: travelDates?.from?.toISOString(),
        travelDateTo: travelDates?.to?.toISOString(),
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/booking-confirmation?ref=${result.booking.confirmationNumber}`);
      } else {
        alert(result.error || "Failed to create booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      alert("An error occurred while submitting your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = trip.price * travelerCount;

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <img
          src={trip.image}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <Badge className="bg-primary text-primary-foreground mb-4">
            {trip.category}
          </Badge>
          <h1 className="font-inter text-5xl md:text-6xl font-bold text-background mb-4">
            {trip.name}
          </h1>
          <div className="flex items-center gap-6 text-background/90 flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{trip.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{trip.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Max {trip.groupSize} people</span>
            </div>
            {travelDates && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {format(travelDates.from, "MMM dd")} -{" "}
                  {format(travelDates.to, "MMM dd, yyyy")}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16 container mx-auto px-4 lg:px-8">
        {/* Step Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <span
                className={`font-medium ${
                  currentStep === 1
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Personal Info
              </span>
            </div>
            <div className="w-16 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span
                className={`font-medium ${
                  currentStep === 2
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-inter text-2xl font-bold mb-6">
                      Personal Information
                    </h2>

                    {/* Sign Up Reminder */}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">
                          Save Your Trips
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sign up or sign in to save your bookings and access
                          them anytime.
                        </p>
                        <div className="flex gap-3 mt-3">
                          {/* Temporarily disabled - will work when Clerk is set up */}
                          <Button variant="outline" size="sm" disabled>
                            Sign In
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            Sign Up
                          </Button>
                          {/* Uncomment when Clerk is ready:
                          <Link href="/sign-in">
                            <Button variant="outline" size="sm">
                              Sign In
                            </Button>
                          </Link>
                          <Link href="/sign-up">
                            <Button variant="outline" size="sm">
                              Sign Up
                            </Button>
                          </Link>
                          */}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">
                            First Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="firstName"
                            value={personalInfo.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            placeholder="John"
                            required
                            size="lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">
                            Last Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="lastName"
                            value={personalInfo.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            placeholder="Doe"
                            required
                            size="lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email Address{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="john.doe@example.com"
                          required
                          size="lg"
                        />
                        <p className="text-xs text-muted-foreground">
                          We'll send your booking confirmation here
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Phone Number{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={personalInfo.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="+1 (555) 123-4567"
                          required
                          size="lg"
                          inputMode="tel"
                        />
                        <p className="text-xs text-muted-foreground">
                          We may contact you for trip updates
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="travelers">
                          Number of Travelers{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="travelers"
                          type="number"
                          min="1"
                          max="32"
                          value={personalInfo.numberOfTravelers}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              handleInputChange("numberOfTravelers", "");
                              return;
                            }

                            const parsedTravelers = Number.parseInt(
                              e.target.value,
                              10
                            );

                            if (!Number.isNaN(parsedTravelers)) {
                              handleInputChange(
                                "numberOfTravelers",
                                parsedTravelers
                              );
                            }
                          }}
                          required
                          size="lg"
                          inputMode="numeric"
                          className={errors.numberOfTravelers ? "border-destructive" : ""}
                        />
                        {errors.numberOfTravelers ? (
                          <p className="text-sm text-destructive">
                            {errors.numberOfTravelers}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Maximum 32 travelers per booking. For larger groups, please request a custom package.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialRequests">
                          Special Requests (Optional)
                        </Label>
                        <Textarea
                          id="specialRequests"
                          value={personalInfo.specialRequests}
                          onChange={(e) =>
                            handleInputChange("specialRequests", e.target.value)
                          }
                          placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                          className="min-h-24 resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          Let us know about any special requirements to make your trip more comfortable
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-inter text-2xl font-bold mb-6">
                      Payment Information
                    </h2>

                    {/* Booking Summary */}
                    <div className="bg-muted/50 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold mb-3">Booking Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">
                            {personalInfo.firstName} {personalInfo.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium">
                            {personalInfo.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">
                            {personalInfo.phone}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Travelers:
                          </span>
                          <span className="font-medium">
                            {travelerCount || "-"}
                          </span>
                        </div>
                        {travelDates && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Travel Dates:
                            </span>
                            <span className="font-medium">
                              {format(travelDates.from, "MMM dd")} -{" "}
                              {format(travelDates.to, "MMM dd, yyyy")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                          />
                          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            maxLength={4}
                          />
                        </div>
                      </div>

                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                        <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground mb-1">
                            Secure Payment
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Your payment information is encrypted and secure. We
                            never store your card details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Previous
                </Button>
                {currentStep === 1 && (
                  <Button size="lg" onClick={handleNext} className="gap-2">
                    Next
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                )}
                {currentStep === 2 && (
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        Processing...
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      </>
                    ) : (
                      <>
                        Complete Booking
                        <ChevronRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Price Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Price Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Price per person
                      </span>
                      <span className="font-medium">
                        ${trip.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Number of travelers
                      </span>
                      <span className="font-medium">
                        {travelerCount || "-"}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-2xl text-primary">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Free cancellation up to 48 hours</p>
                    <p>• Full refund if cancelled early</p>
                    <p>• Best price guaranteed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
