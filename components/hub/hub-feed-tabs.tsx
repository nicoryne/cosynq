"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sparkles, Users, Zap, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function HubFeedTabs() {
  const tabs = [
    { value: "global", label: "Global Signal", icon: <Globe className="size-3.5" />, color: "text-primary" },
    { value: "synchronized", label: "Synchronized", icon: <Users className="size-3.5" />, color: "text-secondary" },
    { value: "directives", label: "Directives", icon: <Zap className="size-3.5" />, color: "text-accent" },
  ]

  return (
    <div className="w-full flex justify-center pb-4">
      {/* Desktop View: High-Fidelity Tabs */}
      <div className="hidden sm:block w-full">
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="w-full h-14 bg-white/[0.01] border border-white/5 rounded-sm sm:rounded-md p-1 flex gap-1 backdrop-blur-3xl overflow-x-auto no-scrollbar flex-nowrap">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className={cn(
                  "flex-1 min-w-[100px] rounded-sm sm:rounded-md h-full transition-all text-[10px] font-black uppercase tracking-[0.2em] gap-2 px-2",
                  tab.value === "global" && "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-glow-primary/5",
                  tab.value === "synchronized" && "data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary data-[state=active]:shadow-glow-secondary/5",
                  tab.value === "directives" && "data-[state=active]:bg-accent/10 data-[state=active]:text-accent data-[state=active]:shadow-glow-accent/5"
                )}
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile View: Clean Signal Dropdown */}
      <div className="sm:hidden w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full h-14 glassmorphism border-white/5 bg-white/[0.01] rounded-2xl flex justify-between px-6 font-black uppercase tracking-[0.2em] text-[10px]">
               <div className="flex items-center gap-3">
                 <Globe className="size-4 text-primary" />
                 <span>Filter Signals</span>
               </div>
               <ChevronDown className="size-4 text-muted-foreground/30" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(100vw-2rem)] glassmorphism border-white/10 rounded-2xl p-2 bg-[#0a0a12]/95 backdrop-blur-3xl shadow-2xl">
            {tabs.map((tab) => (
              <DropdownMenuItem key={tab.value} className="h-12 rounded-xl flex items-center gap-3 px-4 font-black uppercase tracking-widest text-[10px] focus:bg-white/5 focus:text-primary transition-colors">
                {tab.icon}
                {tab.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
