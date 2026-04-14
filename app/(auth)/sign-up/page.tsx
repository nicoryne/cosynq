import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { SignUpWizard } from '@/components/auth/sign-up-wizard';
import { Starfield } from '@/components/landing/starfield';

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create your cosynq account and join the cosplay community. Start organizing your cosplans, connect with creatives, and sync your convention schedules.',
};

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-6 overflow-hidden">
      <Starfield />
      
      {/* Decorative Atmosphere Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-12 text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <Sparkles className="size-3" />
            Begin Your Journey
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight">
            Weave Your <span className="text-primary italic">Constellation</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            Create your galactic identity and weave your dreams into the cosynq universe.
          </p>
        </div>

        <SignUpWizard className="w-full" />

        <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-bold text-muted-foreground transition-all hover:text-primary group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Return to Core Orbit
          </Link>
        </div>
      </div>
    </div>
  );
}
