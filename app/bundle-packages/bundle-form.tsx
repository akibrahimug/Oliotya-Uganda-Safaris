"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Trash2, Calendar, Users, Send, Clock, DollarSign } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bundleClientSchema, type BundleClientData } from "@/lib/validations";

interface Package {
  id: number;
  slug: string;
  name: string;
  category: string;
  duration: string;
  price: number;
  image: string;
}

interface BundledPackage extends Package {
  notes?: string;
}

export function BundleForm({ packages }: { packages: Package[] }) {
  const router = useRouter();
  const [bundledPackages, setBundledPackages] = useState<BundledPackage[]>([]);

  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm<BundleClientData>({
    resolver: zodResolver(bundleClientSchema),
    defaultValues: { name: "", numberOfPeople: 2, travelDate: "", specialRequests: "" },
    mode: "onSubmit",
  });

  const togglePackage = (pkg: Package) => {
    const exists = bundledPackages.find((p) => p.id === pkg.id);
    if (exists) {
      setBundledPackages(bundledPackages.filter((p) => p.id !== pkg.id));
    } else {
      setBundledPackages([...bundledPackages, { ...pkg }]);
    }
  };

  const totalPrice = bundledPackages.reduce((sum, pkg) => sum + pkg.price, 0);

  const onSubmit = async (data: BundleClientData) => {
    if (bundledPackages.length === 0) {
      alert("Please select at least one package");
      return;
    }

    try {
      const response = await fetch("/api/package-bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name || "Custom Package Bundle",
          packages: bundledPackages.map((p) => ({ packageId: p.id, notes: p.notes })),
          numberOfPeople: data.numberOfPeople,
          travelDate: data.travelDate ? new Date(data.travelDate) : null,
          specialRequests: data.specialRequests,
        }),
      });

      if (response.ok) {
        alert("Your package bundle request has been submitted! We'll send you a quote soon.");
        router.push("/");
      } else {
        alert("Failed to submit bundle. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting bundle:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-inter text-2xl font-bold mb-4">Select Packages to Bundle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg) => {
                const isSelected = bundledPackages.some((p) => p.id === pkg.id);
                return (
                  <Card
                    key={pkg.id}
                    className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary border-primary" : "hover:shadow-lg"}`}
                    onClick={() => togglePackage(pkg)}
                  >
                    <CardContent className="p-0">
                      <div className="relative h-48">
                        <Image
                          src={pkg.image}
                          alt={pkg.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                            <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                          </div>
                        )}
                        <Badge className="absolute top-2 left-2 bg-background/90 text-foreground">
                          {pkg.category}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{pkg.name}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />{pkg.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-semibold text-primary">${pkg.price}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {bundledPackages.length > 0 && (
            <div>
              <h2 className="font-inter text-2xl font-bold mb-4">
                Your Bundle ({bundledPackages.length} packages)
              </h2>
              <div className="space-y-3">
                {bundledPackages.map((pkg) => (
                  <Card key={pkg.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 shrink-0">
                          <Image
                            src={pkg.image}
                            alt={pkg.name}
                            fill
                            className="object-cover rounded"
                            sizes="80px"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{pkg.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{pkg.duration}</span>
                            <span className="flex items-center gap-1 text-primary font-semibold"><DollarSign className="h-3 w-3" />${pkg.price}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); togglePackage(pkg); }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-inter text-xl font-bold">Bundle Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Packages</span>
                    <span className="font-semibold">{bundledPackages.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Base Price</span>
                    <span className="font-semibold text-lg text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Final bundled price may be lower. We'll provide a custom quote!</p>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div>
                    <Label htmlFor="bundleName">Bundle Name (Optional)</Label>
                    <Input id="bundleName" placeholder="My Uganda Grand Tour" {...register("name")} />
                  </div>
                  <div>
                    <Label htmlFor="numberOfPeople">
                      <Users className="h-4 w-4 inline mr-2" />Number of People
                    </Label>
                    <Controller
                      control={control}
                      name="numberOfPeople"
                      render={({ field }) => (
                        <Input
                          id="numberOfPeople"
                          type="number"
                          min="1"
                          max="100"
                          value={field.value}
                          onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) field.onChange(v); }}
                          onBlur={field.onBlur}
                          required
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="travelDate">
                      <Calendar className="h-4 w-4 inline mr-2" />Preferred Travel Date
                    </Label>
                    <Input id="travelDate" type="date" {...register("travelDate")} />
                  </div>
                  <div>
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea id="specialRequests" placeholder="Any special requirements..." rows={4} {...register("specialRequests")} />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || bundledPackages.length === 0}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Request Bundle Quote"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">Get a special bundled price within 24 hours</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  );
}
