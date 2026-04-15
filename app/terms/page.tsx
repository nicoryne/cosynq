import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { FooterSection } from "@/components/landing/footer-section"
import { Starfield } from "@/components/landing/starfield"

export const metadata: Metadata = {
  title: "Terms of Service | cosynq",
  description: "Rules and guidelines for using the cosynq platform.",
}

export default function TermsPage() {
  const lastUpdated = "April 15, 2026"

  return (
    <>
      <Navbar />
      <Starfield />
      <main className="relative pt-32 pb-24 px-6 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tight mb-6">
              Terms of Service
            </h1>
            <p className="text-muted-foreground font-medium">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Terms Content */}
          <div className="glassmorphism border-white/10 rounded-[2.5rem] p-8 sm:p-16 space-y-12 leading-relaxed text-muted-foreground/90 font-medium">
            <p className="italic text-foreground/70">
              Please read these Terms of Service carefully before accessing or using our Platform. By accessing or using any part of the site, you agree to be bound by these Terms of Service.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">1. General Conditions</h2>
              <p>
                We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">2. User Accounts</h2>
              <p>
                To access most features of cosynq, you must register for an account. When you register, you agree to provide accurate, current, and complete information. You are solely responsible for maintaining the confidentiality of your account and password, and you accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">3. Community Standards & Conduct</h2>
              <p>
                cosynq is a sanctuary for the cosplay community. You agree not to use the Platform for any purpose that is unlawful or prohibited by these Terms. Prohibited activities include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Harassment, bullying, or discrimination against other cosplayers.</li>
                <li>Posting content that is obscene, hateful, or violates third-party intellectual property.</li>
                <li>Spamming group recruitment or marketing materials.</li>
                <li>Attempting to circumvent the security features of the platform (RLS policies).</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">4. Intellectual Property</h2>
              <p>
                <strong>Your Content</strong>: You retain all ownership rights to the cosplay projects, photos, and planning data you upload. By posting content, you grant cosynq a non-exclusive, royalty-free license to host, store, and display your content to facilitate your use of the service.
              </p>
              <p>
                <strong>Our Content</strong>: The cosynq brand, logo, and proprietary design system are the property of RYNE.DEV and are protected by intellectual property laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">5. Service Availability & Modifications</h2>
              <p>
                We strive for maximum uptime, but we do not guarantee that the Platform will always be available or uninterrupted. We reserve the right to modify or discontinue the Service (or any part or content thereof) without notice at any time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">6. Limitation of Liability</h2>
              <p>
                In no case shall cosynq, our directors, officers, or employees be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind arising from your use of the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">7. Governing Law</h2>
              <p>
                These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of <strong>Cebu City, Philippines</strong>.
              </p>
            </section>

            <div className="pt-8 border-t border-white/5 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                © 2026 cosynq • RYNE.DEV
              </p>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  )
}
