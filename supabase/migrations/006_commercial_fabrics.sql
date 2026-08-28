-- 006 — Telas comerciales actuales (2 opciones).
-- Bliss → Sunbrella Canvas - Agora - Linetex (mismos precios, fabric_id bliss).
-- Sunbrella → Sunbrella Natte (A cotizar, fabric_id sunbrella).
-- Ágora independiente → eliminar sin duplicar combinaciones bliss.

-- Labels vigentes
update public.price_variants
set fabric_label = 'Sunbrella Canvas - Agora - Linetex'
where fabric_id = 'bliss';

update public.price_variants
set
  fabric_label = 'Sunbrella Natte',
  price_status = 'quote',
  list_price = 0
where fabric_id = 'sunbrella';

-- Corregir etiquetas antiguas si el fabric_id ya es correcto
update public.price_variants
set fabric_label = 'Sunbrella Canvas - Agora - Linetex'
where fabric_id = 'bliss'
  and fabric_label in (
    'Bliss Premium',
    'Bliss',
    'Ágora Premium',
    'Agora Premium',
    'Ágora',
    'Agora'
  );

update public.price_variants
set
  fabric_label = 'Sunbrella Natte',
  price_status = 'quote',
  list_price = 0
where fabric_id = 'sunbrella'
  and fabric_label in ('Sunbrella Premium', 'Sunbrella');

-- Disponibilidad de variantes Ágora (se eliminan)
delete from public.variant_availability va
where exists (
  select 1
  from public.price_variants pv
  where pv.variant_key = va.variant_key
    and pv.fabric_id = 'agora'
);

-- Ágora duplicada: bliss ya cubre la misma combinación
delete from public.price_variants agora
where agora.fabric_id = 'agora'
  and exists (
    select 1
    from public.price_variants bliss
    where bliss.fabric_id = 'bliss'
      and bliss.product_id = agora.product_id
      and bliss.size_id = agora.size_id
      and bliss.structure_id = agora.structure_id
      and bliss.stone_id = agora.stone_id
  );

-- Resto de Ágora (sin bliss equivalente)
delete from public.variant_availability va
where exists (
  select 1
  from public.price_variants pv
  where pv.variant_key = va.variant_key
    and pv.fabric_id = 'agora'
);

delete from public.price_variants
where fabric_id = 'agora';
