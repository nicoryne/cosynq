"use client"

import { useState } from "react"
import { Image, Zap, Users, Sparkles, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface HubPostComposerProps {
  user: {
    name: string
    avatarUrl?: string
  }
}

export function HubPostComposer({ user }: HubPostComposerProps) {
  const [isFocused, setIsFocused] = useState(false)
  const initials = user.name.slice(0, 2).toUpperCase()

  return (
    <article 
      className={cn(
        "glassmorphism border-white/5 rounded-sm sm:rounded-md px-4 py-6 sm:p-8 transition-all duration-500 group border-x-0 sm:border-x relative overflow-hidden",
        isFocused ? "bg-white/[0.04] border-white/10 shadow-glow-primary/5" : "bg-white/[0.01]"
      )}
    >
      {/* Background Depth Blurs */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -z-10 transition-opacity duration-700",
        isFocused ? "opacity-100" : "opacity-0"
      )} />

      <div className="flex gap-4">
        <Avatar className="size-11 border-white/10 shrink-0">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-4">
          <textarea
            placeholder="What's orbiting in your craft?"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-lg font-medium placeholder:text-muted-foreground/20 resize-none min-h-[80px] py-2 transition-all custom-scrollbar selection:bg-primary/30"
          />

          <div className="pt-6 border-t border-white/5 mt-2">
            <div className="grid grid-cols-5 items-center gap-1 sm:gap-4">
              <Button variant="ghost" size="sm" className="rounded-full size-10 p-0 text-muted-foreground/40 hover:text-primary hover:bg-primary/5 transition-all justify-self-start">
                <Image className="size-5" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full size-10 p-0 text-muted-foreground/40 hover:text-secondary hover:bg-secondary/5 transition-all justify-self-start">
                <Zap className="size-5" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full size-10 p-0 text-muted-foreground/40 hover:text-accent hover:bg-accent/5 transition-all justify-self-start">
                <Users className="size-5" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full size-10 p-0 text-muted-foreground/40 hover:text-foreground hover:bg-white/5 transition-all justify-self-start">
                <Sparkles className="size-5" />
              </Button>

              <Button size="sm" className="rounded-full size-12 p-0 shadow-glow-primary hover:scale-105 transition-all justify-self-end">
                <Send className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
