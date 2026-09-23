-- Run the whole script in Dashboard SQL Editor AFTER the migration.
-- All users and saves below are synthetic, created inside this transaction.
-- ROLLBACK removes them. An assertion failure aborts the transaction; run
-- ROLLBACK if the editor leaves it open. No email or external auth request occurs.
begin;

select set_config('hero_test.parent_a', gen_random_uuid()::text, true);
select set_config('hero_test.parent_b', gen_random_uuid()::text, true);
select set_config('hero_test.parent_c', gen_random_uuid()::text, true);
insert into auth.users (id, aud, role, email, created_at, updated_at)
select value::uuid, 'authenticated', 'authenticated', value || '@example.invalid', now(), now()
from (values (current_setting('hero_test.parent_a')),
             (current_setting('hero_test.parent_b')),
             (current_setting('hero_test.parent_c'))) as parents(value);

set local role authenticated;
select set_config('request.jwt.claim.sub', current_setting('hero_test.parent_a'), true);
select set_config('request.jwt.claims', json_build_object('sub', current_setting('hero_test.parent_a'), 'role', 'authenticated')::text, true);

do $$
declare before_version timestamptz; after_version timestamptz; affected integer;
begin
  insert into public.hero_islands_saves (owner_id, state)
    values (auth.uid(), '{"test":"family-a"}');
  select updated_at into before_version from public.hero_islands_saves where owner_id = auth.uid();
  if before_version is null then raise exception 'FAIL: parent cannot read own save'; end if;
  update public.hero_islands_saves set state = '{"test":"family-a-updated"}'
    where owner_id = auth.uid() and updated_at = before_version;
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'FAIL: matching version update failed'; end if;
  select updated_at into after_version from public.hero_islands_saves where owner_id = auth.uid();
  if after_version <= before_version then raise exception 'FAIL: version did not advance'; end if;
  update public.hero_islands_saves set state = '{"test":"stale-overwrite"}'
    where owner_id = auth.uid() and updated_at = before_version;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'FAIL: stale version overwrote save'; end if;
  begin
    update public.hero_islands_saves set state = jsonb_build_object('payload', repeat('x', 131073)) where owner_id = auth.uid();
    raise exception 'FAIL: oversized state accepted';
  exception when check_violation then null;
  end;
  begin
    update public.hero_islands_saves set state = '[]' where owner_id = auth.uid();
    raise exception 'FAIL: non-object state accepted';
  exception when check_violation then null;
  end;
  begin
    update public.hero_islands_saves set updated_at = now() where owner_id = auth.uid();
    raise exception 'FAIL: client can set version';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.hero_islands_saves set owner_id = current_setting('hero_test.parent_c')::uuid where owner_id = auth.uid();
    raise exception 'FAIL: client can reassign save ownership';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.hero_islands_saves where owner_id = auth.uid();
    raise exception 'FAIL: client delete permitted';
  exception when insufficient_privilege then null;
  end;
end $$;

select set_config('request.jwt.claim.sub', current_setting('hero_test.parent_b'), true);
select set_config('request.jwt.claims', json_build_object('sub', current_setting('hero_test.parent_b'), 'role', 'authenticated')::text, true);
do $$
declare affected integer;
begin
  if exists (select 1 from public.hero_islands_saves where owner_id = current_setting('hero_test.parent_a')::uuid)
    then raise exception 'FAIL: family B can read family A'; end if;
  update public.hero_islands_saves set state = '{"test":"cross-family"}'
    where owner_id = current_setting('hero_test.parent_a')::uuid;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'FAIL: family B can update family A'; end if;
  begin
    insert into public.hero_islands_saves (owner_id, state)
      values (current_setting('hero_test.parent_c')::uuid, '{}');
    raise exception 'FAIL: family B can create family C save';
  exception when insufficient_privilege then null;
  end;
  insert into public.hero_islands_saves (owner_id, state) values (auth.uid(), '{"test":"family-b"}');
  if (select count(*) from public.hero_islands_saves) <> 1
    then raise exception 'FAIL: family B does not see exactly its own save'; end if;
end $$;

reset role;
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$
begin
  begin
    perform 1 from public.hero_islands_saves;
    raise exception 'FAIL: anonymous SELECT permitted';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.hero_islands_saves (owner_id, state) values (current_setting('hero_test.parent_c')::uuid, '{}');
    raise exception 'FAIL: anonymous INSERT permitted';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.hero_islands_saves set state = '{}';
    raise exception 'FAIL: anonymous UPDATE permitted';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

select 'PASS: own access, family isolation, anonymous denial, size/type limits, server versions and stale-write protection' as verification;
rollback;
