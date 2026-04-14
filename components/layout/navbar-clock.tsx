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
    <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest whitespace-nowrap opacity-80">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {/* Pulsing indicator - Cyan for dark, Seraph Blue for light */}
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDark ? 'bg-cyan-400' : 'bg-blue-400'}`}></span>
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isDark ? 'bg-cyan-500' : 'bg-blue-500'}`}></span>
      </span>
      {formattedTime}
    </div>
  )
}
