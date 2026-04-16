'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CosplanListItemDTO, CosplanStatus } from '@/lib/types/cosplan.types';
import { Calendar, CheckCircle2, Package, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CosplanCardProps {
  cosplan: CosplanListItemDTO;
}

export function CosplanCard({ cosplan }: CosplanCardProps) {
  const statusColors: Record<CosplanStatus, string> = {
    DREAMING: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    PLANNING: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    IN_PROGRESS: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    ALMOST_DONE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ASCENDED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    STASIS: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <Link href={`/hub/cosplans/${cosplan.id}`}>
      <Card className="group relative overflow-hidden border-white/5 bg-black/40 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:bg-white/5 active:scale-[0.98]">
        {/* Progress Glow Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" 
          style={{ clipPath: `inset(${100 - cosplan.progressPercentage}% 0 0 0)` }}
        />

        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-lg md:text-xl tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                {cosplan.characterName}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {cosplan.series}
              </p>
            </div>
            <Badge variant="outline" className={cn("rounded-full font-bold text-[10px] uppercase tracking-widest", statusColors[cosplan.status])}>
              {cosplan.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                <CheckCircle2 className="size-3 text-emerald-400" />
                Progress
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tighter">
                  {cosplan.progressPercentage}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                <Package className="size-3 text-cyan-400" />
                BudgetItem
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold tracking-tight">
                  ₱{cosplan.budgetCeiling.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/5">
            <div 
              className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-1000 ease-out"
              style={{ width: `${cosplan.progressPercentage}%` }}
            />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
              <Calendar className="size-3" />
              {cosplan.deadline ? `Deadline: ${cosplan.deadline}` : 'No deadline set'}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-primary/60 font-black uppercase tracking-widest">
              View Node
              <Sparkles className="size-3" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
