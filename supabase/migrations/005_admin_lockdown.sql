-- 005 — Solo el mail de Maldivas puede escribir, y hay límite de intentos de login.
-- Pegá este archivo completo en SQL Editor de Supabase y dale Run.

create table if not exists public.admin_allowlist (
  email text primary key
);

insert into public.admin_allowlist (email)
values ('maldivas.outdoor@gmail.com')
on conflict (email) do nothing;

alter table public.admin_allowlist enable row level security;

revoke all on public.admin_allowlist from anon, authenticated;
grant select, insert, update, delete on public.admin_allowlist to service_role;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_allowlist a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, service_role;

create table if not exists public.login_guard (
  key text primary key,
  fail_count integer not null default 0,
  window_started_at timestamptz not null default now(),
  locked_until timestamptz
);

alter table public.login_guard enable row level security;

revoke all on public.login_guard from anon, authenticated;
grant select, insert, update, delete on public.login_guard to service_role;

create or replace function public.login_guard_status(p_key text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.login_guard%rowtype;
  retry int := 0;
begin
  if p_key is null or length(p_key) < 16 then
    return jsonb_build_object('allowed', false, 'retry_after', 60);
  end if;

  select * into row from public.login_guard where key = p_key;
  if not found then
    return jsonb_build_object('allowed', true, 'retry_after', 0);
  end if;

  if row.locked_until is not null and row.locked_until > now() then
    retry := greatest(1, floor(extract(epoch from (row.locked_until - now())))::int);
    return jsonb_build_object('allowed', false, 'retry_after', retry);
  end if;

  return jsonb_build_object('allowed', true, 'retry_after', 0);
end;
$$;

create or replace function public.login_guard_fail(p_key text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.login_guard%rowtype;
  retry int := 0;
  max_fails int := 5;
  window_secs int := 900;
  lock_secs int := 900;
begin
  if p_key is null or length(p_key) < 16 then
    return jsonb_build_object('allowed', false, 'retry_after', 60);
  end if;

  insert into public.login_guard (key, fail_count, window_started_at, locked_until)
  values (p_key, 0, now(), null)
  on conflict (key) do nothing;

  select * into row from public.login_guard where key = p_key for update;

  if row.locked_until is not null and row.locked_until > now() then
    retry := greatest(1, floor(extract(epoch from (row.locked_until - now())))::int);
    return jsonb_build_object('allowed', false, 'retry_after', retry);
  end if;

  if row.window_started_at < now() - make_interval(secs => window_secs) then
    row.fail_count := 0;
    row.window_started_at := now();
    row.locked_until := null;
  end if;

  row.fail_count := row.fail_count + 1;

  if row.fail_count >= max_fails then
    row.locked_until := now() + make_interval(secs => lock_secs);
    retry := lock_secs;
  end if;

  update public.login_guard
  set fail_count = row.fail_count,
      window_started_at = row.window_started_at,
      locked_until = row.locked_until
  where key = p_key;

  return jsonb_build_object(
    'allowed', row.locked_until is null or row.locked_until <= now(),
    'retry_after', retry
  );
end;
$$;

create or replace function public.login_guard_ok(p_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.login_guard where key = p_key;
end;
$$;

revoke all on function public.login_guard_status(text) from public;
revoke all on function public.login_guard_fail(text) from public;
revoke all on function public.login_guard_ok(text) from public;
grant execute on function public.login_guard_status(text) to anon, authenticated, service_role;
grant execute on function public.login_guard_fail(text) to anon, authenticated, service_role;
grant execute on function public.login_guard_ok(text) to anon, authenticated, service_role;

create or replace function public.apply_percent_to_variants(
  p_ids uuid[],
  p_percent numeric
)
returns integer
language plpgsql
security invoker
as $$
declare
  n integer;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'No autorizado';
  end if;

  if p_ids is null or array_length(p_ids, 1) is null then
    return 0;
  end if;

  update public.price_variants
  set list_price = greatest(0, round(list_price * (1 + p_percent / 100.0)))
  where id = any (p_ids)
    and price_status = 'priced';

  get diagnostics n = row_count;
  return n;
end;
$$;

-- Escritura solo admin. Lectura pública de catálogo se mantiene.

drop policy if exists "authenticated insert price variants" on public.price_variants;
create policy "authenticated insert price variants"
  on public.price_variants for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "authenticated update price variants" on public.price_variants;
create policy "authenticated update price variants"
  on public.price_variants for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "authenticated delete price variants" on public.price_variants;
create policy "authenticated delete price variants"
  on public.price_variants for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "authenticated read price log" on public.price_change_log;
create policy "authenticated read price log"
  on public.price_change_log for select
  to authenticated
  using (public.is_admin());

drop policy if exists "authenticated insert price log" on public.price_change_log;
create policy "authenticated insert price log"
  on public.price_change_log for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "authenticated write discount settings" on public.discount_settings;
create policy "authenticated write discount settings"
  on public.discount_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "authenticated insert product discounts" on public.product_discounts;
create policy "authenticated insert product discounts"
  on public.product_discounts for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "authenticated update product discounts" on public.product_discounts;
create policy "authenticated update product discounts"
  on public.product_discounts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "authenticated delete product discounts" on public.product_discounts;
create policy "authenticated delete product discounts"
  on public.product_discounts for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "authenticated insert product status" on public.product_status;
create policy "authenticated insert product status"
  on public.product_status for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "authenticated update product status" on public.product_status;
create policy "authenticated update product status"
  on public.product_status for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "authenticated delete product status" on public.product_status;
create policy "authenticated delete product status"
  on public.product_status for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "authenticated insert catalog products" on public.catalog_products;
create policy "authenticated insert catalog products"
  on public.catalog_products for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "authenticated update catalog products" on public.catalog_products;
create policy "authenticated update catalog products"
  on public.catalog_products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "authenticated delete catalog products" on public.catalog_products;
create policy "authenticated delete catalog products"
  on public.catalog_products for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "authenticated insert variant availability" on public.variant_availability;
create policy "authenticated insert variant availability"
  on public.variant_availability for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "authenticated update variant availability" on public.variant_availability;
create policy "authenticated update variant availability"
  on public.variant_availability for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "authenticated delete variant availability" on public.variant_availability;
create policy "authenticated delete variant availability"
  on public.variant_availability for delete
  to authenticated
  using (public.is_admin());
