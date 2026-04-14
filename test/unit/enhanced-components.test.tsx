import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

describe('Enhanced Components', () => {
  describe('Button Component', () => {
    it('renders celestial variant with correct classes', () => {
      render(<Button variant="celestial">Test Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button.className).toContain('border-2');
      expect(button.className).toContain('border-primary');
      expect(button.className).toContain('bg-primary/10');
      expect(button.className).toContain('shadow-glow-primary');
    });

    it('has hover scale micro-interaction', () => {
      render(<Button>Test Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button.className).toContain('hover:scale-105');
    });

    it('has active scale micro-interaction', () => {
      render(<Button>Test Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button.className).toContain('active:scale-[0.98]');
    });

    it('renders with correct size variants', () => {
      const { rerender } = render(<Button size="default">Default</Button>);
      let button = screen.getByRole('button');
      expect(button.className).toContain('h-12');

      rerender(<Button size="sm">Small</Button>);
      button = screen.getByRole('button');
      expect(button.className).toContain('h-10');

      rerender(<Button size="lg">Large</Button>);
      button = screen.getByRole('button');
      expect(button.className).toContain('h-14');

      rerender(<Button size="xl">Extra Large</Button>);
      button = screen.getByRole('button');
      expect(button.className).toContain('h-16');
    });

    it('has focus-visible ring for accessibility', () => {
      render(<Button>Test Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button.className).toContain('focus-visible:ring-3');
      expect(button.className).toContain('focus-visible:ring-ring/50');
    });
  });

  describe('Card Component', () => {
    it('renders with glassmorphism styling', () => {
      render(
        <Card>
          <CardContent>Test Content</CardContent>
        </Card>
      );
      
      const card = screen.getByText('Test Content').parentElement;
      expect(card?.className).toContain('glassmorphism');
    });

    it('has rounded-[3rem] border radius', () => {
      render(<Card>Test</Card>);
      const card = screen.getByText('Test');
      
      expect(card.className).toContain('rounded-[3rem]');
    });

    it('has hover effects', () => {
      render(<Card>Test</Card>);
      const card = screen.getByText('Test');
      
      expect(card.className).toContain('hover:border-primary/20');
      expect(card.className).toContain('hover:shadow-glow-primary');
    });

    it('has 500ms transition duration', () => {
      render(<Card>Test</Card>);
      const card = screen.getByText('Test');
      
      expect(card.className).toContain('duration-500');
    });

    it('supports size variants', () => {
      const { rerender } = render(<Card size="default">Default</Card>);
      let card = screen.getByText('Default');
      expect(card.className).toContain('p-10');
      expect(card.className).toContain('gap-8');

      rerender(<Card size="sm">Small</Card>);
      card = screen.getByText('Small');
      expect(card.className).toContain('data-[size=sm]:p-6');
      expect(card.className).toContain('data-[size=sm]:gap-6');
    });
  });

  describe('Input Component', () => {
    it('has h-14 height', () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      
      expect(input.className).toContain('h-14');
    });

    it('has rounded-2xl border radius', () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      
      expect(input.className).toContain('rounded-2xl');
    });

    it('has glassmorphism background', () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      
      expect(input.className).toContain('bg-background/50');
      expect(input.className).toContain('backdrop-blur-md');
    });

    it('has focus glow effects', () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      
      expect(input.className).toContain('focus-visible:border-primary/50');
      expect(input.className).toContain('focus-visible:ring-4');
      expect(input.className).toContain('focus-visible:ring-primary/10');
    });

    it('has error state styling', () => {
      render(<Input placeholder="Test" aria-invalid="true" />);
      const input = screen.getByPlaceholderText('Test');
      
      expect(input.className).toContain('aria-invalid:border-destructive');
      expect(input.className).toContain('aria-invalid:ring-4');
      expect(input.className).toContain('aria-invalid:ring-destructive/20');
    });
  });

  describe('Badge Component', () => {
    it('renders with default styling', () => {
      render(<Badge>Test Badge</Badge>);
      const badge = screen.getByText('Test Badge');
      
      expect(badge).toBeDefined();
    });

    it('celestial variant has uppercase tracking-widest', () => {
      render(<Badge variant="celestial">Test</Badge>);
      const badge = screen.getByText('Test');
      
      expect(badge.className).toContain('uppercase');
      expect(badge.className).toContain('tracking-widest');
    });
  });

  describe('Progress Component', () => {
    it('renders with gradient fill', () => {
      const { container } = render(<Progress value={50} />);
      const indicator = container.querySelector('[data-slot="progress-indicator"]');
      
      expect(indicator?.className).toContain('bg-gradient-to-r');
      expect(indicator?.className).toContain('from-primary');
      expect(indicator?.className).toContain('via-secondary');
      expect(indicator?.className).toContain('to-primary');
    });

    it('has glow effect', () => {
      const { container } = render(<Progress value={50} />);
      const indicator = container.querySelector('[data-slot="progress-indicator"]');
      
      expect(indicator?.className).toContain('shadow-glow-primary');
    });

    it('has 500ms transition duration', () => {
      const { container } = render(<Progress value={50} />);
      const indicator = container.querySelector('[data-slot="progress-indicator"]');
      
      expect(indicator?.className).toContain('duration-500');
    });
  });

  describe('Avatar Component', () => {
    it('has border-2 and glow effects', () => {
      render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );
      
      const avatar = screen.getByText('AB').parentElement;
      expect(avatar?.className).toContain('border-2');
      expect(avatar?.className).toContain('border-primary/20');
      expect(avatar?.className).toContain('shadow-glow-primary');
    });

    it('supports size variants', () => {
      const { rerender, container } = render(
        <Avatar size="default">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );
      
      let avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar?.className).toContain('size-12');

      rerender(
        <Avatar size="sm">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );
      avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar?.className).toContain('data-[size=sm]:size-8');

      rerender(
        <Avatar size="lg">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );
      avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar?.className).toContain('data-[size=lg]:size-20');
    });
  });
});
