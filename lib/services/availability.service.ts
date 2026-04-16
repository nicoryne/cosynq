// =====================================================================
// Availability Service Layer
// =====================================================================
// Core business logic for checking email and username availability
// Implements "Do Not Trust The Client" paradigm with strict validation

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { AvailabilityResult } from '@/lib/types/auth.types';

/**
 * AvailabilityService - Centralized service for availability checks
 * Handles email and username uniqueness validation with proper security
 */
export class AvailabilityService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async checkEmailAvailability(email: string): Promise<AvailabilityResult> {
    try {
      // Use the newly created secure RPC function to check email existence
      // This prevents the slow and unauthorized listing of all users
      const { data: emailExists, error } = await this.supabase.rpc(
        'check_email_exists',
        { lookup_email: email }
      );

      if (error) {
        throw new Error(`Failed to check email availability: ${error.message}`);
      }

      if (emailExists) {
        return {
          available: false,
          message: 'This email is already registered',
        };
      }

      return {
        available: true,
        message: 'Email is available',
      };
    } catch (error) {
      throw new Error(
        `Email availability check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Checks if a username is available for registration
   * Queries user_profiles table to verify username uniqueness
   * @param username - Username to check
   * @returns AvailabilityResult with availability status and message
   * @throws Error if database operation fails
   */
  async checkUsernameAvailability(username: string): Promise<AvailabilityResult> {
    try {
      // Use the newly created secure RPC function to check username existence
      // This prevents the RLS-blocked SELECT query from falsely indicating all usernames are free
      const { data: usernameExists, error } = await this.supabase.rpc(
        'check_username_exists',
        { lookup_username: username }
      );

      if (error) {
        throw new Error(`Failed to check username availability: ${error.message}`);
      }

      if (usernameExists) {
        return {
          available: false,
          message: 'This username is taken',
        };
      }

      return {
        available: true,
        message: 'Username is available',
      };
    } catch (error) {
      throw new Error(
        `Username availability check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Checks if a Facebook Profile URL is already linked to a profile
   * Queries user_profiles table using canonicalized URL
   * @param facebookUrl - Facebook URL to check
   * @returns AvailabilityResult with availability status and message
   */
  async checkFacebookUrlAvailability(facebookUrl: string): Promise<AvailabilityResult> {
    try {
      const { data: urlExists, error } = await this.supabase.rpc(
        'check_facebook_url_exists',
        { lookup_url: facebookUrl }
      );

      if (error) {
        throw new Error(`Failed to check facebook identity: ${error.message}`);
      }

      if (urlExists) {
        return {
          available: false,
          message: 'This identity is already linked to another account',
        };
      }

      return {
        available: true,
        message: 'Identity is available',
      };
    } catch (error) {
      throw new Error(
        `Facebook availability check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
