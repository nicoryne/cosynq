'use client';

import { useState } from 'react';
import { CosplanDetailDTO, CosplanAssetType } from "@/lib/types/cosplan.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  ChevronRight, 
  ExternalLink, 
  Filter, 
  Image as ImageIcon, 
  Plus, 
  Sparkles,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface HubGalleryNodeProps {
  cosplan: CosplanDetailDTO;
}

export function HubGalleryNode({ cosplan }: HubGalleryNodeProps) {
  const [filter, setFilter] = useState<CosplanAssetType | 'ALL'>('ALL');

  const filteredAssets = filter === 'ALL' 
    ? cosplan.assets 
    : cosplan.assets.filter(a => a.assetType === filter);

  const filterButtons: { label: string; value: CosplanAssetType | 'ALL' }[] = [
    { label: 'All Manifestations', value: 'ALL' },
    { label: 'Divine Reference', value: 'REFERENCE' },
    { label: 'Temporal Progress', value: 'PROGRESS' },
    { label: 'Ascended Finals', value: 'FINAL' },
  ];

  return (
    <div className="space-y-10">
      {/* Gallery Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                filter === btn.value 
                  ? "bg-primary text-black shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <Button className="rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 h-10 px-6 font-black uppercase tracking-widest text-[10px] gap-2 shadow-glow-primary/5">
          Manifest Asset <Plus className="size-4" />
        </Button>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="group relative rounded-2xl overflow-hidden border border-white/5 bg-black/40 aspect-[4/5] hover:border-primary/30 transition-all duration-500">
             {/* Asset Badge */}
             <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <Badge className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest h-5 px-2">
                 {asset.assetType}
               </Badge>
             </div>

             {/* Action Overlay */}
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3 z-20">
                <button className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/40 transition-colors">
                  <ExternalLink className="size-5" />
                </button>
             </div>

             {/* Image Manifest */}
             <img 
               src={asset.url} 
               alt={`${cosplan.characterName} Asset`} 
               className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
             />
             
             {/* Bottom Metadata */}
             <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent pt-8">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/80">
                  <Zap className="size-3" />
                  Node Secured
                </div>
             </div>
          </div>
        ))}

        {/* Upload Trigger Node */}
        <button className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-white/5 bg-black/10 hover:border-primary/20 hover:bg-primary/5 transition-all duration-500 aspect-[4/5]">
          <div className="size-12 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:text-primary transition-all duration-500">
            <Camera className="size-6" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover:text-primary transition-colors">
            Upload Asset
          </p>
        </button>
      </div>

      {filteredAssets.length === 0 && filter !== 'ALL' && (
        <div className="py-24 text-center space-y-4 bg-black/10 rounded-3xl border border-dashed border-white/5">
          <ImageIcon className="size-12 text-muted-foreground/20 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-lg font-bold tracking-tight">No {filter.toLowerCase()} assets found</h4>
            <p className="text-sm text-muted-foreground">The planetary archive does not contain manifestations for this stratum.</p>
          </div>
        </div>
      )}
    </div>
  );
}
