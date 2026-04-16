'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { NotificationService } from '@/lib/services/notification.service';
import { ActionResponse } from './role.actions';

/**
 * Ensures the requesting traveler is authenticated
 * @returns User ID of the authenticated traveler
 */
async function requireAuth(): Promise<string> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Authentication required to recalibrate notification strata.');
  }

  return user.id;
}

/**
 * Acknowledges a specific notification signal
 */
export async function markNotificationAsReadAction(
  notificationId: string
): Promise<ActionResponse> {
  try {
    const userId = await requireAuth();

    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const notificationService = new NotificationService(supabase);

    await notificationService.markAsRead(notificationId, userId);

    // Revalidate the hub sector to refresh counts and manifests
    revalidatePath('/hub');

    return {
      success: true,
      message: 'Notification acknowledged successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to acknowledge notification signal',
    };
  }
}

/**
 * Performs bulk acknowledgement of all unread alerts in the user's sector
 */
export async function markAllNotificationsAsReadAction(): Promise<ActionResponse> {
  try {
    const userId = await requireAuth();

    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const notificationService = new NotificationService(supabase);

    await notificationService.markAllAsRead(userId);

    // Revalidate the entire hub sector
    revalidatePath('/hub');

    return {
      success: true,
      message: 'All notifications acknowledged successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to synchronize notification manifest',
    };
  }
}
