import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { SecurityLogger } from '@/lib/utils/security-logger';

/**
 * Handle verification redirects from Supabase Auth
 * Supported types: signup, recovery, email_change, invite
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('token');
  redirectTo.searchParams.delete('type');

  if (token_hash && type) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Step 2: Handle success redirects based on verification type
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/reset-password', request.url));
      }

      // Default success redirect for signup and others
      return NextResponse.redirect(new URL('/verify-success', request.url));
    }

    // Log verification failure
    SecurityLogger.logEmailVerificationFailed('Link clicked', error.message, {
      type,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    });
  }

  // Fallback for missing or invalid tokens
  return NextResponse.redirect(new URL('/sign-in?error=invalid_token', request.url));
}
