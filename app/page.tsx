import dynamic from "next/dynamic"
import { Navbar } from "@/components/layout/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { Starfield } from "@/components/landing/starfield"

// Lazy load below-the-fold sections for better initial page load performance
const FeaturesSection = dynamic(() => import("@/components/landing/features-section").then(mod => ({ default: mod.FeaturesSection })), {
  loading: () => <div className="min-h-screen" />,
})

const JourneySection = dynamic(() => import("@/components/landing/journey-section").then(mod => ({ default: mod.JourneySection })), {
  loading: () => <div className="min-h-screen" />,
})

const CommunitySection = dynamic(() => import("@/components/landing/community-section").then(mod => ({ default: mod.CommunitySection })), {
  loading: () => <div className="min-h-[600px]" />,
})

const FAQSection = dynamic(() => import("@/components/landing/faq-section").then(mod => ({ default: mod.FAQSection })), {
  loading: () => <div className="min-h-[800px]" />,
})

const FooterSection = dynamic(() => import("@/components/landing/footer-section").then(mod => ({ default: mod.FooterSection })), {
  loading: () => <div className="min-h-[400px]" />,
})

export default function Home() {
  return (
    <>
      <Navbar />
      <Starfield />
      <main id="main-content" className="relative">
        <HeroSection />
        <FeaturesSection />
        <JourneySection />
        <CommunitySection />
        <FAQSection />
      </main>
      <FooterSection />
    </>
  )
}
