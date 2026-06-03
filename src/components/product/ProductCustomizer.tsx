"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, ProductConfig } from "@/types";
import { calculatePrice, formatPrice, buildConfigSummary } from "@/lib/pricing";
import { defaultProductConfig, dynamicImageResolver } from "@/lib/images";
import { useCart } from "@/context/CartContext";
import { DynamicProductImage } from "./DynamicProductImage";

interface ProductCustomizerProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  mode: "customize" | "cart";
  initialConfig?: ProductConfig;
  onConfigChange?: (config: ProductConfig) => void;
}

export function ProductCustomizer({
  product,
  isOpen,
  onClose,
  mode,
  initialConfig,
  onConfigChange,
}: ProductCustomizerProps) {
  const [config, setConfig] = useState<ProductConfig>(() =>
    initialConfig ?? defaultProductConfig(product)
  );
  const { addItem } = useCart();

  useEffect(() => {
    if (isOpen && initialConfig) {
      setConfig(initialConfig);
    }
  }, [isOpen, initialConfig]);

  const price = useMemo(() => calculatePrice(product, config), [product, config]);
  const summary = useMemo(
    () => buildConfigSummary(product, config),
    [product, config]
  );

  const update = (patch: Partial<ProductConfig>) => {
    setConfig((c) => {
      const next = { ...c, ...patch };
      onConfigChange?.(next);
      return next;
    });
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      category: product.category,
      slug: product.slug,
      image: dynamicImageResolver(product, config),
      config,
      configSummary: summary,
      unitPrice: price,
    });
    onClose();
  };

  const OptionButton = ({
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
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 border transition-all duration-300 ${
        selected
          ? "border-matte-black bg-matte-black text-white"
          : "border-stone/25 hover:border-matte-black/40"
      }`}
    >
      <span className="text-sm block">{label}</span>
      {sublabel && (
        <span
          className={`text-xs mt-0.5 block ${
            selected ? "text-white/60" : "text-matte-black/45"
          }`}
        >
          {sublabel}
        </span>
      )}
      {onRequest && (
        <span
          className={`text-[10px] mt-1 block tracking-wide uppercase ${
            selected ? "text-sand" : "text-matte-black/35"
          }`}
        >
          A pedido
        </span>
      )}
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-matte-black/50 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-4 top-[8%] bottom-[8%] z-[110] mx-auto max-w-4xl overflow-hidden bg-white shadow-2xl md:inset-x-auto md:w-full"
          >
            <div className="flex h-full flex-col md:flex-row">
              <div className="relative h-52 md:h-auto md:w-1/2 flex-shrink-0 overflow-hidden bg-sand/10">
                <DynamicProductImage
                  product={product}
                  config={config}
                  alt={product.name}
                  priority
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black/15 to-transparent md:bg-gradient-to-r pointer-events-none" />
              </div>

              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-start justify-between px-6 md:px-8 pt-6 pb-4 border-b border-stone/15">
                  <div>
                    <p className="text-[10px] tracking-luxury uppercase text-matte-black/40">
                      {mode === "customize" ? "Personalizar" : "Configurar"}
                    </p>
                    <h3 className="text-xl font-light mt-1">{product.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-sm text-matte-black/40 hover:text-matte-black"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-8">
                  {product.sizes.length > 0 && !product.customizableSize && (
                    <section>
                      <h4 className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
                        Tamaño
                      </h4>
                      <div className="grid gap-2">
                        {product.sizes.map((size) => (
                          <OptionButton
                            key={size.id}
                            selected={config.sizeId === size.id}
                            onClick={() => update({ sizeId: size.id })}
                            label={size.label}
                            sublabel={size.dimensions}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {product.customizableSize && (
                    <section>
                      <h4 className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
                        Medida personalizada
                      </h4>
                      <input
                        type="text"
                        placeholder="Ej: 180 × 90 cm"
                        value={config.customDimensions ?? ""}
                        onChange={(e) =>
                          update({ customDimensions: e.target.value })
                        }
                        className="w-full border border-stone/25 px-4 py-3 text-sm focus:border-matte-black outline-none transition-colors"
                      />
                    </section>
                  )}

                  {product.structures.length > 0 &&
                    product.structures[0].id !== "estandar" && (
                      <section>
                        <h4 className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
                          Estructura
                        </h4>
                        <div className="grid gap-2">
                          {product.structures.map((s) => (
                            <OptionButton
                              key={s.id}
                              selected={config.structureId === s.id}
                              onClick={() => update({ structureId: s.id })}
                              label={s.label}
                              onRequest={s.onRequest}
                            />
                          ))}
                        </div>
                      </section>
                    )}

                  {product.fabrics.length > 0 && (
                    <section>
                      <h4 className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
                        Tapizado
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.fabrics.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => update({ fabricId: f.id })}
                            className={`px-4 py-2 text-xs border transition-all duration-300 ${
                              config.fabricId === f.id
                                ? "border-matte-black bg-matte-black text-white"
                                : "border-stone/25 hover:border-matte-black/40"
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  {product.stoneBrands && product.stoneBrands.length > 0 && (
                    <>
                      <section>
                        <h4 className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
                          Marca de piedra
                        </h4>
                        <div className="grid gap-2">
                          {product.stoneBrands.map((b) => (
                            <OptionButton
                              key={b.id}
                              selected={config.stoneBrand === b.id}
                              onClick={() => update({ stoneBrand: b.id })}
                              label={b.label}
                            />
                          ))}
                        </div>
                      </section>
                      <section>
                        <h4 className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
                          Modelo de piedra
                        </h4>
                        <input
                          type="text"
                          placeholder="Consultar stock"
                          value={config.stoneModel ?? ""}
                          onChange={(e) =>
                            update({ stoneModel: e.target.value })
                          }
                          className="w-full border border-stone/25 px-4 py-3 text-sm focus:border-matte-black outline-none"
                        />
                      </section>
                    </>
                  )}
                </div>

                <div className="border-t border-stone/15 px-6 md:px-8 py-6 bg-white">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-[10px] tracking-luxury uppercase text-matte-black/40">
                        Precio configurado
                      </p>
                      <p className="text-2xl font-light mt-1">{formatPrice(price)}</p>
                    </div>
                  </div>
                  {summary.length > 0 && (
                    <ul className="mb-4 space-y-1">
                      {summary.map((line) => (
                        <li
                          key={line}
                          className="text-[11px] text-matte-black/45"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full bg-matte-black text-white py-4 text-xs tracking-luxury uppercase hover:bg-matte-black/90 transition-colors"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
