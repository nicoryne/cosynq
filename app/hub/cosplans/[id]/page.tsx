'use client';

import { useCosplanDetail } from '@/lib/hooks/use-cosplans';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Settings2,
  Sparkles,
  Trophy,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { HubProgressOverview } from '@/components/hub/nodes/hub-progress-overview';
import { HubBudgetNode } from '@/components/hub/nodes/hub-budget-node';
import { HubGalleryNode } from '@/components/hub/nodes/hub-gallery-node';
import { HubJournalNode } from '@/components/hub/nodes/hub-journal-node';
import { HubNexusNode } from '@/components/hub/nodes/hub-nexus-node';

export default function CosplanDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: cosplan, isLoading } = useCosplanDetail(id);

  if (isLoading) {
    return <CosplanDetailSkeleton />;
  }

  if (!cosplan) {
    return <CosplanNotFound />;
  }

  const progressPercentage = cosplan.tasks.length > 0 
    ? Math.round((cosplan.tasks.filter(t => t.isCompleted).length / cosplan.tasks.length) * 100) 
    : 0;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-transparent">
      {/* Header Strata */}
      <div className="relative border-b border-white/5 bg-black/20 backdrop-blur-3xl px-4 md:px-8 py-8 md:py-12 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 size-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 size-64 bg-cyan-500/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Link 
                href="/hub/cosplans" 
                className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform" />
                Return to Directory
              </Link>
              
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground">
                    {cosplan.characterName}
                  </h1>
                  <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full text-[10px] uppercase font-black h-6 px-3">
                    {cosplan.status}
                  </Badge>
                </div>
                <p className="text-xl md:text-2xl font-bold text-muted-foreground/80 lowercase italic tracking-tight">
                  {cosplan.series}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="icon" variant="celestial" className="rounded-xl size-12 shadow-primary/20">
                <Settings2 className="size-5" />
              </Button>
              <Button variant="celestial" className="rounded-xl h-12 px-6 font-black uppercase tracking-widest text-xs gap-2">
                Update Status <Sparkles className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between text-[11px] uppercase font-bold tracking-[0.2em] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Trophy className="size-4 text-primary" />
                  Construction Sequence
                </div>
                <span className="text-primary">{progressPercentage}% Manifested</span>
              </div>
              <Progress value={progressPercentage} className="h-2.5 bg-white/5" />
            </div>

            <div className="flex items-center gap-6 divide-x divide-white/10">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Deadline</p>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Calendar className="size-4 text-cyan-400" />
                  {cosplan.deadline || 'Infinite'}
                </div>
              </div>
              <div className="pl-6 space-y-1">
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Days Left</p>
                <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
                  <Clock className="size-5 text-indigo-400" />
                  T-Minus --
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Strata */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Tabs defaultValue="progress" className="w-full space-y-10">
          <div className="border-b border-white/5 pb-2">
            <TabsList className="bg-transparent h-auto p-0 gap-8 w-full justify-start overflow-x-auto no-scrollbar">
              {[
                { id: 'progress', label: 'Progress Matrix', icon: History },
                { id: 'budget', label: 'Budgetary Node', icon: Sparkles },
                { id: 'gallery', label: 'Visual Archive', icon: Sparkles },
                { id: 'nexus', label: 'Resource Nexus', icon: Sparkles },
                { id: 'journal', label: 'Journal', icon: Sparkles },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-4 h-auto text-[11px] font-black uppercase tracking-widest text-muted-foreground transition-all border-b-2 border-transparent"
                >
                  <div className="flex items-center gap-2">
                    {tab.label}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="progress" className="m-0 focus-visible:ring-0">
            <HubProgressOverview cosplan={cosplan} />
          </TabsContent>
          <TabsContent value="budget" className="m-0 focus-visible:ring-0">
             <HubBudgetNode cosplan={cosplan} />
          </TabsContent>
          <TabsContent value="gallery" className="m-0 focus-visible:ring-0">
             <HubGalleryNode cosplan={cosplan} />
          </TabsContent>
          <TabsContent value="nexus" className="m-0 focus-visible:ring-0">
             <HubNexusNode cosplan={cosplan} />
          </TabsContent>
          <TabsContent value="journal" className="m-0 focus-visible:ring-0">
             <HubJournalNode cosplan={cosplan} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PlaceholderNode({ title }: { title: string }) {
  return (
    <div className="h-96 border-2 border-dashed border-white/5 rounded-3xl bg-black/10 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-2">
        <Sparkles className="size-12 text-primary/20 mx-auto" />
        <h3 className="text-xl font-bold tracking-tight text-muted-foreground/50">{title} Manifestation Pending</h3>
      </div>
    </div>
  );
}

function CosplanDetailSkeleton() {
  return (
    <div className="flex-1 space-y-12">
      <div className="h-64 md:h-80 w-full bg-white/5 rounded-none md:rounded-b-3xl" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <Skeleton className="h-12 w-96 bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-64 md:col-span-2 bg-white/5 rounded-2xl" />
          <Skeleton className="h-64 bg-white/5 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function CosplanNotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
        <Sparkles className="size-10" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black tracking-tighter">Manifest Lost</h3>
        <p className="text-muted-foreground/80 max-w-[400px]">
          The project coordinates you provided do not exist in the current manifestation strata. Return to the directory to recalibrate.
        </p>
      </div>
      <Button asChild className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-xs" variant="celestial">
        <Link href="/hub/cosplans">Return to Directory</Link>
      </Button>
    </div>
  );
}
