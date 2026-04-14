"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer"
import { cn } from "@/lib/utils"

const orbiters = [
  { type: "avatar", initial: "A", color: "bg-primary" },
  { type: "con", name: "Otaku Fest" },
  { type: "avatar", initial: "M", color: "bg-secondary" },
  { type: "con", name: "ARCHcon" },
  { type: "avatar", initial: "R", color: "bg-primary" },
  { type: "con", name: "Cosplay Mania" },
  { type: "avatar", initial: "K", color: "bg-secondary" },
  { type: "con", name: "Comic Alley" },
  { type: "avatar", initial: "J", color: "bg-primary" },
  { type: "con", name: "Best of Anime" },
  { type: "avatar", initial: "S", color: "bg-secondary" },
  { type: "con", name: "Toycon PH" },
  { type: "avatar", initial: "D", color: "bg-primary" },
  { type: "con", name: "Cosmania" },
  { type: "avatar", initial: "L", color: "bg-secondary" },
  { type: "con", name: "Animax" },
]

export function CommunitySection() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 })

  // Double the items for seamless loop
  const marqueeItems = [...orbiters, ...orbiters]

  return (
    <section
      id="community"
      ref={ref}
      className="relative py-24 overflow-hidden"
    >
      {/* Header with fade-in animation */}
      <div 
        className={cn(
          "text-center mb-16 px-6 transition-all duration-700",
          isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Currently Orbiting
        </h2>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          Join the growing constellation of cosplayers already syncing their universe.
        </p>
      </div>

      {/* Infinite Marquee with fade gradients */}
      <div 
        className={cn(
          "relative transition-all duration-700 delay-200",
          isIntersecting ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Fade gradients on left and right edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background via-transparent to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background via-transparent to-transparent z-10 pointer-events-none" />

        {/* Marquee container with 30s duration */}
        <div className="flex animate-marquee gap-8 w-max">
          {marqueeItems.map((item, i) =>
            item.type === "avatar" ? (
              <Avatar 
                key={`avatar-${i}`}
                className={cn(
                  "size-14 border-2 border-white/10 shrink-0 shadow-glow-primary",
                  item.color
                )}
              >
                <AvatarFallback className="font-black italic bg-transparent text-white">
                  {item.initial}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Badge
                key={`con-${i}`}
                variant="outline"
                className="h-14 px-8 rounded-2xl text-sm font-black uppercase tracking-widest shrink-0 border-white/10 bg-card/50 glassmorphism whitespace-nowrap"
              >
                {item.name}
              </Badge>
            )
          )}
        </div>
      </div>

      {/* Testimonial Card with glassmorphism and staggered delay */}
      <div 
        className={cn(
          "max-w-2xl mx-auto mt-20 px-6 transition-all duration-700 delay-[400ms]",
          isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <Card className="relative border-none bg-transparent shadow-none">
          <CardContent className="relative rounded-[2.5rem] p-12 text-center glassmorphism border-white/10 shadow-glow-primary overflow-hidden">
            {/* Internal decorative glow effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl -ml-12 -mb-12" />
            
            {/* Decorative quote marks */}
            <span className="absolute top-6 left-10 text-6xl text-primary/30 font-serif leading-none select-none" aria-hidden="true">
              &ldquo;
            </span>
            
            {/* Testimonial content */}
            <p className="text-lg sm:text-xl leading-relaxed text-foreground/90 italic font-medium relative z-10">
              Finally, a place where our massive Genshin group can organize without
              our GC turning into a warzone.
            </p>
            
            {/* Author info */}
            <div className="mt-8 flex items-center justify-center gap-4 relative z-10">
              <Avatar className="size-12 border-2 border-white/10 shadow-glow-secondary">
                <AvatarFallback className="bg-secondary text-secondary-foreground font-black italic">
                  D
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-base font-black italic tracking-tight">✨ Dreamer</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
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
