"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, Sparkles, X } from "lucide-react"
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

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#journey" },
  { label: "Community", href: "#community" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

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
        "fixed top-6 left-1/2 z-50 -translate-x-1/2",
        "flex items-center gap-6 whitespace-nowrap",
        "rounded-[2.5rem] px-8 py-4",
        "glassmorphism transition-all duration-500",
        scrolled ? "top-3 py-3 border-primary/20 shadow-glow-primary" : "shadow-2xl border-white/5",
        "w-[calc(100%-3rem)] max-w-5xl"
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-heading font-black text-2xl tracking-tighter select-none shrink-0 group flex items-center gap-2"
      >
        <div className="size-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground shadow-glow-primary transition-all group-hover:scale-110 group-hover:rotate-6">
          <Sparkles className="size-6" />
        </div>
        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hidden sm:block">cosynq</span>
      </Link>

      {/* Divider */}
      <div className="h-6 w-px shrink-0 bg-white/10 hidden lg:block" />

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-2">
        {navLinks.map((link) => (
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
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle className="size-12 rounded-2xl hover:bg-white/5 transition-all shrink-0" />

        {/* User Profile / Auth */}
        <UserNav className="shrink-0" />

        {/* Clock — desktop only */}
        <div className="hidden xl:block shrink-0 ml-2">
          <NavbarClock />
        </div>

        {/* Mobile Menu Button - Sheet Trigger */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors shrink-0"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="top" 
              className="w-[calc(100%-3rem)] mx-auto mt-6 rounded-[3rem] glassmorphism border-white/10 p-8 pt-12 animate-in slide-in-from-top-12 duration-500"
            >
              <SheetHeader className="mb-8">
                <SheetTitle className="text-4xl font-black text-primary shadow-glow-primary shadow-none">ORBITAL NAVIGATION</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant="ghost"
                    asChild
                    className="justify-start text-lg font-black uppercase tracking-widest text-muted-foreground hover:text-primary py-8 rounded-[2rem] hover:bg-white/5 px-8"
                  >
                    <a href={link.href}>{link.label}</a>
                  </Button>
                ))}
                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4 px-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Local Orbital Time</span>
                  <div className="flex items-center justify-between">
                    <NavbarClock />
                    <Sparkles className="size-6 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

