/**
 * Notification System Types & DTOs
 * Grounded terminology for alert delivery across the sanctuary
 */

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'system' | 'group_invite';

export interface NotificationDTO {
  id: string;
  recipientId: string;
  actorId: string | null;
  type: NotificationType;
  entityType: string | null;
  entityId: string | null;
  content: string | null;
  metadata: Record<string, any>;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  // Synthesized data for high-fidelity UI
  actor?: {
    username: string;
    avatarUrl: string | null;
    displayName: string | null;
  };
}

export interface CreateNotificationParams {
  recipientId: string;
  actorId?: string;
  type: NotificationType;
  entityType?: string;
  entityId?: string;
  content?: string;
  metadata?: Record<string, any>;
}
