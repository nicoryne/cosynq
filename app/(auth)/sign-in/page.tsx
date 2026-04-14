import type { Metadata } from 'next';
import { SignInForm } from '@/components/auth/sign-in-form';
import { Starfield } from '@/components/landing/starfield';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      
      {/* Decorative Atmosphere Orbs - Requirement 10.2, hidden from screen readers */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden="true">
        <div className="absolute top-[20%] right-[10%] w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Badge with "Welcome Traveler" and Sparkles - Requirement 10.3 */}
        <div className="mb-10 text-center space-y-3 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Sparkles className="size-3" />
            Welcome Traveler
          </Badge>
          
          {/* Headline with italic "Nexus" - Requirement 10.4 */}
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
            Return to the <span className="italic">Nexus</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Re-align your universe and continue your craft.
          </p>
        </div>

        {/* Sign-in form in glassmorphic card with shadow-2xl - Requirement 10.5 */}
        <SignInForm className="w-full" />
      </div>
    </div>
  );
}
