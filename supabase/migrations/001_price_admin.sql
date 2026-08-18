-- Maldivas Outdoor — precios por variante + auditoría
-- Ejecutar en el SQL Editor de Supabase (producción).

create table if not exists public.price_variants (
  id uuid primary key default gen_random_uuid(),
  variant_key text not null unique,
  product_id text not null,
  product_name text not null,
  collection text not null,
  category text not null,
  size_id text not null default '',
  size_label text not null default '',
  structure_id text not null default '',
  structure_label text not null default '',
  fabric_id text not null default '',
  fabric_label text not null default '',
  stone_id text not null default '',
  stone_label text not null default '',
  list_price integer not null default 0,
  price_status text not null default 'priced'
    check (price_status in ('priced', 'quote')),
  updated_at timestamptz not null default now()
);

create index if not exists price_variants_product_idx
  on public.price_variants (product_id);
create index if not exists price_variants_category_idx
  on public.price_variants (category);
create index if not exists price_variants_collection_idx
  on public.price_variants (collection);

create table if not exists public.price_change_log (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid references public.price_variants(id) on delete set null,
  variant_key text not null,
  product_id text not null,
  product_name text,
  old_list_price integer,
  new_list_price integer,
  old_price_status text,
  new_price_status text,
  percent_applied numeric,
  changed_by uuid,
  changed_by_email text,
  created_at timestamptz not null default now()
);

create index if not exists price_change_log_created_idx
  on public.price_change_log (created_at desc);

create or replace function public.touch_price_variant_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_price_variants_updated_at on public.price_variants;
create trigger trg_price_variants_updated_at
before update on public.price_variants
for each row execute function public.touch_price_variant_updated_at();

create or replace function public.log_price_variant_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  applied numeric;
begin
  if new.list_price is not distinct from old.list_price
     and new.price_status is not distinct from old.price_status then
    return new;
  end if;

  applied := null;
  if tg_op = 'UPDATE'
     and old.list_price is not null
     and old.list_price > 0
     and new.list_price is distinct from old.list_price then
    applied := round(((new.list_price::numeric / old.list_price::numeric) - 1) * 100, 4);
  end if;

  insert into public.price_change_log (
    variant_id,
    variant_key,
    product_id,
    product_name,
    old_list_price,
    new_list_price,
    old_price_status,
    new_price_status,
    percent_applied,
    changed_by,
    changed_by_email
  ) values (
    new.id,
    new.variant_key,
    new.product_id,
    new.product_name,
    old.list_price,
    new.list_price,
    old.price_status,
    new.price_status,
    applied,
    auth.uid(),
    coalesce(auth.jwt() ->> 'email', '')
  );

  return new;
end;
$$;

drop trigger if exists trg_price_variants_audit on public.price_variants;
create trigger trg_price_variants_audit
after update on public.price_variants
for each row execute function public.log_price_variant_change();

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
  if auth.uid() is null then
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

alter table public.price_variants enable row level security;
alter table public.price_change_log enable row level security;

drop policy if exists "anon read price variants" on public.price_variants;
create policy "anon read price variants"
  on public.price_variants for select
  to anon, authenticated
  using (true);

drop policy if exists "authenticated insert price variants" on public.price_variants;
create policy "authenticated insert price variants"
  on public.price_variants for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated update price variants" on public.price_variants;
create policy "authenticated update price variants"
  on public.price_variants for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated delete price variants" on public.price_variants;
create policy "authenticated delete price variants"
  on public.price_variants for delete
  to authenticated
  using (true);

drop policy if exists "authenticated read price log" on public.price_change_log;
create policy "authenticated read price log"
  on public.price_change_log for select
  to authenticated
  using (true);

drop policy if exists "authenticated insert price log" on public.price_change_log;
create policy "authenticated insert price log"
  on public.price_change_log for insert
  to authenticated
  with check (true);

grant usage on schema public to anon, authenticated, service_role;
grant select on public.price_variants to anon, authenticated, service_role;
grant insert, update, delete on public.price_variants to authenticated, service_role;
grant select, insert on public.price_change_log to authenticated, service_role;
grant execute on function public.apply_percent_to_variants(uuid[], numeric) to authenticated, service_role;
