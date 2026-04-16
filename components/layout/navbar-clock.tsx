"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { toISOFormat, toLocalTimeWithOptions } from "@/lib/utils/time.utils"

export function NavbarClock() {
  const [time, setTime] = useState<Date | null>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Set initial time
    setTime(new Date())
    // Update every second
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  // Prevent hydration mismatch by not rendering until client-side
  if (!time) {
    return (
      <div className="w-[4.5rem] h-4 bg-muted/50 animate-pulse rounded-full" />
    )
  }

  // Use the cosynq time utility for consistent formatting
  const formattedTime = toLocalTimeWithOptions(
    toISOFormat(time),
    { hour: '2-digit', minute: '2-digit', second: '2-digit' }
  )

  return (
    <div className="flex items-center gap-3">
      <div className="size-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_hsl(var(--secondary))]" />
      <time className="tabular-nums font-black text-[12px] tracking-widest text-foreground/80 lowercase">
        {formattedTime}
      </time>
    </div>
  )
}
