'use client';

import { Search, Bell } from 'lucide-react';
import { UserNav } from '@/components/layout/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  className?: string;
}

export function DashboardHeader({ className }: DashboardHeaderProps) {
  return (
    <header className={cn(
      "h-20 w-full flex items-center justify-between px-8 z-40 relative sticky top-0",
      className
    )}>
      {/* Search Bar - Aesthetic Focus */}
      <div className="flex-1 max-w-xl hidden md:block group">
        <div className="relative">
          <Input 
            placeholder="Search celestial archives..." 
            className="h-12 pl-12 pr-4 rounded-2xl border-white/5 bg-white/[0.03] focus:bg-white/[0.05] focus:ring-primary/20 focus:border-primary/20 transition-all text-sm font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
             <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      {/* Global Actions */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-11 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all relative"
        >
          <Bell className="size-5" />
          <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-primary shadow-glow-primary border-2 border-background" />
        </Button>
        
        <ThemeToggle className="size-11 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08]" />
        
        <div className="h-8 w-px bg-white/10 mx-2" />
        
        <UserNav />
      </div>
    </header>
  );
}
