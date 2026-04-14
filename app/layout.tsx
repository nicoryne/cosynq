import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { quicksand, dmsans } from "@/lib/constants/fonts";
import { siteMetadata } from "@/lib/constants/metadata";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", quicksand.variable, dmsans.variable)}
      suppressHydrationWarning
    >
      <body className={cn("min-h-full flex flex-col bg-background text-foreground", dmsans.className)}>
        {/* Skip to main content link for keyboard navigation - Requirement 18.6 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-2xl focus:shadow-glow-primary focus:font-bold focus:uppercase focus:tracking-widest focus:text-sm"
        >
          Skip to main content
        </a>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            storageKey="cosynq-theme"
            disableTransitionOnChange={false}
          >
            <TooltipProvider>
              {children}
            </TooltipProvider>
            <Toaster position="bottom-right" className="glassmorphism" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
