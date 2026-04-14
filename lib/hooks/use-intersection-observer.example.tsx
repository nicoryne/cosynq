// =====================================================================
// Example Usage: useIntersectionObserver Hook
// =====================================================================
// This file demonstrates how to use the intersection observer hooks
// for viewport-triggered animations

import { useIntersectionObserver, useStaggeredIntersectionObserver } from './use-intersection-observer';
import { cn } from '@/lib/utils';

// =====================================================================
// Example 1: Basic Fade-In Animation
// =====================================================================

export function FadeInSection({ children }: { children: React.ReactNode }) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={cn(
        'opacity-0 translate-y-8 transition-all duration-700',
        isIntersecting && 'opacity-100 translate-y-0'
      )}
    >
      {children}
    </section>
  );
}

// =====================================================================
// Example 2: Slide-Up Animation with Staggered Children
// =====================================================================

export function StaggeredFeatureCards() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  const features = [
    { title: 'Feature 1', description: 'Description 1' },
    { title: 'Feature 2', description: 'Description 2' },
    { title: 'Feature 3', description: 'Description 3' },
  ];

  return (
    <section ref={ref} className="grid grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div
          key={feature.title}
          className={cn(
            'opacity-0 translate-y-8 transition-all duration-700',
            isIntersecting && 'opacity-100 translate-y-0'
          )}
          style={{
            transitionDelay: isIntersecting ? `${index * 100}ms` : '0ms',
          }}
        >
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </section>
  );
}

// =====================================================================
// Example 3: Using useStaggeredIntersectionObserver
// =====================================================================

export function AutoStaggeredCards() {
  const { ref, isIntersecting } = useStaggeredIntersectionObserver({
    threshold: 0.1,
    staggerDelay: 150, // 150ms delay between each child
  });

  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  return (
    <section ref={ref} className="space-y-4">
      {items.map((item) => (
        <div
          key={item}
          className={cn(
            'opacity-0 translate-x-8 transition-all duration-500',
            isIntersecting && 'opacity-100 translate-x-0'
          )}
        >
          {item}
        </div>
      ))}
    </section>
  );
}

// =====================================================================
// Example 4: Trigger Once (Performance Optimization)
// =====================================================================

export function TriggerOnceSection({ children }: { children: React.ReactNode }) {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true, // Only animate once
  });

  return (
    <section
      ref={ref}
      className={cn(
        'opacity-0 scale-95 transition-all duration-700',
        hasIntersected && 'opacity-100 scale-100'
      )}
    >
      {children}
    </section>
  );
}

// =====================================================================
// Example 5: Custom Root Margin (Trigger Earlier)
// =====================================================================

export function EarlyTriggerSection({ children }: { children: React.ReactNode }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px', // Trigger 100px before element enters viewport
  });

  return (
    <section
      ref={ref}
      className={cn(
        'opacity-0 blur-sm transition-all duration-1000',
        isIntersecting && 'opacity-100 blur-0'
      )}
    >
      {children}
    </section>
  );
}

// =====================================================================
// Example 6: Complex Animation with Multiple Properties
// =====================================================================

export function ComplexAnimationSection({ children }: { children: React.ReactNode }) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className={cn(
        'opacity-0 translate-y-12 scale-95 rotate-1 transition-all duration-1000',
        isIntersecting && 'opacity-100 translate-y-0 scale-100 rotate-0'
      )}
    >
      {children}
    </section>
  );
}
