import { Navbar } from "@/components/layout/navbar"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { AuthService } from "@/lib/services/auth.service"
import { redirect } from "next/navigation"
import { Starfield } from "@/components/landing/starfield"
import { cn } from "@/lib/utils"
import { getRelativeTime } from "@/lib/utils/time.utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Users, 
  Calendar, 
  Zap,
  Plus,
  UserPlus,
  TrendingUp,
  Clock
} from "lucide-react"
import Link from "next/link"

/**
 * Dashboard Page
 * Requirements: 12.1-12.6 - User command center with stats, activity feed, and CTAs
 */
export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const authService = new AuthService(supabase)
  const user = await authService.getCurrentUser()

  // Redirect if not authenticated
  if (!user) {
    redirect("/sign-in")
  }

  const displayName = user.profile.displayName || user.profile.username
  const initials = displayName.slice(0, 2).toUpperCase()

  // Mock data for stats and activity (will be replaced with real data later)
  const stats = {
    cosplans: 0,
    groups: 0,
    events: 0,
  }

  const recentActivity = [
    {
      id: 1,
      type: 'profile',
      message: 'Profile created',
      timestamp: user.createdAt,
      icon: <Sparkles className="size-4" />,
    },
  ]

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      <Navbar />
      <Starfield />

      {/* Atmospheric Background Blurs - Hidden from screen readers */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden="true">
        <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <main id="main-content" className="relative z-10 container mx-auto px-6 pt-32 pb-24">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* User Greeting with Avatar */}
          <header className="flex items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Avatar size="lg" className="shadow-glow-primary">
              <AvatarImage src={user.profile.avatarUrl || undefined} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                Welcome back, <span className="italic text-primary">{displayName}</span>
              </h1>
              <p className="text-muted-foreground text-base font-medium">
                Your celestial command center awaits
              </p>
            </div>
          </header>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <Card size="sm" className="shadow-glow-primary">
              <CardContent className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    Cosplans
                  </p>
                  <p className="text-4xl font-black text-primary">
                    {stats.cosplans}
                  </p>
                </div>
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Zap className="size-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card size="sm" className="shadow-glow-secondary">
              <CardContent className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    Groups
                  </p>
                  <p className="text-4xl font-black text-secondary">
                    {stats.groups}
                  </p>
                </div>
                <div className="size-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <Users className="size-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card size="sm" className="shadow-glow-primary">
              <CardContent className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    Events
                  </p>
                  <p className="text-4xl font-black text-accent">
                    {stats.events}
                  </p>
                </div>
                <div className="size-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Calendar className="size-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Feed */}
            <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <TrendingUp className="size-6 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-background/50 border border-white/5 hover:border-primary/20 transition-all"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        {activity.icon}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Clock className="size-3" />
                          {getRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {recentActivity.length === 1 && (
                    <div className="py-12 text-center space-y-3">
                      <div className="size-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto">
                        <TrendingUp className="size-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Your activity feed will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* CTA Cards */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-450">
              <Card size="sm" className="group hover:shadow-glow-primary transition-all duration-500">
                <CardContent className="space-y-6">
                  <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                    <Plus className="size-7 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-heading text-xl font-black tracking-tighter">
                      Create Cosplan
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Start a new project and bring your vision to life
                    </p>
                  </div>
                  <Button 
                    variant="celestial" 
                    size="lg" 
                    className="w-full"
                    asChild
                  >
                    <Link href="#">
                      <Sparkles className="size-4" />
                      Coming Soon
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card size="sm" className="group hover:shadow-glow-secondary transition-all duration-500">
                <CardContent className="space-y-6">
                  <div className="size-14 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:scale-110 transition-all">
                    <UserPlus className="size-7 text-secondary group-hover:text-secondary-foreground" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-heading text-xl font-black tracking-tighter">
                      Join Groups
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Connect with fellow cosplayers and collaborate
                    </p>
                  </div>
                  <Button 
                    variant="celestial" 
                    size="lg" 
                    className="w-full border-secondary text-secondary hover:bg-secondary shadow-glow-secondary"
                    asChild
                  >
                    <Link href="#">
                      <Sparkles className="size-4" />
                      Coming Soon
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
