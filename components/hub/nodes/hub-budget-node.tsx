"use client"

import { MoreHorizontal } from "lucide-react"

export function HubBudgetNode() {
  const spent = 12450
  const total = 25000
  const percentage = (spent / total) * 100

  return (
    <div className="space-y-6 group">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          Total Budget Spent
        </h3>
        <button className="text-muted-foreground/30 hover:text-foreground transition-colors p-1">
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black tracking-tighter text-accent shadow-glow-accent/20">
            ₱{spent.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-muted-foreground/40">
            / ₱{total.toLocaleString()}
          </span>
        </div>

        {/* Minimal Progress Rail */}
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
          <div 
            className="absolute left-0 top-0 h-full bg-accent shadow-glow-accent/40 rounded-full transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
