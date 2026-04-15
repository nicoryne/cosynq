import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

/**
 * Smoke Tests for Auth resolution RPC
 */

describe('Auth Resolution RPC Smoke Tests', () => {
  let supabase: ReturnType<typeof createClient<Database>>;

  beforeAll(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_API_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables for smoke tests');
    }

    supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
  });

  describe('Function Removal', () => {
    it('should NOT have get_email_for_auth function', async () => {
      // Query pg_proc or use check_function_exists if available
      const { data, error } = await supabase.rpc('check_function_exists', {
        function_name: 'get_email_for_auth'
      });

      if (!error) {
        expect(data).toBe(false);
      } else {
        // If check_function_exists is missing, try calling it and expect failure
        const { error: funcError } = await supabase.rpc(
          'get_email_for_auth',
          { lookup_username: 'test' }
        );

        expect(funcError?.message).toMatch(/does not exist|permission denied/);
      }
    });
  });
});
