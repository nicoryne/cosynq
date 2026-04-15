# Custom Auth Flow Documentation: Verification & Password Reset

This document details how we implemented the custom URL flow for email verification and password resets to ensure a seamless, branded user experience within the **EYntern Arena** rather than using Supabase's default generic redirects.

## 1. URL Construction Strategy

Instead of using Supabase's default confirmation logic, we constructed custom URLs that point directly to our frontend application routes.

### Email Verification
- **Route**: [verify/page.tsx](file:///c:/Users/porte/CODE/eyntern-arena/app/verify/page.tsx)
- **URL Structure**: `{{ .SiteURL }}/verify?token={{ .TokenHash }}&type=signup`
- **Logic**: When a user clicks the link, they are brought to the `/verify` page. The page extracts the `token` (the hashed OTP) and calls `supabase.auth.verifyOtp` to confirm the email.

### Password Reset
- **Route**: [reset-password/page.tsx](file:///c:/Users/porte/CODE/eyntern-arena/app/reset-password/page.tsx)
- **URL Structure**: `{{ .SiteURL }}/reset-password?token={{ .TokenHash }}&type=recovery`
- **Logic**: The link carries a `token_hash` of type `recovery`. The `/reset-password` page verifies this token, which then grants the user a temporary session allowed to execute `supabase.auth.updateUser({ password: ... })`.

---

## 2. Supabase Dashboard Configuration

To make these custom URLs work, we modified settings in the Supabase Dashboard under **Authentication**:

### Site Settings
- **Site URL**: Updated to the production domain (or `http://localhost:3000` for local dev).
- **Redirect URLs**: Explicitly added our callback and verification routes (e.g., `https://ey-ntern-arena.vercel.app/verify`, `https://ey-ntern-arena.vercel.app/reset-password`) to the allowlist.

### Email Templates
We replaced the default `{{ .ConfirmationURL }}` variable in the templates with our manual route structure:

| Template | Custom Link Content |
| :--- | :--- |
| **Confirm signup** | `<a href="{{ .SiteURL }}/verify?token={{ .TokenHash }}&type=signup">Verify Email</a>` |
| **Reset Password** | `<a href="{{ .SiteURL }}/reset-password?token={{ .TokenHash }}&type=recovery">Reset Password</a>` |

> [!IMPORTANT]
> By using `{{ .TokenHash }}` instead of `{{ .ConfirmationURL }}`, we bypass Supabase's automatic redirect handler and gain full control over the UX in our Next.js app.

---

## 3. Security Implementation

We implemented multiple layers of security to ensure these links cannot be abused:

### Hashed Tokens (`token_hash`)
We use **Token Hashes** instead of raw tokens. These are:
- **Single-use**: Once verified, the hash becomes invalid.
- **Short-lived**: They expire after a set time (default 1 hour).
- **Secure**: Because they are hashes, they can safely appear in URL query parameters without exposing the raw secret.

### Secure Verification Logic
In [verify/page.tsx](file:///c:/Users/porte/CODE/eyntern-arena/app/verify/page.tsx) and [reset-password/page.tsx](file:///c:/Users/porte/CODE/eyntern-arena/app/reset-password/page.tsx), we use:
```typescript
const { data, error } = await supabase.auth.verifyOtp({ 
  token_hash: token, 
  type: 'signup' // or 'recovery'
});
```
This method ensures the server-side validation is performed by Supabase Auth before the application grants any session or access.

### Database Synchronization
Once Supabase confirms the verification, we perform an additional security sync with our private `users` table:
```typescript
// From app/verify/page.tsx
const { error: updateError } = await supabase
  .from('users')
  .update({ email_verified: true })
  .eq('id', session.user.id);
```
This ensures that our internal application logic (which might use the `users` table for metadata) is perfectly aligned with the Supabase Auth state.

### Route Protection
The `/reset-password` page only shows the "New Password" fields if a valid `PASSWORD_RECOVERY` event or session is detected, preventing users from accessing the form without a valid link.
