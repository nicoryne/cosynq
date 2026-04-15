import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { SignUpWizard } from '@/components/auth/sign-up-wizard';
import { Starfield } from '@/components/landing/starfield';

import { ThemeToggle } from '@/components/theme-toggle';

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create your cosynq account and join the cosplay community. Start organizing your cosplans, connect with creatives, and sync your convention schedules.',
};

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-6 overflow-hidden">
      <Starfield />

      {/* Floating Utilities */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      {/* Decorative Atmosphere Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <SignUpWizard className="w-full" />

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
