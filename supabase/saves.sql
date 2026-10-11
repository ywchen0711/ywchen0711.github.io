-- Cloud saves for the games on ywchen0711.github.io. Run once in the Supabase SQL Editor.
create table if not exists public.saves (
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  game text not null check (char_length(game) <= 40),
  data jsonb not null check (pg_column_size(data) < 200000),
  updated_at timestamptz not null default now(),
  primary key (user_id, game)
);
alter table public.saves enable row level security;
drop policy if exists "own saves" on public.saves;
create policy "own saves" on public.saves for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.saves to authenticated;
