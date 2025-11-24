import { prisma } from "@/lib/db";

export interface SiteSettings {
  brand: {
    siteName: string;
    logo: string;
    tagline: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  newsletter: {
    title: string;
    description: string;
  };
  footer: {
    description: string;
    copyright: string;
  };
}

/**
 * Fetch all site settings from the database
 * This function runs on the server and can be used in Server Components
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.siteSettings.findMany();

    // Transform array of settings into structured object
    const transformedSettings: SiteSettings = {
      brand: { siteName: "Nambi Uganda Safaris", logo: "", tagline: "Experience the Pearl of Africa" },
      contact: { phone: "+256 788048210", email: "info@nambiuganda.com", address: "Kampala, Uganda", whatsapp: "+256 788048210" },
      social: { facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "" },
      newsletter: { title: "Subscribe to Our Newsletter", description: "Get exclusive travel tips, special offers, and updates on Uganda's best safari experiences" },
      footer: { description: "Experience the Pearl of Africa with expert-guided safaris, cultural tours, and unforgettable adventures.", copyright: "© 2025 Nambi Uganda Safaris. All rights reserved." },
    };

    settings.forEach((setting: any) => {
      if (setting.key in transformedSettings) {
        transformedSettings[setting.key as keyof SiteSettings] = setting.value;
      }
    });

    return transformedSettings;
  } catch (error) {
    console.error("Error fetching site settings:", error);

    // Return default settings if there's an error
    return {
      brand: { siteName: "Nambi Uganda Safaris", logo: process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/nambi-uganda-safaris/images/fox_logo.webp", tagline: "Experience the Pearl of Africa" },
      contact: { phone: "+256 788048210", email: "info@nambiuganda.com", address: "Kampala, Uganda", whatsapp: "+256 788048210" },
      social: { facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "" },
      newsletter: { title: "Subscribe to Our Newsletter", description: "Get exclusive travel tips, special offers, and updates on Uganda's best safari experiences" },
      footer: { description: "Experience the Pearl of Africa with expert-guided safaris, cultural tours, and unforgettable adventures.", copyright: "© 2025 Nambi Uganda Safaris. All rights reserved." },
    };
  }
}

/**
 * Fetch site settings on the client side
 * This function makes an API call and can be used in Client Components
 */
export async function fetchSiteSettingsClient(): Promise<SiteSettings> {
  try {
    const response = await fetch("/api/cms/settings/public", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch settings");
    }

    const data = await response.json();
    return data.settings;
  } catch (error) {
    console.error("Error fetching site settings:", error);

    // Return default settings if there's an error
    return {
      brand: { siteName: "Nambi Uganda Safaris", logo: process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/nambi-uganda-safaris/images/fox_logo.webp", tagline: "Experience the Pearl of Africa" },
      contact: { phone: "+256 788048210", email: "info@nambiuganda.com", address: "Kampala, Uganda", whatsapp: "+256 788048210" },
      social: { facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "" },
      newsletter: { title: "Subscribe to Our Newsletter", description: "Get exclusive travel tips, special offers, and updates on Uganda's best safari experiences" },
      footer: { description: "Experience the Pearl of Africa with expert-guided safaris, cultural tours, and unforgettable adventures.", copyright: "© 2025 Nambi Uganda Safaris. All rights reserved." },
    };
  }
}
