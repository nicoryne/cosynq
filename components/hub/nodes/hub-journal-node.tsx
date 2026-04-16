'use client';

import { CosplanDetailDTO } from "@/lib/types/cosplan.types";
import { LexicalEditor } from "@/components/ui/lexical-editor";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  History, 
  Save, 
  Sparkles 
} from "lucide-react";
import { useState } from "react";
import { useUpdateCosplan } from "@/lib/hooks/use-cosplans";

interface HubJournalNodeProps {
  cosplan: CosplanDetailDTO;
}

export function HubJournalNode({ cosplan }: HubJournalNodeProps) {
  const [editorState, setEditorState] = useState<any>(null);
  const { mutate: updateCosplan, isPending } = useUpdateCosplan(cosplan.id);

  const handleSave = () => {
    if (editorState) {
      updateCosplan({
        notes: editorState.toJSON()
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Journal Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-[0.2em] text-xs">Construction Journal</h3>
            <p className="text-[10px] text-muted-foreground font-bold">Archive every breakthrough and material discovery</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <Button 
            variant="ghost" 
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-white/5 gap-2 px-3 h-10"
           >
             <History className="size-4" />
             View History
           </Button>
           <Button 
            onClick={handleSave}
            disabled={isPending}
            className="rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 h-10 px-6 font-black uppercase tracking-widest text-[10px] gap-2 shadow-glow-primary/5"
           >
             {isPending ? <>Syncing... <Save className="size-4 animate-pulse" /></> : <>Save Log <Save className="size-4" /></>}
           </Button>
        </div>
      </div>

      {/* Lexical Manifestation */}
      <div className="relative">
        <div className="absolute -top-12 -left-12 size-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <LexicalEditor 
          onChange={(state) => setEditorState(state)}
          initialConfig={{
            editorState: cosplan.notes ? JSON.stringify(cosplan.notes) : undefined
          }}
          className="min-h-[500px] shadow-2xl shadow-primary/5"
          placeholder="Manifest your progress logs, material findings, or construction secrets here..."
        />
      </div>

      <div className="flex items-center justify-center gap-8 py-8 opacity-30 group grayscale hover:grayscale-0 transition-all">
        <Sparkles className="size-4 text-primary" />
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">The journal maintains absolute synchronization</p>
        <Sparkles className="size-4 text-primary" />
      </div>
    </div>
  );
}
