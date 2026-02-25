"use client";

import { useState, useEffect, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  Users,
  DollarSign,
  Send,
  AlertCircle,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customPackageClientSchema, type CustomPackageClientData } from "@/lib/validations/custom-package";
import { FormErrorMessage } from "@/components/ui/form-error-message";

interface Destination {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  country: string;
  region: string | null;
}

interface SelectedDestination {
  id: number;
  name: string;
  category: string;
  image: string;
  days: number;
}

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

export default function BuildPackagePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [pageContent, setPageContent] = useState<any>(null);
  const [selectedDestinations, setSelectedDestinations] = useState<SelectedDestination[]>([]);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CustomPackageClientData>({
    resolver: zodResolver(customPackageClientSchema),
    defaultValues: {
      name: "",
      contactName: "",
      email: "",
      phone: "",
      numberOfPeople: 2,
      travelDate: "",
      budget: null,
      specialRequests: "",
      website: "",
    },
    mode: "onTouched",
  });

  const { register, control, handleSubmit, formState: { errors, isSubmitting, isValid }, watch } = form;

  // Fetch destinations on mount
  useEffect(() => {
    fetchDestinations();
  }, []);

  // Fetch hero and content data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [heroResponse, contentResponse] = await Promise.all([
          fetch("/api/cms/custom-package-hero"),
          fetch("/api/cms/custom-package-content")
        ]);

        // Handle hero data
        if (heroResponse.ok) {
          const heroSection = await heroResponse.json();
          if (heroSection.section) {
            setHeroSlides([{
              image: heroSection.section.image,
              title: heroSection.section.title,
              subtitle: heroSection.section.subtitle,
              description: heroSection.section.description,
            }]);
          }
        }

        // Handle content data
        if (contentResponse.ok) {
          const contentSection = await contentResponse.json();
          if (contentSection.section) {
            setPageContent(contentSection.section);
          }
        }

        // Fallbacks if no data
        if (!heroSlides.length) {
          const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
          const IMAGE_PATH = "nambi-uganda-safaris/images";

          setHeroSlides([{
            image: `${R2_BASE}/${IMAGE_PATH}/uganda-queen-elizabeth-national-park-safari.webp`,
            title: "Create Your Perfect Adventure",
            subtitle: "Custom Safari Packages",
            description: "Design your ideal safari experience with our expert team. Choose destinations, activities, and accommodations that match your preferences.",
          }]);
        }

        if (!pageContent) {
          setPageContent({
            title: "Build Your Custom Safari Package",
            subtitle: "",
            description: "Select the destinations you want to visit, customize the duration, choose your preferred accommodations, and let our expert team create your perfect safari experience.",
          });
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
        // Fallback to default
        const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
        const IMAGE_PATH = "nambi-uganda-safaris/images";

        setHeroSlides([{
          image: `${R2_BASE}/${IMAGE_PATH}/uganda-queen-elizabeth-national-park-safari.webp`,
          title: "Create Your Perfect Adventure",
          subtitle: "Custom Safari Packages",
          description: "Design your ideal safari experience with our expert team. Choose destinations, activities, and accommodations that match your preferences.",
        }]);

        setPageContent({
          title: "Build Your Custom Safari Package",
          subtitle: "",
          description: "Select the destinations you want to visit, customize the duration, choose your preferred accommodations, and let our expert team create your perfect safari experience.",
        });
      }
    }

    fetchData();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/destinations');
      if (!response.ok) throw new Error('Failed to fetch destinations');
      const data = await response.json();
      setDestinations(data.destinations || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoadingDestinations(false);
    }
  };

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in?redirect_url=/build-package");
    return null;
  }

  const toggleDestination = (dest: Destination) => {
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
      setDestinationError(null);
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

  const isFormComplete = isValid && selectedDestinations.length > 0;

  const onSubmit = async (data: CustomPackageClientData) => {
    // Bot detection
    if (data.website) {
      return;
    }

    // Validate destinations (separate state)
    if (selectedDestinations.length === 0) {
      setDestinationError("Please select at least one destination");
      return;
    }

    setSubmitError(null);

    try {
      const requestData = {
        name: data.name || "Custom Safari Package",
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        destinations: selectedDestinations,
        duration: `${totalDays} Days`,
        numberOfPeople: data.numberOfPeople,
        travelDate: data.travelDate || null,
        budget: data.budget,
        specialRequests: data.specialRequests,
        website: data.website,
      };

      const response = await fetch("/api/custom-packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        setSubmitError("Failed to process server response. Please try again.");
        return;
      }

      if (response.ok) {
        router.push(`/custom-package-confirmation?packageId=${result.packageId}`);
      } else {
        let errorMessage = "Failed to submit custom package. Please try again.";

        if (response.status === 400 && result.details) {
          const validationErrors = result.details
            .map((err: any) => err.message)
            .join(", ");
          errorMessage = `Validation failed: ${validationErrors}`;
        } else if (response.status === 429) {
          errorMessage = "Too many requests. Please wait an hour and try again.";
        } else if (response.status === 401) {
          errorMessage = "You must be signed in to create a custom package.";
          router.push("/sign-in?redirect_url=/build-package");
          return;
        } else if (result.error) {
          errorMessage = result.error;
        }

        setSubmitError(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting package:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again."
      );
    }
  };

  return (
    <main className="min-h-screen">
      <Header />

      <Suspense
        fallback={
          <div className="h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] w-full bg-muted animate-pulse" />
        }
      >
        <PageHero slides={heroSlides} showCounter={false} showDots={false} autoPlay={false} />
      </Suspense>

      <section className="pt-32 pb-20 container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-inter text-4xl md:text-5xl font-bold mb-4">
              {pageContent?.title || "Build Your Custom Safari Package"}
            </h1>
            {pageContent?.subtitle && (
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
                {pageContent.subtitle}
              </h2>
            )}
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {pageContent?.description || "Select the destinations you want to visit, customize the duration, and we'll create a personalized quote for your dream Uganda adventure."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Destination Selection */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="font-inter text-2xl font-bold mb-4">
                    Step 1: Select Destinations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loadingDestinations ? (
                      <div className="col-span-2 text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                      </div>
                    ) : destinations.length === 0 ? (
                      <div className="col-span-2 text-center py-8 text-muted-foreground">
                        No destinations available. Please create destinations in the CMS first.
                      </div>
                    ) : destinations.map((dest) => {
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
                        {destinationError && (
                          <FormErrorMessage message={destinationError} />
                        )}
                      </div>

                      <div className="border-t pt-4 space-y-4">
                        {/* Contact Information */}
                        <div>
                          <Label htmlFor="contactName" className={errors.contactName ? "text-destructive" : ""}>
                            <User className="h-4 w-4 inline mr-2" />
                            Your Name *
                          </Label>
                          <Input
                            id="contactName"
                            placeholder="John Doe"
                            {...register("contactName")}
                            required
                            className={errors.contactName ? "border-destructive focus-visible:ring-destructive" : ""}
                            aria-invalid={!!errors.contactName}
                            aria-describedby={errors.contactName ? "contactName-error" : undefined}
                          />
                          <FormErrorMessage message={errors.contactName?.message} id="contactName-error" className="mt-1" />
                        </div>

                        <div>
                          <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                            <Mail className="h-4 w-4 inline mr-2" />
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            {...register("email")}
                            required
                            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                          />
                          <FormErrorMessage message={errors.email?.message} id="email-error" className="mt-1" />
                        </div>

                        <div>
                          <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
                            <Phone className="h-4 w-4 inline mr-2" />
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+256 123 456 789"
                            {...register("phone")}
                            required
                            className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                            aria-invalid={!!errors.phone}
                            aria-describedby={errors.phone ? "phone-error" : undefined}
                          />
                          <FormErrorMessage message={errors.phone?.message} id="phone-error" className="mt-1" />
                        </div>

                        <div className="border-t pt-4 space-y-4">
                          <div>
                            <Label htmlFor="packageName">Package Name (Optional)</Label>
                            <Input
                              id="packageName"
                              placeholder="My Custom Safari"
                              {...register("name")}
                            />
                          </div>

                          <div>
                            <Label htmlFor="numberOfPeople" className={errors.numberOfPeople ? "text-destructive" : ""}>
                              <Users className="h-4 w-4 inline mr-2" />
                              Number of People *
                            </Label>
                            <Controller
                              control={control}
                              name="numberOfPeople"
                              render={({ field }) => (
                                <Input
                                  id="numberOfPeople"
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
                                  required
                                  className={errors.numberOfPeople ? "border-destructive focus-visible:ring-destructive" : ""}
                                  aria-invalid={!!errors.numberOfPeople}
                                  aria-describedby={errors.numberOfPeople ? "numberOfPeople-error" : undefined}
                                />
                              )}
                            />
                            <FormErrorMessage message={errors.numberOfPeople?.message} id="numberOfPeople-error" className="mt-1" />
                          </div>

                          <div>
                            <Label htmlFor="travelDate" className={errors.travelDate ? "text-destructive" : ""}>
                              <Calendar className="h-4 w-4 inline mr-2" />
                              Preferred Travel Date
                            </Label>
                            <Input
                              id="travelDate"
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              {...register("travelDate")}
                              className={errors.travelDate ? "border-destructive focus-visible:ring-destructive" : ""}
                              aria-invalid={!!errors.travelDate}
                              aria-describedby={errors.travelDate ? "travelDate-error" : undefined}
                            />
                            <FormErrorMessage message={errors.travelDate?.message} id="travelDate-error" className="mt-1" />
                          </div>

                          <div>
                            <Label htmlFor="budget">
                              <DollarSign className="h-4 w-4 inline mr-2" />
                              Budget per Person (Optional)
                            </Label>
                            <Controller
                              control={control}
                              name="budget"
                              render={({ field }) => (
                                <Input
                                  id="budget"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="1000.00"
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    if (e.target.value === "") {
                                      field.onChange(null);
                                      return;
                                    }
                                    const parsed = parseFloat(e.target.value);
                                    if (!isNaN(parsed)) {
                                      field.onChange(parsed);
                                    }
                                  }}
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                          </div>

                          <div>
                            <Label htmlFor="specialRequests">Special Requests</Label>
                            <Textarea
                              id="specialRequests"
                              placeholder="Any special requirements or preferences..."
                              rows={4}
                              {...register("specialRequests")}
                            />
                          </div>

                          {/* Honeypot field - hidden from real users */}
                          <input
                            type="text"
                            {...register("website")}
                            style={{ display: "none" }}
                            tabIndex={-1}
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submitting...
                          </>
                        ) : !isFormComplete ? (
                          "Complete All Required Fields"
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Request Quote
                          </>
                        )}
                      </Button>

                      {submitError && (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-destructive">Submission Failed</p>
                              <p className="text-destructive/80 mt-1">{submitError}</p>
                            </div>
                          </div>
                        </div>
                      )}

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
