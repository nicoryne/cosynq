import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { SignInForm } from '@/components/auth/sign-in-form';
import { Starfield } from '@/components/landing/starfield';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your cosynq account to access your cosplay sanctuary, manage your projects, and connect with the community.',
};

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-6 overflow-hidden">
      {/* Starfield Background - Requirement 10.1 */}
      <Starfield />

      {/* Floating Utilities */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative Atmosphere Orbs - Requirement 10.2, hidden from screen readers */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden="true">
        <div className="absolute top-[20%] right-[10%] w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Sign-in form in glassmorphic card wrapped in Suspense for useSearchParams */}
        <Suspense fallback={
          <div className="w-full aspect-square flex items-center justify-center rounded-[2.5rem] glassmorphism">
            <Loader2 className="size-8 text-primary animate-spin" />
          </div>
        }>
          <SignInForm className="w-full" />
        </Suspense>

        {/* Discrete Return Link */}
        <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-bold text-muted-foreground transition-all hover:text-primary group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
