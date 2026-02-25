"use client";

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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Phone, MessageSquare, User } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/validations/contact";
import { FormErrorMessage } from "@/components/ui/form-error-message";

export function ContactFormComponent() {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      website: "",
    },
    mode: "onTouched",
  });

  const { register, control, handleSubmit, formState: { errors, isSubmitting, isValid }, watch, reset, setError } = form;
  const messageValue = watch("message") || "";

  const onSubmit = async (data: ContactFormData) => {
    // Bot detection - silently reject
    if (data.website) {
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
            "Too many contact attempts. Please wait an hour and try again."
          );
        }

        throw new Error(result.error || "Failed to send message. Please try again.");
      }

      toast({
        title: "Message Sent!",
        description: result.message || "We'll get back to you within 24 hours.",
      });

      reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Failed to Send",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
          Your Name *
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            {...register("name")}
            required
            placeholder="John Doe"
            className={`pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </div>
        <FormErrorMessage message={errors.name?.message} id="name-error" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              required
              placeholder="john@example.com"
              className={`pl-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </div>
          <FormErrorMessage message={errors.email?.message} id="email-error" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="+1 234 567 8900"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className={errors.subject ? "text-destructive" : ""}>
          Subject *
        </Label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Controller
            control={control}
            name="subject"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  field.onBlur();
                }}
              >
                <SelectTrigger
                  className={`pl-10 ${errors.subject ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                >
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="booking">Booking Question</SelectItem>
                  <SelectItem value="package">Package Information</SelectItem>
                  <SelectItem value="destination">Destination Details</SelectItem>
                  <SelectItem value="custom">Custom Safari Request</SelectItem>
                  <SelectItem value="group">Group Booking</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <FormErrorMessage message={errors.subject?.message} id="subject-error" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className={errors.message ? "text-destructive" : ""}>
          Message *
        </Label>
        <Textarea
          id="message"
          {...register("message")}
          required
          placeholder="Tell us about your inquiry..."
          rows={6}
          className={errors.message ? "border-destructive focus-visible:ring-destructive" : ""}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        <div className="flex items-center justify-between">
          {errors.message ? (
            <FormErrorMessage message={errors.message.message} id="message-error" />
          ) : (
            <div className="text-xs text-muted-foreground">
              {messageValue.length > 0 && `${messageValue.length} / 5000 characters`}
            </div>
          )}
          {messageValue.trim().length > 0 && messageValue.trim().length < 10 && !errors.message && (
            <div className="text-xs text-muted-foreground">
              {10 - messageValue.trim().length} more characters needed
            </div>
          )}
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

      {!isValid && Object.keys(errors).length === 0 && (
        <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-medium mb-2">
            Please complete the following required fields:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            {!watch("name") || watch("name").trim().length < 2 ? <li>Your Name (at least 2 characters)</li> : null}
            {!watch("email") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watch("email")) ? <li>Valid Email Address</li> : null}
            {!watch("subject")?.trim() ? <li>Subject</li> : null}
            {!messageValue || messageValue.trim().length < 10 ? <li>Message (at least 10 characters)</li> : null}
          </ul>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting || !isValid} className="w-full" size="lg">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            {isValid ? "Send Message" : "Complete Required Fields"}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        We'll respond to your inquiry within 24 hours
      </p>
    </form>
  );
}
