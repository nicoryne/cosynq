"use client"

import { ChevronDown } from "lucide-react"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatSmartDateTime } from "@/lib/utils/time.utils"

export function SignalSyncCard() {
  const characters = [
    { name: "Raiden Shogun", role: "Archon", status: "taken" },
    { name: "Nahida", role: "Archon", status: "taken" },
    { name: "Furina", role: "Hydro", status: "open" },
    { name: "Focalors", role: "Hydro", status: "open" },
  ]

  const regDeadline = new Date()
  regDeadline.setHours(regDeadline.getHours() + 2)

  const eventTime = new Date()
  eventTime.setDate(eventTime.getDate() + 1)
  eventTime.setHours(9, 0, 0, 0)

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="p-0 mb-10 text-center">
        <CardTitle className="text-3xl font-bold">Signal Sync</CardTitle>
        <CardDescription className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60 mt-2">FIND YOUR SQUAD & COSPLAY GROUPS</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 space-y-8">
        <div className="rounded-[2.8rem] border border-border/20 bg-muted/10 p-10 space-y-10">
          {/* Group Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
            <div className="space-y-3">
              <Badge className="bg-primary/15 text-primary border-none rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.15em]">
                PRIORITY RECRUITMENT
              </Badge>
              <h4 className="text-2xl font-bold leading-tight tracking-tight text-foreground">Archon Gathering</h4>
            </div>
            <div className="flex flex-col text-right gap-1.5">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">REGISTRATION ENDS AT</span>
                <span className="text-[10px] font-bold text-foreground/80">{formatSmartDateTime(regDeadline.toISOString())}</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">EVENT AT</span>
                <span className="text-[10px] font-bold text-primary">{formatSmartDateTime(eventTime.toISOString())}</span>
              </div>
            </div>
          </div>

          {/* Character Allocation Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">CHARACTER ALLOCATION</h5>
              <Badge variant="outline" className="rounded-full px-4 py-1.5 font-bold border-primary/30 text-primary uppercase text-[9px] tracking-widest">
                2 SLOTS OPEN
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {characters.map((char, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative p-4 rounded-[1.8rem] border transition-all duration-500 flex items-center gap-4 group cursor-pointer",
                    char.status === "open"
                      ? "border-dashed border-primary/40 bg-transparent hover:bg-primary/5"
                      : "border-border/15 hover:cursor-default bg-background/5 hover:bg-background/10"
                  )}
                >
                  <div className="relative">
                    <Avatar className={cn(
                      "size-11 border-2 transition-all duration-500",
                      char.status === "open" ? "border-dashed border-border/40" : "border-background"
                    )}>
                      <AvatarFallback className="text-[10px] font-bold bg-muted/30">{char.name[0]}</AvatarFallback>
                    </Avatar>
                    {char.status === "taken" && (
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-secondary border-2 border-background flex items-center justify-center">
                        <div className="size-1 rounded-full bg-secondary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className={cn(
                      "text-xs font-bold tracking-tight",
                      char.status === "open" ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {char.name}
                    </p>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">{char.role}</span>
                  </div>
                  {char.status === "open" ? (
                    <Badge className="bg-primary text-primary-foreground rounded-full px-3 py-0.5 text-[8px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">APPLY</Badge>
                  ) : (
                    <Badge variant="outline" className="border-primary/80 text-primary rounded-full px-3 py-0.5 text-[8px] font-bold uppercase">TAKEN</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
