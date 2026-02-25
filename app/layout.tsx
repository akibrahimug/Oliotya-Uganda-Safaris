import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getSiteSettings } from "@/lib/settings";
import { getBaseUrl, getDefaultLogoUrl, getDefaultOgImageUrl, toAbsoluteUrl } from "@/lib/seo";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

// Inter - A crisp, modern font optimized for screen readability
// Works excellently across all browsers with built-in fallbacks
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

const DEFAULT_DESCRIPTION =
  "Experience the Pearl of Africa with Oliotya Uganda Safaris. Explore Uganda's wildlife, mountains, and natural wonders.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = getBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);

  const title = settings.meta?.title?.trim() || "Oliotya Uganda Safaris - Discover Uganda";
  const description = settings.meta?.description?.trim() || DEFAULT_DESCRIPTION;
  const keywords =
    settings.meta?.keywords?.trim() ||
    "Uganda safaris, Uganda tours, wildlife safaris, gorilla trekking, Uganda travel, African safari";
  const ogImageRaw =
    settings.meta?.ogImage?.trim() ||
    getDefaultOgImageUrl(siteUrl);
  const ogImage = toAbsoluteUrl(ogImageRaw, siteUrl);
  const icon = settings.meta?.favicon?.trim()
    ? toAbsoluteUrl(settings.meta.favicon.trim(), siteUrl)
    : getDefaultLogoUrl(siteUrl);
  const siteName = settings.brand?.siteName?.trim() || "Oliotya Uganda Safaris";

  return {
    title,
    description,
    keywords,
    icons: {
      icon,
      apple: icon,
    },
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: (settings.meta?.ogType as "website" | "article") || "website",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
      siteName,
      url: siteUrl,
    },
    twitter: {
      card: (settings.meta?.twitterCard as "summary" | "summary_large_image") || "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    metadataBase: new URL(siteUrl),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const logoUrl = getDefaultLogoUrl(siteUrl);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Oliotya Uganda Safaris",
    url: siteUrl,
    logo: logoUrl,
    image: getDefaultOgImageUrl(siteUrl),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Oliotya Uganda Safaris",
    url: siteUrl,
  };

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-inter antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
