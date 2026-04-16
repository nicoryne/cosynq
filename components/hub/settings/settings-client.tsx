'use client';

import { useState } from 'react';
import { AuthUserDTO } from '@/lib/types/auth.types';
import { ProfileMatrix } from './profile-matrix';
import { SecuritySync } from './security-sync';
import { OrbitalHandle } from './orbital-handle';
import { LifecycleDirective } from './lifecycle-directive';
import { 
  UserCircle, 
  ShieldCheck, 
  AtSign, 
  ZapOff, 
  ChevronRight,
  Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsClientProps {
  user: AuthUserDTO;
}

type Quadrant = 'identity' | 'security' | 'handle' | 'lifecycle';

const NAV_ITEMS = [
  { id: 'identity', label: 'Profile Settings', icon: UserCircle, color: 'text-primary' },
  { id: 'security', label: 'Account Security', icon: ShieldCheck, color: 'text-blue-400' },
  { id: 'handle', label: 'Change Username', icon: AtSign, color: 'text-purple-400' },
  { id: 'lifecycle', label: 'Account Actions', icon: ZapOff, color: 'text-red-500' },
] as const;

export function SettingsClient({ user }: SettingsClientProps) {
  const [activeQuadrant, setActiveQuadrant] = useState<Quadrant>('identity');

  const renderQuadrant = () => {
    switch (activeQuadrant) {
      case 'identity': return <ProfileMatrix initialData={user.profile} />;
      case 'security': return <SecuritySync user={user} />;
      case 'handle': return <OrbitalHandle profile={user.profile} />;
      case 'lifecycle': return <LifecycleDirective />;
      default: return <ProfileMatrix initialData={user.profile} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[600px]">
      {/* Tactical Navigation Sidebar */}
      <aside className="w-full lg:w-72 shrink-0 space-y-2 lg:sticky lg:top-24 h-fit">
        <div className="hidden lg:block mb-6 px-4">
          <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
            <Settings2 className="size-3" />
            Control Navigation
          </div>
        </div>
        
        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 px-4 sm:px-0 no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeQuadrant === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveQuadrant(item.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative shrink-0 lg:w-full",
                  isActive 
                    ? "bg-white/5 text-foreground shadow-lg border border-white/5" 
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-white/[0.02]"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full hidden lg:block" />
                )}
                <Icon className={cn("size-5 transition-colors", isActive ? item.color : "group-hover:text-foreground")} />
                <span className={cn("text-xs font-bold uppercase tracking-widest", isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100")}>
                  {item.label}
                </span>
                <ChevronRight className={cn("size-3.5 ml-auto hidden lg:block transition-all", isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")} />
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Administrative Quadrant */}
      <main className="flex-1 min-w-0">
        <div className="animate-in fade-in slide-in-from-right-4 duration-700">
          {renderQuadrant()}
        </div>
      </main>
    </div>
  );
}
