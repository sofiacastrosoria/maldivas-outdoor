-- 004 — Disponibilidad por combinación (las mismas filas que Precios).
-- Pegá este archivo en SQL Editor de Supabase y dale Run.

create table if not exists public.variant_availability (
  variant_key text primary key,
  status text not null default 'active'
    check (status in ('active', 'sold_out', 'hidden')),
  updated_at timestamptz not null default now()
);

alter table public.variant_availability enable row level security;

drop policy if exists "anon read variant availability" on public.variant_availability;
create policy "anon read variant availability"
  on public.variant_availability for select
  to anon, authenticated
  using (true);

drop policy if exists "authenticated insert variant availability" on public.variant_availability;
create policy "authenticated insert variant availability"
  on public.variant_availability for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated update variant availability" on public.variant_availability;
create policy "authenticated update variant availability"
  on public.variant_availability for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated delete variant availability" on public.variant_availability;
create policy "authenticated delete variant availability"
  on public.variant_availability for delete
  to authenticated
  using (true);

grant select on public.variant_availability to anon, authenticated, service_role;
grant insert, update, delete on public.variant_availability to authenticated, service_role;
