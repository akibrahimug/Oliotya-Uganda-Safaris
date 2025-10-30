"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"; // Commented out until Clerk is set up
import { useState, useEffect } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`flex items-center justify-between h-20 transition-all duration-300 ${
          scrolled ? "" : "border-b-2 border-background/20"
        }`}>
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/fox_logo.jpg"
              alt="Fox Adventures Logo"
              className="w-10 h-10 rounded-full object-cover transition-transform group-hover:scale-110"
            />
            <span
              className={`font-serif text-2xl font-bold transition-colors ${
                scrolled ? "text-foreground" : "text-background"
              }`}
            >
              Fox Adventures Africa
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-background"
              }`}
            >
              About
            </Link>
            <Link
              href="/destinations"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-background"
              }`}
            >
              Destinations
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-background"
              }`}
            >
              Tours
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-background"
              }`}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-background"
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Temporary user icon - will be replaced with Clerk auth when set up */}
            <Button
              variant="ghost"
              size="icon"
              className={
                scrolled
                  ? "text-foreground"
                  : "text-background hover:text-primary"
              }
            >
              <User className="h-5 w-5" />
            </Button>

            {/* CLERK AUTHENTICATION - Uncomment when Clerk is set up */}
            {/* <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className={scrolled ? "text-foreground" : "text-background"}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground"
                >
                  Sign Up
                </Button>
              </Link>
            </SignedOut> */}
          </div>
        </div>
      </div>
    </header>
  );
}
