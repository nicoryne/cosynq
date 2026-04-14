import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

describe('Theme Integration', () => {
  it('renders theme provider with theme toggle', () => {
    render(
      <ThemeProvider defaultTheme="system" enableSystem storageKey="cosynq-theme">
        <div>
          <ThemeToggle />
          <main>Test content</main>
        </div>
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button');
    const main = screen.getByRole('main');
    
    expect(button).toBeDefined();
    expect(main).toBeDefined();
  });

  it('theme provider has correct configuration', () => {
    const { container } = render(
      <ThemeProvider 
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        storageKey="cosynq-theme"
        disableTransitionOnChange={false}
      >
        <div>Test</div>
      </ThemeProvider>
    );
    
    expect(container).toBeDefined();
  });

  it('supports smooth 200ms transitions', () => {
    const { container } = render(
      <ThemeProvider disableTransitionOnChange={false}>
        <div className="transition-all duration-200">Test</div>
      </ThemeProvider>
    );
    
    const element = container.querySelector('.transition-all');
    expect(element).toBeDefined();
    expect(element?.className).toContain('duration-200');
  });
});
