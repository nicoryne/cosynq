import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/database.types';
import { UserProfileDTO } from '@/lib/types/auth.types';
import { AvailabilityService } from './availability.service';

/**
 * UserService - Handles user-related operations excluding core authentication
 * Manages identity updates with mandatory temporal guards (cooldowns)
 */
export class UserService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Updates the galactic handle (username) with a mandatory 30-day interval check
   * @param userId - UUID of the user
   * @param newUsername - The new handle to manifest
   * @returns Updated profile or throws an error with cooldown info
   */
  async updateUsername(userId: string, newUsername: string): Promise<UserProfileDTO> {
    // 1. Fetch current telemetry to check cooldown (from isolated telemetry table)
    const { data: telemetry, error: telemetryError } = await this.supabase
      .from('account_telemetry')
      .select('username_last_changed_at')
      .eq('id', userId)
      .single();

    if (telemetryError || !telemetry) {
      throw new Error('Failed to synchronize administrative telemetry');
    }

    // 2. Fetch current profile to check handle manifest
    const { data: profile, error: profileError } = await this.supabase
      .from('user_profiles')
      .select('username')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('Failed to synchronize profile manifest');
    }

    // 3. Already the same handle? No action needed.
    if (profile.username === newUsername) {
      throw new Error('This handle is already synchronized with your manifest');
    }

    // 4. Availability Intercept: Check if the handle is already claimed
    const availabilityService = new AvailabilityService(this.supabase);
    const availability = await availabilityService.checkUsernameAvailability(newUsername);
    if (!availability.available) {
      throw new Error('This handle is already claimed by another traveler');
    }

    // 5. Interval Guard: Check if 30 days have elapsed since last change
    if (telemetry.username_last_changed_at) {
      const lastChange = new Date(telemetry.username_last_changed_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (lastChange > thirtyDaysAgo) {
        const daysRemaining = Math.ceil(
          (lastChange.getTime() - thirtyDaysAgo.getTime()) / (1000 * 60 * 60 * 24)
        );
        throw new Error(`Handle recalibration locked. Cooldown clears in ${daysRemaining} days.`);
      }
    }

    // 6. Persistence Refit: Update handle (public) and temporal markers (private)
    // Using a simple transaction-like flow (sequential updates since RLS allows)
    const updateProfile = this.supabase
      .from('user_profiles')
      .update({ username: newUsername })
      .eq('id', userId);

    const updateTelemetry = this.supabase
      .from('account_telemetry')
      .update({ username_last_changed_at: new Date().toISOString() })
      .eq('id', userId);

    const [profileRes, telemetryRes] = await Promise.all([updateProfile, updateTelemetry]);

    if (profileRes.error) {
      if (profileRes.error.message.includes('duplicate key')) {
        throw new Error('This handle is already claimed by another traveler');
      }
      throw new Error('Failed to manifest new handle. Transmission error.');
    }

    if (telemetryRes.error) {
      throw new Error('Failed to update administrative telemetry.');
    }

    // 7. Get final merged manifest for DTO (Asynchronous Synthesis)
    const profilePromise = this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const telemetryPromise = this.supabase
      .from('account_telemetry')
      .select('username_last_changed_at, deactivated_at')
      .eq('id', userId)
      .single();

    const [finalProfileRes, finalTelemetryRes] = await Promise.all([profilePromise, telemetryPromise]);

    if (finalProfileRes.error || !finalProfileRes.data) {
      throw new Error('Failed to synthesize identity manifest after recalibration.');
    }

    const finalProfile = finalProfileRes.data;
    const finalTelemetry = finalTelemetryRes.data;

    return {
      id: finalProfile.id,
      username: finalProfile.username,
      displayName: finalProfile.display_name,
      bio: finalProfile.bio,
      avatarUrl: finalProfile.avatar_url,
      location: finalProfile.location,
      website: finalProfile.website,
      facebookUrl: finalProfile.facebook_url,
      createdAt: finalProfile.created_at,
      usernameLastChangedAt: finalTelemetry?.username_last_changed_at || null,
      deactivatedAt: finalTelemetry?.deactivated_at || null,
    };
  }

  /**
   * Searches for user profiles based on a fuzzy query (username or display name)
   * @param query - The search term to analyze
   * @param limit - Max results to return (default 10)
   */
  async searchProfiles(query: string, limit: number = 10): Promise<Partial<UserProfileDTO>[]> {
    if (!query || query.length < 2) return [];

    // Search for both handle and display manifest using ilike signals
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('id, username, display_name, avatar_url')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Search transmission failure:', error);
      return [];
    }

    return data.map(profile => ({
      id: profile.id,
      username: profile.username,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
    }));
  }
}
