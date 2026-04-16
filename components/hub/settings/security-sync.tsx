'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, Key, ShieldCheck, AlertCircle, Save, Send } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useForgotPassword, useUpdateEmail } from '@/lib/hooks/use-auth';
import { toast } from 'sonner';
import { AuthUserDTO } from '@/lib/types/auth.types';

interface SecuritySyncProps {
  user: AuthUserDTO;
}

export function SecuritySync({ user }: SecuritySyncProps) {
  const { mutate: updateEmail, isPending: isEmailPending } = useUpdateEmail();
  const { mutate: forgotPassword, isPending: isResetPending } = useForgotPassword();

  const [emailForm, setEmailForm] = useState({ email: user.email });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailForm.email === user.email) {
      toast.info('Email address is already up to date.');
      return;
    }

    updateEmail(emailForm.email, {
      onSuccess: (res) => {
        toast.success(res.message);
      },
      onError: (err: Error) => {
        toast.error(err.message);
      }
    });
  };

  const handleResetDispatch = () => {
    forgotPassword(user.email, {
      onSuccess: () => {
        toast.success('Reset email sent. Check your inbox for instructions.');
      },
      onError: (err: Error) => {
        toast.error(err.message);
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Email Quadrant */}
      <Card className="rounded-none sm:rounded-md border-white/5 glassmorphism bg-white/[0.01] shadow-xl relative overflow-hidden border-x-0 sm:border-x">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-primary opacity-50" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Mail className="size-5 text-blue-400" />
            <span className="font-heading text-xl font-bold tracking-tight uppercase tracking-[0.1em]">Change Email</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email Address</Label>
              <div className="flex gap-3 flex-col sm:flex-row">
                <Input
                  id="email"
                  type="email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ email: e.target.value })}
                  placeholder="new-email@example.com"
                  className="h-12 bg-white/[0.02] flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isEmailPending} 
                  variant="outline" 
                  className="h-12 px-8 border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-[10px] gap-2 shrink-0 glassmorphism"
                >
                  {isEmailPending ? <>Updating... <Send className="size-3.5 animate-pulse" /></> : <>Update Email <Send className="size-3.5" /></>}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground/40 mt-2 px-1 flex items-center gap-1.5 leading-relaxed">
                <AlertCircle className="size-3 shrink-0" />
                Verification emails will be sent to both your current and new addresses.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Quadrant */}
      <Card className="rounded-none sm:rounded-md border-white/5 glassmorphism bg-white/[0.01] shadow-xl relative overflow-hidden border-x-0 sm:border-x">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-50" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-primary" />
            <span className="font-heading text-xl font-bold tracking-tight uppercase tracking-[0.1em]">Change Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-8">
          <div className="max-w-md mx-auto text-center space-y-8 py-6">
            <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto shadow-glow-primary/20 border border-primary/20">
              <Key className="size-7 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-black uppercase tracking-widest leading-none">Password Security</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To ensure your account security, password changes require a verification link sent to your registered email address.
              </p>
            </div>

            <Button 
              onClick={handleResetDispatch}
              disabled={isResetPending} 
              variant="celestial"
              className="w-full sm:w-auto px-10 h-14 font-black uppercase tracking-[0.2em] text-[10px] gap-3 shadow-glow-primary group"
            >
              {isResetPending ? (
                <>Dispatching Signal... <Send className="size-4 animate-pulse" /></>
              ) : (
                <>Send Reset Password Email <Send className="size-4 transition-transform group-hover:translate-x-1" /></>
              )}
            </Button>
            
            <p className="text-[10px] text-muted-foreground/30 font-medium uppercase tracking-[0.3em]">
              Security Protocol: Standard
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
