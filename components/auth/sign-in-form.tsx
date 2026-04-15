'use client';

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignIn } from '@/lib/hooks/use-auth';
import { useResendVerification } from '@/lib/hooks/use-auth';
import type { SignInFormData } from '@/lib/types/auth.types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// =====================================================================
// Sign-In Form Component
// =====================================================================
// Authentication form with email verification handling
// Requirements: 2.1, 2.4, 2.5, 2.9, 2.10, 2.11, 2.12, 8.5, 8.6, 8.7, 20.18, 20.19

interface SignInFormProps {
  className?: string;
  redirectTo?: string;
}

export function SignInForm({ className, redirectTo }: SignInFormProps) {
  const [formData, setFormData] = useState<SignInFormData>({
    emailOrUsername: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showResendLink, setShowResendLink] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  const { mutate: signIn, isPending, error } = useSignIn();
  const {
    mutate: resendVerification,
    isPending: isResending,
    isSuccess: resendSuccess,
  } = useResendVerification();

  const handleChange = (field: keyof SignInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setShowResendLink(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signIn(formData, {
      onError: (error) => {
        // Check if error is due to unverified email
        if (
          error.message.includes('verify your email') ||
          error.message.includes('email not confirmed')
        ) {
          setShowResendLink(true);
          // Try to extract email from the form data
          const email = formData.emailOrUsername.includes('@')
            ? formData.emailOrUsername
            : '';
          setUserEmail(email);
        }
      },
    });
  };

  const handleResendVerification = () => {
    if (userEmail) {
      resendVerification(userEmail);
    }
  };

  return (
    <Card className={cn('w-full border-none glassmorphism shadow-glow-primary/10 relative overflow-hidden', className)}>
      <CardHeader className="p-10 pb-4 text-center">
        <CardTitle className="text-3xl font-black tracking-tight">Sign In</CardTitle>
        <CardDescription className="text-sm font-medium text-muted-foreground/80 mt-2">
          Let's get you in!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {/* Email or Username Input */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="emailOrUsername" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Email or Username
            </Label>
            <Input
              id="emailOrUsername"
              type="text"
              value={formData.emailOrUsername}
              onChange={(e) => handleChange('emailOrUsername', e.target.value)}
              placeholder="Enter your email or @username"
              autoComplete="username"
              required
              className="h-14 text-base rounded-full border-foreground/10 bg-foreground/5 focus-visible:ring-primary/50"
              aria-invalid={!!error}
              aria-describedby={error ? 'signin-error' : undefined}
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between ml-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="h-14 pr-14 text-base rounded-full border-foreground/10 bg-foreground/5 focus-visible:ring-primary/50"
                aria-invalid={!!error}
                aria-describedby={error ? 'signin-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              id="signin-error"
              className="flex items-start gap-4 rounded-[2rem] bg-destructive/10 p-5 text-sm text-destructive border border-destructive/20 glassmorphism animate-in fade-in zoom-in-95 duration-300"
              role="alert"
            >
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="font-black uppercase tracking-widest text-[10px]">Transmission Error</p>
                <p className="font-medium text-destructive/90">{error.message}</p>
                {showResendLink && userEmail && (
                  <div className="mt-3">
                    {resendSuccess ? (
                      <p className="text-green-500 font-bold">
                        Verification coordinates sent!
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={isResending}
                        className="text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:underline disabled:opacity-50"
                      >
                        {isResending ? 'Resending...' : 'Resend Verification'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-16 text-lg font-black uppercase tracking-[0.2em]"
            size="xl"
            variant="celestial"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                Sign In
                <Sparkles className="ml-2 size-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="p-10 pt-0 flex flex-col gap-6">
        <div className="w-full h-px bg-white/5" />
        <div className="text-center text-sm font-medium relative z-10 w-full">
          <span className="text-muted-foreground">Don't have an account?</span>{' '}
          <Link href="/sign-up" className="text-primary font-black hover:underline transition-all">
            Join the Dreamers
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
