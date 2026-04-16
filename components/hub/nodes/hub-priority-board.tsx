"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface HubPriorityBoardProps {
  className?: string
}

export function HubPriorityBoard({ className }: HubPriorityBoardProps) {
  const members = [
    { name: "Saber", role: "Armor Lead", status: "taken", initial: "S" },
    { name: "Ronin", role: "Weapon Tech", status: "taken", initial: "R" },
    { name: "Open Slot", role: "Electronics", status: "open", initial: "+" },
    { name: "Open Slot", role: "Prop Master", status: "open", initial: "+" },
  ]

  return (
    <Card className={cn(
      "w-full border-white/10 bg-white/[0.01] backdrop-blur-3xl rounded-[2.8rem] overflow-hidden relative group",
      className
    )}>
      {/* Background Depth Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:bg-primary/20 transition-all duration-700" />
      
      <CardContent className="p-8 sm:p-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-4">
            <Badge variant="outline" className="px-5 py-1 text-[10px] border-primary/20 bg-primary/5 text-primary">
              Active Status
            </Badge>
            <div className="space-y-1">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">
                Neon Ronin: <span className="text-primary">Group</span>
              </h2>
              <div className="flex items-center gap-4 text-muted-foreground/60 text-xs font-bold uppercase tracking-[0.2em]">
                <span>Reg. ends Today 1:49 PM</span>
                <span className="size-1 rounded-full bg-white/20" />
                <span>Event at Tomorrow 9:00 AM</span>
              </div>
            </div>
          </div>
          
          <Badge variant="outline" className="rounded-full px-6 py-2 border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-widest text-[10px] shadow-glow-primary/20">
            2 Slots Open
          </Badge>
        </div>

        {/* Character/Role Allocation Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/80">
              Role Allocation
            </h3>
            <button className="text-muted-foreground/40 hover:text-primary transition-colors">
              <MoreHorizontal className="size-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {members.map((member, i) => (
              <div 
                key={i}
                className={cn(
                  "flex items-center justify-between p-6 rounded-[2rem] transition-all duration-500 group/item",
                  member.status === 'taken' 
                    ? "bg-white/[0.03] border border-white/5 hover:border-primary/20" 
                    : "bg-transparent border border-dashed border-white/10 hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-5">
                  <Avatar size="sm" className="border-white/10 shadow-lg group-hover/item:shadow-glow-primary/20 transition-all">
                    <AvatarFallback className={cn(
                      "font-black",
                      member.status === 'open' && "bg-transparent text-muted-foreground/30"
                    )}>
                      {member.initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className={cn(
                      "font-black tracking-tight",
                      member.status === 'open' ? "text-muted-foreground/40" : "text-foreground"
                    )}>
                      {member.name}
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                      {member.role}
                    </p>
                  </div>
                </div>

                {member.status === 'taken' && (
                  <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest py-0.5 px-3 bg-white/5 border-white/5 opacity-50">
                    Taken
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
