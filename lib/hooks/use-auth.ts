// =====================================================================
// Authentication Mutation Hooks
// =====================================================================
// Provides mutation hooks for authentication operations
// Uses TanStack Query for state management and cache invalidation

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  signUpAction,
  signInAction,
  signOutAction,
  resendVerificationAction,
  getCurrentUserAction,
} from '@/lib/actions/auth.actions';
import type {
  SignUpFormData,
  SignInFormData,
  AuthUserDTO,
} from '@/lib/types/auth.types';
import type { ActionResponse } from '@/lib/actions/auth.actions';

// =====================================================================
// Sign Up Hook
// =====================================================================

/**
 * Hook: Sign up mutation
 * Handles user registration with optimistic updates
 * Invalidates: current user query
 * Requirements: 1.14, 2.10, 9.3
 *
 * @returns Mutation object with mutate, mutateAsync, isLoading, isError, error
 *
 * @example
 * ```tsx
 * const { mutate, isLoading } = useSignUp();
 *
 * const handleSubmit = (data: SignUpFormData) => {
 *   mutate(data, {
 *     onSuccess: () => router.push('/verify-email'),
 *     onError: (error) => toast.error(error.message),
 *   });
 * };
 * ```
 */
export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ActionResponse<AuthUserDTO>, Error, SignUpFormData>({
    mutationFn: async (data: SignUpFormData) => {
      const response = await signUpAction(data);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: (data) => {
      // Invalidate current user query to refetch user data
      queryClient.invalidateQueries({ queryKey: ['current-user'] });

      // Redirect to email verification screen
      router.push(`/verify-email?email=${encodeURIComponent(data.data?.email || '')}`);
    },
  });
}

// =====================================================================
// Sign In Hook
// =====================================================================

/**
 * Hook: Sign in mutation
 * Handles user authentication with session management
 * Invalidates: current user query
 * Requirements: 1.14, 2.10, 9.3
 *
 * @returns Mutation object with mutate, mutateAsync, isLoading, isError, error
 *
 * @example
 * ```tsx
 * const { mutate, isLoading } = useSignIn();
 *
 * const handleSubmit = (data: SignInFormData) => {
 *   mutate(data, {
 *     onSuccess: () => router.push('/dashboard'),
 *     onError: (error) => toast.error(error.message),
 *   });
 * };
 * ```
 */
export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<
    ActionResponse<AuthUserDTO>,
    Error,
    SignInFormData
  >({
    mutationFn: async (data: SignInFormData) => {
      const response = await signInAction(
        data.emailOrUsername,
        data.password
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: () => {
      // Invalidate current user query to refetch user data
      queryClient.invalidateQueries({ queryKey: ['current-user'] });

      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
}

// =====================================================================
// Sign Out Hook
// =====================================================================

/**
 * Hook: Sign out mutation
 * Clears session and redirects to home
 * Invalidates: all queries
 * Requirements: 1.14, 2.10, 9.3
 *
 * @returns Mutation object with mutate, mutateAsync, isLoading, isError, error
 *
 * @example
 * ```tsx
 * const { mutate, isLoading } = useSignOut();
 *
 * const handleSignOut = () => {
 *   mutate(undefined, {
 *     onSuccess: () => toast.success('Signed out successfully'),
 *   });
 * };
 * ```
 */
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ActionResponse, Error, void>({
    mutationFn: async () => {
      const response = await signOutAction();

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: () => {
      // Clear all cached queries
      queryClient.clear();

      // Redirect to home page
      router.push('/');
    },
  });
}

// =====================================================================
// Current User Hook
// =====================================================================

/**
 * Hook: Get current authenticated user
 * Caching: 5 minutes stale time
 * Requirements: 1.14, 2.10, 9.3
 *
 * @returns Query result with user data, isLoading, isError, error
 *
 * @example
 * ```tsx
 * const { data: user, isLoading } = useCurrentUser();
 *
 * if (isLoading) return <Spinner />;
 * if (!user) return <SignInPrompt />;
 *
 * return <UserProfile user={user} />;
 * ```
 */
export function useCurrentUser() {
  return useQuery<AuthUserDTO | null, Error>({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await getCurrentUserAction();
      if (!response.success) {
        return null;
      }
      return response.data || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if user is not authenticated
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}

/**
 * Hook: Update user profile
 * Handles profile mutations with automatic cache invalidation
 * Requirements: 3.6, 6.1, 6.2, 6.3
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      displayName?: string | null;
      bio?: string | null;
      location?: string | null;
      website?: string | null;
      avatarUrl?: string | null;
    }) => {
      const { updateProfileAction } = await import('@/lib/actions/auth.actions');
      const response = await updateProfileAction(data);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate current user to reflect profile changes globally
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      // If we had a specific profile query, we'd invalidate that too
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['profile', data.username] });
      }
    },
  });
}

// =====================================================================
// Resend Verification Hook
// =====================================================================

/**
 * Hook: Resend verification email
 * Rate-limited with 60 second cooldown
 * Requirements: 20.6, 20.7, 20.8
 *
 * @returns Mutation object with mutate, mutateAsync, isLoading, isError, error, canResend, countdown
 *
 * @example
 * ```tsx
 * const { mutate, isLoading, canResend, countdown } = useResendVerification();
 *
 * const handleResend = () => {
 *   if (canResend) {
 *     mutate(email, {
 *       onSuccess: () => toast.success('Verification email sent'),
 *     });
 *   }
 * };
 *
 * return (
 *   <button disabled={!canResend || isLoading}>
 *     {canResend ? 'Resend' : `Wait ${countdown}s`}
 *   </button>
 * );
 * ```
 */
export function useResendVerification() {
  const [canResend, setCanResend] = React.useState(true);
  const [countdown, setCountdown] = React.useState(0);

  const mutation = useMutation<ActionResponse, Error, string>({
    mutationFn: async (email: string) => {
      const response = await resendVerificationAction(email);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: () => {
      // Start 60-second countdown
      setCanResend(false);
      setCountdown(60);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
  });

  return {
    ...mutation,
    canResend,
    countdown,
  };
}

// Import React for useState
import React from 'react';
