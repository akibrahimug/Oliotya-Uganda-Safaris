import { z } from "zod";

/**
 * Validation schema for creating/updating hero slides
 */
export const heroSlideSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(100, "Subtitle is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
  image: z.string().url("Image URL is required"),
  displayOrder: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export type HeroSlideInput = z.infer<typeof heroSlideSchema>;

/**
 * Validation schema for reordering slides
 */
export const heroSlideReorderSchema = z.object({
  slides: z.array(
    z.object({
      id: z.string(),
      displayOrder: z.number().int().min(0),
    })
  ),
});
