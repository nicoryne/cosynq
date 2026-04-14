import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { EmailVerificationScreen } from '@/components/auth/email-verification-screen';

// =====================================================================
// Email Verification Page
// =====================================================================
// View layer for post-signup email verification instructions
// Requirements: 20.2, 20.28

export const metadata: Metadata = {
  title: 'Verify Your Email',
  description:
    'Check your inbox for the verification email to activate your cosynq account.',
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  const email = params.email;

  // Redirect to sign-up if no email provided
  if (!email) {
    redirect('/sign-up');
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <EmailVerificationScreen email={email} className="w-full" />
    </div>
  );
}
