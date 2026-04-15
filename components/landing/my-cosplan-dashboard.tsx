"use client"

import { ChevronDown } from "lucide-react"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toLocalTimeWithOptions } from "@/lib/utils/time.utils"

export function MyCosplanDashboard() {
  const scheduleItems = [
    { time: "08:00", label: "Otaku Fest Props", duration: "2h", color: "bg-primary" },
    { time: "10:30", label: "Photoshoot: Archons", duration: "1.5h", color: "bg-secondary" },
    { time: "13:00", label: "Wig Styling: Nahida", duration: "3h", color: "bg-accent" },
  ]

  const materials = [
    { name: "EVA Foam", progress: 70, color: "bg-primary" },
    { name: "Fabric & Lining", progress: 45, color: "bg-secondary" },
    { name: "Wig Styling", progress: 90, color: "bg-accent" },
  ]

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="p-0 mb-12 flex items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-3xl font-bold">My Cosplan</CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60 leading-none">COMMAND YOUR ORBIT</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left Column: Date and Material Progress */}
        <div className="lg:col-span-4 space-y-12">
          {/* Calendar Grid */}
          <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">DECEMBER 2026</span>
              <div className="flex gap-2">
                <div className="size-8 rounded-full bg-muted/20 border border-border/30 flex items-center justify-center text-xs hover:bg-muted/40 transition-all cursor-pointer">←</div>
                <div className="size-8 rounded-full bg-muted/20 border border-border/30 flex items-center justify-center text-xs hover:bg-muted/40 transition-all cursor-pointer">→</div>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={`${d}-${i}`} className="text-[8px] sm:text-[9px] font-bold text-center text-muted-foreground/30 pb-2">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={cn(
                    "aspect-square flex items-center justify-center text-[11px] font-bold rounded-xl transition-all cursor-pointer",
                    day === 24 ? "bg-primary text-primary-foreground shadow-glow-primary shadow-none" :
                      day === 6 ? "bg-secondary/40 text-foreground ring-1 ring-secondary/50 border-secondary/20" :
                        "text-muted-foreground hover:bg-muted/30"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Integrated Material Progress */}
          <div className="space-y-8 pt-8 border-t border-border/20">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">MATERIAL TRACKING</h4>
              <span className="text-[10px] font-bold text-primary">68% TOTAL</span>
            </div>
            <div className="space-y-6">
              {materials.map((mat) => (
                <div key={mat.name} className="space-y-3">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                    <span className="flex items-center gap-2">
                      <div className={cn("size-2 rounded-full", mat.color)} />
                      {mat.name}
                    </span>
                    <span className="text-foreground/90">{mat.progress}%</span>
                  </div>
                  <div className="relative h-2.5 w-full bg-muted/30 rounded-full overflow-hidden border border-border/5">
                    <div
                      className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out", mat.color)}
                      style={{ width: `${mat.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Daily Schedule and Budget Overlay */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex items-center justify-between mb-8 px-1">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">DAILY SCHEDULE</h4>
            <Badge variant="outline" className="rounded-full border-muted-foreground/20 text-[9px] font-bold py-1 px-3">TODAY</Badge>
          </div>
          {/* Schedule List with Vertical Line logic constrained to items */}
          <div className="relative">
            {/* Timeline Line - constrained to schedule items only */}
            <div className="absolute top-0 bottom-0 left-[15px] sm:left-[19px] w-[1px] bg-border/20 z-0" />

            <div className="space-y-6 relative z-10">
              {scheduleItems.map((item, i) => (
                <div key={i} className="flex gap-4 sm:gap-8 items-start group">
                  <div className="relative size-8 sm:size-10 rounded-full border-4 border-background bg-muted/20 flex items-center justify-center shrink-0 group-hover:bg-muted/40 transition-all">
                    <div className={cn("size-2 rounded-full", item.color)} />
                  </div>
                  <div className="flex-1 rounded-[1.5rem] sm:rounded-[2.2rem] bg-muted/5 border border-border/15 p-4 sm:p-6 flex items-center justify-between group-hover:border-primary/20 transition-all group-hover:translate-x-1 group-hover:bg-muted/10">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">
                        {toLocalTimeWithOptions(new Date().toISOString(), { hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\d+:\d+/, item.time)} • {item.duration}
                      </span>
                      <p className="text-lg font-bold text-foreground">{item.label}</p>
                    </div>
                    <ChevronDown className="size-5 text-muted-foreground/20 -rotate-90 group-hover:text-primary/50 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Integrated Budget Component - Decoupled from timeline line */}
          <div className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-border/20">
            <div className="rounded-[1.5rem] sm:rounded-[1.8rem] bg-accent/5 border border-accent/15 flex items-center justify-between p-5 sm:p-6 overflow-hidden relative">
              <div className="space-y-1">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50">TOTAL BUDGET SPENT</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-bold text-accent tracking-tighter">₱12,450</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">/ ₱25,000</span>
                </div>
              </div>
              <div className="flex gap-1.5 opacity-20">
                <div className="size-1 rounded-full bg-accent" />
                <div className="size-1 rounded-full bg-accent" />
                <div className="size-1 rounded-full bg-accent" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
