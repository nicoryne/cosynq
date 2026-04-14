import { describe, it, expect } from 'vitest';
import { emailSchema, usernameSchema } from '@/lib/validations/auth.validation';

describe('Auth Actions - Validation', () => {

  describe('Email validation for availability checks', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
      ];

      validEmails.forEach((email) => {
        const result = emailSchema.safeParse(email);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@example.com',
        'user@',
        'user @example.com',
      ];

      invalidEmails.forEach((email) => {
        const result = emailSchema.safeParse(email);
        expect(result.success).toBe(false);
      });
    });

    it('should reject emails longer than 255 characters', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = emailSchema.safeParse(longEmail);
      expect(result.success).toBe(false);
    });
  });

  describe('Username validation for availability checks', () => {
    it('should accept valid usernames', () => {
      const validUsernames = [
        'user',
        'user123',
        'user_name',
        'user-name',
        'User_Name-123',
      ];

      validUsernames.forEach((username) => {
        const result = usernameSchema.safeParse(username);
        expect(result.success).toBe(true);
      });
    });

    it('should reject usernames that are too short', () => {
      const result = usernameSchema.safeParse('ab');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 3 characters');
      }
    });

    it('should reject usernames that are too long', () => {
      const longUsername = 'a'.repeat(31);
      const result = usernameSchema.safeParse(longUsername);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 30 characters');
      }
    });

    it('should reject usernames with invalid characters', () => {
      const invalidUsernames = [
        'user@name',
        'user name',
        'user!name',
        'user#name',
        'user$name',
      ];

      invalidUsernames.forEach((username) => {
        const result = usernameSchema.safeParse(username);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(
            'can only contain letters, numbers, underscores, and hyphens'
          );
        }
      });
    });
  });
});
