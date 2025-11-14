/**
 * R2 Image URLs
 * All images are stored in Cloudflare R2 and optimized as WebP
 */

const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PREFIX = "nambi-uganda-safaris/images";

/**
 * Helper to get R2 image URL
 */
export function getR2ImageUrl(filename: string): string {
  return `${R2_BASE_URL}/${IMAGE_PREFIX}/${filename}`;
}

/**
 * Common images used across the app
 */
export const R2_IMAGES = {
  // Logo
  LOGO: getR2ImageUrl("fox_logo.webp"),

  // Destinations
  UGANDA_QUEEN_ELIZABETH: getR2ImageUrl("uganda-queen-elizabeth-national-park-safari.webp"),
  UGANDA_GORILLA_TREKKING: getR2ImageUrl("uganda-gorilla-trekking-adventure.webp"),
  UGANDA_SAFARI_LANDSCAPE: getR2ImageUrl("uganda-safari-landscape-team-adventure.webp"),
  MURCHISON_FALLS: getR2ImageUrl("murchison-falls-uganda.webp"),
  BWINDI_FOREST: getR2ImageUrl("bwindi-impenetrable-forest-gorillas.webp"),
  LAKE_MBURO: getR2ImageUrl("lake-mburo-national-park-uganda-zebras.webp"),
  KAMPALA_SKYLINE: getR2ImageUrl("kampala-city-uganda-skyline.webp"),

  // Team members
  TEAM_MALE_GUIDE: getR2ImageUrl("african-male-tour-guide-professional.webp"),
  TEAM_FEMALE_MANAGER: getR2ImageUrl("african-female-tour-manager-professional.webp"),
  TEAM_MALE_SAFARI_GUIDE: getR2ImageUrl("african-male-safari-guide-professional.webp"),

  // Placeholders (to be removed - these will help identify what needs real images)
  PLACEHOLDER: null, // Remove placeholder usage
  PLACEHOLDER_USER: null, // Remove placeholder usage
} as const;

/**
 * Default fallback image (optional - shows broken image icon if null)
 */
export const DEFAULT_IMAGE = null; // Set to null to show broken images, making it clear what needs fixing
