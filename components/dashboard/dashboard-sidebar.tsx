'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Zap, 
  Users, 
  Calendar, 
  Settings,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DASHBOARD_NAV_LINKS } from '@/lib/constants/navigation';
import { Button } from '@/components/ui/button';
import { useSignOut } from '@/lib/hooks/use-auth';

interface DashboardSidebarProps {
  className?: string;
}

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  Zap,
  Users,
  Calendar,
  Settings,
};

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { mutate: signOut } = useSignOut();

  return (
    <aside className={cn(
      "w-72 h-screen flex flex-col glassmorphism border-r border-white/5 relative z-50",
      className
    )}>
      {/* Sidebar Glow */}
      <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Brand Section */}
      <div className="p-8 pb-12">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="size-10 rounded-2xl bg-primary/20 flex items-center justify-center shadow-glow-primary group-hover:scale-110 transition-transform">
             <Sparkles className="size-5 text-primary" />
          </div>
          <span className="font-heading font-black text-2xl tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            cosynq
          </span>
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-4 space-y-10 overflow-y-auto custom-scrollbar">
        {/* Main Orbit */}
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-4 italic">
            Orbital Directives
          </p>
          {DASHBOARD_NAV_LINKS.slice(0, 4).map((link) => {
            const Icon = ICON_MAP[link.icon] || LayoutDashboard;
            const isActive = pathname === link.href;

            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-glow-primary/5 border border-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-4">
                  <Icon className={cn(
                    "size-5 transition-transform duration-500 group-hover:scale-110",
                    isActive ? "text-primary" : "group-hover:text-primary"
                  )} />
                  <span className="text-sm font-black uppercase tracking-widest leading-none">
                    {link.label}
                  </span>
                </div>
                {isActive && (
                  <ChevronRight className="size-4 animate-in slide-in-from-left-2" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Support & Configuration */}
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-4 italic">
            System Config
          </p>
          {DASHBOARD_NAV_LINKS.slice(4).map((link) => {
            const Icon = ICON_MAP[link.icon] || LayoutDashboard;
            const isActive = pathname === link.href;

            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                  isActive 
                    ? "bg-secondary/10 text-secondary shadow-glow-secondary/5 border border-secondary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "size-5 transition-transform duration-500 group-hover:scale-110",
                  isActive ? "text-secondary" : "group-hover:text-secondary"
                )} />
                <span className="text-sm font-black uppercase tracking-widest leading-none">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 mt-auto border-t border-white/5">
        <Button 
          variant="ghost" 
          onClick={() => signOut()}
          className="w-full flex items-center justify-start gap-4 h-14 rounded-2xl hover:bg-red-500/10 hover:text-red-500 group transition-all"
        >
          <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-red-500/20">
            <LogOut className="size-4" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">
            De-Orbit (Logout)
          </span>
        </Button>
      </div>
    </aside>
  );
}
