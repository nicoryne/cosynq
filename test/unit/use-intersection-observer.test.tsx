import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIntersectionObserver, useStaggeredIntersectionObserver } from '@/lib/hooks/use-intersection-observer';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    // Setup IntersectionObserver mock
    global.IntersectionObserver = MockIntersectionObserver as any;
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.hasIntersected).toBe(false);
  });

  it('accepts threshold option', () => {
    const { result } = renderHook(() => useIntersectionObserver({ threshold: 0.5 }));

    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
  });

  it('accepts rootMargin option', () => {
    const { result } = renderHook(() => useIntersectionObserver({ rootMargin: '100px' }));

    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
  });

  it('accepts triggerOnce option', () => {
    const { result } = renderHook(() => useIntersectionObserver({ triggerOnce: true }));

    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
  });

  it('returns ref object', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.ref).toHaveProperty('current');
  });
});

describe('useStaggeredIntersectionObserver', () => {
  beforeEach(() => {
    // Setup IntersectionObserver mock
    global.IntersectionObserver = MockIntersectionObserver as any;
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useStaggeredIntersectionObserver());

    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.hasIntersected).toBe(false);
  });

  it('accepts custom stagger delay option', () => {
    const { result } = renderHook(() =>
      useStaggeredIntersectionObserver({ staggerDelay: 200 })
    );

    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
  });

  it('returns ref object', () => {
    const { result } = renderHook(() => useStaggeredIntersectionObserver());

    expect(result.current.ref).toHaveProperty('current');
  });
});
