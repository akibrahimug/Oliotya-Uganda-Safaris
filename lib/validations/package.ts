import { z } from "zod";

/**
 * Itinerary day schema
 */
export const itineraryDaySchema = z.object({
  day: z.number().int().min(1),
  title: z.string().min(1, "Day title is required").max(200),
  description: z.string().min(1, "Day description is required"),
});

/**
 * Validation schema for creating/updating packages
 */
export const packageSchema = z.object({
  name: z.string().min(1, "Package name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),
  category: z.string().min(1, "Category is required"),
  duration: z.string().min(1, "Duration is required"),
  price: z.number().positive("Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  shortDesc: z.string().optional(),
  image: z.string().url("Main image URL is required"),
  images: z.array(z.string().url()).optional(),
  highlights: z.array(z.string()).optional(),
  itinerary: z.array(itineraryDaySchema).min(1, "At least one day is required"),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  minTravelers: z.number().int().min(1, "Minimum travelers must be at least 1"),
  maxTravelers: z
    .number()
    .int()
    .min(1, "Maximum travelers must be at least 1"),
  difficulty: z.enum(["EASY", "MODERATE", "CHALLENGING", "DIFFICULT"]),
  featured: z.boolean().optional(),
  popular: z.boolean().optional(),
  active: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export type PackageInput = z.infer<typeof packageSchema>;
export type ItineraryDay = z.infer<typeof itineraryDaySchema>;

/**
 * Package categories
 */
export const PACKAGE_CATEGORIES = [
  "Gorilla Trekking",
  "Wildlife Safari",
  "Cultural Tours",
  "Adventure Tours",
  "Honeymoon Packages",
  "Family Packages",
  "Luxury Safari",
  "Budget Safari",
  "Multi-Country",
  "Other",
] as const;

/**
 * Difficulty levels
 */
export const DIFFICULTY_LEVELS = [
  { value: "EASY", label: "Easy", description: "Suitable for all fitness levels" },
  {
    value: "MODERATE",
    label: "Moderate",
    description: "Some physical activity required",
  },
  {
    value: "CHALLENGING",
    label: "Challenging",
    description: "Good fitness level required",
  },
  {
    value: "DIFFICULT",
    label: "Difficult",
    description: "Excellent fitness level required",
  },
] as const;
