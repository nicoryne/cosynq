"use client"

import { Menu } from "lucide-react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { HubSidebar } from "./hub-sidebar"
import { Sparkles } from "lucide-react"

export function HubCommandDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-11 rounded-2xl bg-foreground/[0.03] border border-border hover:bg-foreground/[0.08] hover:shadow-glow-primary/20 transition-all group"
        >
          <Menu className="size-5 group-hover:text-primary transition-colors" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="p-0 border-r border-border w-72"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        
        {/* We reuse the HubSidebar but we'll need to strip its fixed height/border in the next step */}
        <HubSidebar className="w-full h-full border-none bg-transparent" />
        
      </SheetContent>
    </Sheet>
  )
}
