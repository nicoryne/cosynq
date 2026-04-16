// =====================================================================
// Authentication Service Layer
// =====================================================================
// Core business logic for user authentication and registration
// Implements "Do Not Trust The Client" paradigm with strict validation

import type { SupabaseClient, EmailOtpType } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type {
  SignUpFormData,
  AuthOperationResult,
  AuthUserDTO,
  UserProfileDTO,
} from '@/lib/types/auth.types';
import { canonicalizeFacebookUrl } from '@/lib/utils/url.utils';
import { AvailabilityService } from './availability.service';

/**
 * AuthService - Centralized service for authentication operations
 * Handles user registration, sign-in, sign-out, and email verification
 */
export class AuthService {
  private availabilityService: AvailabilityService;

  constructor(private supabase: SupabaseClient<Database>) {
    this.availabilityService = new AvailabilityService(supabase);
  }

  /**
   * Creates a new user account with email, password, and profile data
   * @param data - Sign-up form data including email, username, password, and optional profile fields
   * @param adminClient - Optional administrative client to bypass RLS during registration
   * @returns AuthOperationResult with user data or error message
   */
  async signUp(
    data: SignUpFormData,
    adminClient?: SupabaseClient<Database>
  ): Promise<AuthOperationResult> {
    try {
      // Step 1 & 2: Re-verify email and username availability
      const emailCheck = await this.availabilityService.checkEmailAvailability(data.email);
      if (!emailCheck.available) {
        return { success: false, message: 'An account with this email already exists' };
      }

      const usernameCheck = await this.availabilityService.checkUsernameAvailability(data.username);
      if (!usernameCheck.available) {
        return { success: false, message: 'This username is already taken' };
      }

      // Step 3: Create user via Supabase Auth with metadata for the trigger
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          data: {
            username: data.username,
            display_name: data.displayName || data.username,
          },
        },
      });

      if (authError) throw new Error(`Failed to create user account: ${authError.message}`);
      if (!authData.user) throw new Error('User creation failed: No user data returned');

      // Step 4: Update user_profiles record with extended data (Bio, Avatar)
      // We use the adminClient if provided to bypass RLS since the user 
      // is not yet "verified" in the eyes of standard RLS policies.
      const persistenceClient = adminClient || this.supabase;
      
      const { error: profileError } = await persistenceClient
        .from('user_profiles')
        .upsert({
          id: authData.user.id,
          username: data.username,
          display_name: data.displayName || null,
          bio: data.bio || null,
          facebook_url: data.facebookUrl ? canonicalizeFacebookUrl(data.facebookUrl) : '',
          avatar_url: data.avatarUrl || null,
          avatar_public_id: data.avatarPublicId || null,
        }, { onConflict: 'id' });

      if (profileError) {
        console.error('Failed to update user profile:', profileError);
        // We don't delete the user here anymore to avoid race conditions with the trigger
        // The trigger should have at least created the basic profile.
      }

      // Step 5: Fetch the complete user profile for the response
      const { data: profileData, error: fetchError } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (fetchError || !profileData) {
        console.error('Failed to fetch user profile:', fetchError);
        // User was created successfully, but we couldn't fetch the profile
        // Return success with minimal data
        return {
          success: true,
          message: 'Account created successfully. Please verify your email.',
          requiresVerification: true,
          data: {
            id: authData.user.id,
            email: authData.user.email!,
            emailConfirmed: authData.user.email_confirmed_at !== null,
            createdAt: authData.user.created_at,
            profile: {
              id: authData.user.id,
              username: data.username,
              displayName: data.displayName || null,
              bio: data.bio || null,
              avatarUrl: data.avatarUrl || null,
              facebookUrl: (data as any).facebookUrl || null,
              location: null,
              website: null,
              usernameLastChangedAt: null,
              deactivatedAt: null,
              createdAt: authData.user.created_at,
            },
          },
        };
      }

      // Step 6: Build and return the AuthUserDTO
      const userDTO: AuthUserDTO = {
        id: authData.user.id,
        email: authData.user.email!,
        emailConfirmed: authData.user.email_confirmed_at !== null,
        createdAt: authData.user.created_at,
        profile: {
          id: profileData.id,
          username: profileData.username,
          displayName: profileData.display_name,
          bio: profileData.bio,
          avatarUrl: profileData.avatar_url,
          location: profileData.location,
          website: profileData.website,
          facebookUrl: profileData.facebook_url,
          usernameLastChangedAt: null,
          deactivatedAt: null,
          createdAt: profileData.created_at,
        },
      };

      return {
        success: true,
        message: 'Account created successfully. Please verify your email.',
        requiresVerification: true,
        data: userDTO,
      };
    } catch (error) {
      // 1. Diagnostic Logging (Local Only)
      if (process.env.NODE_ENV === 'development') {
        console.error('Sign-up service error:', error);
      }
      
      // 2. Handle Expected User Errors (Show in all environments)
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('already registered')) {
          return { success: false, message: 'An account with this email already exists' };
        }
        if (error.message.toLowerCase().includes('already been taken')) {
          return { success: false, message: 'This username is already taken' };
        }
      }

      // 3. Security Masking (Internal Failures in Production)
      if (process.env.NODE_ENV === 'production') {
        return { 
          success: false, 
          message: 'An unexpected transmission error occurred. Please try again later.' 
        };
      }


      // Fallback for non-Error objects
      console.error('Unknown sign-up error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  /**
   * Authenticates a user with email/username and password
   * @param emailOrUsername - User's email or username
   * @param password - User's password
   * @returns AuthOperationResult with JWT and user data
   * @throws Error if credentials are invalid or email is not verified
   */
  async signIn(
    emailOrUsername: string,
    password: string,
    adminClient?: SupabaseClient<Database>
  ): Promise<AuthOperationResult> {
    try {
      // Step 1: Determine if input is email or username
      let email = emailOrUsername;
      const isEmail = emailOrUsername.includes('@');

      // Step 2: If username provided, resolve to email
      if (!isEmail) {
        // Use admin client if provided, otherwise fall back to standard client
        const resolutionClient = adminClient || this.supabase;

        // 1. Resolve username to user ID via user_profiles
        const { data: profileData, error: profileError } = await resolutionClient
          .from('user_profiles')
          .select('id')
          .eq('username', emailOrUsername)
          .single();

        if (profileError || !profileData) {
          return {
            success: false,
            message: 'Invalid email/username or password',
          };
        }

        // 2. Resolve user ID to email via auth admin API
        // Note: This requires the client to have administrative privileges
        const { data: userData, error: userError } =
          await resolutionClient.auth.admin.getUserById(profileData.id);

        if (userError || !userData.user?.email) {
          return {
            success: false,
            message: 'Invalid email/username or password',
          };
        }

        email = userData.user.email;
      }

      // Step 3: Authenticate with Supabase Auth
      const { data: authData, error: authError } =
        await this.supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        // Handle specific authentication errors
        if (authError.message.includes('Invalid login credentials')) {
          return {
            success: false,
            message: 'Invalid email/username or password',
          };
        }
        if (authError.message.includes('Email not confirmed')) {
          return {
            success: false,
            message: 'Please verify your email address before signing in',
            requiresVerification: true,
          };
        }
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Authentication failed: No user data returned');
      }

      // Step 4: Check email verification status
      if (!authData.user.email_confirmed_at) {
        // Sign out the user since they shouldn't be authenticated
        await this.supabase.auth.signOut();
        return {
          success: false,
          message: 'Please verify your email address before signing in',
          requiresVerification: true,
        };
      }

      // Step 5: Fetch social and administrative manifests asynchronously
      const profilePromise = this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      const telemetryPromise = this.supabase
        .from('account_telemetry')
        .select('username_last_changed_at, deactivated_at')
        .eq('id', authData.user.id)
        .single();

      const [profileRes, telemetryRes] = await Promise.all([profilePromise, telemetryPromise]);

      if (profileRes.error || !profileRes.data) {
        console.error('Failed to fetch user profile manifest:', profileRes.error);
        // User authenticated but profile fetch failed - return minimal data
        return {
          success: true,
          message: 'Sign-in successful',
          data: {
            id: authData.user.id,
            email: authData.user.email!,
            emailConfirmed: true,
            createdAt: authData.user.created_at,
            profile: {
              id: authData.user.id,
              username: 'unknown',
              displayName: null,
              bio: null,
              avatarUrl: null,
              location: null,
              website: null,
              facebookUrl: null,
              usernameLastChangedAt: null,
              deactivatedAt: null,
              createdAt: authData.user.created_at,
            },
          },
        };
      }

      const profileData = profileRes.data;
      const telemetryData = telemetryRes.data;

      // Step 5.5: Stasis Intercept (from asynchronous telemetry)
      if (telemetryData?.deactivated_at) {
        // Sign out for now until they decide to recover
        await this.supabase.auth.signOut();
        return {
          success: false,
          message: 'Account Stasis detected. Do you wish to resurrect your manifest?',
          requiresRecovery: true,
        };
      }

      // Step 6: Build and return the AuthUserDTO
      const userDTO: AuthUserDTO = {
        id: authData.user.id,
        email: authData.user.email!,
        emailConfirmed: true,
        createdAt: authData.user.created_at,
        profile: {
          id: profileData.id,
          username: profileData.username,
          displayName: profileData.display_name,
          bio: profileData.bio,
          avatarUrl: profileData.avatar_url,
          location: profileData.location,
          website: profileData.website,
          facebookUrl: profileData.facebook_url,
          createdAt: profileData.created_at,
          usernameLastChangedAt: telemetryData?.username_last_changed_at || null,
          deactivatedAt: telemetryData?.deactivated_at || null,
        },
      };

      return {
        success: true,
        message: 'Sign-in successful',
        data: userDTO,
      };
    } catch (error) {
      // Handle specific Supabase errors
      if (error instanceof Error) {
        // Check for common Supabase error patterns
        if (error.message.includes('Invalid login credentials')) {
          return {
            success: false,
            message: 'Invalid email/username or password',
          };
        }
        if (error.message.includes('Email not confirmed')) {
          return {
            success: false,
            message: 'Please verify your email address before signing in',
            requiresVerification: true,
          };
        }
        if (error.message.includes('network')) {
          return {
            success: false,
            message: 'Unable to connect. Please check your internet connection',
          };
        }
        if (error.message.includes('service')) {
          return {
            success: false,
            message:
              'Authentication service is temporarily unavailable. Please try again later',
          };
        }

        // Log the full error for debugging
        console.error('Sign-in error:', error);

        // Return a generic error message without exposing technical details
        return {
          success: false,
          message:
            'An error occurred during sign-in. Please try again or contact support.',
        };
      }

      // Fallback for non-Error objects
      console.error('Unknown sign-in error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  /**
   * Signs out the current user and clears session
   * @returns Success boolean
   */
  async signOut(): Promise<boolean> {
    try {
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        console.error('Sign-out error:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected sign-out error:', error);
      return false;
    }
  }

  /**
   * Resends email verification link to user
   * @param email - User's email address
   * @returns Success boolean and message
   */
  async resendVerificationEmail(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await this.supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('rate limit')) {
          return {
            success: false,
            message: 'Please wait before requesting another verification email',
          };
        }
        if (error.message.includes('not found')) {
          return {
            success: false,
            message: 'No account found with this email address',
          };
        }
        
        console.error('Resend verification error:', error);
        return {
          success: false,
          message: 'Failed to send verification email. Please try again later',
        };
      }

      return {
        success: true,
        message: 'Verification email sent successfully',
      };
    } catch (error) {
      console.error('Unexpected resend verification error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again',
      };
    }
  }

  /**
   * Gets the currently authenticated user
   * @returns AuthUserDTO or null if not authenticated
   */
  async getCurrentUser(): Promise<AuthUserDTO | null> {
    try {
      // Get the current session
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser();

      if (authError || !user) {
        return null;
      }

      // Fetch social and administrative manifests asynchronously
      const profilePromise = this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const telemetryPromise = this.supabase
        .from('account_telemetry')
        .select('username_last_changed_at, deactivated_at')
        .eq('id', user.id)
        .single();

      const [profileRes, telemetryRes] = await Promise.all([profilePromise, telemetryPromise]);

      if (profileRes.error || !profileRes.data) {
        console.error('Failed to fetch user profile manifest:', profileRes.error);
        // Return minimal data if profile fetch fails
        return {
          id: user.id,
          email: user.email!,
          emailConfirmed: user.email_confirmed_at !== null,
          createdAt: user.created_at,
          profile: {
            id: user.id,
            username: 'unknown',
            displayName: null,
            bio: null,
            avatarUrl: null,
            location: null,
            website: null,
            facebookUrl: null,
            usernameLastChangedAt: null,
            deactivatedAt: null,
            createdAt: user.created_at,
          },
        };
      }

      const profileData = profileRes.data;
      const telemetryData = telemetryRes.data;

      // Stasis Intercept (for active check)
      if (telemetryData?.deactivated_at) {
        return null;
      }

      // Build and return the AuthUserDTO
      const userDTO: AuthUserDTO = {
        id: user.id,
        email: user.email!,
        emailConfirmed: user.email_confirmed_at !== null,
        createdAt: user.created_at,
        profile: {
          id: profileData.id,
          username: profileData.username,
          displayName: profileData.display_name,
          bio: profileData.bio,
          avatarUrl: profileData.avatar_url,
          location: profileData.location,
          website: profileData.website,
          facebookUrl: profileData.facebook_url,
          usernameLastChangedAt: telemetryData?.username_last_changed_at || null,
          deactivatedAt: telemetryData?.deactivated_at || null,
          createdAt: profileData.created_at,
        },
      };

      return userDTO;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Updates user profile data
   * @param userId - UUID of the user
   * @param data - Partial profile data to update
   * @returns Updated UserProfileDTO or throws error
   */
  async updateProfile(
    userId: string,
    data: Partial<UserProfileDTO>
  ): Promise<UserProfileDTO> {
    try {
      // Build the update object, excluding fields that shouldn't be updated
      const updateData: {
        username?: string;
        display_name?: string | null;
        bio?: string | null;
        avatar_url?: string | null;
        location?: string | null;
        website?: string | null;
        facebook_url?: string;
      } = {};

      if (data.username !== undefined) updateData.username = data.username;
      if (data.displayName !== undefined)
        updateData.display_name = data.displayName;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
      if (data.location !== undefined) updateData.location = data.location;
      if (data.website !== undefined) updateData.website = data.website;
      if (data.facebookUrl !== undefined) {
        updateData.facebook_url = data.facebookUrl 
          ? canonicalizeFacebookUrl(data.facebookUrl) 
          : '';
      }

      // Update the profile
      const { data: updatedProfile, error: updateError } = await this.supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        // Handle specific errors
        if (updateError.message.includes('duplicate key')) {
          throw new Error('This username is already taken');
        }
        if (updateError.message.includes('violates row-level security')) {
          throw new Error('You do not have permission to update this profile');
        }
        
        console.error('Profile update error:', updateError);
        throw new Error('Failed to update profile. Please try again');
      }

      if (!updatedProfile) {
        throw new Error('Profile update failed: No data returned');
      }

      // Return the updated profile synthesized with telemetry (Asynchronous Synthesis)
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

      const [profileRes, telemetryRes] = await Promise.all([profilePromise, telemetryPromise]);

      if (profileRes.error || !profileRes.data) {
        throw new Error('Profile synthesis failed after update.');
      }

      const profileData = profileRes.data;
      const telemetryData = telemetryRes.data;

      return {
        id: profileData.id,
        username: profileData.username,
        displayName: profileData.display_name,
        bio: profileData.bio,
        avatarUrl: profileData.avatar_url,
        location: profileData.location,
        website: profileData.website,
        facebookUrl: profileData.facebook_url,
        usernameLastChangedAt: telemetryData?.username_last_changed_at || null,
        deactivatedAt: telemetryData?.deactivated_at || null,
        createdAt: profileData.created_at,
      };
    } catch (error) {
      // Re-throw known errors (our custom error messages)
      if (error instanceof Error) {
        // Check if this is one of our custom error messages
        if (
          error.message === 'This username is already taken' ||
          error.message === 'You do not have permission to update this profile' ||
          error.message === 'Failed to update profile. Please try again' ||
          error.message === 'Profile update failed: No data returned'
        ) {
          throw error;
        }
      }
      
      // Handle unknown errors
      console.error('Unexpected profile update error:', error);
      throw new Error('An unexpected error occurred while updating profile');
    }
  }

  /**
   * Verifies an OTP token hash (email verification or password recovery)
   * @param token_hash - The hashed token from the email link
   * @param type - The type of verification ('signup', 'recovery', etc.)
   * @returns Success boolean and message
   */
  async verifyOtp(
    token_hash: string,
    type: EmailOtpType
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await this.supabase.auth.verifyOtp({
        token_hash,
        type,
      });

      if (error) {
        console.error(`Verification error (${type}):`, error);
        return {
          success: false,
          message: error.message || 'Verification failed. The link may be expired.',
        };
      }

      return {
        success: true,
        message: 'Verification successful',
      };
    } catch (error) {
      console.error('Unexpected verification error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during verification',
      };
    }
  }

  /**
   * Resets the user's password (requires an active recovery session)
   * @param password - The new password
   * @returns Success boolean and message
   */
  async resetPassword(
    password: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error('Password reset error:', error);
        return {
          success: false,
          message: error.message || 'Failed to update password',
        };
      }

      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while resetting password',
      };
    }
  }

  /**
   * Sends a password reset email to the user
   * @param email - User's email address
   * @returns Success boolean and message
   */
  async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
      });

      if (error) {
        console.error('Forgot password error:', error);
        return {
          success: false,
          message: error.message || 'Failed to send reset email',
        };
      }

      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.',
      };
    } catch (error) {
      console.error('Unexpected forgot password error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      };
    }
  }

  /**
   * Enters the user account into 30-day stasis deactivation
   * @param userId - UUID of the user
   * @returns Success boolean
   */
  async deactivateAccount(userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('account_telemetry')
      .update({ deactivated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Account deactivation error:', error);
      return false;
    }
    await this.supabase.auth.signOut();
    return true;
  }

  /**
   * Resurrection Flow: Clears the stasis marker to reactivate the manifest
   * @param email - User's email
   * @param password - User's password
   * @returns AuthOperationResult with the reactivated profile
   */
  async recoverAccount(email: string, password: string): Promise<AuthOperationResult> {
    // 1. Sign in normally (it might still trigger the intercept if profile isn't cleared yet)
    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return { success: false, message: 'Recovery failed. Invalid credentials.' };
    }

    // 2. Clear the stasis marker (from isolated telemetry)
    const { error: telemetryError } = await this.supabase
      .from('account_telemetry')
      .update({ deactivated_at: null })
      .eq('id', authData.user.id);

    if (telemetryError) {
      console.error('Account recovery error:', telemetryError);
      return { success: false, message: 'Failed to clear stasis marker.' };
    }

    return this.signIn(email, password); // Log in properly after clearing
  }

  /**
   * Recalibrates the user galactic coordinates (Email)
   * This triggers Supabase's dual-verification flow
   * @param newEmail - The new email address
   * @returns Success boolean and status message
   */
  async recalibrateEmail(newEmail: string): Promise<{ success: boolean; message: string }> {
    // 1. Availability Intercept: Check if the coordinate is already claimed
    const { AvailabilityService } = await import('./availability.service');
    const availabilityService = new AvailabilityService(this.supabase);
    const availability = await availabilityService.checkEmailAvailability(newEmail);
    
    if (!availability.available) {
      return { success: false, message: 'This coordinate is already registered to another manifest.' };
    }

    // 2. Dispatch recalibration signals
    const { error } = await this.supabase.auth.updateUser({ email: newEmail });

    if (error) {
      console.error('Email recalibration error:', error);
      return { success: false, message: error.message || 'Failed to recalibrate coordinates' };
    }

    return { 
      success: true, 
      message: 'Verification signals dispatched. Please check both your current and new inbox.' 
    };
  }
}
