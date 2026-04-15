"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { UserNav } from "./user-nav"
import { NavbarClock } from "./navbar-clock"
import { LANDING_NAV_LINKS } from "@/lib/constants/navigation"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed z-50 flex items-center gap-6 transition-all duration-500 glassmorphism whitespace-nowrap",
        // Desktop: Floating Pill
        "md:top-4 md:left-1/2 md:-translate-x-1/2 md:w-[calc(100%-3rem)] md:max-w-5xl md:rounded-2xl md:px-6 md:py-2.5",
        // Mobile: End-to-End Header
        "top-0 left-0 right-0 w-full rounded-none px-4 py-3 border-b border-white/5 md:border-none",
        scrolled ? "md:top-3 md:py-2 border-primary/20 shadow-glow-primary" : "shadow-2xl md:border-white/5"
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-heading font-black text-xl tracking-tighter select-none shrink-0 transition-opacity hover:opacity-80"
      >
        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hidden sm:block">cosynq</span>
      </Link>

      {/* Divider */}
      <div className="h-6 w-px shrink-0 bg-white/10 hidden lg:block" />

      <div className="hidden md:flex items-center gap-2">
        {LANDING_NAV_LINKS.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            asChild
            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all rounded-xl hover:bg-white/5"
          >
            <a href={link.href}>{link.label}</a>
          </Button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Actions Container */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle className="size-10 rounded-xl hover:bg-white/5 transition-all shrink-0" />

        {/* User Profile / Auth */}
        <UserNav className="shrink-0" />

        {/* Clock — desktop only */}
        <div className="hidden xl:block shrink-0 ml-2">
          <NavbarClock />
        </div>

        {/* Mobile Menu Button - Sheet Trigger */}
        <div className="md:hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors shrink-0"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              showCloseButton={false}
              className="w-full sm:max-w-md glassmorphism border-l border-white/10 p-0 overflow-hidden animate-in slide-in-from-right duration-700 ease-in-out"
            >
              {/* Decorative Atmosphere Orb */}
              <div className="absolute top-1/2 -right-20 size-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
              <div className="absolute -bottom-20 -left-20 size-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

              <div className="relative z-10 flex flex-col h-full bg-background/40 backdrop-blur-3xl">
                {/* Drawer Header with Close Button */}
                <div className="p-8 pt-12 flex items-center justify-between">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="font-heading font-black text-3xl tracking-tighter text-foreground"
                  >
                    cosynq
                  </Link>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="size-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                  >
                    <X className="size-6 text-muted-foreground" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <div className="px-6 flex flex-col gap-2 flex-1 mt-4">
                  {LANDING_NAV_LINKS.map((link) => (
                    <Button
                      key={link.href}
                      variant="ghost"
                      asChild
                      onClick={() => setIsOpen(false)}
                      className="text-xl font-black uppercase tracking-widest text-muted-foreground hover:text-primary py-10 rounded-2xl hover:bg-white/5 px-6 transition-all duration-300 flex justify-start"
                    >
                      <a href={link.href}>
                        {link.label}
                      </a>
                    </Button>
                  ))}
                </div>

                {/* Footer / Time */}
                <div className="p-8 pb-12 mt-auto border-t border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block mb-4">Local Orbital Time</span>
                   <NavbarClock />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

