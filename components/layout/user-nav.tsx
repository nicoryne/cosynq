'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Settings, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useCurrentUser, useSignOut } from '@/lib/hooks/use-auth';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants/routes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserNavProps {
  className?: string;
}

export function UserNav({ className }: UserNavProps) {
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: signOut } = useSignOut();

  const isLandingPage = pathname === ROUTES.HOME;

  if (isLoading) {
    return (
      <div className={cn("h-10 w-10 animate-pulse rounded-full bg-muted/20 border border-white/5", className)} />
    );
  }

  if (!user) {
    return (
      <Button 
        asChild 
        variant="ghost" 
        size="sm" 
        className={cn(
          "rounded-xl px-4 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/10 shrink-0 border border-white/5",
          className
        )}
      >
        <Link href="/sign-in">Sign In</Link>
      </Button>
    );
  }

  const profile = user.profile;
  const avatarUrl = profile.avatarUrl;
  const displayName = profile.displayName || profile.username;

  return (
    <div className={cn("flex items-center", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none shrink-0 group relative outline-none border-none bg-transparent p-0">
             {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Avatar className={cn(
               "size-10 border-2 border-white/10 transition-all duration-300 hover:scale-105 active:scale-95 group-hover:border-primary/40 relative z-10",
               className
            )}>
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="font-black bg-gradient-to-br from-primary/20 to-secondary/20 text-[10px]">
                {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 border-white/10 bg-background/60 backdrop-blur-2xl p-2 shadow-2xl animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2" 
          align="end" 
          sideOffset={12}
          forceMount
        >
          {/* Premium Header Section */}
          <div className="flex flex-col items-center gap-3 p-4 mb-2 rounded-xl bg-white/5 border border-white/5 overflow-hidden relative">
            {/* Background Decorative Gradient */}
            <div className="absolute -top-10 -right-10 size-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 size-24 bg-secondary/20 rounded-full blur-2xl" />

            <Avatar className="size-14 border-2 border-white/10 shadow-xl">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="font-black text-xs bg-muted">
                 {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center space-y-0.5 relative z-10">
              <p className="text-sm font-black tracking-tight">{displayName}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                @{profile.username}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {isLandingPage ? (
              /* Simplified Landing Page View */
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 rounded-lg py-3 transition-colors">
                <Link href={ROUTES.HUB} className="flex items-center gap-3">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider">Go to Hub</span>
                </Link>
              </DropdownMenuItem>
            ) : (
              /* Full Platform View */
              <>
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 rounded-lg py-2.5 transition-colors">
                  <Link href={`/hub/u/${profile.username}`} className="flex items-center gap-3">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 rounded-lg py-2.5 transition-colors">
                  <Link href={ROUTES.SETTINGS} className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">Platform Settings</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator className="bg-white/5 mx-1 my-2" />
            
            <DropdownMenuItem
              className="cursor-pointer text-red-400 focus:bg-red-400/10 focus:text-red-400 rounded-lg py-2.5 transition-colors"
              onClick={() => signOut()}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
