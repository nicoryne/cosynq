"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default" | "lg"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-white/10 glassmorphism transition-all duration-300",
        "data-[size=default]:h-8 data-[size=default]:w-14 data-[size=sm]:h-5 data-[size=sm]:w-9 data-[size=lg]:h-10 data-[size=lg]:w-18",
        "data-checked:bg-primary data-checked:shadow-glow-primary data-checked:border-primary/50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-foreground shadow-lg transition-transform duration-300",
          "group-data-[size=default]/switch:size-6 group-data-[size=sm]/switch:size-3.5 group-data-[size=lg]/switch:size-8",
          "group-data-[size=default]/switch:data-checked:translate-x-7 group-data-[size=sm]/switch:data-checked:translate-x-4 group-data-[size=lg]/switch:data-checked:translate-x-8.5",
          "group-data-[size=default]/switch:data-unchecked:translate-x-1 group-data-[size=sm]/switch:data-unchecked:translate-x-0.5 group-data-[size=lg]/switch:data-unchecked:translate-x-1",
          "data-checked:bg-primary-foreground"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
