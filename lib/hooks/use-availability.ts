// =====================================================================
// Availability Check Hooks
// =====================================================================
// Provides debounced real-time availability checking for email and username
// Uses TanStack Query for caching and state management

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import {
  checkEmailAvailabilityAction,
  checkUsernameAvailabilityAction,
} from '@/lib/actions/auth.actions';
import type { AvailabilityResult } from '@/lib/types/auth.types';
import { emailSchema, usernameSchema } from '@/lib/validations/auth.validation';

// =====================================================================
// Constants
// =====================================================================

const DEBOUNCE_DELAY_MS = 500; // 500ms debounce
const STALE_TIME_MS = 60 * 1000; // 1 minute cache

// =====================================================================
// Debounce Hook
// =====================================================================

/**
 * Custom hook for debouncing a value
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// =====================================================================
// Email Availability Hook
// =====================================================================

/**
 * Hook: Check email availability with debouncing
 * Debounce: 500ms
 * Caching: 1 minute stale time
 * Requirements: 14.3, 14.6, 15.3, 15.6
 *
 * @param email - Email address to check
 * @returns Query result with availability data and debounced email
 *
 * @example
 * ```tsx
 * const { data, isLoading, isError, error, debouncedEmail } = useEmailAvailability(email);
 *
 * if (isLoading) return <Spinner />;
 * if (data?.available) return <CheckIcon />;
 * ```
 */
export function useEmailAvailability(email: string) {
  // Debounce the email input to prevent excessive API calls
  const debouncedEmail = useDebounce(email, DEBOUNCE_DELAY_MS);

  // Only enable query if email is not empty, has been debounced AND is a valid email
  // This prevents wasting rate limits on partial strings like "p", "po", "port"
  const isEmailValid = emailSchema.safeParse(debouncedEmail).success;
  const shouldFetch = debouncedEmail.length > 0 && isEmailValid;

  const query = useQuery<AvailabilityResult, Error>({
    queryKey: ['email-availability', debouncedEmail],
    queryFn: async () => {
      const response = await checkEmailAvailabilityAction(debouncedEmail);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data!;
    },
    enabled: shouldFetch,
    staleTime: STALE_TIME_MS,
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    debouncedEmail,
  };
}

// =====================================================================
// Username Availability Hook
// =====================================================================

/**
 * Hook: Check username availability with debouncing
 * Debounce: 500ms
 * Caching: 1 minute stale time
 * Requirements: 14.3, 14.6, 15.3, 15.6
 *
 * @param username - Username to check
 * @returns Query result with availability data and debounced username
 *
 * @example
 * ```tsx
 * const { data, isLoading, isError, error, debouncedUsername } = useUsernameAvailability(username);
 *
 * if (isLoading) return <Spinner />;
 * if (data?.available) return <CheckIcon />;
 * ```
 */
export function useUsernameAvailability(username: string) {
  // Debounce the username input to prevent excessive API calls
  const debouncedUsername = useDebounce(username, DEBOUNCE_DELAY_MS);

  // Only enable query if username is not empty, has been debounced AND is a valid username
  const isUsernameValid = usernameSchema.safeParse(debouncedUsername).success;
  const shouldFetch = debouncedUsername.length > 0 && isUsernameValid;

  const query = useQuery<AvailabilityResult, Error>({
    queryKey: ['username-availability', debouncedUsername],
    queryFn: async () => {
      const response = await checkUsernameAvailabilityAction(debouncedUsername);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data!;
    },
    enabled: shouldFetch,
    staleTime: STALE_TIME_MS,
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    debouncedUsername,
  };
}
