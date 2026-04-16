"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineEvent {
  time: string
  duration: string
  title: string
  color: string // 'primary' | 'secondary' | 'accent'
}

export function HubDailyTimeline() {
  const events: TimelineEvent[] = [
    {
      time: "08:00",
      duration: "2H",
      title: "EVA Foam Base Fabrication",
      color: "accent",
    },
    {
      time: "10:30",
      duration: "1.5H",
      title: "LED Circuit & Signal Ritual",
      color: "secondary",
    },
    {
      time: "13:00",
      duration: "3H",
      title: "Lining & Stitching: Mesh Vest",
      color: "primary",
    },
  ]

  return (
    <div className="space-y-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black tracking-tighter">Daily Schedule</h3>
        <button className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground transition-all">
          Today
        </button>
      </div>

      <div className="relative pl-8 space-y-12 h-full">
        {/* The Dotted Vertical Line */}
        <div className="absolute left-[7px] top-2 bottom-8 w-px border-l border-dashed border-white/20" />

        {events.map((event, i) => (
          <div key={i} className="group relative">
            {/* The Pulsating Node Dot */}
            <div className={cn(
              "absolute -left-8 top-1.5 size-4 rounded-full border-4 border-background z-10 shadow-lg transition-transform group-hover:scale-125",
              event.color === 'primary' && "bg-primary shadow-glow-primary/40",
              event.color === 'secondary' && "bg-secondary shadow-glow-secondary/40",
              event.color === 'accent' && "bg-accent shadow-glow-accent/40"
            )} />

            {/* Event Card */}
            <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group/card">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                  {event.time} 
                  <span className="size-1 rounded-full bg-white/20" /> 
                  {event.duration}
                </p>
                <h4 className="font-black tracking-tight text-lg group-hover/card:text-primary transition-colors">
                  {event.title}
                </h4>
              </div>
              <ChevronRight className="size-5 text-muted-foreground/30 group-hover/card:text-foreground group-hover/card:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
        
        {/* Placeholder spacer to fill grid */}
        <div className="h-4" />
      </div>
    </div>
  )
}
