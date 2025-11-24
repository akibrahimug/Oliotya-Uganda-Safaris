"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Shield,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchSiteSettingsClient, type SiteSettings } from "@/lib/settings";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Default logo URL
  const defaultLogo = "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/fox_logo.webp";

  // Fetch settings on mount
  useEffect(() => {
    fetchSiteSettingsClient().then(setSettings);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Newsletter subscription:", email);
    setSubmitSuccess(true);
    setEmail("");
    setIsSubmitting(false);

    // Hide success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <footer className="bg-background border-t border-border">
      {/* Newsletter Section */}
      <div className="bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-inter text-2xl md:text-3xl font-bold mb-3">
              {settings?.newsletter?.title || "Subscribe to Our Newsletter"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {settings?.newsletter?.description || "Get exclusive travel tips, special offers, and updates on Uganda's best safari experiences"}
            </p>

            {submitSuccess && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-center gap-2 mb-4 max-w-md mx-auto">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Successfully subscribed!</p>
              </div>
            )}

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 space-y-1">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  size="lg"
                  className="bg-background"
                  aria-invalid={!!error}
                />
                {error && (
                  <p className="text-xs text-destructive text-left">{error}</p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 gap-2 shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
                {!isSubmitting && <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={settings?.brand?.logo || defaultLogo}
                alt={`${settings?.brand?.siteName || "Nambi Uganda Safaris"} Logo`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="font-inter text-xl font-bold">
                {settings?.brand?.siteName || "Nambi Uganda Safaris"}
              </span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {settings?.footer?.description || "Experience the Pearl of Africa with expert-guided safaris, cultural tours, and unforgettable adventures."}
            </p>
            <div className="flex gap-3">
              {settings?.social?.facebook && (
                <Link
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center text-foreground hover:text-primary-foreground transition-all group"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              )}
              {settings?.social?.instagram && (
                <Link
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center text-foreground hover:text-primary-foreground transition-all group"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
              {settings?.social?.twitter && (
                <Link
                  href={settings.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center text-foreground hover:text-primary-foreground transition-all group"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              )}
              {settings?.social?.linkedin && (
                <Link
                  href={settings.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center text-foreground hover:text-primary-foreground transition-all group"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              )}
              {settings?.social?.youtube && (
                <Link
                  href={settings.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center text-foreground hover:text-primary-foreground transition-all group"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-inter text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/packages"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tours & Packages
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-inter text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/destinations"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Travel Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-inter text-lg font-bold mb-4">Get In Touch</h3>
            <ul className="space-y-4">
              {settings?.contact?.address && (
                <li>
                  <div className="flex items-start gap-3 text-muted-foreground group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Office</p>
                      <p className="text-sm">{settings.contact.address}</p>
                    </div>
                  </div>
                </li>
              )}
              {settings?.contact?.phone && (
                <li>
                  <div className="flex items-start gap-3 text-muted-foreground group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Phone</p>
                      <a
                        href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                        className="text-sm hover:text-primary transition-colors"
                      >
                        {settings.contact.phone}
                      </a>
                    </div>
                  </div>
                </li>
              )}
              {settings?.contact?.email && (
                <li>
                  <div className="flex items-start gap-3 text-muted-foreground group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Email</p>
                      <a
                        href={`mailto:${settings.contact.email}`}
                        className="text-sm hover:text-primary transition-colors"
                      >
                        {settings.contact.email}
                      </a>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              {settings?.footer?.copyright || "© 2025 Nambi Uganda Safaris. All rights reserved."}
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground items-center">
              <Link href="/about" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="/destinations" className="hover:text-primary transition-colors">
                Sitemap
              </Link>
              <Link
                href="/cms"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Shield className="h-3.5 w-3.5" />
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
