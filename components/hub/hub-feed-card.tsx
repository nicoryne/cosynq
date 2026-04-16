"use client"

import { MessageSquare, Repeat2, Heart, Share2, MoreHorizontal, Zap, Users, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState } from "react"

export type SignalType = 'progress' | 'invite' | 'blog' | 'status'

interface HubFeedCardProps {
  author: {
    name: string
    username: string
    avatarUrl?: string
  }
  timestamp: string
  content: string
  type?: SignalType
  meta?: {
    projectName?: string
    progress?: number
    groupName?: string
    roles?: string[]
    readTime?: string
  }
  image?: string
}

export function HubFeedCard({ author, timestamp, content, type = 'status', meta, image }: HubFeedCardProps) {
  const [hasPulsed, setHasPulsed] = useState(false)
  const [hasBoosted, setHasBoosted] = useState(false)
  const [pulseCount, setPulseCount] = useState(12)
  const initials = author.name.slice(0, 2).toUpperCase()

  const handlePulse = () => {
    setHasPulsed(!hasPulsed)
    setPulseCount(prev => hasPulsed ? prev - 1 : prev + 1)
  }

  return (
    <article className="glassmorphism border-white/5 bg-white/[0.01] rounded-sm sm:rounded-md px-4 py-6 sm:px-6 sm:py-7 space-y-5 hover:bg-white/[0.02] hover:border-white/10 transition-all duration-500 group border-x-0 sm:border-x">
      {/* Post Header */}
      <div className="flex items-start gap-2 sm:gap-4 w-full">
        <Avatar className="size-10 sm:size-11 border-white/10 shadow-lg shrink-0">
          <AvatarImage src={author.avatarUrl} alt={author.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between w-full mb-2">
            <div className="flex items-baseline gap-2.5 min-w-0">
              <span className="font-black tracking-tight text-foreground text-sm sm:text-base leading-tight truncate shrink-0">
                {author.name}
              </span>
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="text-xs font-medium text-foreground/40 truncate">@{author.username}</span>
                <span className="size-1 rounded-full bg-white/10 shrink-0" />
                <span className="text-xs font-medium text-foreground/40 shrink-0">{timestamp}</span>
              </div>
            </div>
            <button className="text-foreground/30 hover:text-foreground transition-colors p-1 shrink-0 -mt-1 -mr-1">
              <MoreHorizontal className="size-4" />
            </button>
          </div>
          
          {/* Contextual Signal Badge */}
          {type === 'progress' && (
            <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 truncate">
              <Zap className="size-3 shrink-0" />
              Synthesis Update: {meta?.projectName}
            </p>
          )}
          {type === 'invite' && (
            <p className="text-[9px] font-black uppercase tracking-widest text-secondary flex items-center gap-1.5 truncate">
              <Users className="size-3 shrink-0" />
              Recruitment Signal: {meta?.groupName}
            </p>
          )}
          {type === 'blog' && (
            <p className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center gap-1.5 truncate">
              <Sparkles className="size-3 shrink-0" />
              Orbital Technique & bull; {meta?.readTime} read
            </p>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="space-y-4 ml-0 sm:ml-14 pt-4 sm:pt-0">
        <p className="text-base sm:text-lg leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
          {content}
        </p>

        {/* Specialized Meta Content (Progress Bars, etc) */}
        {type === 'progress' && meta?.progress !== undefined && (
          <div className="p-4 sm:p-5 rounded-xl bg-white/5 border border-white/5 space-y-3">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">
                <span>Craft Progress</span>
                <span>{meta.progress}%</span>
             </div>
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary shadow-glow-primary transition-all duration-1000"
                  style={{ width: `${meta.progress}%` }}
                />
             </div>
          </div>
        )}

        {/* Image Attachment (If any) */}
        {image && (
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative">
            <img src={image} alt="Signal Attachment" className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}

        {/* Interaction Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 sm:gap-4">
            <button className="flex items-center gap-1 sm:gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all group/action">
              <div className="size-9 rounded-full flex items-center justify-center group-hover/action:bg-primary/10 transition-colors">
                <MessageSquare className="size-4.5" />
              </div>
              <span className="hidden sm:inline">12</span>
            </button>
            <button 
              onClick={() => setHasBoosted(!hasBoosted)}
              className={cn(
                "flex items-center gap-1 sm:gap-2 text-xs font-black uppercase tracking-widest transition-all group/action",
                hasBoosted ? "text-secondary" : "text-muted-foreground/40 hover:text-secondary"
              )}
            >
              <div className={cn(
                "size-9 rounded-full flex items-center justify-center transition-colors",
                hasBoosted ? "bg-secondary/20" : "group-hover/action:bg-secondary/10"
              )}>
                <Repeat2 className={cn("size-4.5 transition-transform duration-500", hasBoosted && "rotate-180")} />
              </div>
              <span className="hidden sm:inline">{hasBoosted ? "Boosted" : "Boost"}</span>
            </button>
            <button 
              onClick={handlePulse}
              className={cn(
                "flex items-center gap-1 sm:gap-2 text-xs font-black uppercase tracking-widest transition-all group/action",
                hasPulsed ? "text-accent" : "text-muted-foreground/40 hover:text-accent"
              )}
            >
              <div className={cn(
                "size-9 rounded-full flex items-center justify-center transition-colors",
                hasPulsed ? "bg-accent/20" : "group-hover/action:bg-accent/10"
              )}>
                <Heart className={cn("size-4.5 transition-all duration-300", hasPulsed && "fill-accent scale-110")} />
              </div>
              <span className="hidden sm:inline tracking-tighter">{pulseCount}</span>
            </button>
          </div>
          
          <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground transition-all group/action">
             <div className="size-9 rounded-full flex items-center justify-center group-hover/action:bg-white/10 transition-colors">
                <Share2 className="size-4" />
             </div>
          </button>
        </div>
      </div>
    </article>
  )
}
