'use client';

import { useState } from 'react';
import { Loader2, AlertCircle, Mail, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForgotPassword } from '@/lib/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface ForgotPasswordFormProps {
  className?: string;
}

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: forgotPassword, isPending, error } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword(email, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  };

  if (isSubmitted) {
    return (
      <Card className={cn('w-full border-none glassmorphism shadow-glow-primary/10 relative overflow-hidden', className)}>
        <CardHeader className="p-10 pb-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
              <CheckCircle2 className="size-6 text-emerald-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight underline-glow">Check Your Inbox</CardTitle>
          <CardDescription className="text-sm font-medium text-muted-foreground/80 mt-2">
            We've sent a cosmic link to <span className="text-primary font-bold">{email}</span>. Click it to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-6 text-center">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-primary font-bold uppercase tracking-widest text-xs"
            onClick={() => setIsSubmitted(false)}
          >
            Didn't get the email? Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full border-none glassmorphism shadow-glow-primary/10 relative overflow-hidden', className)}>
      <CardHeader className="p-10 pb-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3 ring-1 ring-primary/20">
            <Mail className="size-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-black tracking-tight underline-glow">Lost in Space?</CardTitle>
        <CardDescription className="text-sm font-medium text-muted-foreground/80 mt-2">
          Enter your email and we'll send you a link to regain access to your sanctuary.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-10 pt-6">
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {/* Email Address */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="email" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Cosmic Address (Email)
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@cosynq.space"
                required
                className="h-14 pl-12 text-base rounded-full border-foreground/10 bg-foreground/5 focus-visible:ring-primary/50 transition-all font-medium"
                disabled={isPending}
              />
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/50" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="flex items-start gap-4 rounded-[2rem] bg-destructive/10 p-5 text-sm text-destructive border border-destructive/20 glassmorphism animate-in fade-in zoom-in-95 duration-300"
              role="alert"
            >
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-black uppercase tracking-widest text-[10px]">Transmission Error</p>
                <p className="font-medium text-destructive/90">{error.message}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending || !email}
            className="w-full h-16 text-lg font-black uppercase tracking-[0.2em]"
            variant="celestial"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Sending Signal...
              </>
            ) : (
              <>
                Send Reset Link
                <ArrowRight className="ml-2 size-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
