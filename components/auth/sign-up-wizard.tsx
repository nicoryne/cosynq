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
      step1: { email: '', username: '' },
      step2: { password: '', confirmPassword: '' },
      step3: { displayName: '', bio: '' },
      step4: { avatarUrl: '', avatarPublicId: '' },
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

  const {
    data: usernameAvailability,
    isLoading: isCheckingUsername,
    debouncedUsername,
  } = useUsernameAvailability(state.formData.step1.username);

  const handleStep1Change = (field: 'email' | 'username', value: string) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        step1: {
          ...prev.formData.step1,
          [field]: value,
        },
      },
      errors: { ...prev.errors, [field]: '' },
    }));
  };

  const validateStep1 = (): boolean => {
    const result = step1Schema.safeParse(state.formData.step1);

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

    if (
      debouncedUsername === state.formData.step1.username &&
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
  // Step 2: Security (Password)
  // ===================================================================

  const handleStep2Change = (field: 'password' | 'confirmPassword', value: string) => {
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
  // Step 3: Identity (Display Name & Bio)
  // ===================================================================

  const handleStep3Change = (field: 'displayName' | 'bio', value: string) => {
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
      username: state.formData.step1.username,
      password: state.formData.step2.password,
      confirmPassword: state.formData.step2.confirmPassword,
      displayName: state.formData.step3.displayName,
      bio: state.formData.step3.bio,
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
          state.formData.step1.username.length > 0 &&
          !isCheckingEmail &&
          !isCheckingUsername &&
          emailAvailability?.available === true &&
          usernameAvailability?.available === true
        );
      case 2:
        return (
          state.formData.step2.password.length > 0 &&
          state.formData.step2.confirmPassword.length > 0
        );
      case 3:
        return (
          state.formData.step3.displayName &&
          state.formData.step3.displayName.length > 0
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
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/20 font-black text-xl shadow-glow-primary">
                0{state.currentStep}
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl md:text-3xl font-black tracking-tight">Sign Up</CardTitle>
                <CardDescription className="text-sm font-medium text-muted-foreground/80 mt-2">
                  Let's get you started!
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black tracking-tighter text-primary">
                {Math.round((state.currentStep / 4) * 100)}%
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Progress</span>
            </div>
          </div>
          <Progress
            value={(state.currentStep / 4) * 100}
            className="h-2"
            aria-label="Registration progress"
          />
        </div>
      </CardHeader>

      <CardContent className="p-10 md:p-12 pt-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Credentials (Email & Username) */}
          {state.currentStep === 1 && (
            <Step1Credentials
              email={state.formData.step1.email}
              username={state.formData.step1.username}
              onChange={handleStep1Change}
              errors={{
                email: state.errors.email,
                username: state.errors.username,
              }}
              isCheckingEmail={isCheckingEmail}
              isCheckingUsername={isCheckingUsername}
              emailAvailability={emailAvailability}
              usernameAvailability={usernameAvailability}
              debouncedEmail={debouncedEmail}
              debouncedUsername={debouncedUsername}
            />
          )}

          {/* Step 2: Security (Password) */}
          {state.currentStep === 2 && (
            <Step2Security
              password={state.formData.step2.password}
              confirmPassword={state.formData.step2.confirmPassword}
              onChange={handleStep2Change}
              errors={{
                password: state.errors.password,
                confirmPassword: state.errors.confirmPassword,
              }}
            />
          )}

          {/* Step 3: Identity (Display Name & Bio) */}
          {state.currentStep === 3 && (
            <Step3Identity
              displayName={state.formData.step3.displayName || ''}
              bio={state.formData.step3.bio || ''}
              onChange={handleStep3Change}
              errors={{
                displayName: state.errors.displayName,
                bio: state.errors.bio,
              }}
            />
          )}

          {/* Step 4: Visual (Profile Picture) */}
          {state.currentStep === 4 && (
            <Step4Visual
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
                className="flex-1 h-14 md:h-16 rounded-full border-foreground/10"
              >
                <ChevronLeft className="size-5 mr-1" />
                Back
              </Button>
            )}

            {state.currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 h-14 md:h-16 rounded-full"
                variant="default"
              >
                Continue
                <ChevronRight className="size-5 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-14 md:h-16 rounded-full"
                variant="default"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
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

interface Step1CredentialsProps {
  email: string;
  username: string;
  onChange: (field: 'email' | 'username', value: string) => void;
  errors: {
    email?: string;
    username?: string;
  };
  isCheckingEmail: boolean;
  isCheckingUsername: boolean;
  emailAvailability?: { available: boolean; message: string };
  usernameAvailability?: { available: boolean; message: string };
  debouncedEmail: string;
  debouncedUsername: string;
}

function Step1Credentials({
  email,
  username,
  onChange,
  errors,
  isCheckingEmail,
  isCheckingUsername,
  emailAvailability,
  usernameAvailability,
  debouncedEmail,
  debouncedUsername,
}: Step1CredentialsProps) {
  const showEmailAvailability = debouncedEmail === email && emailAvailability && !errors.email;
  const showUsernameAvailability = debouncedUsername === username && usernameAvailability && !errors.username;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-black tracking-tight">Credentials</h2>
        <p className="text-muted-foreground leading-relaxed">
          The stars need a way to reach you and a name to call you in the void.
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 italic">
          Note: Your email and username are permanent and cannot be changed later.
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Input */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="email" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onChange('email', e.target.value)}
            className={cn(
              'h-14 text-base rounded-full border-foreground/10 bg-foreground/5 focus-visible:ring-primary/50',
              errors.email && 'border-destructive focus:ring-destructive'
            )}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {isCheckingEmail && (
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">
              <Loader2 className="size-3 animate-spin" />
              Scanning frequency...
            </p>
          )}
          {showEmailAvailability && (
            <p className={cn('flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ml-4', emailAvailability.available ? 'text-green-500' : 'text-destructive')}>
              {emailAvailability.available ? <Check className="size-3" /> : null}
              {emailAvailability.message}
            </p>
          )}
          {errors.email && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-destructive ml-4">{errors.email}</p>
          )}
        </div>

        {/* Username Input */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="username" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Username
          </Label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">@</span>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => onChange('username', e.target.value)}
              className={cn(
                'h-14 pl-12 text-base rounded-full border-foreground/10 bg-foreground/5 focus-visible:ring-primary/50',
                errors.username && 'border-destructive focus:ring-destructive'
              )}
              placeholder="cosplayer123"
              autoComplete="username"
            />
          </div>
          {isCheckingUsername && (
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">
              <Loader2 className="size-3 animate-spin" />
              Checking signal availability...
            </p>
          )}
          {showUsernameAvailability && (
            <p className={cn('flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ml-4', usernameAvailability.available ? 'text-green-500' : 'text-destructive')}>
              {usernameAvailability.available ? <Check className="size-3" /> : null}
              {usernameAvailability.message}
            </p>
          )}
          {errors.username && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-destructive ml-4">{errors.username}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface Step2SecurityProps {
  password: string;
  confirmPassword: string;
  onChange: (field: 'password' | 'confirmPassword', value: string) => void;
  errors: {
    password?: string;
    confirmPassword?: string;
  };
}

function Step2Security({
  password,
  confirmPassword,
  onChange,
  errors,
}: Step2SecurityProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-black tracking-tight">Security</h2>
        <p className="text-muted-foreground leading-relaxed">
          Create a strong password to keep your sanctuary safe from the stars.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="password" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onChange('password', e.target.value)}
              className={cn(
                'h-14 pr-14 text-base rounded-full border-foreground/10 bg-foreground/5 focus-visible:ring-primary/50',
                errors.password && 'border-destructive focus:ring-destructive'
              )}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2"
            >
              {showPassword ? <ShieldCheck className="size-5 text-primary" /> : <ShieldCheck className="size-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-destructive ml-4">{errors.password}</p>
          )}
        </div>

        <PasswordChecklist password={password} />

        <div className="flex flex-col gap-3">
          <Label htmlFor="confirmPassword" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => onChange('confirmPassword', e.target.value)}
              className={cn(
                'h-14 pr-14 text-base rounded-full border-foreground/10 bg-foreground/5 focus-visible:ring-primary/50',
                errors.confirmPassword && 'border-destructive focus:ring-destructive'
              )}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2"
            >
              {showConfirmPassword ? <ShieldCheck className="size-5 text-primary" /> : <ShieldCheck className="size-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-destructive ml-4">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface Step3IdentityProps {
  displayName: string;
  bio: string;
  onChange: (field: 'displayName' | 'bio', value: string) => void;
  errors: {
    displayName?: string;
    bio?: string;
  };
}

function Step3Identity({
  displayName,
  bio,
  onChange,
  errors,
}: Step3IdentityProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-black tracking-tight">Public Identity</h2>
        <p className="text-muted-foreground leading-relaxed">
          How do you want to be known in the celestial sanctuary?
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 italic">
          Don't worry, you can change your display name and bio anytime from your profile settings.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="displayName" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Display Name
          </Label>
          <Input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => onChange('displayName', e.target.value)}
            className={cn(
              'h-14 text-base rounded-full border-foreground/10 bg-foreground/5 focus-visible:ring-primary/50',
              errors.displayName && 'border-destructive focus:ring-destructive'
            )}
            placeholder="E.g. Jace Beleren"
            autoComplete="name"
            maxLength={50}
          />
          {errors.displayName && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-destructive ml-4">{errors.displayName}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="bio" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            The Chronicle (Bio)
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => onChange('bio', e.target.value)}
            className="rounded-[2rem] border-foreground/10 bg-foreground/5 focus-visible:ring-primary/50 p-6"
            placeholder="I build props out of foam and dreams..."
            rows={5}
            maxLength={500}
          />
          <div className="flex justify-between items-center px-2">
             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">
              Optional bio for your profile
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
              {bio.length} / 500 Transferred
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Step4VisualProps {
  onUploadComplete: (url: string, publicId: string) => void;
}

function Step4Visual({
  onUploadComplete,
}: Step4VisualProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-black tracking-tight">Finalize <span className="text-primary italic">Aura</span></h2>
        <p className="text-muted-foreground leading-relaxed">
          Upload a profile picture to complete your visual orbit. (Optional)
        </p>
      </div>

      <ProfilePictureUpload onUploadComplete={onUploadComplete} />
    </div>
  );
}
