"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateRange, OnSelectHandler } from "react-day-picker";
import { format, isSameDay, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as DatePickerCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingClientSchema, type BookingClientData } from "@/lib/validations/booking";
import { FormErrorMessage } from "@/components/ui/form-error-message";

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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const form = useForm<BookingClientData>({
    resolver: zodResolver(bookingClientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      numberOfTravelers: initialTravelers,
      travelDateFrom: "",
      travelDateTo: "",
      specialRequests: "",
      website: "",
    },
    mode: "onTouched",
  });

  const { register, control, handleSubmit, formState: { errors }, watch, setValue } = form;

  const watchedValues = watch();
  const travelerCount = watchedValues.numberOfTravelers || 0;
  const totalPrice = pricePerPerson * travelerCount;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDateRange: DateRange | undefined =
    watchedValues.travelDateFrom || watchedValues.travelDateTo
      ? {
          from: watchedValues.travelDateFrom ? parseISO(watchedValues.travelDateFrom) : undefined,
          to: watchedValues.travelDateTo ? parseISO(watchedValues.travelDateTo) : undefined,
        }
      : undefined;

  const travelDateError = errors.travelDateFrom?.message || errors.travelDateTo?.message;
  const travelDateDisplay = selectedDateRange?.from
    ? selectedDateRange.to
      ? `${format(selectedDateRange.from, "MMM d, yyyy")} - ${format(selectedDateRange.to, "MMM d, yyyy")}`
      : `${format(selectedDateRange.from, "MMM d, yyyy")} - Select end date`
    : "";

  const applySelectedRange = (range: DateRange | undefined) => {
    setValue(
      "travelDateFrom",
      range?.from ? format(range.from, "yyyy-MM-dd") : "",
      { shouldValidate: true }
    );
    setValue(
      "travelDateTo",
      range?.to ? format(range.to, "yyyy-MM-dd") : "",
      { shouldValidate: true }
    );
  };

  const handleTravelDateSelect: OnSelectHandler<DateRange | undefined> = (
    range,
    triggerDate,
    modifiers
  ) => {
    if (modifiers.disabled) {
      return;
    }

    const hasCompletedRange = Boolean(
      selectedDateRange?.from &&
      selectedDateRange?.to &&
      !isSameDay(selectedDateRange.from, selectedDateRange.to)
    );
    if (hasCompletedRange) {
      applySelectedRange({ from: triggerDate, to: undefined });
      setIsDatePickerOpen(true);
      return;
    }

    applySelectedRange(range);
    setIsDatePickerOpen(true);
  };

  const onSubmit = async (data: BookingClientData) => {
    // Bot detection - silently reject
    if (data.website) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          bookingType,
          packageId: bookingType === "PACKAGE" ? itemId : undefined,
          destinationId: bookingType === "DESTINATION" ? itemId : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.details) {
          const validationErrors = result.details
            .map((err: any) => err.message)
            .join(", ");
          throw new Error(`Validation failed: ${validationErrors}`);
        }

        if (response.status === 429) {
          throw new Error(
            "Too many booking attempts. Please wait an hour and try again."
          );
        }

        throw new Error(result.error || "Booking failed. Please try again.");
      }

      toast({
        title: "✅ Booking Successfully Submitted!",
        description: `Confirmation #${result.booking.confirmationNumber} - Check your email for payment instructions. You'll be redirected to your booking details shortly.`,
        duration: 5000,
      });

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result.booking.confirmationNumber);
        } else {
          router.push(`/booking-confirmation?ref=${result.booking.confirmationNumber}`);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                {...register("firstName")}
                placeholder="John"
                className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
              <FormErrorMessage message={errors.firstName?.message} id="firstName-error" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className={errors.lastName ? "text-destructive" : ""}>
                Last Name *
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Doe"
                className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
              <FormErrorMessage message={errors.lastName?.message} id="lastName-error" />
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
                {...register("email")}
                placeholder="john@example.com"
                className={`pl-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            <FormErrorMessage message={errors.email?.message} id="email-error" />
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
                  {...register("phone")}
                  placeholder="+1 234 567 8900"
                  className={`pl-10 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </div>
              <FormErrorMessage message={errors.phone?.message} id="phone-error" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className={errors.country ? "text-destructive" : ""}>
                Country *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <Controller
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
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
                  )}
                />
              </div>
              <FormErrorMessage message={errors.country?.message} id="country-error" />
            </div>
          </div>

          {/* Honeypot field */}
          <input
            type="text"
            {...register("website")}
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
          <div className="space-y-2">
            <Label htmlFor="travelDates" className={travelDateError ? "text-destructive" : ""}>
              Travel Dates *
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Input
                    id="travelDates"
                    readOnly
                    value={travelDateDisplay}
                    placeholder="Select your travel dates"
                    className={cn(
                      "pl-10 cursor-pointer",
                      !selectedDateRange?.from && "text-muted-foreground",
                      travelDateError && "border-destructive focus-visible:ring-destructive"
                    )}
                    aria-invalid={!!travelDateError}
                    aria-describedby={travelDateError ? "travelDates-error" : undefined}
                  />
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto border-border bg-background p-2 shadow-lg"
                  align="start"
                >
                  <DatePickerCalendar
                    mode="range"
                    selected={selectedDateRange}
                    onSelect={handleTravelDateSelect}
                    disabled={{ before: today }}
                    numberOfMonths={1}
                    initialFocus
                    defaultMonth={selectedDateRange?.from || today}
                    className="rounded-md"
                  />
                </PopoverContent>
              </Popover>
            </div>
            {travelDateError ? (
              <FormErrorMessage message={travelDateError} id="travelDates-error" />
            ) : (
              <p className="text-xs text-muted-foreground">
                Pick a start and end date from one calendar.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">
              Special Requests or Dietary Requirements
            </Label>
            <Textarea
              id="specialRequests"
              {...register("specialRequests")}
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
              <Controller
                control={control}
                name="numberOfTravelers"
                render={({ field }) => (
                  <Input
                    id="numberOfTravelers"
                    type="number"
                    min="1"
                    max="50"
                    value={field.value}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        field.onChange(0);
                        return;
                      }
                      const parsed = parseInt(e.target.value, 10);
                      if (!isNaN(parsed)) {
                        field.onChange(parsed);
                      }
                    }}
                    onBlur={field.onBlur}
                    className={`pl-10 ${errors.numberOfTravelers ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    aria-invalid={!!errors.numberOfTravelers}
                    aria-describedby={errors.numberOfTravelers ? "numberOfTravelers-error" : undefined}
                  />
                )}
              />
            </div>
            {errors.numberOfTravelers ? (
              <FormErrorMessage message={errors.numberOfTravelers.message} id="numberOfTravelers-error" />
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
                <span className="font-medium">{travelerCount || "-"}</span>
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
                  {watchedValues.firstName && watchedValues.lastName
                    ? `${watchedValues.firstName} ${watchedValues.lastName}`
                    : "Not provided"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Email</span>
                <span className="font-medium">{watchedValues.email || "Not provided"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Phone</span>
                <span className="font-medium">{watchedValues.phone || "Not provided"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Country</span>
                <span className="font-medium">{watchedValues.country || "Not selected"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Travel From</span>
                <span className="font-medium">
                  {watchedValues.travelDateFrom
                    ? new Date(watchedValues.travelDateFrom).toLocaleDateString()
                    : "Not selected"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Travel To</span>
                <span className="font-medium">
                  {watchedValues.travelDateTo
                    ? new Date(watchedValues.travelDateTo).toLocaleDateString()
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
