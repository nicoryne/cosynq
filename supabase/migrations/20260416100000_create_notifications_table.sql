-- 20260416100000_create_notifications_table.sql

-- Notifications Table
create table public.notifications (
    id uuid default gen_random_uuid() primary key,
    recipient_id uuid references public.user_profiles(id) on delete cascade not null,
    actor_id uuid references public.user_profiles(id) on delete set null,
    type text not null, -- 'like', 'comment', 'follow', 'mention', 'system'
    entity_type text,   -- 'post', 'comment', 'group'
    entity_id uuid,     -- ID of the related entity
    content text,       -- Optional pre-rendered content
    metadata jsonb default '{}'::jsonb,
    is_read boolean default false,
    read_at timestamptz,
    created_at timestamptz default now()
);

-- Indices for performance (Composite and Partial)
create index notifications_recipient_id_idx on public.notifications(recipient_id);
create index notifications_created_at_idx on public.notifications(created_at desc);
create index notifications_unread_idx on public.notifications(recipient_id, created_at desc) where is_read = false;
create index notifications_recipient_read_idx on public.notifications(recipient_id, is_read, created_at desc);

-- RLS Policies
alter table public.notifications enable row level security;

-- Only users can view their own notifications
create policy "users_view_own_notifications"
    on public.notifications for select
    using (auth.uid() = recipient_id);

-- Only users can mark their own notifications as read
create policy "users_update_own_notifications"
    on public.notifications for update
    using (auth.uid() = recipient_id)
    with check (auth.uid() = recipient_id);

-- Explicitly deny delete (unless we want to allow it later)
create policy "users_cannot_delete_notifications"
    on public.notifications for delete
    using (false);

-- Grant select and update to authenticated users
grant select, update on public.notifications to authenticated;

-- Maintenance Cleanup Logic (30-day TTL)
-- Note: pg_cron is not standard everywhere, so we define a function that can be called by an edge job
create or replace function public.delete_old_notifications()
returns void as $$
begin
    delete from public.notifications
    where created_at < now() - interval '30 days';
end;
$$ language plpgsql security definer;
