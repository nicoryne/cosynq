'use client';

import Link from 'next/link';
import { User, Settings, LogOut, UserCircle } from 'lucide-react';
import Image from 'next/image';
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

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserNavProps {
  className?: string;
}

export function UserNav({ className }: UserNavProps) {
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: signOut } = useSignOut();

  if (isLoading) {
    return (
      <div className={cn("h-8 w-8 animate-pulse rounded-full bg-muted/20", className)} />
    );
  }

  if (!user) {
    return (
      <Button 
        asChild 
        variant="ghost" 
        size="sm" 
        className={cn(
          "rounded-xl px-4 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/10 shrink-0",
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
          <button className="focus:outline-none shrink-0 group">
            <Avatar className={cn(
               "size-10 border-2 border-white/10 transition-all hover:scale-110 active:scale-95 group-hover:border-primary/50 group-hover:shadow-glow-primary",
               className
            )}>
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="font-black bg-gradient-to-br from-primary/20 to-secondary/20">
                {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 border-white/10 bg-background/80 backdrop-blur-xl" 
          align="end" 
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                @{profile.username}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/5">
            <Link href={`/hub/u/${profile.username}`}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/5">
            <Link href="/hub/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
