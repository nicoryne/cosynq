"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer"
import { cn } from "@/lib/utils"
import { SignalSyncCard } from "./signal-sync-card"
import { MyCosplanDashboard } from "./my-cosplan-dashboard"

export function FeaturesSection() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Intersection observer for section header
  const { ref: headerRef, isIntersecting: headerVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  })

  // Intersection observer for bento grid
  const { ref: gridRef, isIntersecting: gridVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  const cardBase = "h-full border-none glassmorphism transition-all duration-700 overflow-hidden"

  return (
    <section
      id="features"
      className="relative py-24 px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={cn(
            "text-center mb-20 transition-all duration-700",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
            Features
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-medium text-lg leading-relaxed">
            Everything you need to plan, build, and connect—organized in one high-fidelity sanctuary.
          </p>
        </div>

        {/* Bento Grid with CSS Grid layout */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Signal Sync Board - Character Allocation & Recruitment */}
          <Card
            className={cn(
              cardBase,
              "md:col-span-2 p-6 md:p-14",
              "opacity-0 translate-y-8",
              gridVisible && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: gridVisible ? "100ms" : "0ms",
            }}
          >
            <SignalSyncCard />
          </Card>

          {/* Merged My Cosplan Dashboard - Planning & Budgeting */}
          <Card
            className={cn(
              cardBase,
              "md:col-span-2 p-6 md:p-14",
              "opacity-0 translate-y-8",
              gridVisible && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: gridVisible ? "200ms" : "0ms",
            }}
          >
            <MyCosplanDashboard />
          </Card>
        </div>
      </div>
    </section>
  )
}
