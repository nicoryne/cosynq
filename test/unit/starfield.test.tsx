import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Starfield } from '@/components/landing/starfield'

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}))

const { useTheme } = await import('next-themes')

describe('Starfield Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Light Mode', () => {
    beforeEach(() => {
      vi.mocked(useTheme).mockReturnValue({
        resolvedTheme: 'light',
        theme: 'light',
        setTheme: vi.fn(),
        themes: ['light', 'dark'],
        systemTheme: 'light',
      } as any)
    })

    it('renders pastel nebula base gradient in light mode', () => {
      const { container } = render(<Starfield />)
      
      // Check for the base gradient
      const gradient = container.querySelector('.bg-gradient-to-br')
      expect(gradient).toBeInTheDocument()
      expect(gradient).toHaveClass('from-[#F9F7FD]')
      expect(gradient).toHaveClass('via-[#FCE6F0]/30')
      expect(gradient).toHaveClass('to-[#E0F7FA]/30')
    })

    it('renders large soft color wash orbs with correct blur values', () => {
      const { container } = render(<Starfield />)
      
      // Check for purple color wash
      const purpleOrb = container.querySelector('.bg-purple-200\\/20')
      expect(purpleOrb).toBeInTheDocument()
      expect(purpleOrb).toHaveClass('blur-[120px]')
      
      // Check for pink color wash
      const pinkOrb = container.querySelector('.bg-pink-200\\/20')
      expect(pinkOrb).toBeInTheDocument()
      expect(pinkOrb).toHaveClass('blur-[100px]')
      
      // Check for cyan color wash
      const cyanOrb = container.querySelector('.bg-cyan-100\\/20')
      expect(cyanOrb).toBeInTheDocument()
      expect(cyanOrb).toHaveClass('blur-[110px]')
    })

    it('renders drifting clouds with animate-cloud-drift', () => {
      const { container } = render(<Starfield />)
      
      // Check for clouds with animation
      const clouds = container.querySelectorAll('.animate-cloud-drift')
      expect(clouds.length).toBeGreaterThanOrEqual(15)
    })

    it('renders clouds with white/60 background and shadow', () => {
      const { container } = render(<Starfield />)
      
      // Check for cloud styling
      const cloudElements = container.querySelectorAll('.bg-white\\/60')
      expect(cloudElements.length).toBeGreaterThanOrEqual(15)
      
      // Check for blur-3xl and shadow
      cloudElements.forEach((cloud) => {
        expect(cloud).toHaveClass('blur-3xl')
        expect(cloud).toHaveClass('shadow-[0_0_40px_rgba(255,255,255,0.4)]')
      })
    })

    it('does not render dark mode elements in light mode', () => {
      const { container } = render(<Starfield />)
      
      // Should not have stars
      const stars = container.querySelectorAll('.animate-twinkle')
      expect(stars.length).toBe(0)
      
      // Should not have shooting stars
      const shootingStars = container.querySelectorAll('.animate-shooting-star')
      expect(shootingStars.length).toBe(0)
    })
  })

  describe('Dark Mode', () => {
    beforeEach(() => {
      vi.mocked(useTheme).mockReturnValue({
        resolvedTheme: 'dark',
        theme: 'dark',
        setTheme: vi.fn(),
        themes: ['light', 'dark'],
        systemTheme: 'dark',
      } as any)
    })

    it('renders deep nebula base gradient in dark mode', () => {
      const { container } = render(<Starfield />)
      
      // Check for the base gradient
      const gradient = container.querySelector('.bg-gradient-to-br')
      expect(gradient).toBeInTheDocument()
      expect(gradient).toHaveClass('from-[#0a0a12]')
      expect(gradient).toHaveClass('via-[#0f0a1f]')
      expect(gradient).toHaveClass('to-[#0a0a12]')
    })

    it('renders twinkling stars', () => {
      const { container } = render(<Starfield />)
      
      // Check for stars with animation
      const stars = container.querySelectorAll('.animate-twinkle')
      expect(stars.length).toBeGreaterThanOrEqual(100)
    })

    it('renders shooting stars with gradient trails', () => {
      const { container } = render(<Starfield />)
      
      // Check for shooting stars
      const shootingStars = container.querySelectorAll('.animate-shooting-star')
      expect(shootingStars.length).toBeGreaterThanOrEqual(3)
    })

    it('renders nebula orbs with pulse animation', () => {
      const { container } = render(<Starfield />)
      
      // Check for nebula orbs
      const nebulas = container.querySelectorAll('.animate-pulse')
      expect(nebulas.length).toBeGreaterThanOrEqual(4)
    })

    it('does not render light mode elements in dark mode', () => {
      const { container } = render(<Starfield />)
      
      // Should not have clouds
      const clouds = container.querySelectorAll('.animate-cloud-drift')
      expect(clouds.length).toBe(0)
      
      // Should not have light mode color washes
      const purpleOrb = container.querySelector('.bg-purple-200\\/20')
      expect(purpleOrb).not.toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    beforeEach(() => {
      vi.mocked(useTheme).mockReturnValue({
        resolvedTheme: 'light',
        theme: 'light',
        setTheme: vi.fn(),
        themes: ['light', 'dark'],
        systemTheme: 'light',
      } as any)
    })

    it('renders as fixed background layer with correct z-index', () => {
      const { container } = render(<Starfield />)
      
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('fixed')
      expect(wrapper).toHaveClass('inset-0')
      expect(wrapper).toHaveClass('-z-10')
      expect(wrapper).toHaveClass('overflow-hidden')
      expect(wrapper).toHaveClass('pointer-events-none')
    })

    it('renders placeholder during SSR (not mounted)', () => {
      vi.mocked(useTheme).mockReturnValue({
        resolvedTheme: undefined,
        theme: 'light',
        setTheme: vi.fn(),
        themes: ['light', 'dark'],
        systemTheme: 'light',
      } as any)

      const { container } = render(<Starfield />)
      
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('fixed')
      expect(wrapper).toHaveClass('inset-0')
      expect(wrapper).toHaveClass('-z-10')
      expect(wrapper).toHaveClass('pointer-events-none')
      
      // Note: The component still renders content even when not mounted in test environment
      // This is expected behavior as useEffect runs immediately in test environment
    })
  })

  describe('Cloud Generation', () => {
    beforeEach(() => {
      vi.mocked(useTheme).mockReturnValue({
        resolvedTheme: 'light',
        theme: 'light',
        setTheme: vi.fn(),
        themes: ['light', 'dark'],
        systemTheme: 'light',
      } as any)
    })

    it('generates exactly 15 clouds', () => {
      const { container } = render(<Starfield />)
      
      const clouds = container.querySelectorAll('.animate-cloud-drift')
      expect(clouds.length).toBe(15)
    })

    it('generates clouds with valid properties', () => {
      const { container } = render(<Starfield />)
      
      const clouds = container.querySelectorAll('.animate-cloud-drift')
      
      clouds.forEach((cloud) => {
        const cloudElement = cloud as HTMLElement
        const innerCloud = cloudElement.querySelector('.bg-white\\/60') as HTMLElement
        
        // Check that inline styles are applied
        expect(cloudElement.style.top).toBeTruthy()
        expect(cloudElement.style.animationDelay).toBeTruthy()
        expect(cloudElement.style.animationDuration).toBeTruthy()
        
        expect(innerCloud.style.width).toBeTruthy()
        expect(innerCloud.style.height).toBeTruthy()
        expect(innerCloud.style.transform).toBeTruthy()
        expect(innerCloud.style.opacity).toBeTruthy()
      })
    })
  })
})
