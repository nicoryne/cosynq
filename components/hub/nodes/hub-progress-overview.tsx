"use client"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ProgressItem {
  label: string
  value: number
  color: string // 'primary' | 'secondary' | 'accent'
}

export function HubProgressOverview() {
  const items: ProgressItem[] = [
    { label: "EVA Foam Synthesis", value: 70, color: "primary" },
    { label: "Textile & Lining", value: 45, color: "secondary" },
    { label: "Prop Electronics", value: 90, color: "accent" },
  ]

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/80">
          Material Tracking
        </h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-primary shadow-glow-primary/20">
          68% Total
        </p>
      </div>

      <div className="space-y-10">
        {items.map((item, i) => (
          <div key={i} className="space-y-4 group">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 transition-colors group-hover:text-foreground">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "size-1.5 rounded-full",
                  item.color === 'primary' && "bg-primary shadow-glow-primary",
                  item.color === 'secondary' && "bg-secondary shadow-glow-secondary",
                  item.color === 'accent' && "bg-accent shadow-glow-accent"
                )} />
                {item.label}
              </div>
              <span className="tabular-nums">{item.value}%</span>
            </div>
            
            <div className="relative">
              <Progress 
                value={item.value} 
                className={cn(
                  "h-1.5 rounded-full",
                  item.color === 'primary' && "[&>[data-slot=progress-indicator]]:bg-primary [&>[data-slot=progress-indicator]]:shadow-glow-primary",
                  item.color === 'secondary' && "[&>[data-slot=progress-indicator]]:bg-secondary [&>[data-slot=progress-indicator]]:shadow-glow-secondary",
                  item.color === 'accent' && "[&>[data-slot=progress-indicator]]:bg-accent [&>[data-slot=progress-indicator]]:shadow-glow-accent"
                )}
              />
              {/* Optional: Add a subtle glow highlight behind the bar on hover */}
              <div className={cn(
                "absolute inset-0 blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-500",
                item.color === 'primary' && "bg-primary",
                item.color === 'secondary' && "bg-secondary",
                item.color === 'accent' && "bg-accent"
              )} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
