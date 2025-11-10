"use client";

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
} from "lucide-react";

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

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/cms" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">NUS</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Nambi Uganda Safaris</h1>
            <p className="text-xs text-muted-foreground">CMS</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
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
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Back to Website</span>
        </Link>
      </div>
    </div>
  );
}
