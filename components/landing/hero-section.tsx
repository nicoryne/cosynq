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
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20"
    >
      {/* Subtle Starfield Background */}
      <Starfield />

      <div className="relative z-10 flex flex-col items-center text-center max-w-7xl mx-auto pt-10">
        {/* Giant Branding Focal Point - Background Layer */}
        <div className="relative mb-0 flex flex-col items-center select-none pointer-events-none w-full px-4">
          <h1 className="font-heading text-[clamp(4rem,18vw,26rem)] font-black tracking-tighter leading-none whitespace-nowrap">
            <span className="block bg-gradient-to-b from-foreground to-transparent bg-clip-text text-transparent opacity-80 transform -translate-y-4 sm:-translate-y-12">
              cosynq
            </span>
          </h1>
        </div>

        {/* Main Content Layer */}
        <div className="relative z-20 mt-8 flex flex-col items-center w-full px-6">
          {/* Catchphrase / Slogan */}
          <h2 className="font-heading text-[clamp(1rem,6vw,4.5rem)] font-bold tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] whitespace-nowrap">
            {isDark ? "navigate the nebula." : "dream in pastel."}
          </h2>
        </div>

        {/* Minimalist Description */}
        <p className="mt-8 text-lg sm:text-xl max-w-2xl leading-relaxed text-muted-foreground/80 font-medium">
          The ultimate sanctuary for the cosplay community. Drop the messy
          spreadsheets and step into a beautifully organized command center.
        </p>

        {/* Opaque CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto px-12 h-16 text-lg font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg active:scale-95"
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
            className="w-full sm:w-auto px-12 h-16 text-lg font-bold rounded-full border-2 border-primary/20 bg-background/50 hover:bg-primary/5 transition-all active:scale-95"
          >
            <Link href="#features">
              Explore Features
            </Link>
          </Button>
        </div>
      </div>

      {/* Minimalist Scroll Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-muted-foreground/40 animate-bounce-gentle transition-opacity hover:opacity-100" aria-hidden="true">
        <span className="text-xs uppercase tracking-[0.3em] font-black">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/40 to-transparent" />
      </div>
    </section>
  )
}
