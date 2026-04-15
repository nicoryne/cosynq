"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer"
import { cn } from "@/lib/utils"

const cosplayers = [
  { initial: "A", color: "bg-primary" },
  { initial: "M", color: "bg-secondary" },
  { initial: "R", color: "bg-primary" },
  { initial: "K", color: "bg-secondary" },
  { initial: "J", color: "bg-primary" },
  { initial: "S", color: "bg-secondary" },
  { initial: "D", color: "bg-primary" },
  { initial: "L", color: "bg-secondary" },
]

const conventions = [
  "Otaku Fest", "ARCHcon", "Cosplay Mania", "Comic Alley", 
  "Best of Anime", "Toycon PH", "Animax", "Nexus"
]

const metrics = [
  { label: "Syncers in Orbit", value: "1,240+" },
  { label: "Groups Formed", value: "320" },
  { label: "Cons Mapped", value: "45" },
]

export function CommunitySection() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 })

  return (
    <section
      id="community"
      ref={ref}
      className="relative py-24 overflow-hidden"
    >
      {/* Header with fade-in animation */}
      <div
        className={cn(
          "text-center mb-16 px-6 transition-all duration-500",
          isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
          The Community
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto font-medium text-lg leading-relaxed">
          Join the growing constellation of cosplayers already syncing their universe.
        </p>
      </div>

      {/* The Community Constellation Grid */}
      <div
        className={cn(
          "relative max-w-6xl mx-auto transition-all duration-1000 delay-200",
          isIntersecting ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Constellation Container - Staggered & Organic */}
        <div className="flex flex-wrap justify-center gap-4 px-4 sm:gap-10 sm:px-6">
          
          {/* Top Sector: Cosplayer Orbitals */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 sm:mb-20 max-w-4xl">
            {cosplayers.map((item, i) => (
              <div 
                key={`cosplayer-${i}`}
                className="md:animate-float-slow"
                style={{ animationDelay: `${i * 1}s`, animationDuration: `${8 + i}s` }}
              >
                <Avatar
                  className={cn(
                    "size-12 sm:size-20 border-2 border-white/10 shadow-glow-primary transition-all duration-500 hover:scale-110 hover:border-primary group cursor-pointer",
                    item.color
                  )}
                >
                  <AvatarFallback className="font-black bg-transparent text-white text-base sm:text-xl">
                    {item.initial}
                  </AvatarFallback>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity pointer-events-none" />
                </Avatar>
              </div>
            ))}
          </div>

          {/* Central Anchor: Community Metrics Ribbon */}
          <div className="relative py-8 z-20 w-full mb-12 sm:mb-24">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent border-y border-white/5 backdrop-blur-sm" />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative grid grid-cols-3 gap-4 sm:gap-8 w-full">
              {metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col items-center text-center">
                  <span className="text-lg sm:text-2xl font-black text-foreground tracking-tighter">{metric.value}</span>
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground leading-tight">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Sector: Convention Sectors */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-8 max-w-5xl">
            {conventions.map((name, i) => (
              <div 
                key={`con-${i}`}
                className="md:animate-float-slow"
                style={{ animationDelay: `${i * 1 + 1}s`, animationDuration: `${10 + i}s` }}
              >
                <Badge
                  variant="outline"
                  className="h-12 sm:h-16 px-6 sm:px-12 rounded-full text-xs sm:text-base font-black uppercase tracking-[0.2em] border-white/10 bg-white/5 backdrop-blur-xl whitespace-nowrap hover:border-primary hover:text-primary hover:shadow-glow-primary transition-all duration-500 cursor-pointer"
                >
                  {name}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative background glows for the constellation */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Testimonial Card with Holographic effects */}
      <div
        className={cn(
          "max-w-2xl mx-auto mt-24 px-6 transition-all duration-700 delay-300",
          isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
      >
        <Card className="relative border-none bg-transparent shadow-none group">
          <div className="absolute inset-0 bg-primary/10 rounded-[2rem] sm:rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <CardContent className="relative rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 text-center glassmorphism border-white/10 shadow-glow-primary overflow-hidden transition-all duration-700 group-hover:bg-white/[0.03]">
            {/* Holographic Scan Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-20 w-full animate-scan-line pointer-events-none opacity-30" />
            
            {/* Internal decorative orbs */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -mr-24 -mt-24 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-[60px] -ml-16 -mb-16 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Decorative quote marks */}
            <span className="absolute top-8 left-12 text-7xl text-primary/20 font-serif leading-none select-none" aria-hidden="true">
              &ldquo;
            </span>

            {/* Testimonial content */}
            <p className="text-xl sm:text-2xl leading-relaxed text-foreground font-medium relative z-10 tracking-tight">
              Finally, a place where our massive Genshin group can organize without
              our GC turning into a warzone.
            </p>

            {/* Author info */}
            <div className="mt-12 flex items-center justify-center gap-5 relative z-10">
              <Avatar className="size-14 border-2 border-primary/20 shadow-glow-secondary transition-transform group-hover:scale-110">
                <AvatarFallback className="bg-secondary text-secondary-foreground font-black text-xl">
                  D
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-lg font-black tracking-tight flex items-center gap-2">
                  Dreamer
                  <span className="size-2 rounded-full bg-primary animate-pulse shadow-glow-primary" />
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">
                  Cebu City, PH
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
