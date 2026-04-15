import { Navbar } from "@/components/layout/navbar";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { AuthService } from "@/lib/services/auth.service";
import { redirect } from "next/navigation";
import { Starfield } from "@/components/landing/starfield";
import { Settings as SettingsIcon } from "lucide-react";
import { SettingsForm } from "./settings-form";
import { Badge } from "@/components/ui/badge";

/**
 * Settings Page
 * Requirements: 13.1-13.6 - Settings page redesign with organized sections
 * UI/UX Overhaul: Phase 5 - Hub Pages Redesign
 */
export default async function SettingsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const authService = new AuthService(supabase);
  const user = await authService.getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-16 max-w-5xl">
      {/* Header */}
      <header className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Badge variant="outline" className="px-5 py-2.5 gap-2 border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[0.2em] text-primary rounded-full glassmorphism">
          <SettingsIcon className="size-3.5" />
          Orbital Configuration
        </Badge>
        <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tighter">
          Identity <span className="text-primary italic">Matrix</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed font-medium">
          Configure how you manifest in the cosynq sanctuary. Your display alias and chronicle are visible to all travelers in the sector.
        </p>
      </header>

      {/* Settings Form */}
      <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
        <SettingsForm initialData={user.profile} />
      </div>
    </div>
  );
}
