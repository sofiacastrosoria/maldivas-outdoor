-- 003 — Descuentos (global + por producto) y catálogo admin.
-- Pegá este archivo completo en SQL Editor de Supabase y dale Run.

create table if not exists public.discount_settings (
  id text primary key default 'global',
  cash_percent numeric not null default 30,
  transfer_percent numeric not null default 15,
  updated_at timestamptz not null default now()
);

insert into public.discount_settings (id, cash_percent, transfer_percent)
values ('global', 30, 15)
on conflict (id) do nothing;

create table if not exists public.product_discounts (
  product_id text primary key,
  cash_percent numeric not null,
  transfer_percent numeric not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.product_status (
  product_id text primary key,
  status text not null default 'active'
    check (status in ('active', 'sold_out', 'hidden')),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  collection text not null,
  name text not null,
  slug text not null,
  description text not null default '',
  image_url text not null default '',
  list_price integer,
  status text not null default 'active'
    check (status in ('active', 'sold_out', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category, slug)
);

create index if not exists catalog_products_category_idx
  on public.catalog_products (category);

alter table public.discount_settings enable row level security;
alter table public.product_discounts enable row level security;
alter table public.product_status enable row level security;
alter table public.catalog_products enable row level security;

drop policy if exists "anon read discount settings" on public.discount_settings;
create policy "anon read discount settings"
  on public.discount_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "authenticated write discount settings" on public.discount_settings;
create policy "authenticated write discount settings"
  on public.discount_settings for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "anon read product discounts" on public.product_discounts;
create policy "anon read product discounts"
  on public.product_discounts for select
  to anon, authenticated
  using (true);

drop policy if exists "authenticated insert product discounts" on public.product_discounts;
create policy "authenticated insert product discounts"
  on public.product_discounts for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated update product discounts" on public.product_discounts;
create policy "authenticated update product discounts"
  on public.product_discounts for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated delete product discounts" on public.product_discounts;
create policy "authenticated delete product discounts"
  on public.product_discounts for delete
  to authenticated
  using (true);

drop policy if exists "anon read product status" on public.product_status;
create policy "anon read product status"
  on public.product_status for select
  to anon, authenticated
  using (true);

drop policy if exists "authenticated insert product status" on public.product_status;
create policy "authenticated insert product status"
  on public.product_status for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated update product status" on public.product_status;
create policy "authenticated update product status"
  on public.product_status for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated delete product status" on public.product_status;
create policy "authenticated delete product status"
  on public.product_status for delete
  to authenticated
  using (true);

drop policy if exists "anon read catalog products" on public.catalog_products;
create policy "anon read catalog products"
  on public.catalog_products for select
  to anon, authenticated
  using (true);

drop policy if exists "authenticated insert catalog products" on public.catalog_products;
create policy "authenticated insert catalog products"
  on public.catalog_products for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated update catalog products" on public.catalog_products;
create policy "authenticated update catalog products"
  on public.catalog_products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated delete catalog products" on public.catalog_products;
create policy "authenticated delete catalog products"
  on public.catalog_products for delete
  to authenticated
  using (true);

grant select on public.discount_settings to anon, authenticated, service_role;
grant insert, update on public.discount_settings to authenticated, service_role;
grant select on public.product_discounts to anon, authenticated, service_role;
grant insert, update, delete on public.product_discounts to authenticated, service_role;
grant select on public.product_status to anon, authenticated, service_role;
grant insert, update, delete on public.product_status to authenticated, service_role;
grant select on public.catalog_products to anon, authenticated, service_role;
grant insert, update, delete on public.catalog_products to authenticated, service_role;
