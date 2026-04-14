'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useResendVerification } from '@/lib/hooks/use-auth';

// =====================================================================
// Email Verification Screen Component
// =====================================================================
// Post-signup screen with resend functionality and countdown timer
// Requirements: 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8, 20.9, 20.10, 20.11, 20.12, 20.13, 20.14, 20.15, 20.16, 20.28

interface EmailVerificationScreenProps {
  email: string;
  className?: string;
}

export function EmailVerificationScreen({
  email,
  className,
}: EmailVerificationScreenProps) {
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const {
    mutate: resendVerification,
    isPending: isResending,
    isSuccess: resendSuccess,
    isError: resendError,
    error,
  } = useResendVerification();

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleResend = () => {
    if (!canResend || isResending) return;

    resendVerification(email, {
      onSuccess: () => {
        setCanResend(false);
        setCountdown(60);
      },
    });
  };

  return (
    <div className={cn('w-full max-w-md space-y-8 text-center', className)}>
      {/* Icon */}
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/10 p-6">
          <Mail className="size-12 text-primary" aria-hidden="true" />
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-3">
        <h1 className="font-quicksand text-3xl font-semibold">
          Check your inbox
        </h1>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            We've sent a verification link to
          </p>
          <p className="font-medium text-foreground">{email}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-4 rounded-lg border bg-muted/50 p-6 text-left">
        <p className="text-sm text-muted-foreground">
          Click the verification link in the email to activate your account.
        </p>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <p>
            Can't find the email? Check your spam folder or try resending it.
          </p>
        </div>
      </div>

      {/* Resend Section */}
      <div className="space-y-4">
        {resendSuccess && (
          <div className="flex items-center justify-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="size-4 shrink-0" />
            <p>Verification email sent successfully!</p>
          </div>
        )}

        {resendError && error && (
          <div className="flex items-center justify-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <p>{error.message}</p>
          </div>
        )}

        <div className="space-y-2">
          <Button
            onClick={handleResend}
            disabled={!canResend || isResending}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {isResending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : canResend ? (
              'Resend verification email'
            ) : (
              `Resend in ${countdown}s`
            )}
          </Button>

          {!canResend && countdown > 0 && (
            <p className="text-xs text-muted-foreground">
              You can resend the verification email in {countdown} seconds
            </p>
          )}
        </div>
      </div>

      {/* Return to Sign In */}
      <div className="pt-4">
        <Link
          href="/sign-in"
          className="text-sm text-primary hover:underline"
        >
          Return to sign in
        </Link>
      </div>

      {/* Celestial Animation (Optional Enhancement) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-30">
        <div className="absolute left-1/4 top-1/4 size-64 animate-pulse rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 animate-pulse rounded-full bg-primary/10 blur-3xl animation-delay-2000" />
      </div>
    </div>
  );
}
