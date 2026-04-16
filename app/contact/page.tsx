import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { FooterSection } from "@/components/landing/footer-section"
import { Starfield } from "@/components/landing/starfield"
import { ContactForm } from "@/components/landing/contact-form"

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
        <div className="max-w-4xl mx-auto">
          {/* Header - Styled to match Privacy Policy */}
          <div className="mb-16 text-center">
            <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tight mb-6">
              Contact Us
            </h1>
            <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto">
              Have a question about group syncs or project orbit? 
              Dispatch your signal to the command center.
            </p>
          </div>

          {/* Centered Contact Form - Simplified Layout */}
          <div className="glassmorphism border-white/10 rounded-[2.8rem] p-8 sm:p-16 shadow-2xl relative overflow-hidden bg-white/[0.01] backdrop-blur-2xl">
            {/* Background Depth Gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-[80px] -z-10" />
            
            <div className="relative z-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  )
}
