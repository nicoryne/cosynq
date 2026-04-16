'use client';

import { Search } from 'lucide-react';
import { UserNav } from '@/components/layout/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { HubCommandDrawer } from './hub-command-drawer';
import { NotificationsDropdown } from './notifications-dropdown';
import React from 'react';
import { SearchDropdown } from './search-dropdown';

interface HubHeaderProps {
  className?: string;
}

export function HubHeader({ className }: HubHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  // Close search manifest when clicking outside the Command Center
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={cn(
      "h-20 w-full flex items-center justify-between px-6 md:px-8 z-40 relative sticky top-0 bg-background/50 backdrop-blur-xl border-b border-white/5",
      className
    )}>
      {/* Navigation Trigger - Command Drawer */}
      <div className="mr-4">
        <HubCommandDrawer />
      </div>

      {/* Search Bar - Aesthetic Focus & Logic Manifest */}
      <div className="flex-1 max-w-xl hidden md:block group relative" ref={searchRef}>
        <div className="relative">
          <Input 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="h-12 pl-24 pr-4 rounded-2xl border-foreground/5 bg-foreground/[0.03] focus:bg-foreground/[0.05] focus:ring-primary/20 focus:border-primary/20 transition-all text-sm font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-3 text-muted-foreground group-focus-within:text-primary transition-colors" />

          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
             <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Global Discovery Manifest */}
        <SearchDropdown 
          query={searchQuery} 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-3">
        <NotificationsDropdown />
        
        <ThemeToggle className="size-11 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08]" />
        
        <div className="h-8 w-px bg-white/10 mx-2" />
        
        <UserNav />
      </div>
    </header>
  );
}