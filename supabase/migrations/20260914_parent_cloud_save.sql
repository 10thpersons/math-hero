-- Run in Supabase Dashboard > SQL Editor as the project administrator.
-- One bounded save per authenticated parent; browser clients never use service_role.
begin;

create table if not exists public.hero_islands_saves (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null check (jsonb_typeof(state) = 'object'),
  updated_at timestamptz not null default clock_timestamp()
);

-- Also hardens a table created by the original version of this migration.
alter table public.hero_islands_saves drop constraint if exists hero_islands_save_size;
alter table public.hero_islands_saves add constraint hero_islands_save_size
  check (octet_length(state::text) <= 131072);
alter table public.hero_islands_saves enable row level security;
alter table public.hero_islands_saves force row level security;
revoke all on table public.hero_islands_saves from public;
revoke all on table public.hero_islands_saves from anon;
revoke all on table public.hero_islands_saves from authenticated;
grant select on table public.hero_islands_saves to authenticated;
grant insert (owner_id, state), update (state) on public.hero_islands_saves to authenticated;

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
returns trigger language plpgsql security invoker set search_path = pg_catalog as $$
begin
  if TG_OP = 'UPDATE' then
    new.updated_at = greatest(clock_timestamp(), old.updated_at + interval '1 microsecond');
  else
    new.updated_at = clock_timestamp();
  end if;
  return new;
end;
$$;
revoke all on function public.hero_islands_set_updated_at() from public, anon, authenticated;
drop trigger if exists hero_islands_saves_updated_at on public.hero_islands_saves;
create trigger hero_islands_saves_updated_at before insert or update on public.hero_islands_saves
  for each row execute function public.hero_islands_set_updated_at();

commit;
