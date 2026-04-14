/**
 * Animation Performance Tests
 * 
 * Validates that all animations follow GPU acceleration best practices:
 * - Use transform and opacity properties only
 * - Apply will-change sparingly during active animations
 * - All animations are CSS-based (no JavaScript animation loops)
 * - Respect prefers-reduced-motion media query
 */

import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Animation Performance Optimizations', () => {
  const globalsCSS = fs.readFileSync(
    path.join(process.cwd(), 'app/globals.css'),
    'utf-8'
  )

  describe('GPU Acceleration', () => {
    it('should only animate transform and opacity properties', () => {
      // Extract all @keyframes blocks
      const keyframesRegex = /@keyframes\s+[\w-]+\s*{([^}]+)}/g
      const matches = [...globalsCSS.matchAll(keyframesRegex)]
      
      expect(matches.length).toBeGreaterThan(0)
      
      matches.forEach((match) => {
        const keyframeContent = match[1]
        
        // Check that only transform, opacity, and background-position are animated
        // background-position is allowed for gradient-shift animation
        const animatedProperties = keyframeContent.match(/^\s*([a-z-]+):/gm)
        
        if (animatedProperties) {
          animatedProperties.forEach((prop) => {
            const cleanProp = prop.trim().replace(':', '')
            expect(
              ['transform', 'opacity', 'background-position'].includes(cleanProp),
              `Animation should only use GPU-accelerated properties, found: ${cleanProp}`
            ).toBe(true)
          })
        }
      })
    })

    it('should not animate layout-triggering properties', () => {
      // These properties trigger layout recalculation and should never be animated
      const badProperties = [
        'width', 'height', 'top', 'left', 'right', 'bottom',
        'margin', 'padding', 'border-width', 'font-size'
      ]
      
      const keyframesRegex = /@keyframes\s+[\w-]+\s*{([^}]+)}/g
      const matches = [...globalsCSS.matchAll(keyframesRegex)]
      
      matches.forEach((match) => {
        const keyframeContent = match[1]
        
        badProperties.forEach((badProp) => {
          expect(
            keyframeContent.includes(`${badProp}:`),
            `Animation should not use layout-triggering property: ${badProp}`
          ).toBe(false)
        })
      })
    })
  })

  describe('will-change Property', () => {
    it('should apply will-change to animated elements', () => {
      const animationClasses = [
        'animate-float',
        'animate-twinkle',
        'animate-shooting-star',
        'animate-cloud-drift',
        'animate-marquee',
        'animate-bounce-gentle'
      ]
      
      animationClasses.forEach((className) => {
        const classRegex = new RegExp(`\\.${className}\\s*{[^}]*will-change:\\s*([^;]+);`, 's')
        const match = globalsCSS.match(classRegex)
        
        expect(
          match,
          `${className} should have will-change property`
        ).toBeTruthy()
        
        if (match) {
          const willChangeValue = match[1].trim()
          expect(
            ['transform', 'opacity', 'transform, opacity', 'auto'].includes(willChangeValue),
            `will-change should only use transform/opacity, found: ${willChangeValue}`
          ).toBe(true)
        }
      })
    })

    it('should remove will-change when not needed (animate-float)', () => {
      // animate-float should remove will-change when not hovering
      expect(globalsCSS).toContain('.animate-float:not(:hover)')
      expect(globalsCSS).toMatch(/\.animate-float:not\(:hover\)\s*{\s*will-change:\s*auto/)
    })
  })

  describe('CSS-Only Animations', () => {
    it('should define all animations in CSS', () => {
      const expectedAnimations = [
        'float',
        'twinkle',
        'shooting-star',
        'cloud-drift',
        'marquee',
        'gradient-shift',
        'bounce-gentle'
      ]
      
      expectedAnimations.forEach((animName) => {
        const keyframeRegex = new RegExp(`@keyframes\\s+${animName}\\s*{`)
        expect(
          globalsCSS.match(keyframeRegex),
          `Should define @keyframes ${animName}`
        ).toBeTruthy()
      })
    })

    it('should use CSS animation property, not JavaScript', () => {
      // Verify animation classes use CSS animation property
      const animationClasses = [
        'animate-float',
        'animate-twinkle',
        'animate-shooting-star',
        'animate-cloud-drift',
        'animate-marquee',
        'animate-gradient-shift',
        'animate-bounce-gentle'
      ]
      
      animationClasses.forEach((className) => {
        const classRegex = new RegExp(`\\.${className}\\s*{[^}]*animation:\\s*([^;]+);`, 's')
        const match = globalsCSS.match(classRegex)
        
        expect(
          match,
          `${className} should have animation property`
        ).toBeTruthy()
      })
    })
  })

  describe('Accessibility: Reduced Motion', () => {
    it('should include prefers-reduced-motion media query', () => {
      expect(globalsCSS).toContain('@media (prefers-reduced-motion: reduce)')
    })

    it('should disable animations for reduced motion', () => {
      const reducedMotionRegex = /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*{([^}]+)}/s
      const match = globalsCSS.match(reducedMotionRegex)
      
      expect(match).toBeTruthy()
      
      if (match) {
        const reducedMotionContent = match[1]
        
        // Should set animation-duration to near-zero
        expect(reducedMotionContent).toContain('animation-duration: 0.01ms !important')
        
        // Should set animation-iteration-count to 1
        expect(reducedMotionContent).toContain('animation-iteration-count: 1 !important')
        
        // Should set transition-duration to near-zero
        expect(reducedMotionContent).toContain('transition-duration: 0.01ms !important')
        
        // Should disable smooth scroll
        expect(reducedMotionContent).toContain('scroll-behavior: auto !important')
      }
    })

    it('should disable will-change for reduced motion', () => {
      // Check if the media query exists
      expect(globalsCSS).toContain('@media (prefers-reduced-motion: reduce)')
      
      // Check if all animation classes are listed in the reduced motion section
      const animationClasses = [
        'animate-float',
        'animate-twinkle',
        'animate-shooting-star',
        'animate-cloud-drift',
        'animate-marquee',
        'animate-bounce-gentle'
      ]
      
      // Extract the reduced motion section
      const startIndex = globalsCSS.indexOf('@media (prefers-reduced-motion: reduce)')
      expect(startIndex).toBeGreaterThan(-1)
      
      // Find the closing brace of the media query
      let braceCount = 0
      let inMediaQuery = false
      let endIndex = startIndex
      
      for (let i = startIndex; i < globalsCSS.length; i++) {
        if (globalsCSS[i] === '{') {
          braceCount++
          inMediaQuery = true
        } else if (globalsCSS[i] === '}') {
          braceCount--
          if (inMediaQuery && braceCount === 0) {
            endIndex = i
            break
          }
        }
      }
      
      const reducedMotionContent = globalsCSS.substring(startIndex, endIndex + 1)
      
      animationClasses.forEach((className) => {
        expect(
          reducedMotionContent.includes(className),
          `Reduced motion should disable will-change for ${className}`
        ).toBe(true)
      })
      
      expect(reducedMotionContent).toContain('will-change: auto !important')
    })
  })

  describe('Animation Timing', () => {
    it('should use appropriate animation durations', () => {
      // Verify animations have reasonable durations (not too fast, not too slow)
      const timingTests = [
        { name: 'float', min: 5, max: 10 },
        { name: 'twinkle', min: 2, max: 5 },
        { name: 'shooting-star', min: 5, max: 10 },
        { name: 'cloud-drift', min: 40, max: 60 },
        { name: 'marquee', min: 20, max: 40 },
        { name: 'gradient-shift', min: 5, max: 10 },
        { name: 'bounce-gentle', min: 1, max: 3 }
      ]
      
      timingTests.forEach(({ name, min, max }) => {
        const classRegex = new RegExp(`\\.animate-${name}\\s*{[^}]*animation:\\s*${name}\\s+(\\d+)s`, 's')
        const match = globalsCSS.match(classRegex)
        
        if (match) {
          const duration = parseInt(match[1])
          expect(
            duration >= min && duration <= max,
            `${name} duration should be between ${min}s and ${max}s, found ${duration}s`
          ).toBe(true)
        }
      })
    })

    it('should use infinite iteration for continuous animations', () => {
      const continuousAnimations = [
        'animate-float',
        'animate-twinkle',
        'animate-shooting-star',
        'animate-cloud-drift',
        'animate-marquee',
        'animate-gradient-shift',
        'animate-bounce-gentle'
      ]
      
      continuousAnimations.forEach((className) => {
        const classRegex = new RegExp(`\\.${className}\\s*{[^}]*animation:[^;]*infinite`, 's')
        expect(
          globalsCSS.match(classRegex),
          `${className} should use infinite iteration`
        ).toBeTruthy()
      })
    })
  })
})
