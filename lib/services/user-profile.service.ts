// =====================================================================
// User Profile Service Layer
// =====================================================================
// Core business logic for profile retrieval and management
// Requirements: 3.1, 3.2, 3.4, 3.5, 3.6, 6.1, 6.2, 6.3

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/database.types';
import { UserProfileDTO } from '@/lib/types/auth.types';

/**
 * UserProfileService - Centralized service for User Profile operations
 */
export class UserProfileService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Fetches a user profile by its unique username handle
   * Requirements: 3.1 - Profile retrieval, 3.5 - Search/Handle lookup
   * @param username - The unique @handle to look up
   * @returns UserProfileDTO or null if not found
   */
  async getProfileByUsername(username: string): Promise<UserProfileDTO | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*, account_telemetry(username_last_changed_at, deactivated_at)')
        .eq('username', username)
        .single();

      if (error || !data) {
        if (error?.code !== 'PGRST116') { // Not found error code
          console.error('Failed to fetch profile by username:', error);
        }
        return null;
      }

      // Map database record to DTO
      return {
        id: data.id,
        username: data.username,
        displayName: data.display_name,
        bio: data.bio,
        avatarUrl: data.avatar_url,
        location: data.location,
        website: data.website,
        facebookUrl: data.facebook_url,
        usernameLastChangedAt: (data as any).account_telemetry?.username_last_changed_at || null,
        deactivatedAt: (data as any).account_telemetry?.deactivated_at || null,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Unexpected error in getProfileByUsername:', error);
      return null;
    }
  }

  /**
   * Fetches a user profile by UUID
   * @param id - User UUID
   * @returns UserProfileDTO or null if not found
   */
  async getProfileById(id: string): Promise<UserProfileDTO | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*, account_telemetry(username_last_changed_at, deactivated_at)')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        username: data.username,
        displayName: data.display_name,
        bio: data.bio,
        avatarUrl: data.avatar_url,
        location: data.location,
        website: data.website,
        facebookUrl: data.facebook_url,
        usernameLastChangedAt: (data as any).account_telemetry?.username_last_changed_at || null,
        deactivatedAt: (data as any).account_telemetry?.deactivated_at || null,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Unexpected error in getProfileById:', error);
      return null;
    }
  }
}
