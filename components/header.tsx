"use client";

import Link from "next/link";
import { Menu, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { fetchSiteSettingsClient, type SiteSettings } from "@/lib/settings";
import { useRouter, usePathname } from "next/navigation";

interface HeaderProps {
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;
}

export function Header({
  showBackButton = false,
  backButtonText = "Back",
  onBackClick,
}: HeaderProps = {}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [siteName, setSiteName] = useState<string>("Oliotya Uganda Safaris");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    setIsLoading(true);
    fetchSiteSettingsClient()
      .then((data) => {
        console.log("Header: Fetched settings", data);
        setLogoUrl(data?.brand?.logo || "");
        setSiteName(data?.brand?.siteName || "Oliotya Uganda Safaris");
      })
      .catch((error) => {
        console.error("Failed to fetch settings:", error);
        setLogoUrl("");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
            <Link href="/" className="flex items-center gap-2 group ">
              {!isLoading && logoUrl && (
                <img
                  src={logoUrl}
                  alt={`${siteName} Logo`}
                  className="h-10 w-auto object-contain transition-transform group-hover:scale-105 duration-300 rounded-xs "
                  onError={(e) => {
                    // Fallback to default logo if image fails to load
                    e.currentTarget.src = logoUrl || "";
                  }}
                />
              )}
              {isLoading && (
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              )}
              <span
                className={`font-serif text-2xl font-bold transition-colors ${
                  scrolled ? "text-foreground" : "text-background"
                }`}
              >
                {siteName}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {showBackButton && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (onBackClick) {
                      onBackClick();
                    } else {
                      router.back();
                    }
                  }}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    scrolled ? "text-foreground" : "text-background"
                  }`}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backButtonText}
                </Button>
              )}
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
                {!isLoading && logoUrl && (
                  <img
                    src={logoUrl}
                    alt={`${siteName} Logo`}
                    className="h-10 w-auto object-contain transition-transform group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = logoUrl || "";
                    }}
                  />
                )}
                {isLoading && (
                  <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                )}
                <span className="font-serif text-xl font-bold text-background">
                  {siteName}
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
              {showBackButton && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onBackClick) {
                      onBackClick();
                    } else {
                      router.back();
                    }
                  }}
                  className="text-background text-lg font-medium py-4 px-4 rounded-lg hover:bg-background/10 transition-colors justify-start"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backButtonText}
                </Button>
              )}
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
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
