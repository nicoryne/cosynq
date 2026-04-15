'use client';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil } from 'lucide-react';

export interface Step3IdentityProps {
  displayName: string;
  bio: string;
  onChange: (field: 'displayName' | 'bio', value: string) => void;
  errors: {
    displayName?: string;
    bio?: string;
  };
}

export function SignUpStepIdentity({
  displayName,
  bio,
  onChange,
  errors,
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
