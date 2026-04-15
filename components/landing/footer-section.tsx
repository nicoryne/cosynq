"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants/routes"
import { LANDING_NAV_LINKS, FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants/navigation"

// Custom SVG Icons for brands not included in Lucide-React
const GithubIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const TwitterIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const YoutubeIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

const SOCIAL_ICONS: Record<string, any> = {
  twitter: TwitterIcon,
  github: GithubIcon,
  youtube: YoutubeIcon,
}

export function FooterSection() {
  return (
    <footer className="relative pt-32 pb-16 px-6 overflow-hidden">
      {/* Decorative Atmosphere Orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <Link
              href="/"
              className="font-heading font-black text-3xl tracking-tighter select-none flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">cosynq</span>
            </Link>
            <p className="text-muted-foreground/80 max-w-xs text-sm font-medium leading-relaxed">
              The ultimate sanctuary for the cosplay community. Drop the messy spreadsheets and step into a beautifully organized command center.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon as keyof typeof SOCIAL_ICONS]
                if (!Icon) return null
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 hover:bg-white/10 transition-all group"
                    aria-label={social.label}
                  >
                    <Icon className="size-5 transition-transform group-hover:scale-110" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links: Platform */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Platform</h4>
            <ul className="space-y-4">
              {LANDING_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="size-1 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Resources */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Resources</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                    className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="size-1 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA / Newsletter Lite */}
          <div className="space-y-8">
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/5 to-secondary/5 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
              <div className="relative z-10">
                <h5 className="font-heading text-xl font-bold mb-2">Join the Dreamers</h5>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Ready to organize your next big craft?</p>
                <Button asChild size="sm" className="w-full rounded-xl bg-primary text-primary-foreground shadow-glow-primary">
                  <Link href={ROUTES.SIGN_UP}>Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em]">
          <div className="flex items-center gap-6 text-muted-foreground/60">
            <span>© 2026 COSYNQ</span>
            <span className="hidden md:block size-1 rounded-full bg-white/10" />
            <span>ALL RIGHTS RESERVED</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/40">CRAFTED BY</span>
            <a
              href="https://ryne.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors py-1 px-3 rounded-lg bg-white/5 border border-white/5"
            >
              RYNE.DEV
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
