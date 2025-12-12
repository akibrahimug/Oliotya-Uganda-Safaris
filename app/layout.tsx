import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import { getSiteSettings } from "@/lib/settings";
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://oliotyasafaris.com";

  return {
    title: settings.meta.title,
    description: settings.meta.description,
    keywords: settings.meta.keywords,
    icons: {
      icon: settings.meta.favicon || "/fox_logo.webp",
    },
    openGraph: {
      type: settings.meta.ogType as "website" | "article",
      title: settings.meta.title,
      description: settings.meta.description,
      images: [
        {
          url: settings.meta.ogImage,
          width: 1200,
          height: 630,
          alt: settings.brand.siteName,
        },
      ],
      siteName: settings.brand.siteName,
      url: siteUrl,
    },
    twitter: {
      card: settings.meta.twitterCard as "summary" | "summary_large_image",
      title: settings.meta.title,
      description: settings.meta.description,
      images: [settings.meta.ogImage],
    },
    metadataBase: new URL(siteUrl),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body className="font-inter antialiased" suppressHydrationWarning>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
