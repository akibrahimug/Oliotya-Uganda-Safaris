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
    HelpCircle,
    Home,
    Info,
    Mail,
    Menu,
    X,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Calendar,
    MessageSquare,
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
        name: "Bookings",
        href: "/cms/bookings",
        icon: Calendar,
    },
    {
        name: "Inquiries",
        href: "/cms/inquiries",
        icon: MessageSquare,
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

interface SidebarContentProps {
    pathname: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onItemClick: () => void;
}

function SidebarContent({
                            pathname,
                            isCollapsed,
                            onToggleCollapse,
                            onItemClick,
                        }: SidebarContentProps) {
    return (
        <>
            {/* Logo */}
            <div className="p-4 lg:p-4 border-b border-border flex items-center">
                <Link href="/cms" className="truncate">
                    {isCollapsed ? (
                        <h1 className="font-bold text-base lg:text-lg">N</h1>
                    ) : (
                        <div className="truncate">
                            <h1 className="font-bold text-base lg:text-lg truncate">
                                Nambi Uganda Safaris
                            </h1>
                            <p className="text-xs text-muted-foreground">CMS</p>
                        </div>
                    )}
                </Link>
            </div>

            {/* Collapse Button (separate row, desktop only) */}
            <div className="hidden lg:flex justify-center border-b border-border p-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleCollapse}
                    className="h-7 w-7"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Navigation (fills middle space) */}
            <nav className="flex-1 p-3 lg:p-3 space-y-1 overflow-y-auto">
                {navigation.map((item) => (
                    <div key={item.name}>
                        {item.children ? (
                            <div>
                                <div
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground",
                                        isCollapsed && "justify-center"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {!isCollapsed && <span>{item.name}</span>}
                                </div>
                                <div className={cn("space-y-1", !isCollapsed && "ml-6")}>
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={onItemClick}
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                                                isCollapsed && "justify-center",
                                                pathname === child.href
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            <child.icon className="h-4 w-4" />
                                            {!isCollapsed && <span>{child.name}</span>}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Link
                                href={item.href!}
                                onClick={onItemClick}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isCollapsed && "justify-center",
                                    pathname === item.href
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer pinned at bottom */}
            <div className="p-4 border-t border-border">
                <Link
                    href="/"
                    onClick={onItemClick}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors",
                        isCollapsed && "justify-center"
                    )}
                >
                    <ArrowLeft className="h-4 w-4" />
                    {!isCollapsed && <span>Back to Landing Page</span>}
                </Link>
            </div>
        </>
    );
}

export function CMSSidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] bg-card border-b border-border">
                <div className="flex items-center justify-between p-4">
                    <Link href="/cms">
                        <h1 className="font-bold text-base">Nambi Uganda Safaris</h1>
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
                    className="lg:hidden fixed inset-0 bg-black/50 z-[90]"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden lg:flex lg:flex-col bg-card border-r border-border lg:h-screen lg:sticky lg:top-0 transition-[width] duration-300 lg:z-[80]",
                    isCollapsed ? "lg:w-16" : "lg:w-64"
                )}
            >
                <SidebarContent
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
                    onItemClick={() => {
                        /* no-op on desktop */
                    }}
                />
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    "lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-card border-r border-border z-[95] flex flex-col transition-transform duration-300",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <SidebarContent
                    pathname={pathname}
                    isCollapsed={false} // always expanded on mobile
                    onToggleCollapse={() => {
                        /* no-op on mobile */
                    }}
                    onItemClick={() => setIsMobileMenuOpen(false)}
                />
            </aside>
        </>
    );
}
