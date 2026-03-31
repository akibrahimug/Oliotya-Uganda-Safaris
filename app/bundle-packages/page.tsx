import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/db";
import { BundleForm } from "./bundle-form";
import { getBaseUrl, toAbsoluteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const title = "Bundle Safari Packages | Create Your Custom Uganda Adventure";
  const description =
    "Combine multiple safari packages to create your ultimate Uganda adventure. Get a special bundled price quote from our experts.";

  const settings = await getSiteSettings();
  const ogImageRaw = settings.meta?.ogImage || settings.brand?.logo || "";
  const ogImage = ogImageRaw ? toAbsoluteUrl(ogImageRaw, baseUrl) : `${baseUrl}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/bundle-packages` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${baseUrl}/bundle-packages`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BundlePackagesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/bundle-packages");
  }

  const rawPackages = await prisma.package.findMany({
    where: { active: true },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      duration: true,
      price: true,
      image: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const packages = rawPackages.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-32 pb-20 container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-inter text-4xl md:text-5xl font-bold mb-4">
              Bundle Your Safari Packages
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Combine multiple safari packages to create your ultimate Uganda adventure.
              Get a special bundled price quote!
            </p>
          </div>

          <BundleForm packages={packages} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
