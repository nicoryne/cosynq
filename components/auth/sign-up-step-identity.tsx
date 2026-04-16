'use client';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Loader2, Check, AlertCircle } from 'lucide-react';

export interface Step3IdentityProps {
  displayName: string;
  bio: string;
  facebookUrl: string;
  onChange: (field: 'displayName' | 'bio' | 'facebookUrl', value: string) => void;
  errors: {
    displayName?: string;
    bio?: string;
    facebookUrl?: string;
  };
  isCheckingFacebook?: boolean;
  facebookAvailability?: { available: boolean; message?: string } | null;
  debouncedFacebookUrl?: string;
}

export function SignUpStepIdentity({
  displayName,
  bio,
  facebookUrl,
  onChange,
  errors,
  isCheckingFacebook,
  facebookAvailability,
  debouncedFacebookUrl,
}: Step3IdentityProps) {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl md:text-3xl font-black tracking-tight leading-tight">Public Identity</h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          How do you want to be known in the celestial sanctuary?
        </p>
        <div className="inline-block rounded-lg bg-primary/5 px-3 py-1.5 border border-primary/10">
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-primary/70">
            Can be changed anytime
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="displayName" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Display Name
          </Label>
          <div className="relative">
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => onChange('displayName', e.target.value)}
              className={cn(
                'pl-[4.5rem] md:pl-[4.5rem] pr-8 md:pr-8 rounded-full border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50',
                errors.displayName && 'border-destructive/50 bg-destructive/5 text-destructive placeholder:text-destructive/40 focus-visible:ring-destructive/50'
              )}
              placeholder="E.g. Jace Beleren"
              autoComplete="name"
              maxLength={50}
            />
            <Pencil className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40 z-10 pointer-events-none" />
          </div>
          {errors.displayName && (
            <p className="text-[10px] font-black uppercase tracking-widest text-destructive ml-4 animate-in fade-in slide-in-from-left-2">{errors.displayName}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="facebookUrl" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Facebook Profile Link
          </Label>
          <div className="relative">
            <Input
              id="facebookUrl"
              type="url"
              value={facebookUrl}
              onChange={(e) => onChange('facebookUrl', e.target.value)}
              className={cn(
                'pl-[4.5rem] md:pl-[4.5rem] pr-12 md:pr-12 rounded-full border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50',
                (errors.facebookUrl || (debouncedFacebookUrl === facebookUrl && facebookAvailability?.available === false)) && 'border-destructive/50 bg-destructive/5 text-destructive placeholder:text-destructive/40 focus-visible:ring-destructive/50'
              )}
              placeholder="facebook.com/yourprofile"
            />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center z-10 pointer-events-none">
              <svg 
                viewBox="0 0 24 24" 
                className={cn("size-4 transition-colors", facebookUrl ? "text-primary" : "text-muted-foreground/40")}
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>

            {/* Availability Indicators */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isCheckingFacebook && <Loader2 className="size-4 animate-spin text-primary" />}
              {!isCheckingFacebook && debouncedFacebookUrl === facebookUrl && facebookUrl.length > 0 && (
                <>
                  {facebookAvailability?.available ? (
                    <div className="rounded-full bg-primary/20 p-1 animate-in zoom-in duration-300">
                      <Check className="size-3 text-primary stroke-[3px]" />
                    </div>
                  ) : (
                    <div className="rounded-full bg-destructive/20 p-1 animate-in zoom-in duration-300">
                      <AlertCircle className="size-3 text-destructive stroke-[3px]" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {(errors.facebookUrl || (debouncedFacebookUrl === facebookUrl && facebookAvailability?.available === false)) ? (
            <p className="text-[10px] font-black uppercase tracking-widest text-destructive ml-4 animate-in fade-in slide-in-from-left-2">
              {errors.facebookUrl || facebookAvailability?.message}
            </p>
          ) : (
             <p className="text-[10px] font-black uppercase tracking-widest text-primary ml-4 italic">
              Mandatory link for identity verification
            </p>
          )}
        </div>

        <div className="space-y-4 flex flex-col">
          <Label htmlFor="bio" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            The Chronicle (Bio)
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => onChange('bio', e.target.value)}
            className="px-8 py-6 rounded-[2rem] border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50"
            placeholder="I build props out of foam and dreams..."
            rows={5}
            maxLength={500}
          />
          <div className="flex justify-between items-center px-2">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
              Optional bio for your profile
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
              {bio.length} / 500 Transferred
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
