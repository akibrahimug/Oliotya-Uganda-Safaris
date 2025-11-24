import { z } from "zod";

/**
 * Selected destination schema for custom packages
 */
export const selectedDestinationSchema = z.object({
  id: z.number().int().positive("Invalid destination ID"),
  name: z
    .string()
    .min(1, "Destination name is required")
    .max(200, "Destination name too long")
    .trim(),
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category too long")
    .trim(),
  image: z.string().url("Invalid image URL").trim(),
  days: z
    .number()
    .int("Days must be a whole number")
    .min(1, "At least 1 day required per destination")
    .max(30, "Maximum 30 days per destination"),
});

/**
 * Custom package validation schema
 */
export const customPackageSchema = z
  .object({
    name: z
      .string()
      .min(3, "Package name must be at least 3 characters")
      .max(200, "Package name too long")
      .regex(
        /^[a-zA-Z0-9\s\-']+$/,
        "Package name contains invalid characters"
      )
      .trim(),

    destinations: z
      .array(selectedDestinationSchema)
      .min(1, "At least one destination is required")
      .max(10, "Maximum 10 destinations allowed"),

    duration: z.string().optional(),

    numberOfPeople: z
      .number()
      .int("Number of people must be a whole number")
      .min(1, "At least 1 person required")
      .max(50, "Maximum 50 people allowed"),

    travelDate: z
      .string()
      .datetime({ message: "Invalid date format" })
      .optional()
      .nullable()
      .refine(
        (date) => {
          if (!date) return true;
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        },
        { message: "Travel date cannot be in the past" }
      ),

    budget: z
      .number()
      .positive("Budget must be greater than 0")
      .max(1000000, "Budget too high")
      .optional()
      .nullable(),

    specialRequests: z
      .string()
      .max(2000, "Special requests too long")
      .trim()
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // Validate total days doesn't exceed reasonable limits
      const totalDays = data.destinations.reduce(
        (sum, dest) => sum + dest.days,
        0
      );
      return totalDays <= 60;
    },
    {
      message: "Total trip duration cannot exceed 60 days",
      path: ["destinations"],
    }
  );

export type CustomPackageInput = z.infer<typeof customPackageSchema>;
export type SelectedDestination = z.infer<typeof selectedDestinationSchema>;
