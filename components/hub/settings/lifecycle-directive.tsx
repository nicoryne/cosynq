'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, AlertTriangle, ShieldAlert, ZapOff, Clock, LogOut } from 'lucide-react';
import { useDeactivateAccount } from '@/lib/hooks/use-auth';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function LifecycleDirective() {
  const { mutate: deactivate, isPending } = useDeactivateAccount();

  const handleDeactivate = () => {
    deactivate(undefined, {
      onSuccess: () => {
        toast.success('Account deactivated. You have 30 days to recover it.');
      },
      onError: (err) => {
        toast.error(err.message);
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="rounded-none sm:rounded-md border-red-500/10 glassmorphism bg-red-500/[0.01] shadow-xl relative overflow-hidden border-x-0 sm:border-x">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400 opacity-50" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ZapOff className="size-5 text-red-500" />
            <span className="font-heading text-xl font-bold tracking-tight uppercase tracking-[0.1em] text-red-500">Account Deactivation</span>
          </CardTitle>
          <CardDescription className="text-red-200/40 text-xs">
            Manage your account deactivation and data deletion settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2.5 text-red-400 font-bold text-xs uppercase tracking-widest">
                <Clock className="size-4" />
                Deactivation Period
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground/60">
                Deactivating your account does not immediately delete your data. Your account enters a <strong>30-day deactivation period</strong>. 
                You can recover your account at any time during this period by simply signing back in.
              </p>
            </div>

            <div className="space-y-4 p-5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2.5 text-red-400 font-bold text-xs uppercase tracking-widest">
                <Trash2 className="size-4" />
                Permanent Deletion
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground/60">
                After the 30-day period expires, all your posts, groups, and personal data will be 
                permanently deleted from our database. This action is irreversible.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
            <div className="space-y-1.5 text-center sm:text-left">
              <h4 className="text-sm font-black uppercase tracking-widest text-red-400 flex items-center justify-center sm:justify-start gap-2">
                <ShieldAlert className="size-4" />
                Deactivate Account
              </h4>
              <p className="text-[10px] text-red-200/40 leading-relaxed font-medium">
                Start the account deactivation process and enter the 30-day recovery period.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="rounded-none sm:rounded-xl px-10 h-12 font-black uppercase tracking-widest text-[10px] gap-2 shadow-glow-red"
                  disabled={isPending}
                >
                  <LogOut className="size-4" />
                  Initiate Deactivation
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glassmorphism border-red-500/20 max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-heading text-2xl font-bold tracking-tighter text-red-500 uppercase">
                    Deactivate Account
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed pt-2">
                    Are you sure you want to deactivate your account? It will enter a 30-day deactivation period, 
                    after which all your data will be permanently deleted.
                    <br /><br />
                    Deactivating will sign you out immediately. Proceed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="pt-6">
                  <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl font-bold uppercase tracking-widest text-[10px] py-6">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeactivate}
                    className="bg-red-500 hover:bg-red-600 shadow-glow-red rounded-xl font-black uppercase tracking-widest text-[10px] py-6"
                  >
                    Deactivate Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
