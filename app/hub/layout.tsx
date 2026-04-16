import { HubSidebar } from "@/components/hub/hub-sidebar";
import { HubHeader } from "@/components/hub/hub-header";
import { Starfield } from "@/components/landing/starfield";
import { cn } from "@/lib/utils";

/**
 * Hub Layout
 * Provides Sidebar + Header architecture for all authenticated sub-routes
 */
export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-background flex overflow-hidden">
      <Starfield />

      {/* Atmospheric Background Blurs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Main viewport */}
      <div className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
        <HubHeader />
        
        {/* Scrollable Canvas */}
        <main id="main-content" className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 lg:p-10">
          <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
