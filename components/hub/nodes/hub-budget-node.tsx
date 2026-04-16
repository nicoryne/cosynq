'use client';

import { CosplanDetailDTO } from "@/lib/types/cosplan.types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Banknote, 
  CreditCard, 
  PieChart, 
  ShoppingCart, 
  Sparkles,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HubBudgetNodeProps {
  cosplan: CosplanDetailDTO;
}

export function HubBudgetNode({ cosplan }: HubBudgetNodeProps) {
  const totalSpent = cosplan.budgetItems.reduce((acc, item) => acc + item.cost, 0);
  const budgetCeiling = cosplan.budgetCeiling || 0;
  const percentageUsed = budgetCeiling > 0 ? Math.round((totalSpent / budgetCeiling) * 100) : 0;
  const remaining = Math.max(0, budgetCeiling - totalSpent);

  const isOverBudget = totalSpent > budgetCeiling;

  return (
    <div className="space-y-12">
      {/* Financial Mission Control */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-black/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
           
           <div className="flex items-center justify-between relative">
             <div className="space-y-1">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Budget Utilization</h3>
               <p className="text-3xl font-black tracking-tighter">
                 ₱{totalSpent.toLocaleString()} <span className="text-muted-foreground/30 text-lg">/ ₱{budgetCeiling.toLocaleString()}</span>
               </p>
             </div>
             <div className="text-right">
               <span className={cn(
                 "text-2xl font-black tracking-tighter transition-colors",
                 isOverBudget ? "text-red-400" : "text-emerald-400 shadow-glow-emerald/20"
               )}>
                 {percentageUsed}%
               </span>
               <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Celestial Capacity</p>
             </div>
           </div>

           <div className="space-y-2">
             <Progress value={Math.min(100, percentageUsed)} className={cn(
               "h-3 bg-white/5 transition-all",
               isOverBudget && "[&>[data-slot=progress-indicator]]:bg-red-500"
             )} />
             <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
               <span>Origin (₱0)</span>
               <span>Cap Manifest (₱{budgetCeiling.toLocaleString()})</span>
             </div>
           </div>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 flex flex-col justify-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Remaining Orbit</p>
             <h4 className="text-4xl font-black tracking-tighter text-foreground">
               ₱{remaining.toLocaleString()}
             </h4>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
            {isOverBudget ? (
              <>Ceiling Breached <TrendingUp className="size-4 text-red-400" /></>
            ) : (
              <>Sector Clear <TrendingDown className="size-4 text-emerald-400" /></>
            )}
          </div>
        </div>
      </div>

      {/* Itemization Strata */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <ShoppingCart className="size-5" />
            </div>
            <h3 className="font-black uppercase tracking-[0.2em] text-xs">Material Itemization</h3>
          </div>
          <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest h-10 px-6 gap-2 hover:bg-white/10">
            Provision Node <Banknote className="size-3" />
          </Button>
        </div>

        <div className="border border-white/5 rounded-3xl overflow-hidden bg-black/10 backdrop-blur-md">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent tracking-widest text-[10px] font-black uppercase">
                <TableHead className="py-4 px-6 h-auto">Manifest Item</TableHead>
                <TableHead className="py-4 px-6 h-auto">Status</TableHead>
                <TableHead className="py-4 px-6 h-auto text-right">Coordinate Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cosplan.budgetItems.map((item) => (
                <TableRow key={item.id} className="border-white/5 group hover:bg-white/[0.02]">
                  <TableCell className="py-4 px-6 font-bold text-sm tracking-tight">{item.itemName}</TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge variant="outline" className="rounded-full text-[10px] font-bold uppercase tracking-widest py-0.5 px-3 bg-white/5 border-white/10 text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right font-black tracking-tight text-base">
                    ₱{item.cost.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {cosplan.budgetItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-12 text-center text-muted-foreground/50 italic text-sm border-none">
                    No material coordinates itemized in this manifestation.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function Button({ children, variant, size, className, ...props }: any) {
  return (
    <button className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", className)} {...props}>
      {children}
    </button>
  );
}
