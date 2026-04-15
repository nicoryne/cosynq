import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { FooterSection } from "@/components/landing/footer-section"
import { Starfield } from "@/components/landing/starfield"
import { ContactForm } from "@/components/landing/contact-form"
import { Mail, MessageSquare, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | cosynq",
  description: "Get in touch with the cosynq command center.",
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <Starfield />
      <main className="relative pt-32 pb-24 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-20 text-center max-w-2xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tight mb-6">
              Contact Us
            </h1>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              Have a question about group syncs, project tracking, or just want to say hi? 
              Dispatch your signal below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-8">
                <div className="flex gap-6 group">
                  <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all shadow-glow-primary">
                    <Mail className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-1">Direct Signal</h3>
                    <p className="text-lg font-bold text-foreground/80">hello@cosynq.com</p>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 mt-1">24/7 Orbital Monitoring</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="size-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0 group-hover:scale-110 group-hover:bg-secondary/20 transition-all shadow-glow-secondary">
                    <MessageSquare className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-1">Community Hub</h3>
                    <p className="text-lg font-bold text-foreground/80">Discord & Forums</p>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 mt-1">Real-time collaboration</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="size-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                    <MapPin className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-1">Command Base</h3>
                    <p className="text-lg font-bold text-foreground/80">Cebu City, Philippines</p>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 mt-1">GMT+8 (PH Standard Time)</p>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="p-8 rounded-[2rem] glassmorphism border-white/5 bg-primary/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -mr-16 -mt-16 animate-pulse" />
                 <div className="relative z-10 flex items-center gap-4">
                   <div className="size-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60">System Status</p>
                     <p className="text-sm font-bold text-foreground/90 leading-none mt-1">All Systems Operational</p>
                   </div>
                 </div>
              </div>
            </div>

            {/* Contact Form Container */}
            <div className="lg:col-span-7">
              <div className="glassmorphism border-white/10 rounded-[2.8rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:bg-primary/15 transition-colors" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-[80px] -z-10 group-hover:bg-secondary/10 transition-colors" />
                
                <div className="relative z-10">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  )
}
