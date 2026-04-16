"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send, CheckCircle2, Loader2, RotateCcw, User, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { contactSchema, ContactFormData } from "@/lib/validations/contact.schema"
import { useContactMutation } from "@/lib/hooks/use-contact"

export function ContactForm() {
  const { mutate: sendSignal, isPending, isSuccess, reset: resetMutation } = useContactMutation()

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = (data: ContactFormData) => {
    sendSignal(data)
  }

  const handleReset = () => {
    resetForm()
    resetMutation()
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center justify-center py-16 space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-glow-primary/40 relative">
          <CheckCircle2 className="size-12 relative z-10" />
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20" />
        </div>
        <div className="space-y-4">
          <h3 className="text-3xl font-black tracking-tighter">Transmission Synchronized</h3>
          <p className="text-muted-foreground/80 max-w-xs mx-auto leading-relaxed uppercase tracking-wider text-[10px] font-bold">
            Your signal has been successfully beamed to the command center. Check your orbit for a confirmation echo.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="rounded-full px-8 h-12 uppercase font-black tracking-widest text-[10px] border-white/5 hover:bg-white/5"
        >
          <RotateCcw className="size-3 mr-2" />
          Send New Broadcast
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <Label htmlFor="name" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Commander Name
          </Label>
          <div className="relative">
            <Input 
              id="name"
              {...register("name")}
              placeholder="Aether Sculptor" 
              className={cn(
                "pl-[4.5rem] md:pl-[4.5rem] pr-8 md:pr-8 rounded-full border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50 h-14",
                errors.name && "border-destructive/50 focus-visible:ring-destructive/20"
              )}
            />
            <User className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40 z-10 pointer-events-none" />
          </div>
          {errors.name && (
            <p className="text-[10px] font-black uppercase tracking-widest text-destructive ml-4 animate-in fade-in slide-in-from-left-2">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="email" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Orbit Email
          </Label>
          <div className="relative">
            <Input 
              id="email"
              type="email"
              {...register("email")}
              placeholder="aether@cosynq.ryne.dev" 
              className={cn(
                "pl-[4.5rem] md:pl-[4.5rem] pr-8 md:pr-8 rounded-full border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50 h-14",
                errors.email && "border-destructive/50 focus-visible:ring-destructive/20"
              )}
            />
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40 z-10 pointer-events-none" />
          </div>
          {errors.email && (
            <p className="text-[10px] font-black uppercase tracking-widest text-destructive ml-4 animate-in fade-in slide-in-from-left-2">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Label htmlFor="subject" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Subject Frequency
        </Label>
        <div className="relative">
          <Input 
            id="subject"
            {...register("subject")}
            placeholder="Orbital recruitment inquiry" 
            className={cn(
              "pl-[4.5rem] md:pl-[4.5rem] pr-8 md:pr-8 rounded-full border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50 h-14",
              errors.subject && "border-destructive/50 focus-visible:ring-destructive/20"
            )}
          />
          <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40 z-10 pointer-events-none" />
        </div>
        {errors.subject && (
          <p className="text-[10px] font-black uppercase tracking-widest text-destructive ml-4 animate-in fade-in slide-in-from-left-2">
            {errors.subject.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="message" className="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Your Signal
        </Label>
        <Textarea 
          id="message"
          {...register("message")}
          placeholder="How can we help your craft thrive in the hub?" 
          className={cn(
            "rounded-[2rem] border-foreground/10 bg-foreground/5 shadow-inner transition-all focus-visible:ring-primary/50 min-h-[180px] resize-none p-8 text-base",
            errors.message && "border-destructive/50 focus-visible:ring-destructive/20"
          )}
        />
        {errors.message && (
          <p className="text-[10px] font-black uppercase tracking-widest text-destructive ml-4 animate-in fade-in slide-in-from-left-2">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button 
        type="submit" 
        size="xl"
        disabled={isPending}
        className="w-full h-16 rounded-full shadow-glow-primary active:scale-[0.98] transition-all font-black uppercase tracking-[0.2em]"
      >
        {isPending ? (
          <>
            <Loader2 className="size-5 animate-spin mr-3" />
            Broadcasting...
          </>
        ) : (
          <>
            Dispatch Transmission
            <Send className="size-5 ml-3" />
          </>
        )}
      </Button>
    </form>
  )
}
