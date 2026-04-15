import type { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { Starfield } from '@/components/landing/starfield';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your cosynq account to regain access to your cosplay sanctuary.',
};

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-6 overflow-hidden">
      {/* Starfield Background */}
      <Starfield />

      {/* Floating Utilities */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative Atmosphere Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden="true">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Reset Password form in glassmorphic card */}
        <ResetPasswordForm className="w-full" />

        {/* Discrete Return Link */}
        <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link 
            href="/sign-in" 
            className="inline-flex items-center text-sm font-bold text-muted-foreground transition-all hover:text-primary group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
