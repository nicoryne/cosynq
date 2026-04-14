'use client';

import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PasswordStrength } from '@/lib/types/auth.types';

// =====================================================================
// Password Checklist Component
// =====================================================================
// Real-time password strength validation with visual indicators
// Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 8.3, 8.4, 11.3

interface PasswordChecklistProps {
  password: string;
  className?: string;
}

/**
 * Calculates password strength in real-time (sub-100ms)
 * @param password - Password string to validate
 * @returns PasswordStrength object with validation results
 */
function calculatePasswordStrength(password: string): PasswordStrength {
  return {
    hasMinLength: password.length >= 6,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
    isValid:
      password.length >= 6 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password),
  };
}

export function PasswordChecklist({ password, className }: PasswordChecklistProps) {
  // Memoize strength calculation to ensure sub-100ms performance
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  const criteria = [
    { label: 'At least 6 characters', met: strength.hasMinLength },
    { label: 'One lowercase letter', met: strength.hasLowercase },
    { label: 'One uppercase letter', met: strength.hasUppercase },
    { label: 'One number', met: strength.hasNumber },
    { label: 'One special character', met: strength.hasSpecialChar },
  ];

  return (
    <div className={cn('space-y-2', className)} role="list" aria-label="Password requirements">
      <p className="text-sm font-medium text-muted-foreground">Password must contain:</p>
      <ul className="space-y-1.5">
        {criteria.map((criterion, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-sm"
            role="listitem"
            aria-label={`${criterion.label}: ${criterion.met ? 'satisfied' : 'not satisfied'}`}
          >
            {criterion.met ? (
              <Check
                className="size-4 shrink-0 text-green-600 dark:text-green-400"
                aria-hidden="true"
              />
            ) : (
              <X
                className="size-4 shrink-0 text-muted-foreground/50"
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                'transition-colors',
                criterion.met
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-muted-foreground'
              )}
            >
              {criterion.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
