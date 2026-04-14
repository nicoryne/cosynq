# Email Verification Setup Guide

This document provides instructions for configuring Supabase Auth email verification for the cosynq platform.

## Local Development Configuration

The local Supabase configuration has been updated to require email verification:

### Configuration Changes (`supabase/config.toml`)

```toml
[auth.email]
enable_confirmations = true  # Users must verify email before signing in
otp_expiry = 3600           # Verification links expire after 1 hour (3600 seconds)
```

### Custom Email Template

A celestial-themed email template has been created at `supabase/templates/confirm-signup.html`:

- **Design**: Space Core theme with gradient backgrounds
- **Branding**: cosynq logo and celestial aesthetics
- **Content**: Clear call-to-action button and expiry notice
- **Accessibility**: Fallback link for users who can't click the button

### Testing Email Verification Locally

1. **Start Supabase**: `npx supabase start`
2. **Access Inbucket**: Navigate to `http://127.0.0.1:54324` to view test emails
3. **Sign Up**: Create a new account through the app
4. **Check Inbucket**: View the verification email in the Inbucket interface
5. **Click Link**: Click the verification link to confirm the email

## Production Configuration

For production deployment, you need to configure the following in the Supabase Dashboard:

### Step 1: Enable Email Confirmations

1. Navigate to **Authentication > Settings** in the Supabase Dashboard
2. Scroll to **Email Auth**
3. Enable **Confirm email**
4. Set **Email confirmation expiry** to `86400` seconds (24 hours)

### Step 2: Configure Email Template

1. Navigate to **Authentication > Email Templates**
2. Select **Confirm signup** template
3. Click **Edit template**
4. Copy the contents of `supabase/templates/confirm-signup.html`
5. Paste into the template editor
6. Update the subject line: `Verify Your Email - cosynq`
7. Save the template

### Step 3: Configure SMTP (Production Email Delivery)

For production, configure a production-ready SMTP server:

1. Navigate to **Project Settings > Auth**
2. Scroll to **SMTP Settings**
3. Enable **Enable Custom SMTP**
4. Configure your SMTP provider (e.g., SendGrid, AWS SES, Mailgun):
   - **Host**: Your SMTP host (e.g., `smtp.sendgrid.net`)
   - **Port**: `587` (TLS) or `465` (SSL)
   - **Username**: Your SMTP username
   - **Password**: Your SMTP password/API key
   - **Sender email**: `noreply@cosynq.com` (or your verified sender)
   - **Sender name**: `cosynq`

#### Recommended SMTP Providers

**SendGrid** (Recommended for cosynq):
```toml
[auth.email.smtp]
enabled = true
host = "smtp.sendgrid.net"
port = 587
user = "apikey"
pass = "env(SENDGRID_API_KEY)"
admin_email = "noreply@cosynq.com"
sender_name = "cosynq"
```

**AWS SES**:
```toml
[auth.email.smtp]
enabled = true
host = "email-smtp.us-east-1.amazonaws.com"
port = 587
user = "env(AWS_SES_SMTP_USERNAME)"
pass = "env(AWS_SES_SMTP_PASSWORD)"
admin_email = "noreply@cosynq.com"
sender_name = "cosynq"
```

### Step 4: Configure Site URL and Redirect URLs

1. Navigate to **Authentication > URL Configuration**
2. Set **Site URL**: `https://cosynq.com` (your production domain)
3. Add **Redirect URLs**:
   - `https://cosynq.com/auth/callback`
   - `https://www.cosynq.com/auth/callback`
   - Any other domains you need to support

### Step 5: Test Production Email Flow

1. Create a test account in production
2. Verify the email is sent to your inbox
3. Check that the email template renders correctly
4. Click the verification link
5. Verify the user is redirected to the correct callback URL
6. Confirm the user can sign in after verification

## Email Verification Flow

### User Journey

1. **Sign Up**: User completes the 4-step sign-up wizard
2. **Account Created**: Account is created but `email_confirmed_at` is `NULL`
3. **Verification Email Sent**: User receives email with verification link
4. **Email Verification Screen**: User is redirected to `/verify-email` page
5. **Click Link**: User clicks the verification link in their email
6. **Email Verified**: Supabase sets `email_confirmed_at` to current timestamp
7. **Redirect**: User is redirected to `/verify-success` page
8. **Auto-Redirect**: After 3 seconds, user is redirected to `/sign-in`
9. **Sign In**: User can now sign in with verified email

### Security Considerations

- **Verification Required**: Users cannot sign in until email is verified
- **Link Expiry**: Verification links expire after 24 hours (production) or 1 hour (local)
- **Rate Limiting**: Resend verification is rate-limited to prevent abuse (60-second cooldown)
- **Secure Tokens**: Verification tokens are cryptographically secure and single-use
- **Audit Logging**: All verification events are logged via SecurityLogger

## Troubleshooting

### Issue: Verification emails not being sent

**Local Development**:
- Check that Supabase is running: `npx supabase status`
- Check Inbucket at `http://127.0.0.1:54324`
- Verify `enable_confirmations = true` in `config.toml`

**Production**:
- Check SMTP configuration in Supabase Dashboard
- Verify SMTP credentials are correct
- Check email provider logs for delivery issues
- Verify sender email is verified with your SMTP provider

### Issue: Verification link expired

- Links expire after 24 hours (production) or 1 hour (local)
- User can request a new verification email via the "Resend" button
- Check `otp_expiry` setting in `config.toml` or Dashboard

### Issue: User redirected to wrong URL after verification

- Verify `site_url` is set correctly in `config.toml` or Dashboard
- Check that redirect URLs are whitelisted in Dashboard
- Ensure `NEXT_PUBLIC_SITE_URL` environment variable is set correctly

### Issue: Email template not rendering correctly

- Verify HTML is valid (no syntax errors)
- Test template variables: `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`
- Check that template is saved in Dashboard (production)
- Restart Supabase after template changes (local): `npx supabase restart`

## Environment Variables

Ensure the following environment variables are set:

**Local Development** (`.env.local`):
```env
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>
```

**Production** (`.env.production`):
```env
NEXT_PUBLIC_SITE_URL=https://cosynq.com
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-production-anon-key>
```

## Security Logging

All email verification events are logged via `SecurityLogger`:

- `EMAIL_VERIFICATION_SENT`: When verification email is sent
- `EMAIL_VERIFICATION_SUCCESS`: When user successfully verifies email
- `EMAIL_VERIFICATION_FAILED`: When verification fails (expired link, invalid token)
- `RATE_LIMIT_EXCEEDED`: When user exceeds resend rate limit

Logs include:
- Timestamp (ISO format)
- Event type and severity
- User email (sanitized)
- IP address
- Metadata (reason for failure, etc.)

## Requirements Satisfied

This configuration satisfies the following requirements:

- **Requirement 20.1**: Supabase Auth configured to require email verification
- **Requirement 20.20**: Verification email sent automatically on sign-up
- **Requirement 20.25**: Verification link functionality implemented
- **Requirement 20.26**: Link expiration set to 24 hours (production)
- **Requirement 20.27**: Custom email template with celestial branding
- **Requirement 20.30**: End-to-end verification flow tested

## Next Steps

1. **Local Testing**: Test the complete flow locally using Inbucket
2. **Production Setup**: Configure SMTP and email templates in Supabase Dashboard
3. **Domain Verification**: Verify sender domain with your SMTP provider
4. **Monitoring**: Set up monitoring for email delivery rates and failures
5. **User Testing**: Conduct user acceptance testing of the verification flow
