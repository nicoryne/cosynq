'use client';

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CosplanDetailDTO, CosplanTaskDTO } from "@/lib/types/cosplan.types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Hammer, Scissors, Sparkles, Wand2 } from "lucide-react";

interface HubProgressOverviewProps {
  cosplan: CosplanDetailDTO;
}

export function HubProgressOverview({ cosplan }: HubProgressOverviewProps) {
  // Group tasks by category
  const categories = cosplan.tasks.reduce((acc, task) => {
    const cat = task.category || 'GENERAL';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(task);
    return acc;
  }, {} as Record<string, CosplanTaskDTO[]>);

  const categoryIcons: Record<string, any> = {
    WIG: Wand2,
    PROPS: Hammer,
    SEWING: Scissors,
    ARMOR: Sparkles,
    GENERAL: Sparkles,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Category Matrices */}
      <div className="lg:col-span-2 space-y-12">
        {Object.entries(categories).map(([category, tasks]) => {
          const Icon = categoryIcons[category] || Sparkles;
          const completedCount = tasks.filter(t => t.isCompleted).length;
          const percentage = Math.round((completedCount / tasks.length) * 100);

          return (
            <div key={category} className="space-y-6 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-xs">{category} NODE</h4>
                    <p className="text-[10px] text-muted-foreground font-bold">{tasks.length} Sequences Manifested</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black tracking-tighter text-primary">{percentage}%</span>
                  <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Completion</p>
                </div>
              </div>

              <div className="space-y-3 pl-1 bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 group/task">
                    <Checkbox 
                      id={task.id} 
                      checked={task.isCompleted} 
                      className="size-5 rounded-md border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label 
                      htmlFor={task.id}
                      className={cn(
                        "text-sm font-medium transition-colors cursor-pointer",
                        task.isCompleted ? "text-muted-foreground line-through" : "text-foreground group-hover/task:text-primary"
                      )}
                    >
                      {task.title}
                    </label>
                  </div>
                ))}
              </div>
              
              <Progress value={percentage} className="h-1 bg-white/5" />
            </div>
          );
        })}

        {cosplan.tasks.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl space-y-4">
            <Sparkles className="size-10 text-primary/20 mx-auto" />
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">No Sequences Manifested Yet</p>
            <Button variant="outline" size="sm" className="rounded-xl border-white/10 text-[10px] font-black uppercase tracking-widest">
              Add First Task Node
            </Button>
          </div>
        )}
      </div>

      {/* Stats Nexus */}
      <div className="space-y-8">
        <div className="bg-black/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Manifestation Statistics</h3>
          <div className="space-y-4">
            <StatRow label="Total Sequences" value={cosplan.tasks.length} />
            <StatRow label="Active Nodes" value={Object.keys(categories).length} />
            <StatRow label="Completed Units" value={cosplan.tasks.filter(t => t.isCompleted).length} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-black tracking-tighter text-lg">{value}</span>
    </div>
  );
}

function Button({ children, variant, size, className }: any) {
  return (
    <button className={cn("inline-flex items-center justify-center whitespace-nowrap px-4 py-2 transition-all", className)}>
      {children}
    </button>
  );
}
