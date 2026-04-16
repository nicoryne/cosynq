"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function HubCalendarNode() {
  const days = ["S", "M", "T", "W", "T", "F", "S"]
  
  // Hardcoded for demonstration to match the "Signal Sync" December 2026 grid
  const monthData = [
    null, null, null, null, null, null, 1,
    2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27, 28, 29,
    30, 31
  ]

  const highlights = {
    6: 'primary', // Lavender Highlight
    24: 'accent'  // Pink Highlight
  }

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          December 2026
        </h3>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded-full hover:bg-white/5 text-muted-foreground transition-all">
            <ChevronLeft className="size-4" />
          </button>
          <button className="p-1 rounded-full hover:bg-white/5 text-muted-foreground transition-all">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 text-center">
        {days.map(day => (
          <div key={day} className="text-[10px] font-black text-muted-foreground/30">
            {day}
          </div>
        ))}

        {monthData.map((day, i) => {
          const highlight = day ? (highlights as any)[day] : null
          
          return (
            <div key={i} className="relative flex items-center justify-center aspect-square flex-col">
              {day && (
                <>
                  {highlight && (
                    <div className={cn(
                      "absolute inset-0 m-1 rounded-full animate-pulse opacity-20",
                      highlight === 'primary' && "bg-primary shadow-glow-primary",
                      highlight === 'accent' && "bg-accent shadow-glow-accent"
                    )} />
                  )}
                  <span className={cn(
                    "relative z-10 text-[11px] font-black tracking-tight transition-all",
                    highlight === 'primary' && "text-primary",
                    highlight === 'accent' && "text-accent",
                    !highlight && "text-muted-foreground/80 hover:text-foreground cursor-pointer"
                  )}>
                    {day}
                  </span>
                  {highlight && (
                    <div className={cn(
                      "absolute -top-1 -right-1 size-1 rounded-full",
                      highlight === 'primary' && "bg-primary shadow-glow-primary",
                      highlight === 'accent' && "bg-accent shadow-glow-accent"
                    )} />
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
