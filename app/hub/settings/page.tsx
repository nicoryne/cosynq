import { Navbar } from "@/components/layout/navbar";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { AuthService } from "@/lib/services/auth.service";
import { redirect } from "next/navigation";
import { Starfield } from "@/components/landing/starfield";
import { Settings as SettingsIcon } from "lucide-react";
import { SettingsClient } from "@/components/hub/settings/settings-client";
import { Badge } from "@/components/ui/badge";

/**
 * Settings Page
 * Requirements: 13.1-13.6 - Account Command Center redesign
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
    <div className="space-y-12 sm:space-y-16 max-w-6xl px-0 sm:px-6 mb-20">
      {/* Header */}
      <header className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 px-4 sm:px-0 pt-8 sm:pt-0">
        <Badge variant="outline" className="px-5 py-2.5 gap-2 border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[0.2em] text-primary rounded-full glassmorphism h-fit w-fit">
          <SettingsIcon className="size-3.5" />
          Settings
        </Badge>
        <div className="space-y-2">
          <h1 className="font-heading text-4xl md:text-7xl font-bold tracking-tighter">
            Account <span className="text-primary">Settings</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl leading-relaxed font-medium">
            Manage your profile, email, and account security.
          </p>
        </div>
      </header>

      {/* Main Command Hub */}
      <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
        <SettingsClient user={user} />
      </div>
    </div>
  );
}
