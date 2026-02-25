import { ClerkProvider } from "@clerk/nextjs";

export default function CMSTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
