'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AtSign, Clock, AlertTriangle, RefreshCw, CheckCircle2, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useUpdateUsername } from '@/lib/hooks/use-auth';
import { UserProfileDTO } from '@/lib/types/auth.types';
import { toast } from 'sonner';

interface OrbitalHandleProps {
  profile: UserProfileDTO;
}

export function OrbitalHandle({ profile }: OrbitalHandleProps) {
  const { mutate: updateUsername, isPending } = useUpdateUsername();
  const [newUsername, setNewUsername] = useState(profile.username);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (profile.usernameLastChangedAt) {
      const lastChange = new Date(profile.usernameLastChangedAt);
      const nextAvailable = new Date(lastChange);
      nextAvailable.setDate(lastChange.getDate() + 30);
      
      const now = new Date();
      if (nextAvailable > now) {
        const diff = Math.ceil((nextAvailable.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        setDaysRemaining(diff);
      } else {
        setDaysRemaining(null);
      }
    }
  }, [profile.usernameLastChangedAt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername === profile.username) {
      toast.info('Username is already up to date.');
      return;
    }

    if (daysRemaining !== null) {
      toast.error(`Username change locked for ${daysRemaining} more days.`);
      return;
    }

    updateUsername(newUsername, {
      onSuccess: () => {
        toast.success('Username updated successfully.');
      },
      onError: (err) => {
        toast.error(err.message);
      }
    });
  };

  const isLocked = daysRemaining !== null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="rounded-none sm:rounded-md border-white/5 glassmorphism bg-white/[0.01] shadow-xl relative overflow-hidden border-x-0 sm:border-x">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-primary opacity-50" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <AtSign className="size-5 text-purple-400" />
            <span className="font-heading text-xl font-bold tracking-tight uppercase tracking-[0.1em]">Change Username</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground/60 text-xs text-balance">
            Your unique username in the cosynq community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2.5">
                <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Username</Label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-40">
                    <AtSign className="size-4" />
                  </div>
                  <Input
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    disabled={isLocked || isPending}
                    className="h-14 bg-white/[0.02] pl-10 text-lg font-mono tracking-tight"
                    placeholder="explorer_77"
                  />
                  {!isLocked && !isPending && newUsername !== profile.username && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle2 className="size-5 text-primary opacity-50" />
                    </div>
                  )}
                </div>
              </div>

              {isLocked ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-200/80">
                  <Clock className="size-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Username Change Locked</p>
                    <p className="text-[10px] leading-relaxed">
                      To preserve community integrity, usernames can only be changed once every 30 days. 
                      Your account will be unlocked in <span className="text-amber-400 font-bold">{daysRemaining} days</span>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 text-primary/80">
                  <RefreshCw className="size-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Username Change Available</p>
                    <p className="text-[10px] leading-relaxed">
                      Changing your username will update your profile URL. This can only be done once every 30 days.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLocked || isPending || newUsername === profile.username} 
                variant="celestial"
                className="rounded-none sm:rounded-xl px-12 h-12 font-black uppercase tracking-widest text-xs gap-2"
              >
                {isPending ? <>Saving... <Save className="size-4 animate-pulse" /></> : <>Update Username <Save className="size-4" /></>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
