import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AvailabilityService } from '@/lib/services/availability.service';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

describe('AvailabilityService', () => {
  let mockSupabase: SupabaseClient<Database>;
  let service: AvailabilityService;

  beforeEach(() => {
    // Create mock Supabase client
    mockSupabase = {
      from: vi.fn(),
      auth: {
        admin: {
          listUsers: vi.fn(),
        },
      },
    } as unknown as SupabaseClient<Database>;

    service = new AvailabilityService(mockSupabase);
  });

  describe('checkEmailAvailability', () => {
    it('should return available true when email does not exist', async () => {
      // Mock admin.listUsers to return empty users array
      vi.mocked(mockSupabase.auth.admin.listUsers).mockResolvedValue({
        data: { users: [], aud: 'authenticated' },
        error: null,
      });

      const result = await service.checkEmailAvailability('new@example.com');

      expect(result.available).toBe(true);
      expect(result.message).toBe('Email is available');
    });

    it('should return available false when email already exists', async () => {
      // Mock admin.listUsers to return user with matching email
      vi.mocked(mockSupabase.auth.admin.listUsers).mockResolvedValue({
        data: {
          users: [
            {
              id: '123',
              email: 'existing@example.com',
              created_at: '2024-01-01',
              app_metadata: {},
              user_metadata: {},
              aud: 'authenticated',
            },
          ],
          aud: 'authenticated',
        },
        error: null,
      });

      const result = await service.checkEmailAvailability('existing@example.com');

      expect(result.available).toBe(false);
      expect(result.message).toBe('This email is already registered');
    });

    it('should be case-insensitive when checking email', async () => {
      // Mock admin.listUsers to return user with lowercase email
      vi.mocked(mockSupabase.auth.admin.listUsers).mockResolvedValue({
        data: {
          users: [
            {
              id: '123',
              email: 'test@example.com',
              created_at: '2024-01-01',
              app_metadata: {},
              user_metadata: {},
              aud: 'authenticated',
            },
          ],
          aud: 'authenticated',
        },
        error: null,
      });

      const result = await service.checkEmailAvailability('TEST@EXAMPLE.COM');

      expect(result.available).toBe(false);
      expect(result.message).toBe('This email is already registered');
    });

    it('should throw error when database operation fails', async () => {
      // Mock admin.listUsers to return error
      vi.mocked(mockSupabase.auth.admin.listUsers).mockResolvedValue({
        data: { users: [], aud: 'authenticated' },
        error: { message: 'Database error', name: 'Error', status: 500 },
      });

      await expect(service.checkEmailAvailability('test@example.com')).rejects.toThrow(
        'Email availability check failed'
      );
    });
  });

  describe('checkUsernameAvailability', () => {
    it('should return available true when username does not exist', async () => {
      // Mock from().select().eq().maybeSingle() chain
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      const mockEq = vi.fn().mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await service.checkUsernameAvailability('newuser');

      expect(result.available).toBe(true);
      expect(result.message).toBe('Username is available');
      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
      expect(mockSelect).toHaveBeenCalledWith('username');
      expect(mockEq).toHaveBeenCalledWith('username', 'newuser');
    });

    it('should return available false when username already exists', async () => {
      // Mock from().select().eq().maybeSingle() chain
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: { username: 'existinguser' },
        error: null,
      });
      const mockEq = vi.fn().mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await service.checkUsernameAvailability('existinguser');

      expect(result.available).toBe(false);
      expect(result.message).toBe('This username is taken');
    });

    it('should throw error when database operation fails', async () => {
      // Mock from().select().eq().maybeSingle() chain with error
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error', code: 'PGRST000' },
      });
      const mockEq = vi.fn().mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      await expect(service.checkUsernameAvailability('testuser')).rejects.toThrow(
        'Username availability check failed'
      );
    });
  });
});
