"use client"

import * as React from "react"
import { Search, User, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSearchUsers } from "@/lib/hooks/use-search"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SearchDropdownProps {
  query: string
  isOpen: boolean
  onClose: () => void
}

/**
 * SearchDropdown - High-fidelity discovery manifest for the Command Center
 * Animates results from the debounced search hook.
 */
export function SearchDropdown({ query, isOpen, onClose }: SearchDropdownProps) {
  const router = useRouter()
  const { data: results, isLoading, isFetching } = useSearchUsers(query)

  // Only manifest if the signal is significant
  if (!isOpen || query.length < 2) return null

  const handleNavigate = (username: string) => {
    router.push(`/profile/${username}`)
    onClose()
  }

  return (
    <div className="absolute top-full left-0 w-full mt-2 glassmorphism border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Manifest Status Sector */}
      <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-1">
          {isLoading ? "Analyzing signals..." : `Found ${results?.length || 0} travelers`}
        </p>
        {isFetching && <Loader2 className="size-3 animate-spin text-primary" />}
      </div>
      
      {/* Results Stratum */}
      <ScrollArea className="max-h-[300px]">
        {isLoading ? (
          <div className="p-2 space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 p-2 items-center">
                <Skeleton className="size-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-2 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : !results || results?.length === 0 ? (
          <div className="p-8 text-center space-y-2 opacity-50">
            <Search className="size-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm font-black italic tracking-tight">No travelers discovered</p>
            <p className="text-[10px] uppercase tracking-widest">Adjust your search signal</p>
          </div>
        ) : (
          <div className="p-1">
            {results?.map((user) => (
              <button
                key={user.id}
                type="button"
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-all text-left group"
                onClick={() => handleNavigate(user.username!)}
              >
                <Avatar className="size-9 border border-white/5 shadow-inner">
                  <AvatarImage src={user.avatarUrl || ""} />
                  <AvatarFallback className="text-[10px] font-black uppercase bg-white/5 text-muted-foreground">
                    {user.username?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate group-hover:text-primary transition-colors leading-tight">
                    {user.displayName || user.username}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-black mt-0.5">
                    @{user.username}
                  </p>
                </div>
                <User className="size-4 text-muted-foreground/20 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0" />
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
