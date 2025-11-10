"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Users, AlertCircle } from "lucide-react";
import Link from "next/link";
import { quoteRequestSchema, type QuoteRequestFormData } from "@/lib/validations";

interface BookingButtonProps {
  packageName: string;
  packageSlug: string;
  maxTravelers: number;
}

export function BookingButton({
  packageName,
  packageSlug,
  maxTravelers,
}: BookingButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const exceedsMax = numberOfPeople > maxTravelers;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuoteRequestFormData>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      packageName,
      packageSlug,
      numberOfPeople,
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: QuoteRequestFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          numberOfPeople,
          message: `${data.message || ""}\n\n---\nPackage: ${packageName}\nRequested Group Size: ${numberOfPeople} people (exceeds standard max of ${maxTravelers})`,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        reset();
        setNumberOfPeople(2);
        setTimeout(() => {
          setShowDialog(false);
          setSubmitSuccess(false);
        }, 2000);
      } else {
        setSubmitError(result.error || "Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting quote request:", error);
      setSubmitError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="numPeople">
            <Users className="h-4 w-4 inline mr-2" />
            Number of Travelers
          </Label>
          <Input
            id="numPeople"
            type="number"
            min="1"
            max="100"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
            className="mt-2"
          />
          {exceedsMax && (
            <p className="text-sm text-amber-600 mt-1">
              Group size exceeds maximum of {maxTravelers}. Request a custom quote!
            </p>
          )}
        </div>

        {exceedsMax ? (
          <Button
            size="lg"
            className="w-full shadow-lg hover:shadow-xl"
            onClick={() => setShowDialog(true)}
          >
            Request Quote for Large Group
          </Button>
        ) : (
          <Link href="/contact">
            <Button size="lg" className="w-full shadow-lg hover:shadow-xl">
              Book This Safari
            </Button>
          </Link>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Quote for Large Group</DialogTitle>
            <DialogDescription>
              Your group of {numberOfPeople} exceeds our standard maximum of{" "}
              {maxTravelers} travelers. Fill out this form and we'll provide a
              custom quote for your group.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {submitError && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">
                  Your quote request has been submitted! We'll contact you within 24 hours.
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="quoteName">Full Name *</Label>
              <Input
                id="quoteName"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="quoteEmail">Email *</Label>
              <Input
                id="quoteEmail"
                type="email"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="quotePhone">Phone Number</Label>
              <Input
                id="quotePhone"
                type="tel"
                {...register("phone")}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="quoteMessage">Additional Information</Label>
              <Textarea
                id="quoteMessage"
                rows={4}
                placeholder="Tell us about your group, preferred dates, special requirements..."
                {...register("message")}
                className={errors.message ? "border-destructive" : ""}
              />
              {errors.message && (
                <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
              )}
            </div>

            <div className="bg-muted p-3 rounded text-sm">
              <strong>Package:</strong> {packageName}
              <br />
              <strong>Group Size:</strong> {numberOfPeople} travelers
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  setSubmitError(null);
                  setSubmitSuccess(false);
                  reset();
                }}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || submitSuccess} className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Sending..." : submitSuccess ? "Sent!" : "Request Quote"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
