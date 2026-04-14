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
    <Card className={cn('w-full border-none glassmorphism shadow-2xl relative overflow-hidden group', className)}>
      {/* Internal Decorative Glow Elements - Requirement 10.6, hidden from screen readers */}
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-20" aria-hidden="true" />
      
      {/* Corner orbs */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-4 left-4 w-20 h-20 bg-secondary/5 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
      
      <CardHeader className="p-10 pb-0 text-center space-y-2">
        <CardTitle className="text-4xl font-black italic tracking-tighter">SECURE <span className="text-primary shadow-glow-primary shadow-none">ORBIT</span></CardTitle>
        <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Initialize Identity Sync</CardDescription>
      </CardHeader>

      <CardContent className="p-10">
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {/* Email or Username Input */}
          <div className="space-y-3">
            <Label htmlFor="emailOrUsername" className="ml-1">
              Galactic ID
            </Label>
            <Input
              id="emailOrUsername"
              type="text"
              value={formData.emailOrUsername}
              onChange={(e) => handleChange('emailOrUsername', e.target.value)}
              placeholder="Email or @username"
              autoComplete="username"
              required
              className="h-16 text-lg rounded-2xl"
              aria-invalid={!!error}
              aria-describedby={error ? 'signin-error' : undefined}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password">
                Pass-Key
              </Label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline hover:text-primary/80 transition-colors italic"
              >
                Forgot identity?
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
                className="h-16 pr-14 text-lg rounded-2xl"
                aria-invalid={!!error}
                aria-describedby={error ? 'signin-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2"
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
              className="flex items-start gap-2 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 glassmorphism"
              role="alert"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">{error.message}</p>
                {showResendLink && userEmail && (
                  <div className="mt-2 text-xs">
                    {resendSuccess ? (
                      <p className="text-green-600 dark:text-green-400 font-bold">
                        Verification email sent successfully!
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={isResending}
                        className="text-primary font-black uppercase tracking-widest hover:underline disabled:opacity-50"
                      >
                        {isResending ? 'Sending...' : 'Resend verification email'}
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
            className="w-full h-16 text-lg font-black uppercase tracking-[0.2em] italic rounded-[2rem]"
            size="lg"
            variant="celestial"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Initialize Session
                <Sparkles className="ml-2 size-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="p-10 pt-0 flex flex-col gap-4">
        <div className="w-full h-px bg-white/5" />
        <div className="text-center text-sm font-medium relative z-10 w-full">
          <span className="text-muted-foreground">New to this orbit?</span>{' '}
          <Link href="/sign-up" className="text-primary font-black uppercase tracking-widest hover:underline transition-all">
            Join the Sanctuary
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
