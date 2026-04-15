import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-bold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 border-foreground/10 shadow-glow-primary hover:shadow-[0_0_20px_rgba(206,155,255,0.6)]",
        outline:
          "border border-foreground/10 dark:border-foreground/5 bg-foreground/5 dark:bg-background/20 backdrop-blur-xl hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-glow-primary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-glow-secondary hover:shadow-[0_0_20px_rgba(102,224,255,0.4)]",
        ghost:
          "hover:bg-primary/10 hover:text-primary",
        celestial:
          "border-2 border-primary bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground shadow-glow-primary",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2 text-xs",
        lg: "h-14 px-10 py-4 text-base tracking-widest uppercase",
        xl: "h-16 px-12 py-5 text-lg font-black tracking-[0.2em] uppercase",
        icon: "size-12",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
