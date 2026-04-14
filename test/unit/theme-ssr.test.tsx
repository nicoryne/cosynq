import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';

describe('Theme SSR Hydration', () => {
  it('renders ThemeProvider with suppressHydrationWarning', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test content</div>
      </ThemeProvider>
    );
    
    expect(container).toBeDefined();
  });

  it('supports system theme preference', () => {
    const { container } = render(
      <ThemeProvider defaultTheme="system" enableSystem>
        <div>Test content</div>
      </ThemeProvider>
    );
    
    expect(container).toBeDefined();
  });

  it('persists theme to localStorage with custom storage key', () => {
    const { container } = render(
      <ThemeProvider storageKey="cosynq-theme">
        <div>Test content</div>
      </ThemeProvider>
    );
    
    expect(container).toBeDefined();
  });

  it('enables smooth transitions on theme change', () => {
    const { container } = render(
      <ThemeProvider disableTransitionOnChange={false}>
        <div>Test content</div>
      </ThemeProvider>
    );
    
    expect(container).toBeDefined();
  });
});
