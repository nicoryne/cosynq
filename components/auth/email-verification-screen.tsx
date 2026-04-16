'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useResendVerification, useVerificationPolling } from '@/lib/hooks/use-auth';

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
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Custom hook for background verification monitoring
  const { data: user } = useVerificationPolling();

  const {
    mutate: resendVerification,
    isPending: isResending,
    isSuccess: resendSuccess,
    isError: resendError,
    error,
  } = useResendVerification();

  /**
   * Automatic redirection when verification is detected
   */
  useEffect(() => {
    if (user?.emailConfirmed) {
      // Small delay for UX to let the user see the "Success" state if they were looking
      const timeout = setTimeout(() => {
        router.push('/hub');
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [user?.emailConfirmed, router]);

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
    <div className={cn('w-full max-w-md space-y-8 text-center relative', className)}>
      {/* Icon */}
      <div className="flex justify-center relative">
        <div className="rounded-full bg-primary/10 p-6 relative z-10">
          <Mail className="size-12 text-primary" aria-hidden="true" />
        </div>
        {/* Pulsating Aether Signal Ring */}
        <div className="absolute inset-x-0 top-0 flex justify-center">
          <div className="size-24 rounded-full border-2 border-primary/20 animate-ping opacity-20" />
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-3">
        <h1 className="font-heading text-3xl font-black tracking-tight">
          Orbital <span className="text-primary italic">Sync</span>
        </h1>
        <div className="space-y-2">
          <p className="text-sm md:text-base text-muted-foreground/60">
            A verification signal has been beamed to
          </p>
          <div className="flex flex-col items-center gap-2">
            <p className="font-black text-lg tracking-tight text-foreground">{email}</p>
            {/* Sync Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_hsl(var(--primary))]"></span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/80">
                Listening for Signal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Success (Auto-detecting) */}
      {user?.emailConfirmed && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 p-4 text-sm text-primary animate-in zoom-in-95 duration-500 shadow-glow-primary/20">
          <CheckCircle className="size-5 shrink-0" />
          <p className="font-bold">Signal Established! Transitioning to Hub...</p>
        </div>
      )}

      {/* Instructions */}
      <div className="space-y-4 rounded-2xl glassmorphism border-white/5 p-6 text-left">
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Click the link in the email to activate your account. You don't need to refresh this page—we'll automatically pull you into orbit once you're verified.
        </p>
        <div className="flex items-start gap-3 text-xs text-muted-foreground/60">
          <AlertCircle className="size-4 shrink-0 mt-0.5 text-primary/40" />
          <p>
            Can't find the transmission? Check your spam folder or trigger a re-broadcast below.
          </p>
        </div>
      </div>

      {/* Resend Section */}
      <div className="space-y-4">
        {resendSuccess && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-green-500/10 p-3 text-sm text-green-500/80 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="size-4 shrink-0" />
            <p className="font-bold">Transmission re-broadcasted!</p>
          </div>
        )}

        {resendError && error && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="size-4 shrink-0" />
            <p className="font-bold">{error.message}</p>
          </div>
        )}

        <div className="space-y-2">
          <Button
            onClick={handleResend}
            disabled={!canResend || isResending}
            variant="ghost"
            className="w-full h-14 rounded-2xl border border-white/5 hover:bg-white/5 font-black uppercase tracking-[0.2em] text-[11px]"
          >
            {isResending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Broadcasting...
              </>
            ) : canResend ? (
              'Re-broadcast Signal'
            ) : (
              `Wait ${countdown}s`
            )}
          </Button>
        </div>
      </div>

      {/* Return to Sign In */}
      <div className="pt-4">
        <Link
          href="/sign-in"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary transition-colors"
        >
          Abort and Sign In
        </Link>
      </div>

      {/* Celestial Background Aura */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-20">
        <div className="absolute left-1/4 top-1/4 size-64 animate-pulse rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 animate-pulse rounded-full bg-secondary/10 blur-3xl animation-delay-2000" />
      </div>
    </div>
  );
}
