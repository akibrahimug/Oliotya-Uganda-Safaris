"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, Users, Mail, Phone, MapPin, AlertCircle } from "lucide-react";
import { countries } from "@/lib/countries";

interface BookingFormProps {
  bookingType: "PACKAGE" | "DESTINATION";
  itemId: number;
  itemName: string;
  pricePerPerson: number;
  initialTravelers?: number;
  onSuccess?: (confirmationNumber: string) => void;
}

export function BookingForm({
  bookingType,
  itemId,
  itemName,
  pricePerPerson,
  initialTravelers = 2,
  onSuccess,
}: BookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    numberOfTravelers: initialTravelers,
    travelDateFrom: "",
    travelDateTo: "",
    specialRequests: "",
    website: "", // Honeypot
  });

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName)) {
      newErrors.firstName = "First name contains invalid characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last name contains invalid characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Phone number is too short";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    // Country validation
    if (!formData.country) {
      newErrors.country = "Country is required";
    }

    // Travel dates validation
    if (!formData.travelDateFrom) {
      newErrors.travelDateFrom = "Travel start date is required";
    }

    if (!formData.travelDateTo) {
      newErrors.travelDateTo = "Travel end date is required";
    }

    if (formData.travelDateFrom && formData.travelDateTo) {
      const fromDate = new Date(formData.travelDateFrom);
      const toDate = new Date(formData.travelDateTo);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (fromDate < today) {
        newErrors.travelDateFrom = "Start date cannot be in the past";
      }

      if (toDate <= fromDate) {
        newErrors.travelDateTo = "End date must be after start date";
      }
    }

    // Number of travelers validation
    if (formData.numberOfTravelers < 1) {
      newErrors.numberOfTravelers = "At least 1 traveler is required";
    } else if (formData.numberOfTravelers > 50) {
      newErrors.numberOfTravelers = "Maximum 50 travelers allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const totalPrice = pricePerPerson * formData.numberOfTravelers;

  // Check if form is complete and valid
  const isFormValid = () => {
    return (
      formData.firstName.trim().length >= 2 &&
      formData.lastName.trim().length >= 2 &&
      formData.email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.phone.trim().length >= 10 &&
      formData.country.length > 0 &&
      formData.travelDateFrom.length > 0 &&
      formData.travelDateTo.length > 0 &&
      formData.numberOfTravelers >= 1 &&
      formData.numberOfTravelers <= 50
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot detection - silently reject
    if (formData.website) {
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bookingType,
          packageId: bookingType === "PACKAGE" ? itemId : undefined,
          destinationId: bookingType === "DESTINATION" ? itemId : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors specifically
        if (response.status === 400 && data.details) {
          const validationErrors = data.details
            .map((err: any) => err.message)
            .join(", ");
          throw new Error(`Validation failed: ${validationErrors}`);
        }

        // Handle rate limiting
        if (response.status === 429) {
          throw new Error(
            "Too many booking attempts. Please wait an hour and try again."
          );
        }

        throw new Error(data.error || "Booking failed. Please try again.");
      }

      toast({
        title: "✅ Booking Successfully Submitted!",
        description: `Confirmation #${data.booking.confirmationNumber} - Check your email for payment instructions. You'll be redirected to your booking details shortly.`,
        duration: 5000,
      });

      // Redirect after a brief delay to let user see the toast
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(data.booking.confirmationNumber);
        } else {
          router.push(`/booking-confirmation?ref=${data.booking.confirmationNumber}`);
        }
      }, 1500);

    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

      toast({
        title: "❌ Booking Failed",
        description: `${errorMessage}. Please check your information and try again, or contact us for assistance.`,
        variant: "destructive",
        duration: 7000,
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>We'll use this to contact you about your booking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className={errors.firstName ? "text-destructive" : ""}>
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="John"
                className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
              {errors.firstName && (
                <div id="firstName-error" className="flex items-center gap-1 text-sm text-destructive font-medium">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.firstName}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className={errors.lastName ? "text-destructive" : ""}>
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                
                placeholder="Doe"
                className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
              {errors.lastName && (
                <div id="lastName-error" className="flex items-center gap-1 text-sm text-destructive font-medium">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.lastName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                
                placeholder="john@example.com"
                className={`pl-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <div id="email-error" className="flex items-center gap-1 text-sm text-destructive font-medium">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
                Phone Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  
                  placeholder="+1 234 567 8900"
                  className={`pl-10 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </div>
              {errors.phone && (
                <div id="phone-error" className="flex items-center gap-1 text-sm text-destructive font-medium">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className={errors.country ? "text-destructive" : ""}>
                Country *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <Select
                  value={formData.country}
                  onValueChange={(value) => updateField("country", value)}
                  
                >
                  <SelectTrigger
                    id="country"
                    className={`pl-10 ${errors.country ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    aria-invalid={!!errors.country}
                    aria-describedby={errors.country ? "country-error" : undefined}
                  >
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.country && (
                <div id="country-error" className="flex items-center gap-1 text-sm text-destructive font-medium">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.country}</span>
                </div>
              )}
            </div>
          </div>

          {/* Honeypot field */}
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={(e) => updateField("website", e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
        </CardContent>
      </Card>

      {/* Travel Details */}
      <Card>
        <CardHeader>
          <CardTitle>Travel Details</CardTitle>
          <CardDescription>When do you plan to travel?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travelDateFrom" className={errors.travelDateFrom ? "text-destructive" : ""}>
                Travel Date From *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="travelDateFrom"
                  type="date"
                  value={formData.travelDateFrom}
                  onChange={(e) => updateField("travelDateFrom", e.target.value)}
                  
                  min={new Date().toISOString().split("T")[0]}
                  className={`pl-10 ${errors.travelDateFrom ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  aria-invalid={!!errors.travelDateFrom}
                  aria-describedby={errors.travelDateFrom ? "travelDateFrom-error" : undefined}
                />
              </div>
              {errors.travelDateFrom && (
                <div id="travelDateFrom-error" className="flex items-center gap-1 text-sm text-destructive font-medium">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.travelDateFrom}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelDateTo" className={errors.travelDateTo ? "text-destructive" : ""}>
                Travel Date To *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="travelDateTo"
                  type="date"
                  value={formData.travelDateTo}
                  onChange={(e) => updateField("travelDateTo", e.target.value)}
                  
                  min={formData.travelDateFrom || new Date().toISOString().split("T")[0]}
                  className={`pl-10 ${errors.travelDateTo ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  aria-invalid={!!errors.travelDateTo}
                  aria-describedby={errors.travelDateTo ? "travelDateTo-error" : undefined}
                />
              </div>
              {errors.travelDateTo && (
                <div id="travelDateTo-error" className="flex items-center gap-1 text-sm text-destructive font-medium">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.travelDateTo}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">
              Special Requests or Dietary Requirements
            </Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => updateField("specialRequests", e.target.value)}
              placeholder="Any special requirements, dietary needs, or questions..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Verify Booking Details */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Verify Your Booking Details</CardTitle>
          <CardDescription>
            Please review and confirm your booking information before submitting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Number of Travelers Input */}
          <div className="space-y-2">
            <Label htmlFor="numberOfTravelers" className={errors.numberOfTravelers ? "text-destructive" : ""}>
              Number of Travelers *
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="numberOfTravelers"
                type="number"
                min="1"
                max="50"
                value={formData.numberOfTravelers}
                onChange={(e) =>
                  updateField("numberOfTravelers", parseInt(e.target.value) || 1)
                }
                
                className={`pl-10 ${errors.numberOfTravelers ? "border-destructive focus-visible:ring-destructive" : ""}`}
                aria-invalid={!!errors.numberOfTravelers}
                aria-describedby={errors.numberOfTravelers ? "numberOfTravelers-error" : undefined}
              />
            </div>
            {errors.numberOfTravelers ? (
              <div id="numberOfTravelers-error" className="flex items-center gap-1 text-sm text-destructive font-medium">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.numberOfTravelers}</span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Large groups (10+ travelers) may receive discounted rates
              </p>
            )}
          </div>

          {/* Booking Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <p className="font-semibold text-sm">Booking Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {bookingType === "PACKAGE" ? "Package" : "Destination"}:
                </span>
                <span className="font-medium">{itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price per person:</span>
                <span className="font-medium">${pricePerPerson.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Number of travelers:</span>
                <span className="font-medium">{formData.numberOfTravelers}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2 mt-2">
                <span className="font-bold">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Info Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-sm mb-3">Your Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground block">Name</span>
                <span className="font-medium">
                  {formData.firstName && formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`
                    : "Not provided"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Email</span>
                <span className="font-medium">{formData.email || "Not provided"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Phone</span>
                <span className="font-medium">{formData.phone || "Not provided"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Country</span>
                <span className="font-medium">{formData.country || "Not selected"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Travel From</span>
                <span className="font-medium">
                  {formData.travelDateFrom
                    ? new Date(formData.travelDateFrom).toLocaleDateString()
                    : "Not selected"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Travel To</span>
                <span className="font-medium">
                  {formData.travelDateTo
                    ? new Date(formData.travelDateTo).toLocaleDateString()
                    : "Not selected"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            After submitting this booking, we'll send you our bank details for payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-semibold">How to Complete Your Booking:</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Submit this form to reserve your spot</li>
              <li>We'll email you our bank transfer details</li>
              <li>Make the payment within 48 hours</li>
              <li>Send us the payment reference number</li>
              <li>We'll confirm your booking once payment is received</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading || !isFormValid()}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : !isFormValid() ? (
          "Please Complete All Required Fields"
        ) : (
          "Submit Booking Request"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By submitting this form, you agree to our terms and conditions. Your personal
        information will be used solely for booking purposes.
      </p>
    </form>
  );
}
