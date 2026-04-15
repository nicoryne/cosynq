// =====================================================================
// Journey Section Component
// =====================================================================
// Displays the user journey timeline with three phases: Dream, Weave, Sync
// Features vertical timeline with gradient connecting line and glassmorphic nodes
// Requirements: 7.1-7.6

"use client";

import { Badge } from "@/components/ui/badge";
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

// =====================================================================
// Data
// =====================================================================

const phases = [
  {
    emoji: "☁️",
    title: "Plan",
    description: "Build your board, add character references, and organize your vision. Let the project crystallize.",
    details: ["Reference & inspiration boards", "Character selection", "Initial project outlining"],
  },
  {
    emoji: "🪡",
    title: "Build",
    description: "Track your budget, manage materials, and check off your build list. Every stitch counts.",
    details: ["Expense & material tracking", "Step-by-step build checklist", "Progress logs & photos"],
  },
  {
    emoji: "🪐",
    title: "Connect",
    description: "Recruit your group, align your convention schedules, and dominate the con floor together.",
    details: ["Group recruitment & chat", "Convention calendar sync", "Meetup coordination"],
  },
];

// =====================================================================
// Component
// =====================================================================

export function JourneySection() {
  const { ref: headerRef, isIntersecting: headerVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: timelineRef, isIntersecting: timelineVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      id="journey"
      className="relative py-24 px-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={cn(
            "text-center mb-20 transition-all duration-700",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
            The Process
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-medium text-lg leading-relaxed">
            From first vision to the convention floor, your professional craft is managed in one sanctuary.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef as React.RefObject<HTMLDivElement>} className="relative">
          {/* Vertical connecting line with gradient (Requirements 7.2) */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px bg-gradient-to-b from-primary via-secondary to-accent"
          />

          {phases.map((phase, index) => (
            <div
              key={phase.title}
              className={cn(
                "relative mb-16 last:mb-0 transition-all duration-700",
                timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: timelineVisible ? `${300 + index * 200}ms` : "0ms" }}
            >
              {/* Grid layout for alternating content (Requirements 7.4) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
                {/* Left content (odd indices on desktop) */}
                <div
                  className={cn(
                    "hidden md:block",
                    index % 2 === 0 ? "md:text-right md:pr-8" : "md:order-2 md:pl-8"
                  )}
                >
                  <Badge
                    variant="outline"
                    className="mb-3 px-3 py-1 bg-primary/10 border-primary/20 text-primary uppercase font-black tracking-widest text-[10px]"
                  >
                    Phase 0{index + 1}
                  </Badge>
                  <h3 className="font-heading text-3xl font-black tracking-tighter mb-4">
                    {phase.title}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">
                    {phase.description}
                  </p>
                  <div
                    className={cn(
                      "space-y-3 flex flex-col",
                      index % 2 === 0 ? "md:items-end" : "md:items-start"
                    )}
                  >
                    {phase.details.map((detail) => (
                      <div
                        key={detail}
                        className={cn(
                          "inline-flex items-center gap-3 px-4 py-2 rounded-xl glassmorphism text-[10px] font-black uppercase tracking-widest text-muted-foreground/80",
                          index % 2 === 0 ? "md:flex-row-reverse" : ""
                        )}
                      >
                        <span className="size-1.5 rounded-full bg-primary shrink-0 shadow-glow-primary" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Node (Requirements 7.3) */}
                <div
                  className={cn(
                    "absolute left-4 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 z-10",
                    "md:relative md:left-0 md:translate-x-0",
                    index % 2 === 0 ? "md:order-2" : "md:order-1"
                  )}
                >
                  <div className="flex justify-center">
                    <div className="size-12 sm:size-16 rounded-full flex items-center justify-center text-xl sm:text-2xl glassmorphism shadow-glow-primary">
                      {phase.emoji}
                    </div>
                  </div>
                </div>

                {/* Mobile content */}
                <div className="md:hidden ml-20">
                  <Badge
                    variant="outline"
                    className="mb-3 px-3 py-1 bg-primary/10 border-primary/20 text-primary uppercase font-black tracking-widest text-[10px]"
                  >
                    Phase 0{index + 1}
                  </Badge>
                  <h3 className="font-heading text-3xl font-black tracking-tighter mb-4">
                    {phase.title}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">
                    {phase.description}
                  </p>
                  <div className="space-y-3 flex flex-col">
                    {phase.details.map((detail) => (
                      <div
                        key={detail}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-xl glassmorphism text-[10px] font-black uppercase tracking-widest text-muted-foreground/80"
                      >
                        <span className="size-1.5 rounded-full bg-primary shrink-0 shadow-glow-primary" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
