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
    delay: Math.random() * -50,
    duration: Math.random() * 20 + 40,
  }))
}

export function Starfield() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [stars] = useState(() => generateStars(100))
  const [clouds] = useState(() => generateClouds(15))
  const [nebulas] = useState(() => generateNebulas(4))

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="fixed inset-0 -z-10 pointer-events-none" />

  const isDark = resolvedTheme === "dark"

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {isDark ? (
        <>
          {/* Deep Nebula Base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a12] via-[#0f0a1f] to-[#0a0a12]" />
          
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
              }}
            />
          ))}

          {/* Static stars */}
          {stars.map((star) => (
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
              }}
            />
          ))}

          {/* Shooting stars — enhanced */}
          <div className="absolute top-[20%] left-[10%] -rotate-[35deg] animate-shooting-star" style={{ animationDuration: "4s" }}>
            <div className="w-40 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-cyan-200 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
          </div>
          <div className="absolute top-[60%] left-[45%] -rotate-[25deg] animate-shooting-star" style={{ animationDuration: "7s" }}>
            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-purple-400/50 to-purple-200 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          </div>
          <div className="absolute top-[35%] left-[80%] -rotate-[40deg] animate-shooting-star" style={{ animationDuration: "5.5s" }}>
            <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300/50 to-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
          </div>

          {/* Subtle atmosphere lighting */}
          <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-full h-[30vh] bg-gradient-to-t from-secondary/5 to-transparent blur-3xl pointer-events-none" />
        </>
      ) : (
        <>
          {/* ═══ LIGHT MODE: Pastel Nebula ═══ */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F9F7FD] via-[#FCE6F0]/30 to-[#E0F7FA]/30" />

          {/* Large soft color washes */}
          <div className="absolute -top-32 -left-32 w-[800px] h-[800px] bg-purple-200/20 rounded-full blur-[120px]" />
          <div className="absolute top-[10%] -right-20 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-[20%] w-[700px] h-[500px] bg-cyan-100/20 rounded-full blur-[110px]" />

          {/* Subtle atmosphere lighting */}
          <div className="absolute top-0 right-0 w-full h-[40vh] bg-gradient-to-b from-secondary/10 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-primary/10 to-transparent blur-3xl pointer-events-none" />

          {/* Drifting Clouds */}
          {clouds.map((cloud) => (
            <div
              key={cloud.id}
              className="absolute animate-cloud-drift"
              style={{
                top: `${cloud.y}%`,
                animationDelay: `${cloud.delay}s`,
                animationDuration: `${cloud.duration}s`,
              }}
            >
              <div
                className="bg-white/60 rounded-full blur-3xl shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                style={{
                  width: `${cloud.width}px`,
                  height: `${cloud.height}px`,
                  transform: `scale(${cloud.scale})`,
                  opacity: cloud.opacity + 0.2,
                }}
              />
            </div>
          ))}
        </>
      )}
    </div>
  )
}

