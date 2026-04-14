// =====================================================================
// Authentication Service Layer
// =====================================================================
// Core business logic for user authentication and registration
// Implements "Do Not Trust The Client" paradigm with strict validation

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type {
  SignUpFormData,
  AuthOperationResult,
  AuthUserDTO,
  UserProfileDTO,
} from '@/lib/types/auth.types';
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
   * @returns AuthOperationResult with user data or error message
   * @throws Error if email/username already exists or Supabase operation fails
   */
  async signUp(data: SignUpFormData): Promise<AuthOperationResult> {
    try {
      // Step 1: Re-verify email availability (server-side guard)
      const emailCheck = await this.availabilityService.checkEmailAvailability(
        data.email
      );
      if (!emailCheck.available) {
        return {
          success: false,
          message: 'An account with this email already exists',
        };
      }

      // Step 2: Re-verify username availability (server-side guard)
      const usernameCheck =
        await this.availabilityService.checkUsernameAvailability(data.username);
      if (!usernameCheck.available) {
        return {
          success: false,
          message: 'This username is already taken',
        };
      }

      // Step 3: Create user via Supabase Auth
      const { data: authData, error: authError } =
        await this.supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            data: {
              username: data.username,
            },
          },
        });

      if (authError) {
        throw new Error(`Failed to create user account: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('User creation failed: No user data returned');
      }

      // Step 4: Update user_profiles record with username and optional profile data
      const { error: profileError } = await this.supabase
        .from('user_profiles')
        .update({
          username: data.username,
          display_name: data.displayName || null,
          bio: data.bio || null,
          avatar_url: data.avatarUrl || null,
          avatar_public_id: data.avatarPublicId || null,
        })
        .eq('id', authData.user.id);

      if (profileError) {
        // Log error but don't fail the sign-up since user was created
        console.error('Failed to update user profile:', profileError);
        // Attempt to clean up the auth user if profile update fails
        await this.supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error(
          'Failed to create user profile. Please try again or contact support.'
        );
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
              location: null,
              website: null,
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
      // Handle specific Supabase errors
      if (error instanceof Error) {
        // Check for common Supabase error patterns
        if (error.message.includes('already registered')) {
          return {
            success: false,
            message: 'An account with this email already exists',
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
        console.error('Sign-up error:', error);

        // Return a generic error message without exposing technical details
        return {
          success: false,
          message:
            'An error occurred during account creation. Please try again or contact support.',
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
    password: string
  ): Promise<AuthOperationResult> {
    try {
      // Step 1: Determine if input is email or username
      let email = emailOrUsername;
      const isEmail = emailOrUsername.includes('@');

      // Step 2: If username provided, resolve to email via user_profiles
      if (!isEmail) {
        // Query user_profiles to get the user ID
        const { data: profileData, error: profileError } = await this.supabase
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

        // We need to get the email from auth.users
        // Since we can't directly query auth.users, we'll attempt sign-in with the user ID
        // However, Supabase Auth requires email for signInWithPassword
        // So we need to use a different approach: store email in user_profiles or use a different method
        
        // For now, we'll use the admin API to get the user's email
        // In production, consider storing email in user_profiles for easier lookup
        const { data: userData, error: userError } =
          await this.supabase.auth.admin.getUserById(profileData.id);

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

      // Step 5: Fetch the complete user profile
      const { data: profileData, error: fetchError } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (fetchError || !profileData) {
        console.error('Failed to fetch user profile:', fetchError);
        // User authenticated but profile fetch failed
        // Return minimal data
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
              createdAt: authData.user.created_at,
            },
          },
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
          createdAt: profileData.created_at,
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

      // Fetch the complete user profile
      const { data: profileData, error: profileError } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        console.error('Failed to fetch user profile:', profileError);
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
            createdAt: user.created_at,
          },
        };
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
      } = {};

      if (data.username !== undefined) updateData.username = data.username;
      if (data.displayName !== undefined)
        updateData.display_name = data.displayName;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
      if (data.location !== undefined) updateData.location = data.location;
      if (data.website !== undefined) updateData.website = data.website;

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

      // Return the updated profile as DTO
      return {
        id: updatedProfile.id,
        username: updatedProfile.username,
        displayName: updatedProfile.display_name,
        bio: updatedProfile.bio,
        avatarUrl: updatedProfile.avatar_url,
        location: updatedProfile.location,
        website: updatedProfile.website,
        createdAt: updatedProfile.created_at,
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
}
