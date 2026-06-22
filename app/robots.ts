import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Only block private/auth surfaces here. Pages that should not be
        // indexed but are fine to crawl (the booking flow: /book, /booking-confirmation,
        // /custom-package-confirmation) intentionally use a `noindex` meta tag instead —
        // they must stay crawlable so Googlebot can SEE the noindex and drop them cleanly.
        // Blocking them in robots.txt prevents that and leaves them stuck as
        // "Excluded by 'noindex' tag" with failed validation.
        disallow: [
          "/api/",
          "/cms",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: new URL(baseUrl).host,
  };
}
