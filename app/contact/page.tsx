"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HelpCircle,
  BookOpen,
  Plane,
  Shield,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PATH = "nambi-uganda-safaris/images";

const heroSlides = [
  {
    image: `${R2_BASE}/${IMAGE_PATH}/uganda-safari-landscape-team-adventure.webp`,
    title: "We're here to help",
    subtitle: "Get In Touch",
    description:
      "Have questions about your Uganda adventure? Our team is ready to make your journey unforgettable.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Form submitted:", formData);
    setSubmitSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);

    // Hide success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <main className="min-h-screen">
      <Header />

      <PageHero
        slides={heroSlides}
        showCounter={false}
        showDots={false}
        autoPlay={false}
      />

      {/* Contact Form & Info Section */}
      <section className="py-16 container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <h2 className="font-inter text-3xl font-bold">
                    Send Us a Message
                  </h2>
                </div>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and our team will get back to you
                  within 24 hours.
                </p>

                {submitSuccess && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3 mb-6">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <p className="text-sm font-medium">
                      Thank you for your message! We'll get back to you soon.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="John Doe"
                        aria-invalid={!!errors.name}
                        size="lg"
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email Address{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="john@example.com"
                        aria-invalid={!!errors.email}
                        size="lg"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">
                          {errors.email}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        We'll never share your email with anyone else
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      Subject <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      placeholder="What is your inquiry about?"
                      aria-invalid={!!errors.subject}
                      size="lg"
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="Tell us more about your trip plans or questions..."
                      className="min-h-40 resize-none"
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">
                        {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formData.message.length} characters
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-inter text-xl font-bold mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <a
                        href="mailto:info@nambiuganda.com"
                        className="text-muted-foreground hover:text-primary"
                      >
                        info@nambiuganda.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Phone</p>
                      <a
                        href="tel:+256788048210"
                        className="text-muted-foreground hover:text-primary"
                      >
                        +256 788048210
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <a
                        href="https://wa.me/+31682754225"
                        target="_blank"
                        className="text-muted-foreground hover:text-primary"
                      >
                        Click here to chat on WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Office</p>
                      <p className="text-muted-foreground">Kampala, Uganda</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Business Hours</p>
                      <p className="text-muted-foreground">
                        Mon - Fri: 8AM - 6PM EAT
                      </p>
                      <p className="text-muted-foreground">
                        Sat: 9AM - 2PM EAT
                      </p>
                      <p className="text-muted-foreground">Sun: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-inter text-lg font-bold mb-3">
                  Quick Response
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our team typically responds within 2-4 hours during business
                  hours. For urgent matters, please call us directly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 pb-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
              <h2 className="font-inter text-4xl font-bold">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Find quick answers to common questions
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4 pb-8">
              <AccordionItem
                value="item-1"
                className="bg-background rounded-lg border px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Do I need a visa to visit Uganda?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Most visitors can obtain a visa on arrival or apply for an
                  e-visa online before traveling. The standard tourist visa
                  costs $50 USD and is valid for 90 days. We recommend applying
                  for an e-visa at least 2 weeks before your trip at{" "}
                  <a
                    href="https://visas.immigration.go.ug"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    visas.immigration.go.ug
                  </a>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="bg-background rounded-lg border px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What vaccinations do I need for Uganda?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  A yellow fever vaccination certificate is required for entry
                  into Uganda. We also recommend vaccinations for hepatitis A &
                  B, typhoid, and malaria prophylaxis. Consult your doctor or
                  travel clinic at least 6-8 weeks before your trip for
                  personalized advice.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="bg-background rounded-lg border px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  When is the best time to visit Uganda?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Uganda is a year-round destination! The dry seasons
                  (June-September and December-February) are ideal for gorilla
                  trekking and wildlife viewing. The wet seasons (March-May and
                  October-November) offer lush landscapes and fewer tourists.
                  Gorilla permits are available year-round.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="bg-background rounded-lg border px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  How much does a gorilla trekking permit cost?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  A gorilla trekking permit in Uganda costs $700 USD per person
                  for international visitors. Permits must be booked well in
                  advance (6-12 months recommended) as they sell out quickly.
                  The permit includes one hour with the gorillas and park ranger
                  guides.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="bg-background rounded-lg border px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What is your cancellation policy?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We offer flexible cancellation options:
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>
                      Free cancellation up to 30 days before departure (full
                      refund minus processing fees)
                    </li>
                    <li>
                      50% refund for cancellations 15-29 days before departure
                    </li>
                    <li>
                      No refund for cancellations less than 14 days before
                      departure
                    </li>
                    <li>Travel insurance is highly recommended</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-6"
                className="bg-background rounded-lg border px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We accept all major credit cards (Visa, Mastercard, American
                  Express), bank transfers, and PayPal. A 30% deposit is
                  required at booking, with the balance due 45 days before
                  departure. Payment plans are available for bookings made more
                  than 90 days in advance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Helpful Resources */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h2 className="font-inter text-4xl font-bold">
                Helpful Resources
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Everything you need to plan your Uganda adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Travel Guide */}
            <Card className="group hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-inter text-xl font-bold mb-3">
                  Uganda Travel Guide
                </h3>
                <p className="text-muted-foreground mb-4">
                  Complete guide to visiting Uganda including transportation,
                  accommodation, culture, and safety tips.
                </p>
                <Link
                  href="/destinations"
                  className="text-primary font-semibold hover:underline"
                >
                  Read Guide →
                </Link>
              </CardContent>
            </Card>

            {/* Visa Information */}
            <Card className="group hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-inter text-xl font-bold mb-3">
                  Visa & Entry Requirements
                </h3>
                <p className="text-muted-foreground mb-4">
                  Detailed information about visa requirements, entry permits,
                  and immigration procedures for Uganda.
                </p>
                <a
                  href="https://visas.immigration.go.ug"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  Apply for Visa →
                </a>
              </CardContent>
            </Card>

            {/* Booking Tips */}
            <Card className="group hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-inter text-xl font-bold mb-3">
                  Booking & Payment Guide
                </h3>
                <p className="text-muted-foreground mb-4">
                  Learn about our booking process, payment options, deposit
                  requirements, and cancellation policies.
                </p>
                <Link
                  href="/about"
                  className="text-primary font-semibold hover:underline"
                >
                  Learn More →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Tips Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-inter text-3xl font-bold mb-8 text-center">
              Before You Reach Out
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Check Our FAQ</h4>
                  <p className="text-sm text-muted-foreground">
                    Many common questions are answered in our FAQ section above.
                    This can save you time!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Review Trip Details</h4>
                  <p className="text-sm text-muted-foreground">
                    Visit our destinations page to see detailed information
                    about each trip, including itineraries and pricing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Prepare Your Questions</h4>
                  <p className="text-sm text-muted-foreground">
                    Having specific questions ready helps us provide you with
                    the most accurate and helpful information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Include Travel Dates</h4>
                  <p className="text-sm text-muted-foreground">
                    If you have preferred travel dates, let us know! This helps
                    us check availability and provide accurate quotes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
