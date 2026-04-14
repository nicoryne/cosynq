// =====================================================================
// Intersection Observer Hook
// =====================================================================
// Provides viewport-triggered animations for sections and elements
// Uses Intersection Observer API with configurable threshold

import { useEffect, useRef, useState } from 'react';

// =====================================================================
// Types
// =====================================================================

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLElement | null>;
  isIntersecting: boolean;
  hasIntersected: boolean;
}

// =====================================================================
// Intersection Observer Hook
// =====================================================================

/**
 * Hook: Intersection Observer for viewport-triggered animations
 * Triggers fade-in and slide-up animations when sections enter viewport
 * Pauses animations when elements leave viewport for performance
 * Requirements: 17.6
 *
 * @param options - Configuration options
 * @param options.threshold - Percentage of element visibility to trigger (default: 0.1)
 * @param options.rootMargin - Margin around root element (default: '0px')
 * @param options.triggerOnce - Whether to trigger only once (default: false)
 * @returns Object with ref, isIntersecting, and hasIntersected
 *
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
 *
 * return (
 *   <section
 *     ref={ref}
 *     className={cn(
 *       'opacity-0 translate-y-8 transition-all duration-700',
 *       isIntersecting && 'opacity-100 translate-y-0'
 *     )}
 *   >
 *     <h2>Animated Section</h2>
 *   </section>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // With staggered delays for child elements
 * const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
 *
 * return (
 *   <section ref={ref}>
 *     <div
 *       className={cn(
 *         'opacity-0 translate-y-8 transition-all duration-700 delay-100',
 *         isIntersecting && 'opacity-100 translate-y-0'
 *       )}
 *     >
 *       Child 1
 *     </div>
 *     <div
 *       className={cn(
 *         'opacity-0 translate-y-8 transition-all duration-700 delay-200',
 *         isIntersecting && 'opacity-100 translate-y-0'
 *       )}
 *     >
 *       Child 2
 *     </div>
 *     <div
 *       className={cn(
 *         'opacity-0 translate-y-8 transition-all duration-700 delay-300',
 *         isIntersecting && 'opacity-100 translate-y-0'
 *       )}
 *     >
 *       Child 3
 *     </div>
 *   </section>
 * );
 * ```
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = false } = options;

  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if already intersected and triggerOnce is enabled
    if (triggerOnce && hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        setIsIntersecting(isElementIntersecting);

        // Track if element has ever intersected
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }

        // Pause animations when element leaves viewport for performance
        if (!isElementIntersecting && element) {
          // Get all animated children
          const animatedElements = element.querySelectorAll('[class*="animate-"]');
          animatedElements.forEach((child) => {
            if (child instanceof HTMLElement) {
              child.style.animationPlayState = 'paused';
            }
          });
        } else if (isElementIntersecting && element) {
          // Resume animations when element enters viewport
          const animatedElements = element.querySelectorAll('[class*="animate-"]');
          animatedElements.forEach((child) => {
            if (child instanceof HTMLElement) {
              child.style.animationPlayState = 'running';
            }
          });
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  return {
    ref,
    isIntersecting,
    hasIntersected,
  };
}

// =====================================================================
// Multiple Elements Intersection Observer Hook
// =====================================================================

/**
 * Hook: Intersection Observer for multiple elements with staggered animations
 * Automatically applies staggered delays (100ms, 200ms, 300ms) to child elements
 * Requirements: 17.6
 *
 * @param options - Configuration options
 * @param options.threshold - Percentage of element visibility to trigger (default: 0.1)
 * @param options.rootMargin - Margin around root element (default: '0px')
 * @param options.staggerDelay - Base delay in milliseconds for staggering (default: 100)
 * @returns Object with ref and isIntersecting
 *
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useStaggeredIntersectionObserver();
 *
 * return (
 *   <section ref={ref}>
 *     {items.map((item, index) => (
 *       <div
 *         key={item.id}
 *         className={cn(
 *           'opacity-0 translate-y-8 transition-all duration-700',
 *           isIntersecting && 'opacity-100 translate-y-0'
 *         )}
 *         style={{
 *           transitionDelay: isIntersecting ? `${index * 100}ms` : '0ms',
 *         }}
 *       >
 *         {item.content}
 *       </div>
 *     ))}
 *   </section>
 * );
 * ```
 */
export function useStaggeredIntersectionObserver(
  options: UseIntersectionObserverOptions & { staggerDelay?: number } = {}
): UseIntersectionObserverReturn {
  const { threshold = 0.1, rootMargin = '0px', staggerDelay = 100 } = options;

  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);

          // Apply staggered delays to direct children
          const children = Array.from(element.children);
          children.forEach((child, index) => {
            if (child instanceof HTMLElement) {
              child.style.transitionDelay = `${index * staggerDelay}ms`;
            }
          });
        }

        // Pause/resume animations for performance
        if (!isElementIntersecting && element) {
          const animatedElements = element.querySelectorAll('[class*="animate-"]');
          animatedElements.forEach((child) => {
            if (child instanceof HTMLElement) {
              child.style.animationPlayState = 'paused';
            }
          });
        } else if (isElementIntersecting && element) {
          const animatedElements = element.querySelectorAll('[class*="animate-"]');
          animatedElements.forEach((child) => {
            if (child instanceof HTMLElement) {
              child.style.animationPlayState = 'running';
            }
          });
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, staggerDelay, hasIntersected]);

  return {
    ref,
    isIntersecting,
    hasIntersected,
  };
}
