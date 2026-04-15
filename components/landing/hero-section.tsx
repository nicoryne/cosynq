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
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-x-clip pt-20 pb-32"
    >
      {/* Subtle Starfield Background */}
      <Starfield />

      <div className="relative z-10 flex flex-col items-center text-center max-w-7xl mx-auto pt-10">
        {/* Giant Branding Focal Point - Background Layer */}
        <div className="relative mb-0 flex flex-col items-center select-none pointer-events-none w-full px-4 overflow-x-clip">
          <h1 className="font-heading text-[clamp(3.5rem,15vw,26rem)] font-black tracking-tighter leading-[0.85] pb-4">
            <span className={cn(
              "block bg-gradient-to-b from-foreground via-foreground to-transparent bg-clip-text text-transparent transform -translate-y-6 sm:-translate-y-12 transition-opacity duration-500",
              isDark ? "opacity-90" : "opacity-50"
            )}>
              cosynq
            </span>
          </h1>
        </div>

        {/* Main Content Layer */}
        <div className="relative z-20 flex flex-col items-center w-full px-6">
          {/* Catchphrase / Slogan */}
          <h2 className={cn(
            "font-heading text-[clamp(1rem,6vw,4.5rem)] font-black tracking-tighter transition-colors duration-500 text-foreground"
          )}>
            Simplify the craft.
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
            size="xl"
            variant="default"
            className="w-full sm:w-auto px-12"
          >
            <Link href={ROUTES.SIGN_UP}>
              Get Started
            </Link>
          </Button>
          <Button
            asChild
            size="xl"
            variant="outline"
            className="w-full sm:w-auto px-12"
          >
            <Link href="#features">
              Explore Features
            </Link>
          </Button>
        </div>
      </div>

      {/* Minimalist Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-muted-foreground/40 animate-bounce-gentle transition-opacity hover:opacity-100" aria-hidden="true">
        <span className="text-xs uppercase tracking-[0.3em] font-black">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/40 to-transparent" />
      </div>
    </section>
  )
}
