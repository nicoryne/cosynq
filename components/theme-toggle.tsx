'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    let newTheme: string;
    let themeLabel: string;

    if (theme === 'light') {
      newTheme = 'dark';
      themeLabel = 'Dark mode';
    } else if (theme === 'dark') {
      newTheme = 'system';
      themeLabel = 'System theme';
    } else {
      newTheme = 'light';
      themeLabel = 'Light mode';
    }

    setTheme(newTheme);
    setAnnouncement(`${themeLabel} activated`);

    // Clear announcement after screen reader reads it
    setTimeout(() => setAnnouncement(''), 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cycleTheme();
    }
  };

  // Get current theme label for aria-label
  const getThemeLabel = () => {
    if (theme === 'light') return 'Light mode';
    if (theme === 'dark') return 'Dark mode';
    return 'System theme';
  };

  // Render placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className={`${className} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
          aria-label="Toggle theme"
          role="button"
          tabIndex={0}
        >
          <Sun className="transition-all duration-150 ease-in-out" />
        </Button>
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only"></div>
      </>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={cycleTheme}
        onKeyDown={handleKeyDown}
        className={`${className} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
        aria-label={`Toggle theme. Current theme: ${getThemeLabel()}`}
        role="button"
        tabIndex={0}
      >
        {theme === 'light' && (
          <Sun className="transition-all duration-150 ease-in-out" />
        )}
        {theme === 'dark' && (
          <Moon className="transition-all duration-150 ease-in-out" />
        )}
        {theme === 'system' && (
          <Star className="transition-all duration-150 ease-in-out" />
        )}
      </Button>
      {/* Screen reader announcement for theme changes */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </>
  );
}
