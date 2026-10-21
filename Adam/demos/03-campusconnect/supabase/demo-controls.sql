-- One-time setup for the Demo controls panel in CampusConnect.
-- Run this once in the SQL Editor. After that, the panel's buttons do the
-- RLS steps, so you don't paste SQL on stage.
--
-- Safety: the function only runs a fixed list of actions, and only with the
-- passphrase below. The passphrase lives in src/DemoPanel.jsx, which only exists
-- on your laptop, so nobody who sees your Supabase URL on the projector can use it.

create or replace function public.demo_control(action text, passphrase text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  p record;
begin
  if passphrase is distinct from 'QcWId9ZY063kTmjB' then
    raise exception 'not allowed';
  end if;

  if action = 'reset' then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'students' loop
      execute format('drop policy %I on public.students', p.policyname);
    end loop;
    alter table public.students disable row level security;
  elsif action = 'lock' then
    alter table public.students enable row level security;
  elsif action = 'policy' then
    drop policy if exists "own rows only" on public.students;
    create policy "own rows only" on public.students for select using (auth.uid() = user_id);
  elsif action = 'bad_policy' then
    drop policy if exists "allow all" on public.students;
    create policy "allow all" on public.students for select using (true);
  elsif action <> 'status' then
    raise exception 'unknown action';
  end if;

  return json_build_object(
    'rls', (select relrowsecurity from pg_class where oid = 'public.students'::regclass),
    'policies', coalesce(
      (select json_agg(policyname order by policyname) from pg_policies where schemaname = 'public' and tablename = 'students'),
      '[]'::json
    )
  );
end;
$$;

revoke all on function public.demo_control(text, text) from public;
grant execute on function public.demo_control(text, text) to anon, authenticated;
