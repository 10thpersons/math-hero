-- Run once in Supabase Dashboard > SQL Editor. This stores one encrypted-in-
-- transit family game state per authenticated parent. Do not use service_role
-- in the browser.
create table if not exists public.hero_islands_saves (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null check (jsonb_typeof(state) = 'object'),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.hero_islands_saves enable row level security;
revoke all on table public.hero_islands_saves from anon;
revoke all on table public.hero_islands_saves from authenticated;
grant select, insert, update on table public.hero_islands_saves to authenticated;

drop policy if exists "parents read their own Hero Islands save" on public.hero_islands_saves;
create policy "parents read their own Hero Islands save" on public.hero_islands_saves for select to authenticated
  using ((select auth.uid()) = owner_id);
drop policy if exists "parents create their own Hero Islands save" on public.hero_islands_saves;
create policy "parents create their own Hero Islands save" on public.hero_islands_saves for insert to authenticated
  with check ((select auth.uid()) = owner_id);
drop policy if exists "parents update their own Hero Islands save" on public.hero_islands_saves;
create policy "parents update their own Hero Islands save" on public.hero_islands_saves for update to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);

create or replace function public.hero_islands_set_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin new.updated_at = timezone('utc', now()); return new; end;
$$;
drop trigger if exists hero_islands_saves_updated_at on public.hero_islands_saves;
create trigger hero_islands_saves_updated_at before update on public.hero_islands_saves
  for each row execute function public.hero_islands_set_updated_at();
