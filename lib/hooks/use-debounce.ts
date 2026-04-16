import { useState, useEffect } from 'react';

/**
 * Hook: Throttles value manifestations to preserve telemetry economy
 * @param value - The signal to debounce
 * @param delay - Milliseconds to delay the manifestation
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
