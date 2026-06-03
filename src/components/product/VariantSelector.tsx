"use client";

import type { Product, ProductConfig } from "@/types";
import { calculatePrice, formatPrice, buildConfigSummary } from "@/lib/pricing";

interface VariantSelectorProps {
  product: Product;
  config: ProductConfig;
  onChange: (patch: Partial<ProductConfig>) => void;
}

function OptionButton({
  selected,
  onClick,
  label,
  sublabel,
  onRequest,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  sublabel?: string;
  onRequest?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full text-left px-4 py-3.5 border transition-all duration-300 ease-luxury ${
        selected
          ? "border-matte-black bg-matte-black text-white shadow-sm"
          : "border-stone/20 bg-white hover:border-matte-black/35 hover:bg-sand/5"
      }`}
    >
      <span className="text-sm block leading-snug">{label}</span>
      {sublabel && (
        <span
          className={`text-[11px] mt-0.5 block ${
            selected ? "text-white/55" : "text-matte-black/40"
          }`}
        >
          {sublabel}
        </span>
      )}
      {onRequest && (
        <span
          className={`text-[9px] mt-1 block tracking-wider uppercase ${
            selected ? "text-sand/90" : "text-matte-black/30"
          }`}
        >
          A pedido
        </span>
      )}
    </button>
  );
}

function FabricChip({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`px-4 py-2.5 text-xs border transition-all duration-300 ease-luxury ${
        selected
          ? "border-matte-black bg-matte-black text-white"
          : "border-stone/20 bg-white hover:border-matte-black/35 hover:bg-sand/5"
      }`}
    >
      {label}
    </button>
  );
}

export function VariantSelector({
  product,
  config,
  onChange,
}: VariantSelectorProps) {
  const price = calculatePrice(product, config);

  return (
    <div className="space-y-8">
      {product.sizes.length > 0 && !product.customizableSize && (
        <section>
          <h3 className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
            Tamaño
          </h3>
          <div className="grid gap-2">
            {product.sizes.map((size) => (
              <OptionButton
                key={size.id}
                selected={config.sizeId === size.id}
                onClick={() => onChange({ sizeId: size.id })}
                label={size.label}
                sublabel={size.dimensions}
              />
            ))}
          </div>
        </section>
      )}

      {product.customizableSize && (
        <section>
          <h3 className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
            Medida personalizada
          </h3>
          <input
            type="text"
            placeholder="Ej: 180 × 90 cm"
            value={config.customDimensions ?? ""}
            onChange={(e) => onChange({ customDimensions: e.target.value })}
            className="w-full border border-stone/20 px-4 py-3 text-sm bg-white focus:border-matte-black outline-none transition-colors duration-300"
          />
        </section>
      )}

      {product.structures.length > 0 &&
        product.structures[0].id !== "estandar" && (
          <section>
            <h3 className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
              Estructura
            </h3>
            <div className="grid gap-2">
              {product.structures.map((s) => (
                <OptionButton
                  key={s.id}
                  selected={config.structureId === s.id}
                  onClick={() => onChange({ structureId: s.id })}
                  label={s.label}
                  onRequest={s.onRequest}
                />
              ))}
            </div>
          </section>
        )}

      {product.fabrics.length > 0 && (
        <section>
          <h3 className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
            Tapizado
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.fabrics.map((f) => (
              <FabricChip
                key={f.id}
                selected={config.fabricId === f.id}
                onClick={() => onChange({ fabricId: f.id })}
                label={f.label}
              />
            ))}
          </div>
        </section>
      )}

      {product.stoneBrands && product.stoneBrands.length > 0 && (
        <>
          <section>
            <h3 className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
              Marca de piedra
            </h3>
            <div className="grid gap-2">
              {product.stoneBrands.map((b) => (
                <OptionButton
                  key={b.id}
                  selected={config.stoneBrand === b.id}
                  onClick={() => onChange({ stoneBrand: b.id })}
                  label={b.label}
                />
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
              Modelo de piedra
            </h3>
            <input
              type="text"
              placeholder="Consultar stock"
              value={config.stoneModel ?? ""}
              onChange={(e) => onChange({ stoneModel: e.target.value })}
              className="w-full border border-stone/20 px-4 py-3 text-sm bg-white focus:border-matte-black outline-none transition-colors duration-300"
            />
          </section>
        </>
      )}

      <div className="pt-4 border-t border-stone/15">
        <p className="text-[10px] tracking-luxury uppercase text-matte-black/40">
          Precio configurado
        </p>
        <p className="text-2xl font-light mt-1">{formatPrice(price)}</p>
      </div>
    </div>
  );
}