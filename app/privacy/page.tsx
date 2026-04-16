import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { FooterSection } from "@/components/landing/footer-section"
import { Starfield } from "@/components/landing/starfield"

export const metadata: Metadata = {
  title: "Privacy Policy | cosynq",
  description: "How we protect and manage your data at cosynq.",
}

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-muted-foreground font-medium">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Policy Content */}
          <div className="glassmorphism border-white/10 rounded-[2.5rem] p-8 sm:p-16 space-y-12 leading-relaxed text-muted-foreground/90 font-medium">
            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">1. Introduction</h2>
              <p>
                Welcome to cosynq (the "Platform"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information when you use our services, specifically designed for the cosplay community.
              </p>
              <p>
                By using cosynq, you agree to the collection and use of information in accordance with this policy. Under the <strong>Philippine Data Privacy Act of 2012 (RA 10173)</strong>, we ensure that your data is handled with transparency, legitimate purpose, and proportionality.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">2. Information We Collect</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground/80 mb-2">Account Information</h3>
                  <p>When you register, we collect your email address and authentication details. These are managed through our secure authentication systems, and we do not store your plain-text passwords.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground/80 mb-2">User Content</h3>
                  <p>Materials you voluntarily provide, including cosplay project details, budget tracking, character references, and group recruitment information.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground/80 mb-2">Technical Data</h3>
                  <p>Log data such as your IP address, browser type, and interaction with our secure cloud storage or database features.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">3. How We Use Your Data</h2>
              <p>We use your data to facilitate your cosplay organization experience, specifically to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manage your Cosplay Group (CG) recruitment via Signal Sync.</li>
                <li>Securely track your project budgets and schedules.</li>
                <li>Facilitate community interaction in the forums and directories.</li>
                <li>Ensure the security and integrity of the platform.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">4. Data Storage & Security</h2>
              <p>
                Your data is stored using industry-standard cloud infrastructure with strict <strong>Row Level Security (RLS)</strong> policies. This ensures that only authorized users (you) can access or edit your private information like budgets and personal drafts.
              </p>
              <p>
                While we strive to use commercially acceptable means to protect your personal data, remember that no method of transmission over the Internet is 100% secure. We utilize sub-processors who meet global security standards to host and protect our universe of data.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">5. Your Rights (RA 10173)</h2>
              <p>As a data subject under Philippine law, you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right to be informed</strong>: How your data is being processed.</li>
                <li><strong>Right to access</strong>: Request a copy of your records.</li>
                <li><strong>Right to rectification</strong>: Correct any inaccuracies in your data.</li>
                <li><strong>Right to erasure</strong>: Request the removal of your data from our systems.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please reach out to our Data Protection Officer at:
              </p>
              <p className="font-black text-primary">hello@cosynq.ryne.dev</p>
            </section>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  )
}
