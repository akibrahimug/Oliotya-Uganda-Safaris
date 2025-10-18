"use client"

import Link from "next/link"
import { Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-primary-foreground font-bold text-xl">F</span>
            </div>
            <span
              className={`font-serif text-2xl font-bold transition-colors ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              Fox Adventures
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              About
            </Link>
            <Link
              href="/destinations"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              Destinations
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              Tours
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              Blog
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              Contacts
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className={scrolled ? "text-foreground" : "text-white hover:text-primary"}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={scrolled ? "text-foreground" : "text-white hover:text-primary"}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
