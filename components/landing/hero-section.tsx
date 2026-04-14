"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { ChevronDown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/constants/routes"
import { Button } from "@/components/ui/button"
import { Starfield } from "@/components/landing/starfield"

export function HeroSection() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 overflow-hidden"
    >
      {/* Starfield Background */}
      <Starfield />

      {/* Decorative Atmosphere Orbs - Hidden from screen readers */}
      <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] animate-pulse pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} aria-hidden="true" />
      <div className="absolute top-[40%] right-[25%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} aria-hidden="true" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Headline with dynamic text */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
          <span className="block" key="headline-1">
            {isDark ? "navigate the nebula." : "dream in pastel."}
          </span>
          <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift" key="headline-2">
            {isDark ? "sync your universe." : "stitch your halo."}
          </span>
        </h1>

        {/* Gradient-animated subheadline */}
        <p className="mt-6 text-base sm:text-lg max-w-xl leading-relaxed bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
          The ultimate sanctuary for the cosplay community. Drop the messy
          spreadsheets and step into a beautifully organized command center.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
          <Button
            asChild
            size="lg"
            variant="celestial"
            className="px-10 h-16 text-base"
          >
            <Link href={ROUTES.SIGN_UP}>
              Join the Orbit
              <Sparkles className="ml-2 size-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="px-10 h-16 text-base"
          >
            <Link href="#features">
              Explore Features
            </Link>
          </Button>
        </div>
      </div>

      {/* Floating Dashboard Mockup */}
      <div className="relative z-10 mt-16 w-full max-w-4xl mx-auto animate-float">
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-700",
            isDark
              ? "border border-white/10 shadow-[0_20px_80px_rgba(124,212,250,0.12)]"
              : "border border-blue-200/30 shadow-[0_20px_80px_rgba(185,217,235,0.35)]"
          )}
        >
          <Image
            src="/dashboard-mockup.png"
            alt="cosynq dashboard preview showing celestial-themed cosplay management interface"
            width={1200}
            height={675}
            className="w-full h-auto"
            priority
          />
          {/* Glassmorphic overlay shimmer */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Scroll Indicator with ChevronDown - Decorative, hidden from screen readers */}
      <div className="relative z-10 mt-12 flex flex-col items-center gap-2 text-muted-foreground/50 animate-bounce-gentle" aria-hidden="true">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="size-5" />
      </div>
    </section>
  )
}
