import { SignUpInput, SignInInput, Step1Input, Step2Input, Step3Input, Step4Input } from '../validations/auth.validation';

// Sign-Up Types
export type SignUpFormData = SignUpInput;

export interface SignUpStepData {
  step1: Step1Input;
  step2: Step2Input;
  step3: Step3Input;
  step4: Step4Input;
}

// Sign-In Types
export type SignInFormData = SignInInput;

// Password Validation
export interface PasswordStrength {
  hasMinLength: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

// Availability Check
export interface AvailabilityCheckResult {
  available: boolean;
  message: string;
  isChecking: boolean;
}

// Email Verification
export interface EmailVerificationState {
  email: string;
  canResend: boolean;
  countdown: number;
  lastSentAt: Date | null;
}

// DTOs (Data Transfer Objects)
export interface UserProfileDTO {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  website: string | null;
  facebookUrl: string | null;
  usernameLastChangedAt: string | null; // ISO format
  deactivatedAt: string | null; // ISO format
  createdAt: string; // ISO format
}

export interface AuthUserDTO {
  id: string;
  email: string;
  emailConfirmed: boolean;
  createdAt: string;
  profile: UserProfileDTO;
}

// Service Responses
export interface AuthOperationResult {
  success: boolean;
  message: string;
  data?: AuthUserDTO;
  requiresVerification?: boolean;
  requiresRecovery?: boolean;
}

export interface AvailabilityResult {
  available: boolean;
  message: string;
}

/**
 * Standardized response format for all Server Actions
 */
export interface ActionResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  requiresVerification?: boolean;
}
