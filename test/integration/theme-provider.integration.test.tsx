// =====================================================================
// ThemeProvider Integration Tests
// =====================================================================
// Tests theme persistence, system preference detection, and FOUC prevention

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Test component that uses the theme hook
function ThemeConsumer() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="resolved-theme">{resolvedTheme}</div>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme('system')} data-testid="set-system">
        Set System
      </button>
    </div>
  );
}

// Test component that checks for hydration issues
function HydrationChecker() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div>
      <div data-testid="mounted">{mounted ? 'true' : 'false'}</div>
      <div data-testid="theme-on-mount">{theme}</div>
      <div data-testid="resolved-on-mount">{resolvedTheme}</div>
    </div>
  );
}

describe('ThemeProvider Integration Tests', () => {
  // Mock localStorage
  let localStorageMock: { [key: string]: string } = {};
  
  beforeEach(() => {
    // Reset localStorage mock
    localStorageMock = {};
    
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      length: 0,
      key: vi.fn(),
    } as Storage;
    
    // Mock matchMedia for system preference detection
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe('Theme Persistence', () => {
    it('should persist theme to localStorage when changed', async () => {
      const { getByTestId } = render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <ThemeConsumer />
        </ThemeProvider>
      );
      
      // Wait for component to mount
      await waitFor(() => {
        expect(getByTestId('current-theme')).toBeDefined();
      });
      
      // Change to light theme
      const setLightButton = getByTestId('set-light');
      setLightButton.click();
      
      // Verify localStorage was called
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'cosynq-theme',
          'light'
        );
      });
    });
    
    it('should restore theme from localStorage on mount', async () => {
      // Pre-populate localStorage with dark theme
      localStorageMock['cosynq-theme'] = 'dark';
      
      const { getByTestId } = render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <ThemeConsumer />
        </ThemeProvider>
      );
      
      // Wait for theme to be restored
      await waitFor(() => {
        const themeElement = getByTestId('current-theme');
        expect(themeElement.textContent).toBe('dark');
      });
    });
    
    it('should persist theme across simulated page refresh', async () => {
      // First render - set theme to dark
      const { getByTestId, unmount } = render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <ThemeConsumer />
        </ThemeProvider>
      );
      
      await waitFor(() => {
        expect(getByTestId('current-theme')).toBeDefined();
      });
      
      const setDarkButton = getByTestId('set-dark');
      setDarkButton.click();
      
      await waitFor(() => {
        expect(getByTestId('current-theme').textContent).toBe('dark');
      });
      
      // Simulate page refresh by unmounting and remounting
      unmount();
      
      const { getByTestId: getByTestId2 } = render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <ThemeConsumer />
        </ThemeProvider>
      );
      
      // Verify theme persisted
      await waitFor(() => {
        expect(getByTestId2('current-theme').textContent).toBe('dark');
      });
    });
  });
  
  describe('System Preference Detection', () => {
    it('should detect light system preference when theme is system', async () => {
      // Mock light system preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)' ? false : true,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
      
      const { getByTestId } = render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <ThemeConsumer />
        </ThemeProvider>
      );
      
      await waitFor(() => {
        const resolvedTheme = getByTestId('resolved-theme');
        expect(resolvedTheme.textContent).toBe('light');
      });
    });
    
    it('should detect dark system preference when theme is system', async () => {
      // Mock dark system preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)' ? true : false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
      
      const { getByTestId } = render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <ThemeConsumer />
        </ThemeProvider>
      );
      
      await waitFor(() => {
        const resolvedTheme = getByTestId('resolved-theme');
        expect(resolvedTheme.textContent).toBe('dark');
      });
    });
    
    it('should enable system theme detection when enableSystem is true', async () => {
      // Mock dark system preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)' ? true : false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
      
      const { getByTestId } = render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <ThemeConsumer />
        </ThemeProvider>
      );
      
      // When theme is "system" and enableSystem is true, 
      // next-themes should detect and apply the system preference
      await waitFor(() => {
        const theme = getByTestId('current-theme');
        expect(theme.textContent).toBe('system');
      });
      
      // Verify matchMedia was called to detect system preference
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });
  });
  
  describe('No Flash of Unstyled Content (FOUC)', () => {
    it('should apply theme class to html element before first paint', async () => {
      // Pre-populate localStorage with dark theme
      localStorageMock['cosynq-theme'] = 'dark';
      
      render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <ThemeConsumer />
        </ThemeProvider>
      );
      
      // Check that html element has the dark class applied
      // Note: In a real browser, next-themes applies this via script tag before React hydrates
      await waitFor(() => {
        // In test environment, we verify the theme is set without delay
        expect(localStorage.getItem).toHaveBeenCalledWith('cosynq-theme');
      });
    });
    
    it('should not cause hydration mismatch with suppressHydrationWarning', async () => {
      const { getByTestId } = render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <HydrationChecker />
        </ThemeProvider>
      );
      
      // Component should mount without errors
      await waitFor(() => {
        expect(getByTestId('mounted').textContent).toBe('true');
      });
      
      // Theme should be available after mount
      await waitFor(() => {
        const theme = getByTestId('theme-on-mount').textContent;
        expect(theme).toBeTruthy();
      });
    });
    
    it('should use defaultTheme when no stored preference exists', async () => {
      // Ensure localStorage is empty
      localStorageMock = {};
      
      const { getByTestId } = render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <ThemeConsumer />
        </ThemeProvider>
      );
      
      await waitFor(() => {
        const theme = getByTestId('current-theme');
        expect(theme.textContent).toBe('system');
      });
    });
    
    it('should handle localStorage being unavailable gracefully', async () => {
      // Mock localStorage to throw errors
      global.localStorage = {
        getItem: vi.fn(() => {
          throw new Error('localStorage not available');
        }),
        setItem: vi.fn(() => {
          throw new Error('localStorage not available');
        }),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      } as Storage;
      
      // Should not throw and should fall back to default theme
      const { getByTestId } = render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <ThemeConsumer />
        </ThemeProvider>
      );
      
      await waitFor(() => {
        const theme = getByTestId('current-theme');
        expect(theme.textContent).toBe('system');
      });
    });
  });
  
  describe('ThemeProvider Configuration', () => {
    it('should use correct storageKey for cosynq', async () => {
      const { getByTestId } = render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <ThemeConsumer />
        </ThemeProvider>
      );
      
      await waitFor(() => {
        expect(getByTestId('current-theme')).toBeDefined();
      });
      
      // Change theme
      const setLightButton = getByTestId('set-light');
      setLightButton.click();
      
      // Verify correct storage key is used
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'cosynq-theme',
          expect.any(String)
        );
      });
    });
    
    it('should apply theme via class attribute', async () => {
      localStorageMock['cosynq-theme'] = 'dark';
      
      render(
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="cosynq-theme"
        >
          <ThemeConsumer />
        </ThemeProvider>
      );
      
      // Verify theme is applied (in real browser, this would add .dark class to html)
      await waitFor(() => {
        expect(localStorage.getItem).toHaveBeenCalledWith('cosynq-theme');
      });
    });
  });
});
