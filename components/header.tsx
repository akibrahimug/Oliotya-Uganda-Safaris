"use client";

import Link from "next/link";
import { Menu, X, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div
            className={`flex items-center justify-between h-20 transition-all duration-300 ${
              scrolled ? "" : "border-b-2 border-background/20"
            }`}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/fox_logo.jpg"
                alt="Nambi Uganda Safaris Logo"
                className="w-10 h-10 rounded-full object-cover transition-transform group-hover:scale-110"
              />
              <span
                className={`font-serif text-2xl font-bold transition-colors ${
                  scrolled ? "text-foreground" : "text-background"
                }`}
              >
                Nambi Uganda Safaris
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
                href="/packages"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  scrolled ? "text-foreground" : "text-background"
                }`}
              >
                Safari Packages
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
                href="/contact"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  scrolled ? "text-foreground" : "text-background"
                }`}
              >
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              {/* Clerk Authentication */}
              <div className="hidden md:flex items-center gap-4">
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                </SignedIn>

                <SignedOut>
                  <Link href="/sign-in">
                    <UserCircle
                      className={`cursor-pointer transition-opacity hover:opacity-80 ${
                        scrolled ? "text-foreground" : "text-background"
                      }`}
                      width={27}
                      height={27}
                      strokeWidth={2}
                    />
                  </Link>
                </SignedOut>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden ${
                  scrolled
                    ? "text-foreground hover:text-foreground/70"
                    : "text-background hover:text-background/70"
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Moved outside header */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 md:hidden z-60"
          style={{
            backgroundColor: "#1a1a1a",
          }}
        >
          <div className="container mx-auto px-4 h-full">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between h-20 border-b border-background/20">
              <Link
                href="/"
                className="flex items-center gap-2 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img
                  src="/fox_logo.jpg"
                  alt="Nambi Uganda Safaris Logo"
                  className="w-10 h-10 rounded-full object-cover transition-transform group-hover:scale-110"
                />
                <span className="font-serif text-xl font-bold text-background">
                  Nambi Uganda Safaris
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-background hover:text-background/70"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Mobile menu navigation */}
            <nav className="flex flex-col gap-2 py-8">
              <Link
                href="/"
                className="text-background text-lg font-medium py-4 px-4 rounded-lg hover:bg-background/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-background text-lg font-medium py-4 px-4 rounded-lg hover:bg-background/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/packages"
                className="text-background text-lg font-medium py-4 px-4 rounded-lg hover:bg-background/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Safari Packages
              </Link>
              <Link
                href="/destinations"
                className="text-background text-lg font-medium py-4 px-4 rounded-lg hover:bg-background/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Destinations
              </Link>
              <Link
                href="/contact"
                className="text-background text-lg font-medium py-4 px-4 rounded-lg hover:bg-background/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile menu user section */}
              <div className="mt-8 pt-8 border-t border-background/20 flex flex-col gap-4">
                <SignedIn>
                  <div className="flex items-center gap-3 px-4">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10",
                        },
                      }}
                    />
                    <span className="text-background text-sm">My Account</span>
                  </div>
                </SignedIn>

                <SignedOut>
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-background text-background hover:bg-background hover:text-foreground"
                    >
                      <UserCircle className="h-5 w-5 mr-2" />
                      Account
                    </Button>
                  </Link>
                </SignedOut>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
