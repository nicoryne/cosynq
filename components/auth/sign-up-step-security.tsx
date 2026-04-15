'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordChecklist } from './password-checklist';

export interface Step2SecurityProps {
  password: string;
  confirmPassword: string;
  onChange: (field: 'password' | 'confirmPassword', value: string) => void;
  errors: {
    password?: string;
    confirmPassword?: string;
  };
}

export function SignUpStepSecurity({
  password,
  confirmPassword,
  onChange,
  errors,
}: Step2SecurityProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl md:text-3xl font-black tracking-tight leading-tight">Security</h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Create a strong password to keep your sanctuary safe from the stars.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="password" className="ml-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onChange('password', e.target.value)}
              className={cn(
                'h-14 pr-14 text-base rounded-full border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50',
                errors.password && 'border-destructive/50 bg-destructive/5 text-destructive placeholder:text-destructive/40 focus-visible:ring-destructive/50'
              )}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2"
            >
              {showPassword ? <EyeOff className="size-5 text-primary" /> : <Eye className="size-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[10px] font-black uppercase tracking-widest text-destructive ml-4 animate-in fade-in slide-in-from-left-2">{errors.password}</p>
          )}
        </div>

        <PasswordChecklist password={password} />

        <div className="flex flex-col gap-3">
          <Label htmlFor="confirmPassword" className="ml-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => onChange('confirmPassword', e.target.value)}
              className={cn(
                'h-14 pr-14 text-base rounded-full border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50',
                errors.confirmPassword && 'border-destructive/50 bg-destructive/5 text-destructive placeholder:text-destructive/40 focus-visible:ring-destructive/50'
              )}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2"
            >
              {showConfirmPassword ? <EyeOff className="size-5 text-primary" /> : <Eye className="size-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[10px] font-black uppercase tracking-widest text-destructive ml-4 animate-in fade-in slide-in-from-left-2">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  );
}
