import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '@/lib/services/auth.service';
import { AvailabilityService } from '@/lib/services/availability.service';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { SignUpFormData } from '@/lib/types/auth.types';

// Mock the AvailabilityService
vi.mock('@/lib/services/availability.service');

describe('AuthService', () => {
  let mockSupabase: SupabaseClient<Database>;
  let service: AuthService;
  let mockAvailabilityService: AvailabilityService;

  const mockSignUpData: SignUpFormData = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'Test123!@#',
    confirmPassword: 'Test123!@#',
    displayName: 'Test User',
    bio: 'Test bio',
    avatarUrl: 'https://example.com/avatar.jpg',
    avatarPublicId: 'avatar123',
  };

  beforeEach(() => {
    // Create mock Supabase client
    mockSupabase = {
      from: vi.fn(),
      auth: {
        signUp: vi.fn(),
        admin: {
          deleteUser: vi.fn(),
        },
      },
    } as unknown as SupabaseClient<Database>;

    service = new AuthService(mockSupabase);

    // Mock AvailabilityService methods
    mockAvailabilityService = new AvailabilityService(mockSupabase);
    vi.spyOn(mockAvailabilityService, 'checkEmailAvailability');
    vi.spyOn(mockAvailabilityService, 'checkUsernameAvailability');
    
    // Replace the service's availability service with our mock
    (service as any).availabilityService = mockAvailabilityService;
  });

  describe('signUp', () => {
    it('should successfully create a user account with complete profile data', async () => {
      // Mock availability checks
      vi.mocked(mockAvailabilityService.checkEmailAvailability).mockResolvedValue({
        available: true,
        message: 'Email is available',
      });
      vi.mocked(mockAvailabilityService.checkUsernameAvailability).mockResolvedValue({
        available: true,
        message: 'Username is available',
      });

      // Mock Supabase auth.signUp
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        email_confirmed_at: null,
      };
      vi.mocked(mockSupabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      // Mock profile update
      const mockUpdate = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      const mockEq = vi.fn().mockReturnValue({
        update: mockUpdate,
      });
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      });
      vi.mocked(mockSupabase.from).mockImplementation(mockFrom as any);

      // Mock profile fetch
      const mockProfile = {
        id: 'user-123',
        username: 'testuser',
        display_name: 'Test User',
        bio: 'Test bio',
        avatar_url: 'https://example.com/avatar.jpg',
        avatar_public_id: 'avatar123',
        location: null,
        website: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });
      const mockSelectEq = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: mockSelectEq,
      });
      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
        select: mockSelect,
      } as any);

      const result = await service.signUp(mockSignUpData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Account created successfully. Please verify your email.');
      expect(result.requiresVerification).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.email).toBe('test@example.com');
      expect(result.data?.profile.username).toBe('testuser');
      expect(result.data?.profile.displayName).toBe('Test User');
    });

    it('should return error when email is already taken', async () => {
      // Mock email availability check to return unavailable
      vi.mocked(mockAvailabilityService.checkEmailAvailability).mockResolvedValue({
        available: false,
        message: 'This email is already registered',
      });

      const result = await service.signUp(mockSignUpData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('An account with this email already exists');
      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should return error when username is already taken', async () => {
      // Mock email available but username unavailable
      vi.mocked(mockAvailabilityService.checkEmailAvailability).mockResolvedValue({
        available: true,
        message: 'Email is available',
      });
      vi.mocked(mockAvailabilityService.checkUsernameAvailability).mockResolvedValue({
        available: false,
        message: 'This username is taken',
      });

      const result = await service.signUp(mockSignUpData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('This username is already taken');
      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should handle Supabase auth.signUp errors', async () => {
      // Mock availability checks
      vi.mocked(mockAvailabilityService.checkEmailAvailability).mockResolvedValue({
        available: true,
        message: 'Email is available',
      });
      vi.mocked(mockAvailabilityService.checkUsernameAvailability).mockResolvedValue({
        available: true,
        message: 'Username is available',
      });

      // Mock Supabase auth.signUp error
      vi.mocked(mockSupabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Auth service error', name: 'AuthError', status: 500 },
      });

      const result = await service.signUp(mockSignUpData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Authentication service is temporarily unavailable');
    });

    it('should handle profile update errors and clean up auth user', async () => {
      // Mock availability checks
      vi.mocked(mockAvailabilityService.checkEmailAvailability).mockResolvedValue({
        available: true,
        message: 'Email is available',
      });
      vi.mocked(mockAvailabilityService.checkUsernameAvailability).mockResolvedValue({
        available: true,
        message: 'Username is available',
      });

      // Mock Supabase auth.signUp
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        email_confirmed_at: null,
      };
      vi.mocked(mockSupabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      // Mock profile update error
      const mockEq = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Profile update failed', code: 'PGRST000' },
      });
      const mockUpdate = vi.fn().mockReturnValue({
        eq: mockEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        update: mockUpdate,
      } as any);

      // Mock admin.deleteUser for cleanup
      vi.mocked(mockSupabase.auth.admin.deleteUser).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await service.signUp(mockSignUpData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('An error occurred during account creation');
      expect(mockSupabase.auth.admin.deleteUser).toHaveBeenCalledWith('user-123');
    });

    it('should successfully create account with minimal data (no optional fields)', async () => {
      const minimalData: SignUpFormData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test123!@#',
        confirmPassword: 'Test123!@#',
      };

      // Mock availability checks
      vi.mocked(mockAvailabilityService.checkEmailAvailability).mockResolvedValue({
        available: true,
        message: 'Email is available',
      });
      vi.mocked(mockAvailabilityService.checkUsernameAvailability).mockResolvedValue({
        available: true,
        message: 'Username is available',
      });

      // Mock Supabase auth.signUp
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        email_confirmed_at: null,
      };
      vi.mocked(mockSupabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      // Mock profile update and fetch
      const mockProfile = {
        id: 'user-123',
        username: 'testuser',
        display_name: null,
        bio: null,
        avatar_url: null,
        avatar_public_id: null,
        location: null,
        website: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });
      const mockSelectEq = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: mockSelectEq,
      });
      const mockUpdateEq = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      const mockUpdate = vi.fn().mockReturnValue({
        eq: mockUpdateEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        update: mockUpdate,
        select: mockSelect,
      } as any);

      const result = await service.signUp(minimalData);

      expect(result.success).toBe(true);
      expect(result.data?.profile.displayName).toBeNull();
      expect(result.data?.profile.bio).toBeNull();
      expect(result.data?.profile.avatarUrl).toBeNull();
    });

    it('should handle network errors gracefully', async () => {
      // Mock availability checks
      vi.mocked(mockAvailabilityService.checkEmailAvailability).mockRejectedValue(
        new Error('network error occurred')
      );

      const result = await service.signUp(mockSignUpData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unable to connect');
    });
  });

  describe('signIn', () => {
    it('should successfully sign in with email', async () => {
      const email = 'test@example.com';
      const password = 'Test123!@#';

      // Mock Supabase auth.signInWithPassword
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        email_confirmed_at: '2024-01-01T00:00:00Z',
      };
      vi.mocked(mockSupabase.auth).signInWithPassword = vi.fn().mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token123' } },
        error: null,
      });

      // Mock profile fetch
      const mockProfile = {
        id: 'user-123',
        username: 'testuser',
        display_name: 'Test User',
        bio: 'Test bio',
        avatar_url: 'https://example.com/avatar.jpg',
        avatar_public_id: 'avatar123',
        location: null,
        website: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });
      const mockSelectEq = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: mockSelectEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await service.signIn(email, password);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Sign-in successful');
      expect(result.data).toBeDefined();
      expect(result.data?.email).toBe('test@example.com');
      expect(result.data?.emailConfirmed).toBe(true);
      expect(result.data?.profile.username).toBe('testuser');
    });

    it('should successfully sign in with username', async () => {
      const username = 'testuser';
      const password = 'Test123!@#';

      // Mock user_profiles query to resolve username to user ID
      const mockProfileSingle = vi.fn().mockResolvedValue({
        data: { id: 'user-123' },
        error: null,
      });
      const mockProfileEq = vi.fn().mockReturnValue({
        single: mockProfileSingle,
      });
      const mockProfileSelect = vi.fn().mockReturnValue({
        eq: mockProfileEq,
      });

      // Mock auth.admin.getUserById to get email
      vi.mocked(mockSupabase.auth).admin = {
        getUserById: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-123', email: 'test@example.com' } },
          error: null,
        }),
      } as any;

      // Mock Supabase auth.signInWithPassword
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        email_confirmed_at: '2024-01-01T00:00:00Z',
      };
      vi.mocked(mockSupabase.auth).signInWithPassword = vi.fn().mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token123' } },
        error: null,
      });

      // Mock profile fetch
      const mockProfile = {
        id: 'user-123',
        username: 'testuser',
        display_name: 'Test User',
        bio: 'Test bio',
        avatar_url: 'https://example.com/avatar.jpg',
        avatar_public_id: 'avatar123',
        location: null,
        website: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });
      const mockSelectEq = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: mockSelectEq,
      });

      vi.mocked(mockSupabase.from).mockImplementation((table: string) => {
        if (table === 'user_profiles') {
          // First call: resolve username to ID
          if (mockProfileSelect.mock.calls.length === 0) {
            return { select: mockProfileSelect } as any;
          }
          // Second call: fetch full profile
          return { select: mockSelect } as any;
        }
        return { select: mockSelect } as any;
      });

      const result = await service.signIn(username, password);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Sign-in successful');
      expect(result.data?.profile.username).toBe('testuser');
    });

    it('should return error when email is not verified', async () => {
      const email = 'test@example.com';
      const password = 'Test123!@#';

      // Mock Supabase auth.signInWithPassword with unverified email
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        email_confirmed_at: null, // Email not verified
      };
      vi.mocked(mockSupabase.auth).signInWithPassword = vi.fn().mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token123' } },
        error: null,
      });

      // Mock signOut
      vi.mocked(mockSupabase.auth).signOut = vi.fn().mockResolvedValue({
        error: null,
      });

      const result = await service.signIn(email, password);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Please verify your email address before signing in');
      expect(result.requiresVerification).toBe(true);
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    it('should return error when credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'WrongPassword';

      // Mock Supabase auth.signInWithPassword error
      vi.mocked(mockSupabase.auth).signInWithPassword = vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials', name: 'AuthError', status: 400 },
      });

      const result = await service.signIn(email, password);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid email/username or password');
    });

    it('should return error when username does not exist', async () => {
      const username = 'nonexistentuser';
      const password = 'Test123!@#';

      // Mock user_profiles query returning no results
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'No rows returned', code: 'PGRST116' },
      });
      const mockEq = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await service.signIn(username, password);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid email/username or password');
    });

    it('should handle Supabase auth error for unverified email', async () => {
      const email = 'test@example.com';
      const password = 'Test123!@#';

      // Mock Supabase auth.signInWithPassword error for unverified email
      vi.mocked(mockSupabase.auth).signInWithPassword = vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email not confirmed', name: 'AuthError', status: 400 },
      });

      const result = await service.signIn(email, password);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Please verify your email address before signing in');
      expect(result.requiresVerification).toBe(true);
    });

    it('should handle network errors gracefully', async () => {
      const email = 'test@example.com';
      const password = 'Test123!@#';

      // Mock network error
      vi.mocked(mockSupabase.auth).signInWithPassword = vi.fn().mockRejectedValue(
        new Error('network error occurred')
      );

      const result = await service.signIn(email, password);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unable to connect');
    });

    it('should handle service unavailable errors', async () => {
      const email = 'test@example.com';
      const password = 'Test123!@#';

      // Mock service error
      vi.mocked(mockSupabase.auth).signInWithPassword = vi.fn().mockRejectedValue(
        new Error('service unavailable')
      );

      const result = await service.signIn(email, password);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Authentication service is temporarily unavailable');
    });

    it('should return minimal data when profile fetch fails', async () => {
      const email = 'test@example.com';
      const password = 'Test123!@#';

      // Mock Supabase auth.signInWithPassword
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        email_confirmed_at: '2024-01-01T00:00:00Z',
      };
      vi.mocked(mockSupabase.auth).signInWithPassword = vi.fn().mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token123' } },
        error: null,
      });

      // Mock profile fetch error
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Profile fetch failed', code: 'PGRST000' },
      });
      const mockSelectEq = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: mockSelectEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await service.signIn(email, password);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Sign-in successful');
      expect(result.data?.profile.username).toBe('unknown');
    });
  });

  describe('signOut', () => {
    it('should successfully sign out user', async () => {
      vi.mocked(mockSupabase.auth).signOut = vi.fn().mockResolvedValue({
        error: null,
      });

      const result = await service.signOut();

      expect(result).toBe(true);
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    it('should return false when sign out fails', async () => {
      vi.mocked(mockSupabase.auth).signOut = vi.fn().mockResolvedValue({
        error: { message: 'Sign out failed', name: 'AuthError', status: 500 },
      });

      const result = await service.signOut();

      expect(result).toBe(false);
    });

    it('should handle unexpected errors gracefully', async () => {
      vi.mocked(mockSupabase.auth).signOut = vi.fn().mockRejectedValue(
        new Error('Unexpected error')
      );

      const result = await service.signOut();

      expect(result).toBe(false);
    });
  });

  describe('resendVerificationEmail', () => {
    it('should successfully resend verification email', async () => {
      const email = 'test@example.com';

      vi.mocked(mockSupabase.auth).resend = vi.fn().mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await service.resendVerificationEmail(email);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Verification email sent successfully');
      expect(mockSupabase.auth.resend).toHaveBeenCalledWith({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });
    });

    it('should handle rate limit errors', async () => {
      const email = 'test@example.com';

      vi.mocked(mockSupabase.auth).resend = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'rate limit exceeded', name: 'AuthError', status: 429 },
      });

      const result = await service.resendVerificationEmail(email);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Please wait before requesting another verification email');
    });

    it('should handle user not found errors', async () => {
      const email = 'nonexistent@example.com';

      vi.mocked(mockSupabase.auth).resend = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'user not found', name: 'AuthError', status: 404 },
      });

      const result = await service.resendVerificationEmail(email);

      expect(result.success).toBe(false);
      expect(result.message).toBe('No account found with this email address');
    });

    it('should handle generic errors', async () => {
      const email = 'test@example.com';

      vi.mocked(mockSupabase.auth).resend = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Generic error', name: 'AuthError', status: 500 },
      });

      const result = await service.resendVerificationEmail(email);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to send verification email. Please try again later');
    });

    it('should handle unexpected errors', async () => {
      const email = 'test@example.com';

      vi.mocked(mockSupabase.auth).resend = vi.fn().mockRejectedValue(
        new Error('Unexpected error')
      );

      const result = await service.resendVerificationEmail(email);

      expect(result.success).toBe(false);
      expect(result.message).toBe('An unexpected error occurred. Please try again');
    });
  });

  describe('getCurrentUser', () => {
    it('should successfully get current authenticated user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        email_confirmed_at: '2024-01-01T00:00:00Z',
      };

      vi.mocked(mockSupabase.auth).getUser = vi.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockProfile = {
        id: 'user-123',
        username: 'testuser',
        display_name: 'Test User',
        bio: 'Test bio',
        avatar_url: 'https://example.com/avatar.jpg',
        avatar_public_id: 'avatar123',
        location: 'Test City',
        website: 'https://example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });
      const mockSelectEq = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: mockSelectEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await service.getCurrentUser();

      expect(result).not.toBeNull();
      expect(result?.id).toBe('user-123');
      expect(result?.email).toBe('test@example.com');
      expect(result?.emailConfirmed).toBe(true);
      expect(result?.profile.username).toBe('testuser');
      expect(result?.profile.displayName).toBe('Test User');
    });

    it('should return null when no user is authenticated', async () => {
      vi.mocked(mockSupabase.auth).getUser = vi.fn().mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated', name: 'AuthError', status: 401 },
      });

      const result = await service.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return minimal data when profile fetch fails', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        email_confirmed_at: '2024-01-01T00:00:00Z',
      };

      vi.mocked(mockSupabase.auth).getUser = vi.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Profile not found', code: 'PGRST116' },
      });
      const mockSelectEq = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockSelect = vi.fn().mockReturnValue({
        eq: mockSelectEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await service.getCurrentUser();

      expect(result).not.toBeNull();
      expect(result?.id).toBe('user-123');
      expect(result?.profile.username).toBe('unknown');
    });

    it('should handle unexpected errors', async () => {
      vi.mocked(mockSupabase.auth).getUser = vi.fn().mockRejectedValue(
        new Error('Unexpected error')
      );

      const result = await service.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should successfully update user profile', async () => {
      const userId = 'user-123';
      const updateData = {
        displayName: 'Updated Name',
        bio: 'Updated bio',
        location: 'New City',
      };

      const mockUpdatedProfile = {
        id: 'user-123',
        username: 'testuser',
        display_name: 'Updated Name',
        bio: 'Updated bio',
        avatar_url: 'https://example.com/avatar.jpg',
        avatar_public_id: 'avatar123',
        location: 'New City',
        website: 'https://example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockUpdatedProfile,
        error: null,
      });
      const mockSelect = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockEq = vi.fn().mockReturnValue({
        select: mockSelect,
      });
      const mockUpdate = vi.fn().mockReturnValue({
        eq: mockEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        update: mockUpdate,
      } as any);

      const result = await service.updateProfile(userId, updateData);

      expect(result.id).toBe('user-123');
      expect(result.displayName).toBe('Updated Name');
      expect(result.bio).toBe('Updated bio');
      expect(result.location).toBe('New City');
      expect(mockUpdate).toHaveBeenCalledWith({
        display_name: 'Updated Name',
        bio: 'Updated bio',
        location: 'New City',
      });
    });

    it('should handle duplicate username errors', async () => {
      const userId = 'user-123';
      const updateData = {
        username: 'existinguser',
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'duplicate key value violates unique constraint', code: '23505' },
      });
      const mockSelect = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockEq = vi.fn().mockReturnValue({
        select: mockSelect,
      });
      const mockUpdate = vi.fn().mockReturnValue({
        eq: mockEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        update: mockUpdate,
      } as any);

      await expect(service.updateProfile(userId, updateData)).rejects.toThrow(
        'This username is already taken'
      );
    });

    it('should handle RLS policy violations', async () => {
      const userId = 'user-123';
      const updateData = {
        displayName: 'Updated Name',
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'violates row-level security policy', code: '42501' },
      });
      const mockSelect = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockEq = vi.fn().mockReturnValue({
        select: mockSelect,
      });
      const mockUpdate = vi.fn().mockReturnValue({
        eq: mockEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        update: mockUpdate,
      } as any);

      await expect(service.updateProfile(userId, updateData)).rejects.toThrow(
        'You do not have permission to update this profile'
      );
    });

    it('should handle generic update errors', async () => {
      const userId = 'user-123';
      const updateData = {
        displayName: 'Updated Name',
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Generic error', code: 'PGRST000' },
      });
      const mockSelect = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockEq = vi.fn().mockReturnValue({
        select: mockSelect,
      });
      const mockUpdate = vi.fn().mockReturnValue({
        eq: mockEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        update: mockUpdate,
      } as any);

      await expect(service.updateProfile(userId, updateData)).rejects.toThrow(
        'Failed to update profile. Please try again'
      );
    });

    it('should handle unexpected errors', async () => {
      const userId = 'user-123';
      const updateData = {
        displayName: 'Updated Name',
      };

      const mockUpdate = vi.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        update: mockUpdate,
      } as any);

      await expect(service.updateProfile(userId, updateData)).rejects.toThrow(
        'An unexpected error occurred while updating profile'
      );
    });

    it('should only update provided fields', async () => {
      const userId = 'user-123';
      const updateData = {
        bio: 'New bio only',
      };

      const mockUpdatedProfile = {
        id: 'user-123',
        username: 'testuser',
        display_name: 'Test User',
        bio: 'New bio only',
        avatar_url: 'https://example.com/avatar.jpg',
        avatar_public_id: 'avatar123',
        location: 'Test City',
        website: 'https://example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockUpdatedProfile,
        error: null,
      });
      const mockSelect = vi.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockEq = vi.fn().mockReturnValue({
        select: mockSelect,
      });
      const mockUpdate = vi.fn().mockReturnValue({
        eq: mockEq,
      });
      vi.mocked(mockSupabase.from).mockReturnValue({
        update: mockUpdate,
      } as any);

      await service.updateProfile(userId, updateData);

      expect(mockUpdate).toHaveBeenCalledWith({
        bio: 'New bio only',
      });
    });
  });
});
