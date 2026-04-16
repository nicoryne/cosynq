-- 20260416110000_hardened_notification_strata.sql

-- 1. Drop existing policies applied to 'public' (default)
drop policy if exists "users_view_own_notifications" on public.notifications;
drop policy if exists "users_update_own_notifications" on public.notifications;
drop policy if exists "users_cannot_delete_notifications" on public.notifications;

-- 2. Re-create policies with explicit 'TO authenticated' manifest
create policy "users_view_own_notifications"
    on public.notifications for select
    to authenticated
    using (auth.uid() = recipient_id);

create policy "users_update_own_notifications"
    on public.notifications for update
    to authenticated
    using (auth.uid() = recipient_id)
    with check (auth.uid() = recipient_id);

create policy "users_cannot_delete_notifications"
    on public.notifications for delete
    to authenticated
    using (false);

-- 3. Enable Real-Time Telemetry
-- Adds the table to the 'supabase_realtime' publication for instant signal delivery
alter publication supabase_realtime add table public.notifications;
