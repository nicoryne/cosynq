'use client';

import { useTheme } from 'next-themes';
import { Turnstile, type TurnstileInstance, type TurnstileProps } from '@marsidev/react-turnstile';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TurnstileWidgetProps extends Omit<TurnstileProps, 'siteKey' | 'options'> {
  className?: string;
}

/**
 * TurnstileWidget - Celestial-themed Cloudflare Turnstile integration
 * Requirements: Cloudflare Turnstile, Dark/Light mode support
 */
export const TurnstileWidget = forwardRef<TurnstileInstance, TurnstileWidgetProps>(
  ({ className, onSuccess, ...props }, ref) => {
    const { theme } = useTheme();
    const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

    // In development or if key is missing, we still show a placeholder or nothing
    // if the dev bypass logic is active server-side.
    if (!siteKey) {
      if (process.env.NODE_ENV === 'development') {
        return (
          <div className={cn(
            "p-4 rounded-xl border border-dashed border-primary/20 bg-primary/5 text-center transition-all",
            className
          )}>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
              🛡️ Turnstile Bypassed (Dev Mode)
            </p>
          </div>
        );
      }
      return null;
    }

    return (
      <div className={cn("flex justify-center w-full transition-all animate-in fade-in zoom-in-95 duration-500", className)}>
        <div className="rounded-xl overflow-hidden shadow-glow-primary/5 p-1 bg-white/5 border border-white/10">
          <Turnstile
            ref={ref}
            siteKey={siteKey}
            onSuccess={onSuccess}
            options={{
              theme: theme === 'dark' ? 'dark' : 'light',
              appearance: 'always',
            }}
            {...props}
          />
        </div>
      </div>
    );
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';
