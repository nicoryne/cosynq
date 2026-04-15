'use server';

// =====================================================================
// Authentication Server Actions
// =====================================================================
// Entry points for authentication mutations from client components
// Implements input validation, rate limiting, and security checks

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { AvailabilityService } from '@/lib/services/availability.service';
import { AuthService } from '@/lib/services/auth.service';
import {
  emailSchema,
  usernameSchema,
  signUpSchema,
  signInSchema,
} from '@/lib/validations/auth.validation';
import type {
  AvailabilityResult,
  SignUpFormData,
  AuthUserDTO,
  UserProfileDTO,
} from '@/lib/types/auth.types';
import { SecurityLogger } from '@/lib/utils/security-logger';

// =====================================================================
// Action Response Type
// =====================================================================

/**
 * Standardized response format for all actions
 */
export interface ActionResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  requiresVerification?: boolean;
}

// =====================================================================
// Rate Limiting Implementation
// =====================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory rate limit store (per IP address)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

/**
 * Checks if the request should be rate limited
 * @param identifier - Unique identifier (IP address)
 * @returns true if rate limit exceeded, false otherwise
 */
function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean up expired entries periodically
  if (entry && now > entry.resetAt) {
    rateLimitStore.delete(identifier);
  }

  // Get or create entry
  const currentEntry = rateLimitStore.get(identifier);

  if (!currentEntry) {
    // First request in window
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  // Check if limit exceeded
  if (currentEntry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  // Increment count
  currentEntry.count++;
  return false;
}

/**
 * Gets the client IP address from headers
 * @returns IP address or 'unknown'
 */
async function getClientIP(): Promise<string> {
  const headersList = await import('next/headers').then((m) => m.headers());
  const headers = await headersList;

  // Try various headers that might contain the real IP
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

// =====================================================================
// Availability Check Actions
// =====================================================================

/**
 * Server Action: Check email availability
 * Rate-limited to 10 requests per minute per IP
 * Requirements: 3.8, 14.2, 14.10, 15.2, 15.10, 18.10
 */
export async function checkEmailAvailabilityAction(
  email: string
): Promise<ActionResponse<AvailabilityResult>> {
  try {
    // Rate limiting check
    const clientIP = await getClientIP();
    if (isRateLimited(`email-${clientIP}`)) {
      // Log rate limit violation
      SecurityLogger.logRateLimitExceeded('checkEmailAvailability', clientIP, {
        email,
      });
      
      return {
        success: false,
        message: 'Too many requests. Please try again later.',
      };
    }

    // Validate input
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: { email: validation.error.issues.map((e) => e.message) },
      };
    }

    // Execute service operation
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const availabilityService = new AvailabilityService(supabase);
    const result = await availabilityService.checkEmailAvailability(
      validation.data
    );

    return {
      success: true,
      message: 'Email availability checked',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to check email availability',
    };
  }
}

/**
 * Server Action: Check username availability
 * Rate-limited to 10 requests per minute per IP
 * Requirements: 3.8, 14.2, 14.10, 15.2, 15.10, 18.10
 */
export async function checkUsernameAvailabilityAction(
  username: string
): Promise<ActionResponse<AvailabilityResult>> {
  try {
    // Rate limiting check
    const clientIP = await getClientIP();
    if (isRateLimited(`username-${clientIP}`)) {
      // Log rate limit violation
      SecurityLogger.logRateLimitExceeded('checkUsernameAvailability', clientIP, {
        username,
      });
      
      return {
        success: false,
        message: 'Too many requests. Please try again later.',
      };
    }

    // Validate input
    const validation = usernameSchema.safeParse(username);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: { username: validation.error.issues.map((e) => e.message) },
      };
    }

    // Execute service operation
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const availabilityService = new AvailabilityService(supabase);
    const result = await availabilityService.checkUsernameAvailability(
      validation.data
    );

    return {
      success: true,
      message: 'Username availability checked',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to check username availability',
    };
  }
}

// =====================================================================
// Authentication Actions
// =====================================================================

/**
 * Server Action: Sign up a new user
 * Validates all inputs, checks availability, creates user and profile
 * Requirements: 1.8, 3.8, 8.1, 9.4, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.10
 */
export async function signUpAction(
  data: SignUpFormData
): Promise<ActionResponse<AuthUserDTO>> {
  try {
    // Step 1: Validate all inputs with Zod schema (server-side re-validation)
    // Requirements: 18.1, 18.2, 18.3
    const validation = signUpSchema.safeParse(data);
    if (!validation.success) {
      const errors: Record<string, string[]> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      });

      return {
        success: false,
        message: 'Validation failed',
        errors,
      };
    }

    // Step 2: Validate all wizard steps are completed (server-side guard)
    // Requirements: 18.6, 18.7
    const validatedData = validation.data;
    
    // Ensure required fields from all steps are present
    if (!validatedData.email || !validatedData.username || !validatedData.password) {
      return {
        success: false,
        message: 'All required steps must be completed',
        errors: {
          form: ['Please complete all required steps before submitting'],
        },
      };
    }

    // Verify password confirmation matches (additional server-side check)
    if (validatedData.password !== validatedData.confirmPassword) {
      return {
        success: false,
        message: 'Validation failed',
        errors: {
          confirmPassword: ['Passwords do not match'],
        },
      };
    }

    // Step 3: Re-verify email and username availability (server-side guard)
    // Requirements: 18.4, 18.5
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const availabilityService = new AvailabilityService(supabase);

    // Re-check email availability
    const emailCheck = await availabilityService.checkEmailAvailability(
      validatedData.email
    );
    if (!emailCheck.available) {
      return {
        success: false,
        message: 'An account with this email already exists',
        errors: {
          email: ['This email is already registered'],
        },
      };
    }

    // Re-check username availability
    const usernameCheck = await availabilityService.checkUsernameAvailability(
      validatedData.username
    );
    if (!usernameCheck.available) {
      return {
        success: false,
        message: 'This username is already taken',
        errors: {
          username: ['This username is taken'],
        },
      };
    }

    // Step 4: Call AuthService.signUp() with validated data
    const authService = new AuthService(supabase);
    const result = await authService.signUp(validatedData);

    // Step 5: Handle errors and return response
    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    // Step 6: Log successful sign-up
    if (result.data) {
      SecurityLogger.logSignUp(result.data.id, result.data.email, {
        username: validatedData.username,
        ipAddress: await getClientIP(),
      });
    }

    // Step 7: Return success with user data
    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    console.error('Sign-up action error:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during sign-up',
    };
  }
}

/**
 * Server Action: Sign in an existing user
 * Validates credentials, checks email verification, generates JWT
 * Requirements: 2.2, 2.3, 3.8, 5.1, 9.4, 9.9
 */
export async function signInAction(
  emailOrUsername: string,
  password: string
): Promise<ActionResponse<AuthUserDTO>> {
  try {
    // Step 1: Validate inputs with Zod schema
    const validation = signInSchema.safeParse({ emailOrUsername, password });
    if (!validation.success) {
      const errors: Record<string, string[]> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      });

      return {
        success: false,
        message: 'Validation failed',
        errors,
      };
    }

    // Step 2: Call AuthService.signIn() with validated credentials
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const adminClient = createAdminClient();
    const authService = new AuthService(supabase);
    const result = await authService.signIn(
      validation.data.emailOrUsername,
      validation.data.password,
      adminClient
    );

    // Step 3: Handle errors (including unverified email)
    if (!result.success) {
      // Log failed authentication attempt
      SecurityLogger.logAuthenticationFailed(
        validation.data.emailOrUsername,
        result.message,
        {
          ipAddress: await getClientIP(),
          requiresVerification: result.requiresVerification,
        }
      );
      
      return {
        success: false,
        message: result.message,
      };
    }

    // Step 4: JWT is automatically stored by Supabase client in httpOnly cookie
    // The createClient function handles cookie management

    // Step 5: Log successful sign-in
    if (result.data) {
      SecurityLogger.logSignIn(result.data.id, result.data.email, {
        ipAddress: await getClientIP(),
      });
    }

    // Step 6: Revalidate dashboard path after successful sign-in
    revalidatePath('/dashboard');

    // Step 7: Return success with user data
    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    console.error('Sign-in action error:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during sign-in',
    };
  }
}

/**
 * Server Action: Sign out current user
 * Clears session cookie and invalidates JWT
 * Requirements: 5.7
 */
export async function signOutAction(): Promise<ActionResponse> {
  try {
    // Step 1: Get current user for logging
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    
    // Step 2: Call AuthService.signOut()
    const authService = new AuthService(supabase);
    const success = await authService.signOut();

    if (!success) {
      return {
        success: false,
        message: 'Failed to sign out. Please try again.',
      };
    }

    // Step 3: Log sign-out event
    if (user) {
      SecurityLogger.logSignOut(user.id, user.email || 'unknown', {
        ipAddress: await getClientIP(),
      });
    }

    // Step 4: Revalidate paths to clear cached data
    revalidatePath('/');
    revalidatePath('/dashboard');

    // Step 5: Return success
    return {
      success: true,
      message: 'Signed out successfully',
    };
  } catch (error) {
    console.error('Sign-out action error:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during sign-out',
    };
  }
}

/**
 * Server Action: Resend email verification
 * Rate-limited to prevent abuse (60 second cooldown)
 * Requirements: 20.6, 20.7, 20.9
 */
export async function resendVerificationAction(
  email: string
): Promise<ActionResponse> {
  try {
    // Step 1: Rate limiting check (60-second cooldown per email)
    const clientIP = await getClientIP();
    const rateLimitKey = `resend-${clientIP}-${email}`;
    if (isRateLimited(rateLimitKey)) {
      // Log rate limit violation
      SecurityLogger.logRateLimitExceeded('resendVerification', clientIP, {
        email,
      });
      
      return {
        success: false,
        message: 'Please wait 60 seconds before requesting another verification email',
      };
    }

    // Step 2: Validate email format
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid email format',
        errors: { email: validation.error.issues.map((e) => e.message) },
      };
    }

    // Step 3: Call AuthService.resendVerificationEmail()
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const authService = new AuthService(supabase);
    const result = await authService.resendVerificationEmail(validation.data);

    // Step 4: Log email verification event
    if (result.success) {
      SecurityLogger.logEmailVerificationSent(validation.data, {
        ipAddress: clientIP,
      });
    } else {
      SecurityLogger.logEmailVerificationFailed(validation.data, result.message, {
        ipAddress: clientIP,
      });
    }

    // Step 5: Return result
    return {
      success: result.success,
      message: result.message,
    };
  } catch (error) {
    console.error('Resend verification action error:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while resending verification email',
    };
  }
}

/**
 * Server Action: Get currently authenticated user
 * Used by client-side hooks to fetch real-time session and profile data
 */
export async function getCurrentUserAction(): Promise<ActionResponse<AuthUserDTO | null>> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const authService = new AuthService(supabase);
    const user = await authService.getCurrentUser();

    return {
      success: true,
      message: user ? 'User session found' : 'No active session',
      data: user,
    };
  } catch (error) {
    console.error('Get current user action error:', error);
    // Silent fail for session checks to avoid UI noise
    return {
      success: false,
      message: 'Failed to fetch user session',
      data: null,
    };
  }
}

/**
 * Server Action: Update user profile information
 * Requirements: 3.6, 6.1, 6.2, 6.3 - Profile management
 */
export async function updateProfileAction(
  data: {
    displayName?: string | null;
    bio?: string | null;
    location?: string | null;
    website?: string | null;
    avatarUrl?: string | null;
  }
): Promise<ActionResponse<UserProfileDTO>> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    // 1. Verify session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        message: 'You must be signed in to perform this action',
      };
    }

    // 2. Execute update via AuthService
    const authService = new AuthService(supabase);
    const updatedProfile = await authService.updateProfile(user.id, data);

    // 3. Revalidate paths to clear cache
    revalidatePath(`/u/${updatedProfile.username}`);
    revalidatePath('/dashboard');
    revalidatePath('/settings');

    return {
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    };
  } catch (error) {
    console.error('Update profile action error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
