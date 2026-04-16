import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { 
  markNotificationAsReadAction, 
  markAllNotificationsAsReadAction 
} from '@/lib/actions/notification.actions';
import { NotificationService } from '@/lib/services/notification.service';
import { useEffect } from 'react';

const supabase = createClient();
const notificationService = new NotificationService(supabase);

/**
 * Hook: Fetches notifications with infinite scroll support
 */
export function useNotifications(userId: string | undefined) {
  return useInfiniteQuery({
    queryKey: ['notifications', userId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!userId) return [];
      return notificationService.getNotifications(userId, 20, pageParam as number);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) return undefined;
      return allPages.length * 20;
    },
    initialPageParam: 0,
    enabled: !!userId,
  });
}

/**
 * Hook: Retrieves real-time unread notification count
 * Subscribes to Supabase Realtime for instant signal manifestation.
 */
export function useUnreadCount(userId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications-count', userId],
    queryFn: async () => {
      if (!userId) return 0;
      return notificationService.getUnreadCount(userId);
    },
    enabled: !!userId,
    staleTime: 30000, // 30 seconds
  });

  // Real-time Sector Subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications-realtime:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT/UPDATE/DELETE)
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`,
        },
        () => {
          // Synchronize Both Count and Manifest instantly
          queryClient.invalidateQueries({ queryKey: ['notifications-count', userId] });
          queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return query;
}

/**
 * Hook: Acknowledges a single notification signal
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await markNotificationAsReadAction(notificationId);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (_, notificationId) => {
      // Recalibrate notification strata
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/**
 * Hook: Bulk acknowledges all unread alerts in the user's sector
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await markAllNotificationsAsReadAction();
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
