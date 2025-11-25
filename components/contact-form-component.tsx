"use client";

import { useState } from "react";
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
import { Loader2, Mail, Phone, MessageSquare, User, AlertCircle } from "lucide-react";

export function ContactFormComponent() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "", // Honeypot
  });

  const updateField = (field: string, value: string) => {
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

  // Check if form is complete and valid
  const isFormValid = () => {
    return (
      formData.name.trim().length >= 2 &&
      formData.email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.subject.trim().length > 0 &&
      formData.message.trim().length >= 10
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) {
      newErrors.name = "Name contains invalid characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Subject validation
    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 5000) {
      newErrors.message = "Message is too long (max 5000 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
            "Too many contact attempts. Please wait an hour and try again."
          );
        }

        throw new Error(data.error || "Failed to send message. Please try again.");
      }

      toast({
        title: "Message Sent!",
        description: data.message || "We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        website: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Failed to Send",
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
      <div className="space-y-2">
        <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
          Your Name *
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
            placeholder="John Doe"
            className={`pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </div>
        {errors.name && (
          <div id="name-error" className="flex items-center gap-1 text-sm text-destructive font-medium">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.name}</span>
          </div>
        )}
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
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
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

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
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
          <Select value={formData.subject} onValueChange={(value) => updateField("subject", value)}>
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
        </div>
        {errors.subject && (
          <div id="subject-error" className="flex items-center gap-1 text-sm text-destructive font-medium">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.subject}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className={errors.message ? "text-destructive" : ""}>
          Message *
        </Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => updateField("message", e.target.value)}
          required
          placeholder="Tell us about your inquiry..."
          rows={6}
          className={errors.message ? "border-destructive focus-visible:ring-destructive" : ""}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <div id="message-error" className="flex items-center gap-1 text-sm text-destructive font-medium">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.message}</span>
          </div>
        )}
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

      <Button type="submit" disabled={loading || !isFormValid()} className="w-full" size="lg">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : !isFormValid() ? (
          "Please Complete All Required Fields"
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        We'll respond to your inquiry within 24 hours
      </p>
    </form>
  );
}
