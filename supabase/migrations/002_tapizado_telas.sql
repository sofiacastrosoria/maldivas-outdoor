-- 002 — Tapizado por marca de tela (no por color).
-- El 001 ya lo corriste. Pegá ESTE archivo completo en SQL Editor de Supabase y dale Run.

grant usage on schema public to service_role;
grant select, insert, update, delete on public.price_variants to service_role;
grant select, insert on public.price_change_log to service_role;

grant delete on public.price_variants to authenticated;

drop policy if exists "authenticated delete price variants" on public.price_variants;
create policy "authenticated delete price variants"
  on public.price_variants for delete
  to authenticated
  using (true);

delete from public.price_variants
where fabric_id in ('negro', 'gris', 'beige', 'blanco');
