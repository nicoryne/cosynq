"use client"

import Link from "next/link"
import { Settings, Sparkles, Users, Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface HubProfileSummaryProps {
  user: {
    name: string
    username: string
    avatarUrl?: string
  }
}

export function HubProfileSummary({ user }: HubProfileSummaryProps) {
  const initials = user.name.slice(0, 2).toUpperCase()

  // High-fidelity mock stats
  const stats = [
    { label: "Cosplans", value: 12, icon: <Sparkles className="size-3 text-primary" /> },
    { label: "Groups", value: 4, icon: <Users className="size-3 text-secondary" /> },
    { label: "Posts", value: "842", icon: <Zap className="size-3 text-accent" /> },
  ]

  return (
    <div className="glassmorphism border-white/5 bg-white/[0.01] rounded-[2.4rem] p-8 space-y-8 relative overflow-hidden group">
      {/* Background Orbital Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-[60px] -z-10 group-hover:bg-primary/10 transition-all duration-700" />
      
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <Avatar className="size-20 border-2 border-white/5 shadow-glow-primary/20">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-xl font-black">{initials}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-primary border-4 border-background flex items-center justify-center shadow-lg">
             <div className="size-1.5 rounded-full bg-white animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tighter">{user.name}</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
            @{user.username}
          </p>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-3 gap-2 py-6 border-y border-white/5">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center justify-center space-y-1 group/stat cursor-default">
            <div className="flex items-center gap-1.5">
              {stat.icon}
              <span className="text-sm font-black tracking-tight group-hover/stat:text-foreground transition-colors">
                {stat.value}
              </span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Action */}
      <Link href="/hub/settings">
        <Button 
          variant="ghost" 
          className="w-full h-12 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.08] hover:text-primary transition-all group/btn"
        >
          <Settings className="size-3.5 mr-2 group-hover/btn:rotate-90 transition-transform duration-500" />
          Edit Profile
        </Button>
      </Link>
    </div>
  )
}
