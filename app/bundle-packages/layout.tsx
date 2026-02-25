import { ClerkProvider } from "@clerk/nextjs";

export default function BundlePackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
