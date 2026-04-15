'use client';

import { useState } from 'react';
import { Loader2, AlertCircle, Eye, EyeOff, Sparkles, ShieldCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResetPassword } from '@/lib/hooks/use-auth';
import type { ResetPasswordInput } from '@/lib/validations/auth.validation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PasswordChecklist } from './password-checklist';

interface ResetPasswordFormProps {
  className?: string;
}

export function ResetPasswordForm({ className }: ResetPasswordFormProps) {
  const [formData, setFormData] = useState<ResetPasswordInput>({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const handleChange = (field: keyof ResetPasswordInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetPassword(formData);
  };

  return (
    <Card className={cn('w-full border-none glassmorphism shadow-glow-primary/10 relative overflow-hidden', className)}>
      <CardHeader className="p-10 pb-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3 ring-1 ring-primary/20">
            <ShieldCheck className="size-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-black tracking-tight underline-glow">Reset Password</CardTitle>
        <CardDescription className="text-sm font-medium text-muted-foreground/80 mt-2">
          Secure your cosmic sanctuary with a new password.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-10 pt-6">
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {/* New Password */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="password" className={cn("ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground")}>
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                required
                className="pl-[4.5rem] md:pl-[4.5rem] pr-14 md:pr-14 rounded-full border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50"
                disabled={isPending}
              />
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40 z-10 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {formData.password && (
              <PasswordChecklist 
                password={formData.password} 
                className="mt-4 p-4 rounded-2xl bg-foreground/5 animate-in fade-in slide-in-from-top-2 duration-300"
              />
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="confirmPassword" className={cn("ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground")}>
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                required
                className="pl-[4.5rem] md:pl-[4.5rem] pr-8 md:pr-8 rounded-full border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50"
                disabled={isPending}
              />
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40 z-10 pointer-events-none" />
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
                <p className="font-black uppercase tracking-widest text-[10px]">Security Error</p>
                <p className="font-medium text-destructive/90">{error.message}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-16 text-lg font-black uppercase tracking-[0.2em]"
            variant="celestial"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Updating Orbit...
              </>
            ) : (
              <>
                Reset Password
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
