"use client";

import type { Product, ProductConfig } from "@/types";
import {
  getAvailableStoneModels,
  STONE_BRAND_LABELS,
  type StoneBrandId,
} from "@/data/comedorStone";
import {
  STRUCTURE_SWATCHES,
  FABRIC_SWATCHES,
  FABRIC_DISPLAY_LABELS,
  FABRIC_TYPE_OPTIONS,
  type FabricTypeId,
} from "@/lib/premiumSwatches";

interface VariantSelectorProps {
  product: Product;
  config: ProductConfig;
  onChange: (patch: Partial<ProductConfig>) => void;
  fabricType: FabricTypeId;
  onFabricTypeChange: (id: FabricTypeId) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] tracking-luxury uppercase text-premium-gray mb-2.5">
      {children}
    </h3>
  );
}

function SizeOption({
  selected,
  onClick,
  label,
  dimensions,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  dimensions?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full flex items-start gap-2.5 text-left px-3.5 py-3 rounded-lg border transition-all duration-300 ${
        selected
          ? "border-matte-black bg-matte-black/[0.03] shadow-sm"
          : "border-premium-border bg-white hover:border-matte-black/25"
      }`}
    >
      <span
        className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-matte-black" : "border-premium-border"
        }`}
        aria-hidden
      >
        {selected && <span className="h-2 w-2 rounded-full bg-matte-black" />}
      </span>
      <span>
        <span className="block text-sm text-matte-black">{label}</span>
        {dimensions && (
          <span className="block text-[11px] text-premium-gray mt-0.5">
            {dimensions}
          </span>
        )}
      </span>
    </button>
  );
}

function ColorSwatchOption({
  selected,
  onClick,
  label,
  swatch,
  onRequest,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  swatch: { background: string; border?: string };
  onRequest?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="flex flex-col items-center gap-1.5 group"
    >
      <span
        className={`relative flex h-[18px] w-[18px] sm:h-5 sm:w-5 md:h-6 md:w-6 items-center justify-center rounded-full transition-all duration-300 ${
          selected
            ? "ring-2 ring-matte-black ring-offset-1 ring-offset-ivory"
            : "ring-1 ring-premium-border group-hover:ring-matte-black/30"
        }`}
        style={{
          background: swatch.background,
          border: swatch.border ? `1px solid ${swatch.border}` : undefined,
        }}
      >
        {selected && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 14 14"
            fill="none"
            className={
              label.toLowerCase().includes("blanco") ||
              label.toLowerCase().includes("greige") ||
              label.toLowerCase().includes("arena")
                ? "text-matte-black"
                : "text-white"
            }
            aria-hidden
          >
            <path
              d="M2.5 7.5L5.5 10.5L11.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-[9px] text-center text-premium-gray max-w-[72px] leading-tight">
        {label}
        {onRequest && (
          <span className="block text-[9px] text-premium-gold mt-0.5">
            A pedido
          </span>
        )}
      </span>
    </button>
  );
}

export function VariantSelector({
  product,
  config,
  onChange,
  fabricType,
  onFabricTypeChange,
}: VariantSelectorProps) {
  const showStructures =
    product.structures.length > 0 && product.structures[0].id !== "estandar";
  const isMarbellaComedor =
    product.slug === "marbella" && product.comedorVariantImages;
  const marbellaStoneModels = isMarbellaComedor
    ? getAvailableStoneModels(config.sizeId)
    : [];

  const stoneGroups: { brand: StoneBrandId; models: typeof marbellaStoneModels }[] =
    [];
  if (isMarbellaComedor) {
    const brands = [...new Set(marbellaStoneModels.map((m) => m.brand))];
    for (const brand of brands) {
      stoneGroups.push({
        brand,
        models: marbellaStoneModels.filter((m) => m.brand === brand),
      });
    }
  }

  return (
    <div className="space-y-6">
      {product.fixedMeasure && product.sizes[0] && (
        <section>
          <SectionTitle>Medida</SectionTitle>
          <p className="text-sm text-matte-black tracking-wide">
            {product.sizes[0].dimensions}
          </p>
        </section>
      )}

      {product.sizes.length > 1 &&
        !product.customizableSize &&
        !product.fixedMeasure && (
        <section>
          <SectionTitle>
            {product.comedorVariantImages ? "Medida" : "Tamaño"}
          </SectionTitle>
          <div className="grid gap-2.5">
            {product.sizes.map((size) => (
              <SizeOption
                key={size.id}
                selected={config.sizeId === size.id}
                onClick={() => onChange({ sizeId: size.id })}
                label={size.label}
                dimensions={size.dimensions}
              />
            ))}
          </div>
        </section>
      )}

      {product.customizableSize && (
        <section>
          <SectionTitle>Medida personalizada</SectionTitle>
          <input
            type="text"
            placeholder="Ej: 180 × 90 cm"
            value={config.customDimensions ?? ""}
            onChange={(e) => onChange({ customDimensions: e.target.value })}
            className="w-full rounded-lg border border-premium-border px-3.5 py-3 text-sm bg-white focus:border-matte-black outline-none transition-colors duration-300"
          />
        </section>
      )}

      {showStructures && (
        <section>
          <SectionTitle>Estructura</SectionTitle>
          <div className="flex flex-wrap gap-3.5 sm:gap-4">
            {product.structures.map((s) => {
              const swatch = STRUCTURE_SWATCHES[s.id] ?? {
                background: "#D9D4CC",
              };
              return (
                <ColorSwatchOption
                  key={s.id}
                  selected={config.structureId === s.id}
                  onClick={() => onChange({ structureId: s.id })}
                  label={s.label}
                  swatch={swatch}
                  onRequest={s.onRequest}
                />
              );
            })}
          </div>
        </section>
      )}

      {product.fabrics.length > 0 && (
        <section>
          <SectionTitle>Tapizado</SectionTitle>
          <div className="flex flex-wrap gap-3.5 sm:gap-4">
            {product.fabrics.map((f) => {
              const swatch = FABRIC_SWATCHES[f.id] ?? {
                background: "#D9D4CC",
              };
              return (
                <ColorSwatchOption
                  key={f.id}
                  selected={config.fabricId === f.id}
                  onClick={() => onChange({ fabricId: f.id })}
                  label={FABRIC_DISPLAY_LABELS[f.id] ?? f.label}
                  swatch={swatch}
                />
              );
            })}
          </div>
        </section>
      )}

      {product.fabrics.length > 0 && (
        <section>
          <SectionTitle>Tipo de tela</SectionTitle>
          <div className="relative">
            <select
              value={fabricType}
              onChange={(e) =>
                onFabricTypeChange(e.target.value as FabricTypeId)
              }
              className="w-full appearance-none rounded-lg border border-premium-border bg-white px-3.5 py-3 pr-10 text-sm text-matte-black focus:border-matte-black outline-none transition-colors duration-300 cursor-pointer"
            >
              {FABRIC_TYPE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-premium-gray text-xs"
              aria-hidden
            >
              ▾
            </span>
          </div>
        </section>
      )}

      {isMarbellaComedor && marbellaStoneModels.length > 0 && (
        <section>
          <SectionTitle>Modelo de piedra</SectionTitle>
          <div className="relative">
            <select
              value={config.stoneModel ?? ""}
              onChange={(e) => onChange({ stoneModel: e.target.value })}
              className="w-full appearance-none rounded-lg border border-premium-border bg-white px-3.5 py-3 pr-10 text-sm text-matte-black focus:border-matte-black outline-none transition-colors duration-300 cursor-pointer"
            >
              <option value="" disabled>
                Seleccionar modelo
              </option>
              {stoneGroups.map((group) => (
                <optgroup
                  key={group.brand}
                  label={STONE_BRAND_LABELS[group.brand].toUpperCase()}
                >
                  {group.models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <span
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-premium-gray text-xs"
              aria-hidden
            >
              ▾
            </span>
          </div>
        </section>
      )}

      {product.stoneBrands && product.stoneBrands.length > 0 && !isMarbellaComedor && (
        <>
          <section>
            <SectionTitle>Marca de piedra</SectionTitle>
            <div className="grid gap-2.5">
              {product.stoneBrands.map((b) => (
                <SizeOption
                  key={b.id}
                  selected={config.stoneBrand === b.id}
                  onClick={() => onChange({ stoneBrand: b.id })}
                  label={b.label}
                />
              ))}
            </div>
          </section>
          <section>
            <SectionTitle>Modelo de piedra</SectionTitle>
            <input
              type="text"
              placeholder="Consultar stock"
              value={config.stoneModel ?? ""}
              onChange={(e) => onChange({ stoneModel: e.target.value })}
              className="w-full rounded-lg border border-premium-border px-3.5 py-3 text-sm bg-white focus:border-matte-black outline-none transition-colors duration-300"
            />
          </section>
        </>
      )}
    </div>
  );
}
