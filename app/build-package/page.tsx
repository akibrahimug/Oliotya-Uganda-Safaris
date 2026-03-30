import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/seo";
import { BuildPackageClient } from "./build-package-client";

export function generateMetadata(): Metadata {
  const baseUrl = getBaseUrl();
  return {
    title: "Build a Custom Safari Package - Oliotya Uganda Safaris",
    description: "Design your perfect Uganda safari. Choose destinations, set your duration, and request a personalised quote from our expert team.",
    alternates: {
      canonical: `${baseUrl}/build-package`,
    },
    openGraph: {
      title: "Build a Custom Safari Package - Oliotya Uganda Safaris",
      description: "Design your perfect Uganda safari. Choose destinations, set your duration, and request a personalised quote from our expert team.",
      url: `${baseUrl}/build-package`,
    },
  };
}

export default function BuildPackagePage() {
  return <BuildPackageClient />;
}
