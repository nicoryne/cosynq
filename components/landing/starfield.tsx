"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }))
}

function generateNebulas(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 400 + 200,
    color: Math.random() > 0.5 ? "bg-primary/10" : "bg-purple-500/10",
    blur: Math.random() * 40 + 80,
    duration: Math.random() * 10 + 10,
  }))
}

function generateClouds(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    width: Math.random() * 300 + 200,
    height: Math.random() * 150 + 100,
    scale: Math.random() * 0.5 + 0.5,
    opacity: Math.random() * 0.3 + 0.1,
    color: Math.random() > 0.7 ? "bg-purple-100/40" : Math.random() > 0.4 ? "bg-pink-50/40" : "bg-white/60",
    delay: Math.random() * -50,
    duration: Math.random() * 20 + 40,
  }))
}

function generateSparkles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 2,
  }))
}

export function Starfield() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Pre-generate all potential elements to keep DOM stable
  const [stars] = useState(() => generateStars(100))
  const [clouds] = useState(() => generateClouds(8))
  const [nebulas] = useState(() => generateNebulas(4))
  const [sparkles] = useState(() => generateSparkles(30))

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!mounted) return <div className="fixed inset-0 -z-10 pointer-events-none" />

  const isDark = resolvedTheme === "dark"

  // Optimization: Reduce density on mobile
  const activeStars = isMobile ? stars.slice(0, 30) : stars
  const activeSparkles = isMobile ? sparkles.slice(0, 10) : sparkles
  const activeClouds = isMobile ? clouds.slice(0, 3) : clouds

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" 
      aria-hidden="true"
      style={{ 
        contain: 'strict',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    >
      {/* ═══ PERSISTENT BACKGROUND LAYER ═══ */}
      <div 
        className={cn(
          "absolute inset-0 transition-colors duration-700 ease-in-out",
          isDark 
            ? "bg-gradient-to-br from-[#0a0a12] via-[#0f0a1f] to-[#0a0a12]" 
            : "bg-gradient-to-br from-[#F9F7FD] via-[#FCE6F0]/40 to-[#E0F7FA]/40"
        )} 
      />

      {/* ═══ DARK MODE ELEMENTS (Nebulas, Stars) ═══ */}
      <div className={cn("absolute inset-0 transition-opacity duration-700", isDark ? "opacity-100" : "opacity-0 invisible")}>
        {/* Nebula Glow Orbs */}
        {nebulas.map((nebula) => (
          <div
            key={nebula.id}
            className={cn("absolute rounded-full animate-pulse", nebula.color)}
            style={{
              left: `${nebula.x}%`,
              top: `${nebula.y}%`,
              width: `${nebula.size}px`,
              height: `${nebula.size}px`,
              filter: `blur(${nebula.blur}px)`,
              animationDuration: `${nebula.duration}s`,
              transform: 'translateZ(0)',
            }}
          />
        ))}

        {/* Stars */}
        {activeStars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              transform: 'translateZ(0)',
            }}
          />
        ))}

        {/* Shooting stars */}
        {!isMobile && (
          <>
            <div className="absolute top-[20%] left-[10%] -rotate-[35deg] animate-shooting-star" style={{ animationDuration: "4s" }}>
              <div className="w-40 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-cyan-200 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            </div>
            <div className="absolute top-[60%] left-[45%] -rotate-[25deg] animate-shooting-star" style={{ animationDuration: "7s" }}>
              <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-purple-400/50 to-purple-200 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            </div>
          </>
        )}
      </div>

      {/* ═══ LIGHT MODE ELEMENTS (Sun, Sparkles, Clouds) ═══ */}
      <div className={cn("absolute inset-0 transition-opacity duration-700", !isDark ? "opacity-100" : "opacity-0 invisible")}>
        {/* Solar Core */}
        <div className="absolute top-[10%] left-[60%] w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 bg-amber-200/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute inset-[35%] bg-white/40 rounded-full blur-[40px]" />
        </div>

        {/* Sparkles */}
        {activeSparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute rounded-full bg-primary/30 animate-twinkle shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
              transform: 'translateZ(0)',
            }}
          />
        ))}

        {/* Clouds */}
        {activeClouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute animate-cloud-drift"
            style={{
              top: `${cloud.y}%`,
              animationDelay: `${cloud.delay}s`,
              animationDuration: `${cloud.duration}s`,
              transform: 'translateZ(0)',
            }}
          >
            <div
              className={cn("rounded-full blur-3xl shadow-[0_0_40px_rgba(255,255,255,0.4)]", cloud.color)}
              style={{
                width: `${cloud.width}px`,
                height: `${cloud.height}px`,
                transform: `scale(${cloud.scale})`,
                opacity: cloud.opacity + 0.1,
              }}
            />
          </div>
        ))}
      </div>

      {/* Unified Atmosphere Lighting */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-1000",
        isDark ? "opacity-30" : "opacity-60"
      )}>
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-full h-[30vh] bg-gradient-to-t from-secondary/10 to-transparent blur-3xl" />
      </div>
    </div>
  )
}

