// =====================================================================
// Authentication Validation Schemas
// =====================================================================
// Zod schemas for validating all authentication-related inputs
// Implements "Absolute Input Validation" security principle

import { z } from 'zod';

// =====================================================================
// Core Field Validation Schemas
// =====================================================================

/**
 * Validates email address format
 * Requirements: 3.1 - Email validation
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email must be less than 255 characters');

/**
 * Validates username format and constraints
 * Requirements: 3.2 - Username validation
 * Rules:
 * - 3-30 characters
 * - Only letters, numbers, underscores, and hyphens
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be less than 30 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens'
  );

/**
 * Validates password strength requirements
 * Requirements: 3.3 - Password validation
 * Rules:
 * - Minimum 6 characters
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[^a-zA-Z0-9]/,
    'Password must contain at least one special character'
  );

/**
 * Validates display name (optional profile field)
 * Requirements: 3.6 - Profile data validation
 */
export const displayNameSchema = z
  .string()
  .min(1, 'Display name must be at least 1 character')
  .max(50, 'Display name must be less than 50 characters')
  .optional();

/**
 * Validates user bio (optional profile field)
 * Requirements: 3.6 - Profile data validation
 */
export const bioSchema = z
  .string()
  .max(500, 'Bio must be less than 500 characters')
  .optional();

// =====================================================================
// Form Validation Schemas
// =====================================================================

/**
 * Validates complete sign-up form data
 * Requirements: 8.1 - Sign-up validation, 13.2 - Password confirmation
 * Includes password confirmation matching validation
 */
export const signUpSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    displayName: displayNameSchema,
    bio: bioSchema,
    avatarUrl: z.string().url().optional(),
    avatarPublicId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Validates sign-in form data
 * Requirements: 8.1 - Sign-in validation
 * Accepts either email or username for flexible authentication
 */
export const signInSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, 'Email or username is required')
    .max(255, 'Input must be less than 255 characters'),
  password: z.string().min(1, 'Password is required'),
});

// =====================================================================
// Multi-Step Wizard Validation Schemas
// =====================================================================

/**
 * Validates Step 1: Email input
 * Requirements: 8.1 - Multi-step validation
 */
export const step1Schema = z.object({
  email: emailSchema,
});

/**
 * Validates Step 2: Username input
 * Requirements: 8.1 - Multi-step validation
 */
export const step2Schema = z.object({
  username: usernameSchema,
  displayName: displayNameSchema,
});

/**
 * Validates Step 3: Password and confirmation
 * Requirements: 8.1 - Multi-step validation, 13.2 - Password confirmation
 */
export const step3Schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Validates Step 4: Optional profile data
 * Requirements: 8.1 - Multi-step validation, 3.6 - Profile data validation
 */
export const step4Schema = z.object({
  bio: bioSchema,
  avatarUrl: z.string().url().optional(),
  avatarPublicId: z.string().optional(),
});

// =====================================================================
// Inferred TypeScript Types
// =====================================================================

/**
 * TypeScript type inferred from signUpSchema
 */
export type SignUpInput = z.infer<typeof signUpSchema>;

/**
 * TypeScript type inferred from signInSchema
 */
export type SignInInput = z.infer<typeof signInSchema>;

/**
 * TypeScript type inferred from step1Schema
 */
export type Step1Input = z.infer<typeof step1Schema>;

/**
 * TypeScript type inferred from step2Schema
 */
export type Step2Input = z.infer<typeof step2Schema>;

/**
 * TypeScript type inferred from step3Schema
 */
export type Step3Input = z.infer<typeof step3Schema>;

/**
 * TypeScript type inferred from step4Schema
 */
export type Step4Input = z.infer<typeof step4Schema>;
