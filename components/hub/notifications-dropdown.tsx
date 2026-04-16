"use client"

import * as React from "react"
import { Bell, CheckCheck, Settings } from "lucide-react"
import { 
  useNotifications, 
  useUnreadCount, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead 
} from "@/lib/hooks/use-notifications"
import { useCurrentUser } from "@/lib/hooks/use-auth"
import { getRelativeTime } from "@/lib/utils/time.utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * NotificationsDropdown - High-fidelity alert center for the Command Center
 * Handles real-time unread signals, on-demand infinite fetching, and signal acknowledgement.
 */
export function NotificationsDropdown() {
  const { data: user } = useCurrentUser()
  const { data: unreadCount } = useUnreadCount(user?.id)
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useNotifications(user?.id)
  
  const { mutate: markAsRead } = useMarkNotificationAsRead()
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead()

  const notifications = data?.pages.flatMap((page) => page) || []

  const handleMarkAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    markAllAsRead()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-11 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all relative group"
        >
          <Bell className="size-5 group-hover:text-primary transition-colors" />
          {unreadCount !== undefined && unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-primary shadow-glow-primary border-2 border-background animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0 glassmorphism border-white/10" align="end">
        {/* Header manifest */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h4 className="text-sm font-black uppercase tracking-widest">Notifications</h4>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-8 rounded-lg hover:bg-white/5"
              onClick={handleMarkAll}
              disabled={unreadCount === 0}
              title="Mark all as read"
            >
              <CheckCheck className="size-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-8 rounded-lg hover:bg-white/5"
            >
              <Settings className="size-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Signal Feed */}
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-2 opacity-50">
              <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
                <Bell className="size-6" />
              </div>
              <p className="text-sm font-black italic tracking-tight">No alerts in your orbit</p>
              <p className="text-[10px] uppercase tracking-widest">You're all caught up</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  className={cn(
                    "flex gap-3 p-4 text-left hover:bg-white/[0.03] transition-colors border-b border-white/5 last:border-0",
                    !n.isRead && "bg-primary/[0.02]"
                  )}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                >
                  <Avatar className="size-10 border border-white/5">
                    <AvatarImage src={n.actor?.avatarUrl || ""} />
                    <AvatarFallback className="text-[10px] font-black uppercase">
                      {n.actor?.username?.slice(0, 2) || "SY"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                       <p className="text-sm leading-tight text-foreground/90">
                        <span className="font-black">@{n.actor?.username || "System"}</span>{" "}
                        {renderNotificationContent(n)}
                      </p>
                      {!n.isRead && (
                        <div className="size-1.5 rounded-full bg-primary mt-1 shrink-0 shadow-glow-primary" />
                      )}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                      {getRelativeTime(n.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
              
              {hasNextPage && (
                <Button
                  variant="ghost"
                  className="w-full h-12 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-white/5"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Analyzing more signals..." : "Load Older Alerts"}
                </Button>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Renders the localized content string based on signal type
 */
function renderNotificationContent(n: any) {
  switch (n.type) {
    case 'like':
      return `liked your ${n.entityType || 'post'}`;
    case 'comment':
      return `commented on your ${n.entityType || 'post'}`;
    case 'follow':
      return `is now following your journey`;
    case 'mention':
      return `mentioned you in a ${n.entityType || 'post'}`;
    case 'group_invite':
      return `invited you to join a new group`;
    default:
      return n.content || 'transmitted a signal';
  }
}
