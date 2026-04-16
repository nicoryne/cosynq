'use client';

import { CosplanDetailDTO } from "@/lib/types/cosplan.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Link as LinkIcon, 
  Palette, 
  Plus, 
  Ruler, 
  Sparkles,
  Zap
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface HubNexusNodeProps {
  cosplan: CosplanDetailDTO;
}

export function HubNexusNode({ cosplan }: HubNexusNodeProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Measurements & Swatches Column */}
      <div className="space-y-12">
        {/* Measurement Strata */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Ruler className="size-5" />
              </div>
              <h3 className="font-black uppercase tracking-[0.2em] text-xs">Measurement Strata</h3>
            </div>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 gap-2 px-3">
              Edit Strata <Plus className="size-3" />
            </Button>
          </div>

          <div className="border border-white/5 rounded-3xl overflow-hidden bg-black/10 backdrop-blur-md">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent tracking-widest text-[10px] font-black uppercase">
                  <TableHead className="py-4 px-6 h-auto">Coordinate Label</TableHead>
                  <TableHead className="py-4 px-6 h-auto text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cosplan.measurements.map((m) => (
                  <TableRow key={m.id} className="border-white/5 group hover:bg-white/[0.02]">
                    <TableCell className="py-4 px-6 font-bold text-sm tracking-tight text-muted-foreground group-hover:text-foreground">{m.label}</TableCell>
                    <TableCell className="py-4 px-6 text-right font-black tracking-tight text-base">
                      {m.value} <span className="text-[10px] text-muted-foreground/50">{m.unit}</span>
                    </TableCell>
                  </TableRow>
                ))}
                {cosplan.measurements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="py-12 text-center text-muted-foreground/30 italic text-sm border-none">
                      No coordinates grounded.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Color Manifest */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                <Palette className="size-5" />
              </div>
              <h3 className="font-black uppercase tracking-[0.2em] text-xs">Color Manifest</h3>
            </div>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 gap-2 px-3">
              Pick Swatch <Plus className="size-3" />
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {cosplan.swatches.map((swatch) => (
              <div key={swatch.id} className="flex items-center gap-3 p-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors">
                <div 
                  className="size-10 rounded-lg shadow-lg" 
                  style={{ backgroundColor: swatch.hexCode }}
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest truncate">{swatch.label || 'Unnamed'}</p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">{swatch.hexCode}</p>
                </div>
              </div>
            ))}
            {cosplan.swatches.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground/30 italic text-sm border-2 border-dashed border-white/5 rounded-3xl">
                No swatches archived.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* External Resources Column */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <LinkIcon className="size-5" />
            </div>
            <h3 className="font-black uppercase tracking-[0.2em] text-xs">Tutorial Nexus & Links</h3>
          </div>
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 gap-2 px-3">
            Pin Resource <Plus className="size-3" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-3xl border border-white/5 bg-black/20 space-y-4">
             {/* Note: In a real app, this would be mapped from cosplan_references */}
             {[
               { title: 'EVA Foam Armor Tutorial', provider: 'Punished Props', category: 'PROPS' },
               { title: 'Invisible Zipper Manifestation', provider: 'Cosplay Realm', category: 'SEWING' }
             ].map((link, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-primary/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                      <LinkIcon className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{link.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-black">{link.provider}</span>
                        <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-black uppercase border-white/10 text-muted-foreground">{link.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="size-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
               </div>
             ))}
             
             <div className="pt-4 flex flex-col items-center justify-center py-12 text-center space-y-4 border-2 border-dashed border-white/5 rounded-2xl">
                <Sparkles className="size-10 text-primary/10" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Consolidate external intelligence here</p>
                <Button variant="outline" className="rounded-xl border-white/10 text-[10px] font-black uppercase tracking-widest h-8 px-4">
                  Add Reference Link
                </Button>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
