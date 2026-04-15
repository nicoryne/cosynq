import { Navbar } from "@/components/layout/navbar"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { UserProfileService } from "@/lib/services/user-profile.service"
import { notFound } from "next/navigation"
import { Starfield } from "@/components/landing/starfield"
import Image from "next/image"
import { UserCircle, Calendar, Link as LinkIcon, MapPin, ExternalLink, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageProps {
  params: Promise<{ username: string }>
}

/**
 * Public User Profile Page
 * Requirements: 3.1, 3.2, 3.4, 3.5, 3.6 - Public profile display
 * Uses Next.js 15+ async params pattern
 */
export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const profileService = new UserProfileService(supabase)
  
  const profile = await profileService.getProfileByUsername(username)

  if (!profile) {
    notFound()
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="mx-auto max-w-5xl space-y-16">
      {/* Profile Header Card */}
      <div className="relative rounded-[3.5rem] glassmorphism p-10 md:p-16 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000">
         {/* Ethereal Glow Orbs internal */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 size-[500px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
          {/* Avatar Orbit - Enhanced */}
          <div className="relative shrink-0 group">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/50 via-secondary/50 to-primary/50 animate-spin-slow blur-xl opacity-40 group-hover:opacity-100 transition-opacity" />
            <div className="relative size-44 md:size-60 rounded-full border-4 border-white/10 overflow-hidden bg-background shadow-glow-primary">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName || profile.username}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                  <UserCircle className="size-32 text-muted-foreground/20" />
                </div>
              )}
            </div>
            {/* Status Badge */}
            <div className="absolute bottom-4 right-4 size-8 rounded-2xl bg-primary shadow-glow-primary border-4 border-background flex items-center justify-center">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
          </div>

          {/* Identity Info */}
          <div className="space-y-8 flex-1">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Celestial Citizen
              </div>
              <h1 className="font-heading text-6xl md:text-7xl font-bold tracking-tighter leading-none">
                {profile.displayName || profile.username}
              </h1>
              <p className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transform-gpu">
                @{profile.username}
              </p>
            </div>

            {profile.bio ? (
              <div className="relative px-6 py-4 glassmorphism rounded-3xl border-white/5">
                <p className="text-muted-foreground text-xl leading-relaxed italic font-medium">
                  "{profile.bio}"
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground/40 italic font-medium text-lg">A mysterious traveler in the cosynq universe...</p>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-8 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 pt-6">
              <div className="flex items-center gap-3 transition-colors hover:text-primary group">
                <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Calendar className="size-4 text-primary" />
                </div>
                <span>Orbit Start: {joinDate}</span>
              </div>
              {profile.location && (
                <div className="flex items-center gap-3 transition-colors hover:text-secondary group">
                  <div className="size-8 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <MapPin className="size-4 text-secondary" />
                  </div>
                  <span>Sector: {profile.location}</span>
                </div>
              )}
               {profile.website && (
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 hover:text-primary transition-all group"
                >
                   <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <LinkIcon className="size-4 text-primary group-hover:rotate-12 transition-transform" />
                  </div>
                  <span className="underline underline-offset-8 decoration-primary/30 group-hover:decoration-primary">Station Frequency</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Content Tabs / Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
        {/* Sidebar Stats */}
        <aside className="space-y-8">
          <div className="p-10 rounded-[3rem] glassmorphism shadow-xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-primary italic">Status Calibration</h3>
            <div className="space-y-8">
               <div className="space-y-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Ranking</p>
                <p className="text-3xl font-black font-heading tracking-tighter italic text-foreground group-hover:text-primary transition-colors">Star Dreamer</p>
              </div>
               <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <p className="text-muted-foreground">Celestial Resonance</p>
                  <p className="text-primary">15%</p>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-2xl overflow-hidden p-1 border border-white/5">
                  <div className="h-full w-[15%] bg-gradient-to-r from-primary to-secondary rounded-xl shadow-glow-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Feed / Content */}
        <section className="lg:col-span-2 space-y-8">
          <div className="relative group p-20 rounded-[3rem] border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center space-y-8 transition-all hover:bg-white/[0.03] hover:border-white/10">
            <div className="size-24 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform duration-700 shadow-2xl">
              <Sparkles className="size-10 text-muted-foreground/20 group-hover:text-primary/50 transition-colors" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black italic tracking-tighter text-muted-foreground/60 transition-colors group-hover:text-muted-foreground">Signal Lost...</h3>
              <p className="text-muted-foreground/40 max-w-sm font-bold text-lg leading-relaxed">
                This citizen hasn't transmitted any chronicles to the Nexus yet. Standing by for manifest...
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
