"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer"
import { cn } from "@/lib/utils"

function CosplanCard() {
  const materials = [
    { name: "EVA Foam", progress: 70 },
    { name: "Fabric & Lining", progress: 45 },
    { name: "Wig Styling", progress: 90 },
    { name: "Accessories", progress: 25 },
  ]

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="p-0 mb-8 flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Cosplan Hub</CardTitle>
          <CardDescription className="text-xs">Track every stitch</CardDescription>
        </div>
        <Badge variant="celestial">4 Active</Badge>
      </CardHeader>
      <CardContent className="p-0 space-y-8 flex-1">
        {materials.map((mat) => (
          <div key={mat.name} className="space-y-3">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground/80">
              <span>{mat.name}</span>
              <span className="text-primary">{mat.progress}%</span>
            </div>
            <Progress value={mat.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
      <div className="pt-6 mt-8 border-t border-white/5 flex items-center justify-between text-xs">
        <span className="font-black uppercase tracking-widest text-muted-foreground/60">Total Budget</span>
        <span className="font-black italic text-lg text-primary shadow-glow-primary shadow-none">₱12,450</span>
      </div>
    </div>
  )
}

function RecruitmentCard() {
  const members = [
    { initial: "R", src: "https://github.com/nutlope.png" },
    { initial: "K", src: "https://github.com/shadcn.png" },
    { initial: "M", src: "" },
  ]

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="p-0 mb-6">
        <CardTitle>Cupid&apos;s Casting</CardTitle>
        <CardDescription className="text-xs">Find your squad</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col gap-6">
        <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="size-5 text-primary shadow-glow-primary" />
            <div>
              <p className="text-sm font-black italic tracking-tight">Genshin Archon Group</p>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Shoujo • Cebu City</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-3">
              {members.map((m, i) => (
                <Avatar key={i} className="border-2 border-background">
                  <AvatarImage src={m.src} />
                  <AvatarFallback>{m.initial}</AvatarFallback>
                </Avatar>
              ))}
              <Avatar className="border-2 border-background bg-muted text-[10px] font-black uppercase">
                <AvatarFallback>+2</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">3/5 Members</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Zhongli", "Raiden", "Nahida"].map((role) => (
              <Badge key={role} variant="outline" className="text-[9px] uppercase tracking-widest px-2 py-0">
                {role}
              </Badge>
            ))}
            <Badge variant="celestial" className="text-[9px] uppercase tracking-widest px-2 py-0">
              2 Open
            </Badge>
          </div>
        </div>
      </CardContent>
    </div>
  )
}

function CalendarCard() {
  const days = ["S", "M", "T", "W", "T", "F", "S"]
  const events = [
    { day: 12, name: "Otaku Fest", color: "bg-primary shadow-glow-primary shadow-none" },
    { day: 19, name: "ARCHcon", color: "bg-secondary shadow-glow-secondary shadow-none" },
  ]
  const eventDays = events.map((e) => e.day)

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="p-0 mb-6">
        <CardTitle>The Halo Hub</CardTitle>
        <CardDescription className="text-xs">Never miss a con</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">April 2026</div>
          <div className="grid grid-cols-7 gap-2 text-center text-[10px]">
            {days.map((d, i) => (
              <div key={`header-${i}`} className="text-muted-foreground/30 font-black">{d}</div>
            ))}
            {[null, null, null].map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-xl transition-all duration-300",
                  eventDays.includes(day)
                    ? "bg-primary text-primary-foreground font-black italic shadow-glow-primary shadow-none scale-110"
                    : day === 14
                      ? "ring-2 ring-primary/50 text-foreground font-black shadow-glow-primary shadow-none"
                      : "text-muted-foreground hover:bg-white/5"
                )}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-64 space-y-4 flex flex-col justify-center">
          {events.map((event) => (
            <div key={event.name} className={cn(
              "p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center gap-4 transition-all hover:scale-105",
              event.color.split(" ")[0] === "bg-primary" ? "hover:border-primary/20" : "hover:border-secondary/20"
            )}>
              <div className={cn("size-3 rounded-full", event.color)} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Apr {event.day}</span>
                <span className="text-xs font-black italic tracking-tight">{event.name}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  )
}

function ThemeCard() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Dual Themes</CardTitle>
        <CardDescription className="text-xs">Click to transform ✨</CardDescription>
      </CardHeader>
      <ThemeToggle className="size-16" />
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse mt-2">Engage Warp</span>
    </div>
  )
}

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
            "text-center mb-16 transition-all duration-700",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            A constellation of features
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Everything you need to plan, create, and conquer—organized in one beautiful orbit.
          </p>
        </div>

        {/* Bento Grid with CSS Grid layout */}
        <div 
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Cosplan Hub - 2-column span with live progress bars and gradient fills */}
          <Card 
            className={cn(
              cardBase, 
              "md:col-span-2 md:row-span-2 p-12",
              "opacity-0 translate-y-8",
              gridVisible && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: gridVisible ? "100ms" : "0ms",
            }}
          >
            <CosplanCard />
          </Card>

          {/* Recruitment Card with avatar groups and badges */}
          <Card 
            className={cn(
              cardBase, 
              "p-10",
              "opacity-0 translate-y-8",
              gridVisible && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: gridVisible ? "200ms" : "0ms",
            }}
          >
            <RecruitmentCard />
          </Card>

          {/* Theme Toggle Card with interactive theme switcher preview */}
          <Card 
            className={cn(
              cardBase, 
              "p-10 flex items-center justify-center",
              "opacity-0 translate-y-8",
              gridVisible && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: gridVisible ? "300ms" : "0ms",
            }}
          >
            <ThemeCard />
          </Card>

          {/* Calendar Card - 3-column span with highlighted event days */}
          <Card 
            className={cn(
              cardBase, 
              "md:col-span-3 p-12",
              "opacity-0 translate-y-8",
              gridVisible && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: gridVisible ? "400ms" : "0ms",
            }}
          >
            <CalendarCard />
          </Card>
        </div>
      </div>
    </section>
  )
}
