"use client"

import { useState, useEffect } from "react"
import { Cookie, X, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CONSENT_KEY = "cosynq-cookie-consent"

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      // Delay opening slightly for a better feel
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "true")
    setIsOpen(false)
  }

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "essential")
    setIsOpen(false)
  }

  if (hasChecked || !isOpen) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 md:bottom-8 left-0 md:left-auto md:right-8 z-[100] w-full md:w-full md:max-w-md p-4 md:p-0",
        "animate-in fade-in slide-in-from-bottom-full duration-700 ease-out fill-mode-both"
      )}
    >
      <div className="bg-background/60 backdrop-blur-2xl border border-white/10 rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-glow-primary/50">
              <Cookie className="size-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-black tracking-tight leading-none">Preference Signal</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                Cookie Consensus
              </p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="ml-auto text-muted-foreground/40 hover:text-foreground transition-colors p-2"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium">
              We use cookies to synchronize your celestial experience, remember your preferences, and ensure your sanctuary remains secure.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <div className="flex items-center gap-1.5 text-primary">
                <ShieldCheck className="size-3" />
                <span>Secure Auth</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3" />
                <span>Theme Persistence</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              onClick={handleAccept}
              className="flex-1 rounded-full h-12"
              variant="default"
            >
              Accept All
            </Button>
            <Button 
              onClick={handleDecline}
              className="flex-1 rounded-full h-12 border-white/5 bg-white/5 hover:bg-white/10"
              variant="outline"
            >
              Essential Only
            </Button>
          </div>

          <div className="text-center">
            <Link 
              href="/privacy" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
            >
              Privacy Policy & Datastream
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
