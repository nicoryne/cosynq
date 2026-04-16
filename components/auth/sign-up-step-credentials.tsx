'use client';

import { Loader2, Check, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export interface Step1CredentialsProps {
  email: string;
  username: string;
  agreedToTerms: boolean;
  onChange: (field: 'email' | 'username' | 'agreedToTerms', value: string | boolean) => void;
  errors: {
    email?: string;
    username?: string;
    agreedToTerms?: string;
  };
  isCheckingEmail: boolean;
  isCheckingUsername: boolean;
  emailAvailability?: { available: boolean; message: string };
  usernameAvailability?: { available: boolean; message: string };
  debouncedEmail: string;
  debouncedUsername: string;
}

export function SignUpStepCredentials({
  email,
  username,
  agreedToTerms,
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
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-3">
        <h2 className="font-heading text-2xl md:text-3xl font-black tracking-tight leading-tight">Credentials</h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          The stars need a way to reach you and a name to call you in the void.
        </p>
      </div>

      <div className="space-y-6 px-2">
        {/* Email Input */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="email" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Email Address
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onChange('email', e.target.value)}
              className={cn(
                'pl-[4.5rem] md:pl-[4.5rem] pr-8 md:pr-8 rounded-full border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50',
                errors.email && 'border-destructive/50 bg-destructive/5 text-destructive placeholder:text-destructive/40 focus-visible:ring-destructive/50'
              )}
              placeholder="commander@cosynq.ryne.dev"
              autoComplete="email"
            />
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40 z-10 pointer-events-none" />
          </div>
          {isCheckingEmail && (
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4 animate-pulse">
              <Loader2 className="size-3 animate-spin" />
              Scanning frequency...
            </p>
          )}
          {showEmailAvailability && (
            <p className={cn('flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ml-4', emailAvailability.available ? 'text-green-500' : 'text-destructive')}>
              {emailAvailability.available ? <Check className="size-3" /> : null}
              {emailAvailability.message}
            </p>
          )}
          {errors.email && (
            <p className="text-[10px] font-black uppercase tracking-widest text-destructive ml-4 animate-in fade-in slide-in-from-left-2">{errors.email}</p>
          )}
        </div>

        {/* Username Input */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="username" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Username
          </Label>
          <div className="relative">
            <span className={cn(
              "absolute left-6 top-1/2 -translate-y-1/2 text-lg font-black text-muted-foreground/40 z-10 pointer-events-none",
              errors.username && "text-destructive/40"
            )}>@</span>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => onChange('username', e.target.value)}
              className={cn(
                'pl-[4.5rem] md:pl-[4.5rem] pr-8 md:pr-8 rounded-full border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50',
                errors.username && 'border-destructive/50 bg-destructive/5 text-destructive placeholder:text-destructive/40 focus-visible:ring-destructive/50'
              )}
              placeholder="cosplayer123"
              autoComplete="username"
            />
          </div>
          {isCheckingUsername && (
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4 animate-pulse">
              <Loader2 className="size-3 animate-spin" />
              Checking signal availability...
            </p>
          )}
          {showUsernameAvailability && (
            <p className={cn('flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ml-4', usernameAvailability.available ? 'text-green-500' : 'text-destructive')}>
              {usernameAvailability.available ? <Check className="size-3" /> : null}
              {usernameAvailability.message}
            </p>
          )}
          {errors.username && (
            <p className="text-[10px] font-black uppercase tracking-widest text-destructive ml-4 animate-in fade-in slide-in-from-left-2">{errors.username}</p>
          )}
        </div>

        {/* Agreement Checkbox */}
        <div className="pt-2">
          <div className="flex items-center gap-3 ml-2 group cursor-pointer">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => onChange('agreedToTerms', checked as boolean)}
              className="mt-1 transition-transform group-hover:scale-110"
            />
            <Label
              htmlFor="terms"
              className={cn(
                "text-xs leading-relaxed cursor-pointer select-none transition-colors normal-case tracking-normal",
                errors.agreedToTerms ? "text-destructive" : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              I agree to the{" "}
              <Link href="/terms" target="_blank" className="font-bold text-primary hover:text-primary/80 transition-colors">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="/privacy" target="_blank" className="font-bold text-primary hover:text-primary/80 transition-colors">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.agreedToTerms && (
            <p className="text-[10px] font-black uppercase tracking-widest text-destructive ml-11 mt-2 animate-in fade-in slide-in-from-left-2">
              {errors.agreedToTerms}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
