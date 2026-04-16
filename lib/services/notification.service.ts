import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/database.types';
import { NotificationDTO, CreateNotificationParams } from '../types/notification.types';

/**
 * NotificationService - Core logic for in-app alert delivery and signal acknowledgement
 * Handles infinite pagination, real-time unread counts, and signal manifestations.
 */
export class NotificationService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Fetches paginated notifications (Infinite Scroll manifest)
   * Joins with user_profiles to retrieve actor metadata for high-fidelity UI.
   */
  async getNotifications(userId: string, limit = 20, offset = 0): Promise<NotificationDTO[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select(`
        *,
        actor:actor_id (
          username,
          avatar_url,
          display_name
        )
      `)
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    return (data || []).map((n: any) => ({
      id: n.id,
      recipientId: n.recipient_id,
      actorId: n.actor_id,
      type: n.type,
      entityType: n.entity_type,
      entityId: n.entity_id,
      content: n.content,
      metadata: n.metadata,
      isRead: n.is_read,
      readAt: n.read_at,
      createdAt: n.created_at,
      actor: n.actor ? {
        username: n.actor.username,
        avatarUrl: n.actor.avatar_url,
        displayName: n.actor.display_name
      } : undefined
    }));
  }

  /**
   * Retrieves the current unread signal count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) throw new Error(error.message);
    return count || 0;
  }

  /**
   * Acknowledges a single notification signal
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('recipient_id', userId);

    if (error) throw new Error(error.message);
  }

  /**
   * Performs bulk signal acknowledgement for all unread alerts in the user's sector
   */
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) throw new Error(error.message);
  }

  /**
   * Manifests a new notification alert (Internal use only)
   */
  async createNotification(params: CreateNotificationParams): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .insert({
        recipient_id: params.recipientId,
        actor_id: params.actorId || null,
        type: params.type,
        entity_type: params.entityType || null,
        entity_id: params.entityId || null,
        content: params.content || null,
        metadata: params.metadata || {}
      });

    if (error) throw new Error(error.message);
  }
}
