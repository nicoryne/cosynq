'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  cosplanBaseSchema, 
  CreateCosplanInput 
} from '@/lib/types/cosplan.types';
import { useCreateCosplan } from '@/lib/hooks/use-cosplans';
import { Loader2, Plus, Rocket, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateCosplanDialogProps {
  children?: React.ReactNode;
}

export function CreateCosplanDialog({ children }: CreateCosplanDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate: createCosplan, isPending } = useCreateCosplan();

  const form = useForm<CreateCosplanInput>({
    resolver: zodResolver(cosplanBaseSchema),
    defaultValues: {
      characterName: '',
      series: '',
      status: 'DREAMING',
      budgetCeiling: 0,
      visibility: 'PRIVATE',
    } as CreateCosplanInput,
  });

  const onSubmit = (data: CreateCosplanInput) => {
    createCosplan(data, {
      onSuccess: (result) => {
        if (result.success && result.data) {
          setOpen(false);
          form.reset();
          router.push(`/hub/cosplans/${result.data}`);
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="rounded-xl px-6 h-12 font-black uppercase tracking-widest text-[10px] gap-2 group shadow-lg shadow-primary/20" variant="celestial">
            Manifest New <Plus className="size-4 group-hover:rotate-90 transition-transform" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md border-white/10 bg-black/60 backdrop-blur-2xl text-foreground rounded-3xl overflow-hidden p-0 shadow-2xl shadow-primary/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="p-6 md:p-8 space-y-6 relative">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
              <Rocket className="size-3" />
              Manifestation Wizard
            </div>
            <DialogTitle className="text-2xl font-black tracking-tighter">
              New <span className="text-primary text-3xl italic block mt-1">Cosplan</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/80 leading-relaxed font-medium">
              Ground your creative signals into the data strata. Define your character and set the financial ceiling for this manifestation.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="characterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-black tracking-[0.15em] text-muted-foreground ml-1">Character Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Cloud Strife" {...field} className="h-12 border-white/5 bg-white/5 rounded-xl px-4 focus-visible:ring-primary/20" />
                    </FormControl>
                    <FormMessage className="text-[10px] uppercase font-bold text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="series"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-black tracking-[0.15em] text-muted-foreground ml-1">Archive / Series</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Final Fantasy VII" {...field} className="h-12 border-white/5 bg-white/5 rounded-xl px-4 focus-visible:ring-primary/20" />
                    </FormControl>
                    <FormMessage className="text-[10px] uppercase font-bold text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budgetCeiling"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-[10px] font-black tracking-[0.15em] text-muted-foreground ml-1">Budget Ceiling (₱)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="h-12 border-white/5 bg-white/5 rounded-xl px-4 focus-visible:ring-primary/20" 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-[10px] font-black tracking-[0.15em] text-muted-foreground ml-1">Target Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} className="h-12 border-white/5 bg-white/5 rounded-xl px-4 focus-visible:ring-primary/20" />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full rounded-2xl h-14 font-black uppercase tracking-[0.2em] text-xs gap-3 shadow-lg shadow-primary/20" 
                  variant="celestial"
                >
                  {isPending ? (
                    <>Manifesting Node... <Loader2 className="size-4 animate-spin" /></>
                  ) : (
                    <>Initialize Manifestation <Sparkles className="size-4" /></>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
