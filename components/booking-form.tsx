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
import { Loader2, Calendar, Users, Mail, Phone, MapPin } from "lucide-react";
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
  };

  const totalPrice = pricePerPerson * formData.numberOfTravelers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot detection - silently reject
    if (formData.website) {
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
        title: "Booking Submitted!",
        description: `Your confirmation number is ${data.booking.confirmationNumber}. We'll contact you soon!`,
      });

      if (onSuccess) {
        onSuccess(data.booking.confirmationNumber);
      } else {
        router.push(`/booking-confirmation?ref=${data.booking.confirmationNumber}`);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
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
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
                placeholder="John"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                required
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
                placeholder="john@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  required
                  placeholder="+1 234 567 8900"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <Select
                  value={formData.country}
                  onValueChange={(value) => updateField("country", value)}
                  required
                >
                  <SelectTrigger id="country" className="pl-10">
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
              <Label htmlFor="travelDateFrom">Travel Date From *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="travelDateFrom"
                  type="date"
                  value={formData.travelDateFrom}
                  onChange={(e) => updateField("travelDateFrom", e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelDateTo">Travel Date To *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="travelDateTo"
                  type="date"
                  value={formData.travelDateTo}
                  onChange={(e) => updateField("travelDateTo", e.target.value)}
                  required
                  min={formData.travelDateFrom || new Date().toISOString().split("T")[0]}
                  className="pl-10"
                />
              </div>
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
            <Label htmlFor="numberOfTravelers">Number of Travelers *</Label>
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
                required
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Large groups (10+ travelers) may receive discounted rates
            </p>
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
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
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
