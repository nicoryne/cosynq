'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// =====================================================================
// Verification Success Page
// =====================================================================
// View layer for successful email verification with auto-redirect
// Requirements: 20.21, 20.22, 20.23, 20.24

export default function VerifySuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Auto-redirect countdown
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // Redirect to sign-in after countdown
      router.push('/sign-in');
    }
  }, [countdown, router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-green-500/10 p-6">
            <CheckCircle
              className="size-16 text-green-600 dark:text-green-400"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-3">
          <h1 className="font-quicksand text-3xl font-semibold">
            Email verified successfully!
          </h1>
          <p className="text-muted-foreground">
            Your account is now active. You can sign in and start exploring
            cosynq.
          </p>
        </div>

        {/* Auto-redirect Notice */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Redirecting to sign in in{' '}
            <span className="font-semibold text-foreground">{countdown}</span>{' '}
            {countdown === 1 ? 'second' : 'seconds'}...
          </p>
        </div>

        {/* Manual Continue Button */}
        <Button asChild size="lg" className="w-full">
          <Link href="/sign-in">
            Continue to Sign In
            <ArrowRight className="size-4" />
          </Link>
        </Button>

        {/* Celestial Animation */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-30">
          <div className="absolute left-1/4 top-1/4 size-64 animate-pulse rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 size-96 animate-pulse rounded-full bg-green-500/10 blur-3xl animation-delay-2000" />
        </div>
      </div>
    </div>
  );
}
