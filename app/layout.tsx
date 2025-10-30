import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
// import { ClerkProvider } from "@clerk/nextjs" // Commented out until Clerk is set up
import "./globals.css"

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
})

export const metadata: Metadata = {
  title: "Fox Adventures - Discover Uganda",
  description:
    "Experience the Pearl of Africa with Fox Adventures. Explore Uganda's wildlife, mountains, and natural wonders.",
  generator: "v0.app",
  icons: {
    icon: "/fox_logo.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )

  // To enable Clerk authentication, uncomment the code below and wrap the HTML:
  // return (
  //   <ClerkProvider>
  //     <html lang="en" className={inter.variable}>
  //       <body className="font-inter antialiased">
  //         {children}
  //         <Analytics />
  //       </body>
  //     </html>
  //   </ClerkProvider>
  // )
}
