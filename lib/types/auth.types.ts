// Sign-Up Types
export interface SignUpFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
}

export interface SignUpStepData {
  step1: { email: string };
  step2: { username: string; displayName?: string };
  step3: { password: string; confirmPassword: string };
  step4: {
    bio?: string;
    avatarUrl?: string;
    avatarPublicId?: string;
  };
}

// Sign-In Types
export interface SignInFormData {
  emailOrUsername: string;
  password: string;
}

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
}

export interface AvailabilityResult {
  available: boolean;
  message: string;
}
