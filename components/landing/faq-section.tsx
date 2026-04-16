"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "What exactly is cosynq?",
    answer: "cosynq is your all-in-one cosplay command center. Think of it as the sanctuary where you can plan your builds, track budgets, recruit group members, sync convention schedules, and connect with the community—all without drowning in messy spreadsheets or chaotic group chats.",
  },
  {
    question: "Is cosynq free to use?",
    answer: "We're currently in early orbit! During our beta phase, core features are free. We'll announce pricing details as we expand, but our mission is to keep cosynq accessible for the cosplay community.",
  },
  {
    question: "Can I use cosynq for solo cosplay projects?",
    answer: "Absolutely! Whether you're a solo cosplayer tracking your personal builds or part of a massive group cosplay, cosynq adapts to your workflow. The Cosplan Hub is perfect for managing your individual projects.",
  },
  {
    question: "How does group recruitment work?",
    answer: "Signal Sync lets you create recruitment posts for your cosplay group, specify open roles, set your convention targets, and filter by location. Other cosplayers can browse and apply to join your squad—no more spamming Facebook groups.",
  },
  {
    question: "What conventions does My Cosplan support?",
    answer: "We're starting with major Philippine conventions (Otaku Fest, ARCHcon, Cosplay Mania, etc.) and expanding globally. You can also manually add any convention to your personal calendar.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. We use industry-standard encryption and strict Row Level Security (RLS) policies. Your cosplay plans, budgets, and personal info are protected. We follow GDPR and Philippine Data Privacy Act standards.",
  },
  {
    question: "Someone claimed my Facebook profile, how do I fix this?",
    answer: "Identity integrity is vital to cosynq. If your Facebook profile has been claimed by another user, you can manually dispute it even if you don't have an account. Simply use the 'Contact Us' form or email us directly to start the rebuttal process. We'll verify your ownership and restore your identity on the platform.",
  },
]

export function FAQSection() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 })

  return (
    <section
      id="faq"
      ref={ref}
      className="relative py-24 px-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className={cn(
          "text-center mb-16 transition-all duration-700",
          isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h3 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
            FAQ
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto font-medium text-lg leading-relaxed">
            Everything you need to know about organizing your craft on the platform.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className={cn(
          "transition-all duration-700 delay-200",
          isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
              >
                <AccordionTrigger>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="text-muted-foreground/90 animate-in fade-in slide-in-from-top-2 duration-300 fill-mode-both"
                  >
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still have questions CTA */}
        <div className={cn(
          "mt-12 text-center transition-all duration-700 delay-400",
          isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-base text-muted-foreground">
            Still have questions?{" "}
            <a
              href="mailto:hello@cosynq.com"
              className="text-primary hover:text-primary/80 font-bold transition-colors underline underline-offset-4"
            >
              Reach out to us
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
