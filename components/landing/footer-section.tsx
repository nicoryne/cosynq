"use client"

import Link from "next/link"
import { ROUTES } from "@/lib/constants/routes"
import { Button } from "@/components/ui/button"

export function FooterSection() {
  return (
    <footer className="relative py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Final Headline */}
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Ready to stitch your halo?
        </h2>

        {/* Large CTA Button */}
        <div className="mt-10">
          <Button
            asChild
            size="xl"
            variant="celestial"
          >
            <Link href={ROUTES.SIGN_UP}>
              Dream Now
            </Link>
          </Button>
        </div>

        {/* Gradient Divider Line */}
        <div className="mt-20 mb-8 h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Footer Credits */}
        <div className="flex flex-col items-center gap-3">
          <span className="font-heading font-bold text-xl tracking-tight">cosynq</span>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>© 2026 cosynq</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>
              crafted with 🩵 by{" "}
              <a
                href="https://ryne.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                RYNE.DEV
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
