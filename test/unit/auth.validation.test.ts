import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  usernameSchema,
  passwordSchema,
  displayNameSchema,
  bioSchema,
  signUpSchema,
  signInSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from '../../lib/validations/auth.validation';

describe('Authentication Validation Schemas', () => {
  describe('emailSchema', () => {
    it('should validate correct email', () => {
      expect(emailSchema.parse('test@example.com')).toBe('test@example.com');
    });

    it('should reject empty email', () => {
      expect(() => emailSchema.parse('')).toThrow('Email is required');
    });

    it('should reject invalid email format', () => {
      expect(() => emailSchema.parse('invalid-email')).toThrow('Invalid email format');
    });
  });

  describe('usernameSchema', () => {
    it('should validate correct username', () => {
      expect(usernameSchema.parse('user_name-123')).toBe('user_name-123');
    });

    it('should reject username too short', () => {
      expect(() => usernameSchema.parse('ab')).toThrow('Username must be at least 3 characters');
    });

    it('should reject username with invalid characters', () => {
      expect(() => usernameSchema.parse('user@name')).toThrow('Username can only contain letters, numbers, underscores, and hyphens');
    });
  });

  describe('passwordSchema', () => {
    it('should validate strong password', () => {
      expect(passwordSchema.parse('Test123!')).toBe('Test123!');
    });

    it('should reject password without uppercase', () => {
      expect(() => passwordSchema.parse('test123!')).toThrow('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase', () => {
      expect(() => passwordSchema.parse('TEST123!')).toThrow('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      expect(() => passwordSchema.parse('TestAbc!')).toThrow('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      expect(() => passwordSchema.parse('Test1234')).toThrow('Password must contain at least one special character');
    });
  });

  describe('signUpSchema', () => {
    it('should validate complete sign-up data', () => {
      const data = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test123!',
        confirmPassword: 'Test123!',
        displayName: 'Test User',
        bio: 'This is my bio',
      };
      expect(signUpSchema.parse(data)).toEqual(data);
    });

    it('should reject mismatched passwords', () => {
      const data = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test123!',
        confirmPassword: 'Different123!',
      };
      expect(() => signUpSchema.parse(data)).toThrow('Passwords do not match');
    });
  });

  describe('step3Schema', () => {
    it('should validate matching passwords', () => {
      const data = {
        password: 'Test123!',
        confirmPassword: 'Test123!',
      };
      expect(step3Schema.parse(data)).toEqual(data);
    });

    it('should reject mismatched passwords', () => {
      const data = {
        password: 'Test123!',
        confirmPassword: 'Different123!',
      };
      expect(() => step3Schema.parse(data)).toThrow('Passwords do not match');
    });
  });
});
