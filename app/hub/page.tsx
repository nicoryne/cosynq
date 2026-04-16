import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { AuthService } from "@/lib/services/auth.service"
import { redirect } from "next/navigation"
import { HubPostComposer } from "@/components/hub/hub-post-composer"
import { HubFeedCard } from "@/components/hub/hub-feed-card"
import { HubFeedTabs } from "@/components/hub/hub-feed-tabs"
import { HubProfileSummary } from "@/components/hub/hub-profile-summary"
import { HubCalendarNode } from "@/components/hub/nodes/hub-calendar-node"
import { HubBudgetNode } from "@/components/hub/nodes/hub-budget-node"
import { HubProgressOverview } from "@/components/hub/nodes/hub-progress-overview"
import { Card } from "@/components/ui/card"
import { Sparkles, TrendingUp, Users } from "lucide-react"

export default async function HubPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const authService = new AuthService(supabase)
  const user = await authService.getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const displayName = user.profile.displayName || user.profile.username
  const username = user.profile.username
  const initials = displayName.slice(0, 2).toUpperCase()

  // High-fidelity mock signals for the sanctuary feed
  const mockSignals = [
    {
      author: { name: "Aether Sculptor", username: "aesculpt", avatarUrl: undefined },
      timestamp: "2h ago",
      content: "Just finalized the primary mold for the Cyberpunk Ronin gauntlets. The EVA high-density foam responded perfectly to the thermal ritual.",
      type: "progress" as const,
      meta: { projectName: "Neon Ronin", progress: 85 },
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop"
    },
    {
      author: { name: "Cosplay Cebu", username: "coscebu", avatarUrl: undefined },
      timestamp: "5h ago",
      content: "Establishing a new Vanguard Sync for Otaku Fest 2026. We are looking for high-fidelity prop makers and technical armor leads to join our 'Archon Gathering' squad.",
      type: "invite" as const,
      meta: { groupName: "Archon Gathering", roles: ["Armor Lead", "Prop Master"] }
    },
    {
      author: { name: "Warp Stylist", username: "warpstyle", avatarUrl: undefined },
      timestamp: "Yesterday",
      content: "Tech Tip: When handling synthetic high-heat fibers for gravity-defying spikes, always ensure your signal frequency is set to 'low' before applying the thermal sealer.",
      type: "blog" as const,
      meta: { readTime: "4 min" }
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-6 space-y-8 sm:space-y-12">
      {/* Social Grid - 2 Column Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 sm:gap-8 lg:gap-12 items-start">
        
        {/* Left Column: The Signal Stream */}
        <main className="lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full overflow-hidden">
          <HubPostComposer user={{ name: displayName, avatarUrl: user.profile.avatarUrl || undefined }} />
          
          <div className="pt-2">
            <HubFeedTabs />
          </div>
          
          <div className="space-y-8">
            {mockSignals.map((signal, i) => (
              <div 
                key={i} 
                className="animate-in fade-in slide-in-from-bottom-12 duration-700"
                style={{ animationDelay: `${(i + 1) * 150}ms` }}
              >
                <HubFeedCard {...signal} />
              </div>
            ))}
          </div>
        </main>

        {/* Right Column: Orbital Command Sidebar (Private Telemetry) - Hidden on Mobile */}
        <aside className="hidden lg:flex lg:col-span-4 flex-col space-y-8 sticky top-4 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
          <HubProfileSummary user={{ name: displayName, username, avatarUrl: user.profile.avatarUrl || undefined }} />

          {/* Section: Your Command Status (Budget/Progress) */}
          <section className="space-y-4">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
              Personal Directives
            </h3>
            <Card className="border-white/5 bg-white/[0.01] backdrop-blur-3xl rounded-sm p-8 space-y-8 shadow-2xl overflow-hidden border-x-0 sm:border-x">
              <HubProgressOverview />
              <div className="h-px bg-white/5 w-full" />
              <HubBudgetNode />
            </Card>
          </section>

          {/* Section: Temporal Coordinates */}
          <section className="space-y-4">
             <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
              Temporal Sync
            </h3>
            <Card className="border-white/5 bg-white/[0.01] backdrop-blur-3xl rounded-none sm:rounded-md p-8 shadow-2xl overflow-hidden border-x-0 sm:border-x">
              <HubCalendarNode />
            </Card>
          </section>

          {/* Section: Trending Signals */}
          <section className="space-y-4">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
              Vanguard Pulse
            </h3>
            <Card className="border-white/5 bg-white/[0.01] backdrop-blur-3xl rounded-none sm:rounded-md p-6 space-y-6 shadow-2xl overflow-hidden border-x-0 sm:border-x">
              {[
                { label: "Otaku Fest Props", trend: "+12 dispatches today", icon: <Sparkles className="size-4 text-primary" /> },
                { label: "Cebu Cosplay Expo", trend: "High recruitment frequency", icon: <Users className="size-4 text-secondary" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-all">
                  <div className="size-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">{item.label}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">{item.trend}</p>
                  </div>
                </div>
              ))}
            </Card>
          </section>

        </aside>
      </div>
    </div>
  )
}
