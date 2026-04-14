'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Loader2, Check, ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PasswordChecklist } from './password-checklist';
import { useEmailAvailability } from '@/lib/hooks/use-availability';
import { useUsernameAvailability } from '@/lib/hooks/use-availability';
import { useSignUp } from '@/lib/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from '@/lib/validations/auth.validation';
import type { SignUpStepData } from '@/lib/types/auth.types';

// Lazy load profile picture upload component (only needed in step 4)
const ProfilePictureUpload = dynamic(() => import('./profile-picture-upload').then(mod => ({ default: mod.ProfilePictureUpload })), {
  loading: () => <div className="h-32 w-32 rounded-full bg-muted animate-pulse" />,
  ssr: false,
});

// =====================================================================
// Sign-Up Wizard Component
// =====================================================================
// Multi-step registration wizard with validation guards
// Requirements: 1.1, 8.1, 8.2, 13.1-13.9, 14.1-14.7, 15.1-15.7

interface SignUpWizardProps {
  className?: string;
}

type WizardStep = 1 | 2 | 3 | 4;

interface WizardState {
  currentStep: WizardStep;
  formData: SignUpStepData;
  errors: Record<string, string>;
}

export function SignUpWizard({ className }: SignUpWizardProps) {
  const router = useRouter();
  const { mutate: signUp, isPending: isSubmitting } = useSignUp();

  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    formData: {
      step1: { email: '' },
      step2: { username: '', displayName: '' },
      step3: { password: '', confirmPassword: '' },
      step4: { bio: '', avatarUrl: '', avatarPublicId: '' },
    },
    errors: {},
  });

  // ===================================================================
  // Step 1: Email Input with Availability Check
  // ===================================================================

  const {
    data: emailAvailability,
    isLoading: isCheckingEmail,
    debouncedEmail,
  } = useEmailAvailability(state.formData.step1.email);

  const handleStep1Change = (email: string) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        step1: { email },
      },
      errors: { ...prev.errors, email: '' },
    }));
  };

  const validateStep1 = (): boolean => {
    const result = step1Schema.safeParse(state.formData.step1);

    if (!result.success) {
      const error = result.error;
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, email: error.message },
      }));
      return false;
    }

    if (
      debouncedEmail === state.formData.step1.email &&
      emailAvailability &&
      !emailAvailability.available
    ) {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, email: 'This email is already registered' },
      }));
      return false;
    }

    return true;
  };

  // ===================================================================
  // Step 2: Username Input with Availability Check
  // ===================================================================

  const {
    data: usernameAvailability,
    isLoading: isCheckingUsername,
    debouncedUsername,
  } = useUsernameAvailability(state.formData.step2.username);

  const handleStep2Change = (field: 'username' | 'displayName', value: string) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        step2: {
          ...prev.formData.step2,
          [field]: value,
        },
      },
      errors: { ...prev.errors, [field]: '' },
    }));
  };

  const validateStep2 = (): boolean => {
    const result = step2Schema.safeParse(state.formData.step2);

    if (!result.success) {
      const error = result.error;
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, username: error.message },
      }));
      return false;
    }

    if (
      debouncedUsername === state.formData.step2.username &&
      usernameAvailability &&
      !usernameAvailability.available
    ) {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, username: 'This username is taken' },
      }));
      return false;
    }

    return true;
  };

  // ===================================================================
  // Step 3: Password Input with Strength Validation
  // ===================================================================

  const handleStep3Change = (field: 'password' | 'confirmPassword', value: string) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        step3: {
          ...prev.formData.step3,
          [field]: value,
        },
      },
      errors: { ...prev.errors, [field]: '' },
    }));
  };

  const validateStep3 = (): boolean => {
    const result = step3Schema.safeParse(state.formData.step3);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, ...errors },
      }));
      return false;
    }

    return true;
  };

  // ===================================================================
  // Step 4: Optional Profile Data
  // ===================================================================

  const handleStep4Change = (
    field: 'bio' | 'avatarUrl' | 'avatarPublicId',
    value: string
  ) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        step4: {
          ...prev.formData.step4,
          [field]: value,
        },
      },
    }));
  };

  const handleProfilePictureUpload = (url: string, publicId: string) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        step4: {
          ...prev.formData.step4,
          avatarUrl: url,
          avatarPublicId: publicId,
        },
      },
    }));
  };

  const validateStep4 = (): boolean => {
    const result = step4Schema.safeParse(state.formData.step4);
    return result.success;
  };

  // ===================================================================
  // Navigation and Submission
  // ===================================================================

  const handleNext = () => {
    let isValid = false;

    switch (state.currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
    }

    if (isValid && state.currentStep < 4) {
      setState((prev) => ({
        ...prev,
        currentStep: (prev.currentStep + 1) as WizardStep,
      }));
    }
  };

  const handleBack = () => {
    if (state.currentStep > 1) {
      setState((prev) => ({
        ...prev,
        currentStep: (prev.currentStep - 1) as WizardStep,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Guard: Prevent submission if not on the final step
    if (state.currentStep !== 4) {
      handleNext();
      return;
    }

    if (!validateStep4()) return;

    const formData = {
      email: state.formData.step1.email,
      username: state.formData.step2.username,
      password: state.formData.step3.password,
      confirmPassword: state.formData.step3.confirmPassword,
      displayName: state.formData.step2.displayName,
      bio: state.formData.step4.bio,
      avatarUrl: state.formData.step4.avatarUrl,
      avatarPublicId: state.formData.step4.avatarPublicId,
    };

    signUp(formData, {
      onError: (error) => {
        setState((prev) => ({
          ...prev,
          errors: { submit: error.message },
        }));
      },
    });
  };

  // ===================================================================
  // Render Helpers
  // ===================================================================

  const canProceed = () => {
    switch (state.currentStep) {
      case 1:
        return (
          state.formData.step1.email.length > 0 &&
          !isCheckingEmail &&
          emailAvailability?.available === true
        );
      case 2:
        return (
          state.formData.step2.username.length > 0 &&
          state.formData.step2.displayName &&
          state.formData.step2.displayName.length > 0 &&
          !isCheckingUsername &&
          usernameAvailability?.available === true
        );
      case 3:
        return (
          state.formData.step3.password.length > 0 &&
          state.formData.step3.confirmPassword.length > 0
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <Card className={cn('w-full max-w-2xl border-none glassmorphism shadow-2xl relative overflow-hidden', className)}>
      {/* Internal decorative glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 z-20" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-[60px] -ml-24 -mb-24 z-20" />
      
      <CardHeader className="p-10 md:p-12 pb-0 relative z-30">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/20 font-black italic text-xl shadow-glow-primary">
                0{state.currentStep}
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-primary">Transmission Progress</CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground/60">Step {state.currentStep} of 4</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black italic tracking-tighter text-primary">
                {Math.round((state.currentStep / 4) * 100)}%
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Sync</span>
            </div>
          </div>
          <Progress 
            value={(state.currentStep / 4) * 100} 
            className="h-2.5"
            aria-label="Registration progress"
            aria-valuenow={(state.currentStep / 4) * 100}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </CardHeader>

      <CardContent className="p-10 md:p-12 pt-10">
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Email */}
        {state.currentStep === 1 && (
          <Step1Email
            email={state.formData.step1.email}
            onChange={handleStep1Change}
            error={state.errors.email}
            isChecking={isCheckingEmail}
            availability={emailAvailability}
            debouncedEmail={debouncedEmail}
          />
        )}

        {/* Step 2: Identity (Username & Display Name) */}
        {state.currentStep === 2 && (
          <Step2Identity
            username={state.formData.step2.username}
            displayName={state.formData.step2.displayName || ''}
            onChange={handleStep2Change}
            errors={{
              username: state.errors.username,
              displayName: state.errors.displayName,
            }}
            isChecking={isCheckingUsername}
            availability={usernameAvailability}
            debouncedUsername={debouncedUsername}
          />
        )}

        {/* Step 3: Password */}
        {state.currentStep === 3 && (
          <Step3Password
            password={state.formData.step3.password}
            confirmPassword={state.formData.step3.confirmPassword}
            onChange={handleStep3Change}
            errors={{
              password: state.errors.password,
              confirmPassword: state.errors.confirmPassword,
            }}
          />
        )}

        {/* Step 4: Profile */}
        {state.currentStep === 4 && (
          <Step4Profile
            bio={state.formData.step4.bio}
            onChange={handleStep4Change}
            onUploadComplete={handleProfilePictureUpload}
          />
        )}

        {/* Submit Error */}
        {state.errors.submit && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {state.errors.submit}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4 relative z-10">
          {state.currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex-1 h-14 md:h-16 rounded-2xl border-white/10"
            >
              <ChevronLeft className="size-5 mr-1" />
              Return
            </Button>
          )}
 
          {state.currentStep < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 h-14 md:h-16 rounded-2xl shadow-glow-primary group"
            >
              Next Phase
              <ChevronRight className="size-5 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-14 md:h-16 rounded-2xl shadow-glow-primary group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Finalizing...
                </>
              ) : (
                <>
                  Sync Account
                  <Sparkles className="size-5 ml-2 transition-transform group-hover:scale-110" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
      </CardContent>
    </Card>
  );
}

// =====================================================================
// Step Components
// =====================================================================

interface Step1EmailProps {
  email: string;
  onChange: (email: string) => void;
  error?: string;
  isChecking: boolean;
  availability?: { available: boolean; message: string };
  debouncedEmail: string;
}

function Step1Email({
  email,
  onChange,
  error,
  isChecking,
  availability,
  debouncedEmail,
}: Step1EmailProps) {
  const showAvailability = debouncedEmail === email && availability && !error;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-bold tracking-tight">What's your <span className="text-secondary italic">Email?</span></h2>
        <p className="text-muted-foreground leading-relaxed">
          The stars need a way to reach you. We'll send a transmission to confirm your identity.
        </p>
      </div>
 
      <div className="space-y-3">
        <Label htmlFor="email" className="ml-1">
          Transmission Address
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-16 text-lg',
            error && 'border-destructive focus:ring-destructive'
          )}
          placeholder="you@nebula.com"
          autoComplete="email"
          aria-invalid={!!error}
          aria-describedby={error ? 'email-error' : undefined}
        />

        {isChecking && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Checking availability...
          </p>
        )}

        {showAvailability && (
          <p
            className={cn(
              'flex items-center gap-2 text-sm',
              availability.available
                ? 'text-green-600 dark:text-green-400'
                : 'text-destructive'
            )}
          >
            {availability.available && <Check className="size-4" />}
            {availability.message}
          </p>
        )}

        {error && (
          <p id="email-error" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

interface Step2IdentityProps {
  username: string;
  displayName: string;
  onChange: (field: 'username' | 'displayName', value: string) => void;
  errors: {
    username?: string;
    displayName?: string;
  };
  isChecking: boolean;
  availability?: { available: boolean; message: string };
  debouncedUsername: string;
}

function Step2Identity({
  username,
  displayName,
  onChange,
  errors,
  isChecking,
  availability,
  debouncedUsername,
}: Step2IdentityProps) {
  const showAvailability = debouncedUsername === username && availability && !errors.username;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Your <span className="text-primary italic">Identity</span></h2>
        <p className="text-muted-foreground leading-relaxed">
          Manifest your presence in the cosynq universe.
        </p>
      </div>
 
      <div className="space-y-6">
        {/* Display Name Input */}
        <div className="space-y-3">
          <Label htmlFor="displayName" className="ml-1">
            Display Alias
          </Label>
          <Input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => onChange('displayName', e.target.value)}
            className={cn(
              'h-16 text-lg',
              errors.displayName && 'border-destructive focus:ring-destructive'
            )}
            placeholder="E.g. Jace Beleren"
            autoComplete="name"
            maxLength={50}
          />
          {errors.displayName && (
            <p className="text-sm text-destructive font-bold">{errors.displayName}</p>
          )}
        </div>
 
        {/* Username Input with @ prefix */}
        <div className="space-y-3">
          <Label htmlFor="username" className="ml-1">
            Galactic @Handle
          </Label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">@</span>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => onChange('username', e.target.value)}
              className={cn(
                'h-16 pl-12 text-lg',
                errors.username && 'border-destructive focus:ring-destructive'
              )}
              placeholder="cosplayer123"
              autoComplete="username"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
          </div>

          {isChecking && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Checking availability...
            </p>
          )}

          {showAvailability && (
            <p
              className={cn(
                'flex items-center gap-2 text-sm',
                availability.available
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-destructive'
              )}
            >
              {availability.available && <Check className="size-4" />}
              {availability.message}
            </p>
          )}

          {errors.username && (
            <p id="username-error" className="text-sm text-destructive">
              {errors.username}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface Step3PasswordProps {
  password: string;
  confirmPassword: string;
  onChange: (field: 'password' | 'confirmPassword', value: string) => void;
  errors: {
    password?: string;
    confirmPassword?: string;
  };
}

function Step3Password({
  password,
  confirmPassword,
  onChange,
  errors,
}: Step3PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Secure your <span className="text-accent italic">Orbit</span></h2>
        <p className="text-muted-foreground leading-relaxed">
          Create a strong pass-key to keep your sanctuary safe.
        </p>
      </div>
 
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="password" className="ml-1">
            New Pass-Key
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onChange('password', e.target.value)}
              className={cn(
                'h-16 text-lg pr-12',
                errors.password && 'border-destructive focus:ring-destructive'
              )}
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <ShieldCheck className="size-5 text-primary" /> : <ShieldCheck className="size-5" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-sm text-destructive font-bold">
              {errors.password}
            </p>
          )}
        </div>
 
        <PasswordChecklist password={password} />
 
        <div className="space-y-3">
          <Label htmlFor="confirmPassword" className="ml-1">
            Confirm Identity
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => onChange('confirmPassword', e.target.value)}
              className={cn(
                'h-16 text-lg pr-12',
                errors.confirmPassword && 'border-destructive focus:ring-destructive'
              )}
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <ShieldCheck className="size-5 text-primary" /> : <ShieldCheck className="size-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="text-sm text-destructive font-bold">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface Step4ProfileProps {
  bio?: string;
  onChange: (field: 'bio', value: string) => void;
  onUploadComplete: (url: string, publicId: string) => void;
}

function Step4Profile({
  bio,
  onChange,
  onUploadComplete,
}: Step4ProfileProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Finalize <span className="text-primary italic">Chronicle</span></h2>
        <p className="text-muted-foreground leading-relaxed">
          Tell the stars about your craft. (Optional)
        </p>
      </div>
 
      <ProfilePictureUpload onUploadComplete={onUploadComplete} />
 
      <div className="space-y-3">
        <Label htmlFor="bio" className="ml-1">
          The Chronicle (Bio)
        </Label>
        <Textarea
          id="bio"
          value={bio || ''}
          onChange={(e) => onChange('bio', e.target.value)}
          placeholder="I build props out of foam and dreams..."
          rows={5}
          maxLength={500}
        />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right italic">
          {(bio || '').length} / 500 Transferred
        </p>
      </div>
    </div>
  );
}
