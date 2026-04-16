'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { AlertCircle, Sparkles, ShieldCheck, Loader2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PasswordChecklist } from './password-checklist';
import { useEmailAvailability } from '@/lib/hooks/use-availability';
import { useUsernameAvailability } from '@/lib/hooks/use-availability';
import { useSignUp, AuthError } from '@/lib/hooks/use-auth';

// =====================================================================
// Internal Components
// =====================================================================

const CelestialError = ({ message, className }: { message: string, className?: string }) => (
  <div className={cn(
    "rounded-xl border border-destructive/20 bg-destructive/5 backdrop-blur-md px-4 py-3 text-xs text-destructive shadow-glow-destructive flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300",
    className
  )}>
    <div className="size-5 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20">
      <AlertCircle className="size-3" />
    </div>
    <span className="font-bold tracking-widest uppercase text-[10px] leading-none">{message}</span>
  </div>
);
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

import { useCloudinaryUpload } from '@/lib/hooks/use-cloudinary-upload';
import { SignUpStepCredentials } from './sign-up-step-credentials';
import { SignUpStepSecurity } from './sign-up-step-security';
import { SignUpStepIdentity } from './sign-up-step-identity';
import { SignUpStepVisual } from './sign-up-step-visual';
import { TurnstileWidget } from './turnstile-widget';
import Link from 'next/link';

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
  selectedFile: File | null;
}

export function SignUpWizard({ className }: SignUpWizardProps) {
  const router = useRouter();
  const { mutate: signUp, isPending: isActuallyCreating } = useSignUp();
  const { uploadFile, isUploading, progress: uploadProgress } = useCloudinaryUpload();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    formData: {
      step1: { email: '', username: '', agreedToTerms: false },
      step2: { password: '', confirmPassword: '' },
      step3: { displayName: '', bio: '' },
      step4: { avatarUrl: undefined, avatarPublicId: undefined, turnstileToken: '' },
    },
    errors: {},
    selectedFile: null,
  });

  const isSubmitting = isActuallyCreating || isUploading || isProcessing;

  // ===================================================================
  // Step 1: Availability Checks
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

  const handleStep1Change = (field: 'email' | 'username' | 'agreedToTerms', value: string | boolean) => {
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
  // Shared Change Handlers
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

  const handleFileSelect = (file: File | null) => {
    setState((prev) => ({
      ...prev,
      selectedFile: file,
    }));
  };

  const validateStep4 = (): boolean => {
    const result = step4Schema.safeParse(state.formData.step4);
    return result.success;
  };

  // ===================================================================
  // Navigation & Submission
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // STRICT GUARD: If we aren't on the final step, we should NEVER 
    // be able to trigger the account creation logic.
    if (state.currentStep < 4) {
      handleNext();
      return;
    }

    if (!validateStep4()) return;

    setIsProcessing(true);
    let avatarUrl: string | undefined = undefined;
    let avatarPublicId: string | undefined = undefined;

    try {
      // 1. Perform Upload if file selected
      if (state.selectedFile) {
        const uploadResult = await uploadFile(state.selectedFile);
        if (uploadResult) {
          avatarUrl = uploadResult.secure_url;
          avatarPublicId = uploadResult.public_id;
        } else {
          setIsProcessing(false);
          return; // Error handled by hook
        }
      }

      // 2. Perform Sign Up
      const formData = {
        email: state.formData.step1.email,
        username: state.formData.step1.username,
        password: state.formData.step2.password,
        confirmPassword: state.formData.step2.confirmPassword,
        displayName: state.formData.step3.displayName,
        bio: state.formData.step3.bio,
        agreedToTerms: state.formData.step1.agreedToTerms,
        avatarUrl,
        avatarPublicId,
        turnstileToken: state.formData.step4.turnstileToken,
      };

      signUp(formData as any, {
        onSuccess: () => {
          setIsRedirecting(true);
          setIsProcessing(false);
        },
        onError: (error) => {
          setIsRedirecting(false);
          const newErrors: Record<string, string> = { submit: error.message };
          
          if (error.errors) {
            // Map structured errors to single strings for our UI
            Object.entries(error.errors).forEach(([field, messages]) => {
              newErrors[field] = messages[0];
            });

            // Auto-navigate to the first step that has an error
            if (newErrors.email || newErrors.username) {
              setState(prev => ({ ...prev, currentStep: 1, errors: newErrors }));
            } else if (newErrors.password || newErrors.confirmPassword) {
              setState(prev => ({ ...prev, currentStep: 2, errors: newErrors }));
            } else if (newErrors.displayName || newErrors.bio) {
              setState(prev => ({ ...prev, currentStep: 3, errors: newErrors }));
            } else {
              setState(prev => ({ ...prev, errors: newErrors }));
            }
          } else {
            setState((prev) => ({
              ...prev,
              errors: { ...prev.errors, ...newErrors },
            }));
          }
          
          setIsProcessing(false);
        }
      });
    } catch (err) {
      setIsProcessing(false);
    }
  };

  const canProceed = () => {
    switch (state.currentStep) {
      case 1:
        return (
          state.formData.step1.email.length > 0 &&
          state.formData.step1.username.length > 0 &&
          state.formData.step1.agreedToTerms === true &&
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
    <Card className={cn(
      'w-full max-w-2xl border-none shadow-none md:shadow-2xl relative overflow-hidden bg-transparent backdrop-blur-none md:bg-background/60 md:backdrop-blur-2xl p-0 md:p-10', 
      className
    )}>
      <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 z-20 pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-[60px] -ml-24 -mb-24 z-20 pointer-events-none" />

      <CardHeader className="px-0 py-8 md:p-10 md:pb-8 relative z-30">
        <div className="space-y-6 md:space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex size-10 md:size-12 items-center justify-center rounded-xl md:rounded-2xl bg-primary/20 text-primary border border-primary/20 font-black text-base md:text-xl shadow-glow-primary shrink-0">
                0{state.currentStep}
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <CardTitle className="text-xl md:text-3xl font-black tracking-tight leading-none">Sign Up</CardTitle>
                <CardDescription className="text-[10px] md:text-sm font-medium text-muted-foreground/80 leading-none">
                  Let's get you started!
                </CardDescription>
              </div>
            </div>
            
            {/* Percentage on desktop, hidden on mobile in this slot */}
            <div className="text-right hidden md:block">
              <span className="text-2xl md:text-3xl font-black tracking-tighter text-primary">
                {Math.round((state.currentStep / 4) * 100)}%
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block leading-none">Progress</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Progress
              value={(state.currentStep / 4) * 100}
              className="h-1.5 md:h-2"
              aria-label="Registration progress"
            />
            {/* Percentage below bar on mobile */}
            <div className="flex justify-between items-center md:hidden px-1">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 leading-none">Stellar Journey</span>
              <span className="text-[10px] font-black tracking-tight text-primary tabular-nums">
                {Math.round((state.currentStep / 4) * 100)}% COMPLETE
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='px-0 pb-8 md:px-10 md:pb-10'>
        <form onSubmit={handleSubmit} className="space-y-10 md:space-y-6">
          {state.currentStep === 1 && (
            <SignUpStepCredentials
              email={state.formData.step1.email}
              username={state.formData.step1.username}
              agreedToTerms={state.formData.step1.agreedToTerms}
              onChange={handleStep1Change}
              errors={{
                email: state.errors.email,
                username: state.errors.username,
                agreedToTerms: state.errors.agreedToTerms,
              }}
              isCheckingEmail={isCheckingEmail}
              isCheckingUsername={isCheckingUsername}
              emailAvailability={emailAvailability}
              usernameAvailability={usernameAvailability}
              debouncedEmail={debouncedEmail}
              debouncedUsername={debouncedUsername}
            />
          )}

          {state.currentStep === 2 && (
            <SignUpStepSecurity
              password={state.formData.step2.password}
              confirmPassword={state.formData.step2.confirmPassword}
              onChange={handleStep2Change}
              errors={{
                password: state.errors.password,
                confirmPassword: state.errors.confirmPassword,
              }}
            />
          )}

          {state.currentStep === 3 && (
            <SignUpStepIdentity
              displayName={state.formData.step3.displayName || ''}
              bio={state.formData.step3.bio || ''}
              onChange={handleStep3Change}
              errors={{
                displayName: state.errors.displayName,
                bio: state.errors.bio,
              }}
            />
          )}

          {state.currentStep === 4 && (
            <SignUpStepVisual
              onFileSelect={handleFileSelect}
              selectedFile={state.selectedFile}
              errors={{
                avatarUrl: state.errors.avatarUrl,
                avatarPublicId: state.errors.avatarPublicId,
              }}
            />
          )}

          {state.currentStep === 4 && (
            <div className="py-4">
              <TurnstileWidget 
                onSuccess={(token) => {
                  setState(prev => ({
                    ...prev,
                    formData: {
                      ...prev.formData,
                      step4: { ...prev.formData.step4, turnstileToken: token }
                    }
                  }))
                }}
              />
            </div>
          )}

          {state.errors.submit && (
            <CelestialError message={state.errors.submit} className="mx-auto max-w-sm" />
          )}

          <div className="flex flex-col md:flex-row gap-3 pt-4 relative z-10">
            {state.currentStep < 4 ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNext();
                }}
                disabled={!canProceed() || isSubmitting}
                className="w-full md:flex-1 h-12 md:h-16 rounded-full order-1 md:order-2"
                variant="default"
              >
                Continue
                <ChevronRight className="size-5 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || isRedirecting}
                className="w-full md:flex-1 h-12 md:h-16 rounded-full relative overflow-hidden group shadow-glow-primary order-1 md:order-2"
                variant="default"
              >
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-300 pointer-events-none z-20" 
                  style={{ width: isUploading ? `${uploadProgress}%` : '0%' }}
                />
                
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-5 animate-spin" />
                    <span>
                      {isUploading 
                        ? `Igniting Orbit... ${uploadProgress}%` 
                        : isActuallyCreating 
                          ? 'Synchronizing...' 
                          : 'Processing...'}
                    </span>
                  </div>
                ) : isRedirecting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-5 animate-spin" />
                    <span>Finalizing Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Create Account</span>
                  </div>
                )}
              </Button>
            )}

            {state.currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
                className="w-full md:flex-1 h-12 md:h-16 rounded-full border-foreground/10 order-2 md:order-1"
              >
                <ChevronLeft className="size-5 mr-1" />
                Back
              </Button>
            )}
          </div>
        </form>
      </CardContent>

      {state.currentStep === 1 && (
        <CardFooter className="px-10 pt-0 pb-10 flex flex-col gap-6 hidden md:flex">
          <div className="w-full h-px bg-white/5" />
          <div className="text-center text-sm font-medium relative z-10 w-full">
            <span className="text-muted-foreground">Already a Dreamer?</span>{' '}
            <Link href="/sign-in" className="text-primary font-black hover:underline transition-all">
              Sign In
            </Link>
          </div>
        </CardFooter>
      )}

      {state.currentStep === 1 && (
        <div className="px-6 pb-8 md:hidden flex flex-col gap-4">
          <div className="w-full h-px bg-white/5" />
          <div className="text-center text-xs font-medium relative z-10 w-full">
            <span className="text-muted-foreground">Already a Dreamer?</span>{' '}
            <Link href="/sign-in" className="text-primary font-black hover:underline transition-all">
              Sign In
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
