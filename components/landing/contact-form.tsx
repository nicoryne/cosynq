"use client"

import { useState } from "react"
import { Send, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center justify-center py-12 space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-glow-primary">
          <CheckCircle2 className="size-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight">Transmission Received</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Your signal has been successfully synced with our command center. We'll reach out shortly.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsSubmitted(false)}
          className="rounded-xl"
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Commander Name</label>
          <Input 
            required 
            placeholder="Keqing Fan" 
            className="rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-12"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Orbit Email</label>
          <Input 
            required 
            type="email" 
            placeholder="keqing@yuheng.com" 
            className="rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-12"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Subject</label>
        <Input 
          required 
          placeholder="Group Recruitment Inquiry" 
          className="rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-12"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Your Signal</label>
        <Textarea 
          required 
          placeholder="How can we help your craft thrive?" 
          className="rounded-[1.5rem] bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 min-h-[150px] resize-none"
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className={cn(
          "w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest shadow-glow-primary transition-all active:scale-95",
          isSubmitting ? "opacity-70" : ""
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            Sending Signal...
            <Loader2 className="size-5 animate-spin" />
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Dispatch Transmission
            <Send className="size-5" />
          </span>
        )}
      </Button>
    </form>
  )
}
