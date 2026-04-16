'use client';

import { useCosplans } from '@/lib/hooks/use-cosplans';
import { CosplanCard } from '@/components/hub/cosplan-card';
import { Button } from '@/components/ui/button';
import { Plus, Rocket, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateCosplanDialog } from '@/components/hub/create-cosplan-dialog';

export default function CosplansPage() {
  const { data: cosplans, isLoading } = useCosplans();

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs">
            <Rocket className="size-4" />
            Project Hub
          </div>
          <h1 className="text-3xl font-black tracking-tighter md:text-4xl text-foreground">
            Cosplan <span className="text-primary">Manifest</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-[500px]">
            Absolute precision for your construction sequences. Manage budget, progress, and references across the multi-verse.
          </p>
        </div>
        
        <CreateCosplanDialog />
      </div>

      <div className="relative">
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -left-24 size-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 size-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[280px] w-full rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : cosplans && cosplans.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cosplans.map((cosplan) => (
              <CosplanCard key={cosplan.id} cosplan={cosplan} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-black/20 backdrop-blur-sm space-y-6 text-center">
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="size-10 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">No Manifestations Found</h3>
              <p className="text-muted-foreground text-sm max-w-[300px]">
                Your sector is currently quiet. Initiate a new cosplan to begin tracking progress across the multi-verse.
              </p>
            </div>
            <CreateCosplanDialog>
              <Button className="rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px] gap-2" variant="celestial">
                Launch First Cosplan <Plus className="size-4" />
              </Button>
            </CreateCosplanDialog>
          </div>
        )}
      </div>
    </div>
  );
}
