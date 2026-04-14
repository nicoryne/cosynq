import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommunitySection } from '@/components/landing/community-section'

// Mock useIntersectionObserver hook
vi.mock('@/lib/hooks/use-intersection-observer', () => ({
  useIntersectionObserver: vi.fn(),
}))

const { useIntersectionObserver } = await import('@/lib/hooks/use-intersection-observer')

describe('CommunitySection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Intersection Observer Integration', () => {
    it('uses intersection observer with correct threshold', () => {
      vi.mocked(useIntersectionObserver).mockReturnValue({
        ref: { current: null },
        isIntersecting: false,
        hasIntersected: false,
      })

      render(<CommunitySection />)

      expect(useIntersectionObserver).toHaveBeenCalledWith({ threshold: 0.1 })
    })

    it('applies fade-in animation when section enters viewport', () => {
      vi.mocked(useIntersectionObserver).mockReturnValue({
        ref: { current: null },
        isIntersecting: true,
        hasIntersected: true,
      })

      const { container } = render(<CommunitySection />)

      // Check header animation
      const header = container.querySelector('.text-center')
      expect(header).toHaveClass('opacity-100')
      expect(header).toHaveClass('translate-y-0')
    })

    it('hides content when not intersecting', () => {
      vi.mocked(useIntersectionObserver).mockReturnValue({
        ref: { current: null },
        isIntersecting: false,
        hasIntersected: false,
      })

      const { container } = render(<CommunitySection />)

      // Check header is hidden
      const header = container.querySelector('.text-center')
      expect(header).toHaveClass('opacity-0')
      expect(header).toHaveClass('translate-y-8')
    })
  })

  describe('Section Structure', () => {
    beforeEach(() => {
      vi.mocked(useIntersectionObserver).mockReturnValue({
        ref: { current: null },
        isIntersecting: true,
        hasIntersected: true,
      })
    })

    it('renders section with correct id and classes', () => {
      const { container } = render(<CommunitySection />)

      const section = container.querySelector('section')
      expect(section).toHaveAttribute('id', 'community')
      expect(section).toHaveClass('relative')
      expect(section).toHaveClass('py-24')
      expect(section).toHaveClass('overflow-hidden')
    })

    it('renders heading with correct text', () => {
      render(<CommunitySection />)

      const heading = screen.getByText('Currently Orbiting')
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H2')
    })

    it('renders subheading with correct text', () => {
      render(<CommunitySection />)

      const subheading = screen.getByText(/Join the growing constellation/)
      expect(subheading).toBeInTheDocument()
    })
  })

  describe('Infinite Marquee', () => {
    beforeEach(() => {
      vi.mocked(useIntersectionObserver).mockReturnValue({
        ref: { current: null },
        isIntersecting: true,
        hasIntersected: true,
      })
    })

    it('renders marquee with animate-marquee class', () => {
      const { container } = render(<CommunitySection />)

      const marquee = container.querySelector('.animate-marquee')
      expect(marquee).toBeInTheDocument()
      expect(marquee).toHaveClass('flex')
      expect(marquee).toHaveClass('gap-8')
      expect(marquee).toHaveClass('w-max')
    })

    it('doubles items for seamless loop', () => {
      const { container } = render(<CommunitySection />)

      // Original orbiters array has 16 items, doubled = 32
      const avatars = container.querySelectorAll('[class*="size-14"]')
      const badges = container.querySelectorAll('[class*="h-14"][class*="px-8"]')

      // Should have 16 avatars (8 original * 2)
      expect(avatars.length).toBe(16)
      // Should have 16 badges (8 original * 2)
      expect(badges.length).toBe(16)
    })

    it('renders avatars with correct styling', () => {
      const { container } = render(<CommunitySection />)

      const avatars = container.querySelectorAll('[class*="size-14"]')
      
      avatars.forEach((avatar) => {
        expect(avatar).toHaveClass('border-2')
        expect(avatar).toHaveClass('border-white/10')
        expect(avatar).toHaveClass('shrink-0')
        expect(avatar).toHaveClass('shadow-glow-primary')
      })
    })

    it('renders convention badges with correct styling', () => {
      const { container } = render(<CommunitySection />)

      const badges = container.querySelectorAll('[class*="h-14"][class*="px-8"]')
      
      badges.forEach((badge) => {
        expect(badge).toHaveClass('rounded-2xl')
        expect(badge).toHaveClass('font-black')
        expect(badge).toHaveClass('uppercase')
        expect(badge).toHaveClass('tracking-widest')
        expect(badge).toHaveClass('glassmorphism')
      })
    })

    it('renders convention names correctly', () => {
      render(<CommunitySection />)

      // Check for some convention names (they appear twice due to doubling)
      expect(screen.getAllByText('Otaku Fest').length).toBe(2)
      expect(screen.getAllByText('ARCHcon').length).toBe(2)
      expect(screen.getAllByText('Cosplay Mania').length).toBe(2)
    })
  })

  describe('Fade Gradients', () => {
    beforeEach(() => {
      vi.mocked(useIntersectionObserver).mockReturnValue({
        ref: { current: null },
        isIntersecting: true,
        hasIntersected: true,
      })
    })

    it('renders left fade gradient', () => {
      const { container } = render(<CommunitySection />)

      const leftGradient = container.querySelector('.bg-gradient-to-r.from-background')
      expect(leftGradient).toBeInTheDocument()
      expect(leftGradient).toHaveClass('absolute')
      expect(leftGradient).toHaveClass('left-0')
      expect(leftGradient).toHaveClass('z-10')
      expect(leftGradient).toHaveClass('pointer-events-none')
    })

    it('renders right fade gradient', () => {
      const { container } = render(<CommunitySection />)

      const rightGradient = container.querySelector('.bg-gradient-to-l.from-background')
      expect(rightGradient).toBeInTheDocument()
      expect(rightGradient).toHaveClass('absolute')
      expect(rightGradient).toHaveClass('right-0')
      expect(rightGradient).toHaveClass('z-10')
      expect(rightGradient).toHaveClass('pointer-events-none')
    })
  })

  describe('Testimonial Card', () => {
    beforeEach(() => {
      vi.mocked(useIntersectionObserver).mockReturnValue({
        ref: { current: null },
        isIntersecting: true,
        hasIntersected: true,
      })
    })

    it('renders testimonial with glassmorphism styling', () => {
      const { container } = render(<CommunitySection />)

      // Find the testimonial card specifically (not the badges)
      const testimonialCard = container.querySelector('.rounded-\\[2\\.5rem\\]')
      expect(testimonialCard).toBeInTheDocument()
      expect(testimonialCard).toHaveClass('glassmorphism')
      expect(testimonialCard).toHaveClass('shadow-glow-primary')
    })

    it('renders testimonial text', () => {
      render(<CommunitySection />)

      const testimonialText = screen.getByText(/Finally, a place where our massive Genshin group/)
      expect(testimonialText).toBeInTheDocument()
      expect(testimonialText).toHaveClass('italic')
      expect(testimonialText).toHaveClass('font-medium')
    })

    it('renders decorative quote marks', () => {
      const { container } = render(<CommunitySection />)

      const quoteMark = container.querySelector('[aria-hidden="true"]')
      expect(quoteMark).toBeInTheDocument()
      expect(quoteMark).toHaveClass('text-6xl')
      expect(quoteMark).toHaveClass('text-primary/30')
      // Check that quote mark has content (any quotation mark character)
      expect(quoteMark?.textContent).toBeTruthy()
      expect(quoteMark?.textContent?.length).toBe(1)
    })

    it('renders internal glow effects', () => {
      const { container } = render(<CommunitySection />)

      // Check for primary glow
      const primaryGlow = container.querySelector('.bg-primary\\/20')
      expect(primaryGlow).toBeInTheDocument()
      expect(primaryGlow).toHaveClass('blur-3xl')

      // Check for secondary glow
      const secondaryGlow = container.querySelector('.bg-secondary\\/10')
      expect(secondaryGlow).toBeInTheDocument()
      expect(secondaryGlow).toHaveClass('blur-2xl')
    })

    it('renders author avatar', () => {
      const { container } = render(<CommunitySection />)

      const authorAvatar = container.querySelector('.shadow-glow-secondary')
      expect(authorAvatar).toBeInTheDocument()
      expect(authorAvatar).toHaveClass('size-12')
      expect(authorAvatar).toHaveClass('border-2')
    })

    it('renders author name and location', () => {
      render(<CommunitySection />)

      const authorName = screen.getByText('✨ Dreamer')
      expect(authorName).toBeInTheDocument()
      expect(authorName).toHaveClass('font-black')
      expect(authorName).toHaveClass('italic')

      const location = screen.getByText('Cebu City, PH')
      expect(location).toBeInTheDocument()
      expect(location).toHaveClass('uppercase')
      expect(location).toHaveClass('tracking-widest')
    })
  })

  describe('Staggered Animations', () => {
    it('applies staggered delays to elements', () => {
      vi.mocked(useIntersectionObserver).mockReturnValue({
        ref: { current: null },
        isIntersecting: true,
        hasIntersected: true,
      })

      const { container } = render(<CommunitySection />)

      // Header: no delay
      const header = container.querySelector('.text-center')
      expect(header).toHaveClass('duration-700')

      // Marquee: 200ms delay
      const marqueeContainer = container.querySelector('.animate-marquee')?.parentElement
      expect(marqueeContainer).toHaveClass('delay-200')

      // Testimonial: 400ms delay - find the outer div with max-w-2xl
      const testimonialWrapper = container.querySelector('.max-w-2xl')
      expect(testimonialWrapper).toHaveClass('delay-[400ms]')
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      vi.mocked(useIntersectionObserver).mockReturnValue({
        ref: { current: null },
        isIntersecting: true,
        hasIntersected: true,
      })
    })

    it('uses semantic HTML elements', () => {
      const { container } = render(<CommunitySection />)

      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()

      const heading = container.querySelector('h2')
      expect(heading).toBeInTheDocument()
    })

    it('hides decorative quote mark from screen readers', () => {
      const { container } = render(<CommunitySection />)

      const quoteMark = container.querySelector('[aria-hidden="true"]')
      expect(quoteMark).toHaveAttribute('aria-hidden', 'true')
    })

    it('provides meaningful text content', () => {
      render(<CommunitySection />)

      // All text should be accessible
      expect(screen.getByText('Currently Orbiting')).toBeInTheDocument()
      expect(screen.getByText(/Join the growing constellation/)).toBeInTheDocument()
      expect(screen.getByText(/Finally, a place where/)).toBeInTheDocument()
      expect(screen.getByText('✨ Dreamer')).toBeInTheDocument()
    })
  })
})
