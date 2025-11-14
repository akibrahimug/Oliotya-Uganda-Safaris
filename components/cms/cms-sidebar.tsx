"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Image,
  FileText,
  Package,
  MapPin,
  Settings,
  Users,
  HelpCircle,
  Home,
  Info,
  Mail,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Dashboard",
    href: "/cms",
    icon: LayoutDashboard,
  },
  {
    name: "Images",
    href: "/cms/images",
    icon: Image,
  },
  {
    name: "Pages",
    icon: FileText,
    children: [
      {
        name: "Home Page",
        href: "/cms/pages/home",
        icon: Home,
      },
      {
        name: "About Page",
        href: "/cms/pages/about",
        icon: Info,
      },
      {
        name: "Contact Page",
        href: "/cms/pages/contact",
        icon: Mail,
      },
    ],
  },
  {
    name: "Packages",
    href: "/cms/packages",
    icon: Package,
  },
  {
    name: "Destinations",
    href: "/cms/destinations",
    icon: MapPin,
  },
  {
    name: "Team",
    href: "/cms/team",
    icon: Users,
  },
  {
    name: "FAQs",
    href: "/cms/faqs",
    icon: HelpCircle,
  },
  {
    name: "Settings",
    href: "/cms/settings",
    icon: Settings,
  },
];

export function CMSSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-border">
        <Link href="/cms">
          <h1 className="font-bold text-base lg:text-lg">Nambi Uganda Safaris</h1>
          <p className="text-xs text-muted-foreground">CMS</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-1">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                <div className="ml-6 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                        pathname === child.href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <child.icon className="h-4 w-4" />
                      <span>{child.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                href={item.href!}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing Page</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link href="/cms">
            <h1 className="font-bold text-base">Nambi Uganda Safaris</h1>
            <p className="text-xs text-muted-foreground">CMS</p>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-card border-r border-border">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-card border-r border-border z-40 flex flex-col transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
