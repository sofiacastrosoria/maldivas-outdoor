"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CartItemImage } from "@/components/product/CartItemImage";
import {
  CartDrawerBreakdown,
  useCartTotals,
} from "@/components/layout/CartTotalsSummary";
import { useCart } from "@/context/CartContext";
import { calculateCartItemPricing, formatPrice } from "@/lib/pricing";
import { openWhatsApp, cartToWhatsApp } from "@/lib/whatsapp";
import type { CartItem } from "@/types";

const CART_ADVISOR_MESSAGE =
  "Hola, estoy finalizando mi compra en Maldivas Outdoor y necesito asesoramiento.";

function configValue(summary: string[], keys: string[]): string | undefined {
  for (const line of summary) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (keys.some((k) => key.includes(k.toLowerCase()))) {
      return value.replace(/\s*\([^)]*\)\s*$/, "").trim() || undefined;
    }
  }
  return undefined;
}

function TrashIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const totals = useCartTotals(items);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) setDetailOpen(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleFinalize = () => {
    if (items.length === 0) return;
    cartToWhatsApp(items);
  };

  const handleAdvisor = () => {
    openWhatsApp(CART_ADVISOR_MESSAGE);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] hidden bg-matte-black/20 backdrop-blur-[2px] md:block"
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[90] flex h-[100dvh] w-full flex-col bg-white md:inset-y-0 md:left-auto md:right-0 md:max-w-md md:border-l md:border-stone/15"
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
          >
            {/* HEADER */}
            <header className="flex-shrink-0 flex items-center justify-between border-b border-stone/15 px-5 py-4 bg-white">
              <h2 className="text-[11px] font-medium tracking-[0.2em] uppercase text-matte-black">
                Carrito
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="text-xs tracking-wide text-matte-black/45 hover:text-matte-black transition-colors duration-300"
              >
                Cerrar
              </button>
            </header>

            {/* BODY: lista + espaciador + pie */}
            <div className="flex flex-1 min-h-0 flex-col bg-white">
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-5 py-2 bg-white">
                {items.length === 0 ? (
                  <p className="text-center text-sm text-matte-black/40 py-20">
                    Su carrito está vacío.
                  </p>
                ) : (
                  <ul className="divide-y divide-stone/10">
                    {items.map((item) => (
                      <CartLineItem
                        key={item.id}
                        item={item}
                        onRemove={() => removeItem(item.id)}
                        onDecrease={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        onIncrease={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      />
                    ))}
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <footer className="flex-shrink-0 mt-auto border-t border-stone/15 bg-white px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                  <div className="mb-4">
                    <p className="text-[9px] tracking-[0.22em] uppercase text-premium-gray">
                      Total efectivo
                    </p>
                    <p className="text-xl font-light text-matte-black tracking-tight tabular-nums mt-0.5">
                      {formatPrice(totals.cash)}
                    </p>
                    <p className="text-[9px] tracking-wide text-matte-black/45 mt-1">
                      30% OFF
                    </p>
                    <button
                      type="button"
                      onClick={() => setDetailOpen(true)}
                      className="mt-3 text-[10px] tracking-[0.2em] uppercase text-matte-black/55 hover:text-matte-black transition-colors duration-300"
                    >
                      Resumen de compra ▼
                    </button>
                  </div>

                  <CartActionButtons
                    onFinalize={handleFinalize}
                    onAdvisor={handleAdvisor}
                  />
                </footer>
              )}
            </div>

            {/* Drawer inferior — solo desglose */}
            <AnimatePresence>
              {detailOpen && items.length > 0 && (
                <>
                  <motion.button
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    aria-label="Cerrar resumen"
                    className="absolute inset-0 z-[15] bg-white/70 backdrop-blur-md"
                    onClick={() => setDetailOpen(false)}
                  />
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{
                      type: "tween",
                      duration: 0.38,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-2xl border-t border-stone/15 shadow-[0_-16px_48px_rgba(26,26,26,0.1)] px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
                    role="dialog"
                    aria-label="Resumen de compra"
                  >
                    <div className="mx-auto mb-3 h-0.5 w-10 rounded-full bg-stone/25" />
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-[10px] tracking-[0.2em] uppercase text-matte-black/55">
                        Resumen de compra
                      </h3>
                      <button
                        type="button"
                        onClick={() => setDetailOpen(false)}
                        className="text-xs text-matte-black/40 hover:text-matte-black transition-colors"
                        aria-label="Cerrar"
                      >
                        ✕
                      </button>
                    </div>
                    <CartDrawerBreakdown totals={totals} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CartActionButtons({
  onFinalize,
  onAdvisor,
}: {
  onFinalize: () => void;
  onAdvisor: () => void;
}) {
  return (
    <div className="space-y-2.5">
      <button
        type="button"
        onClick={onAdvisor}
        className="w-full border border-matte-black/20 bg-white py-3.5 text-[10px] tracking-[0.18em] uppercase text-matte-black hover:bg-matte-black/[0.02] transition-all duration-500"
      >
        Hablar con un Asesor
      </button>
      <button
        type="button"
        onClick={onFinalize}
        className="w-full bg-matte-black text-white py-3.5 text-[10px] tracking-[0.18em] uppercase hover:bg-matte-black/90 transition-colors duration-500"
      >
        Finalizar Pedido
      </button>
    </div>
  );
}

function CartLineItem({
  item,
  onRemove,
  onDecrease,
  onIncrease,
}: {
  item: CartItem;
  onRemove: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const size = configValue(item.configSummary, ["tamaño", "tamano", "medida"]);
  const structure = configValue(item.configSummary, ["estructura"]);
  const lineList = calculateCartItemPricing(item.unitPrice, item.quantity)
    .lineList;

  return (
    <li className="py-4">
      <div className="flex gap-4 items-start">
        <div className="relative h-[72px] w-[60px] flex-shrink-0 overflow-hidden bg-white border border-stone/10 rounded-sm">
          <CartItemImage src={item.image} alt={item.productName} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-3 items-start">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium tracking-tight text-matte-black leading-snug">
                {item.productName}
              </p>
              {size && (
                <p className="text-[11px] text-matte-black/50 leading-tight capitalize">
                  {size}
                </p>
              )}
              {structure && (
                <p className="text-[11px] text-matte-black/50 leading-tight">
                  {structure}
                </p>
              )}
            </div>
            <div className="text-right flex-shrink-0 pl-1">
              <p className="text-[9px] tracking-[0.16em] uppercase text-premium-gray">
                Lista
              </p>
              <p className="text-sm font-light text-matte-black/80 mt-0.5 tabular-nums">
                {formatPrice(lineList)}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onDecrease}
              className="w-8 h-8 flex items-center justify-center border border-stone/25 text-sm text-matte-black/70 hover:border-matte-black/30 transition-colors duration-300 disabled:opacity-35"
              disabled={item.quantity <= 1}
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="text-sm w-5 text-center tabular-nums text-matte-black">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="w-8 h-8 flex items-center justify-center border border-stone/25 text-sm text-matte-black/70 hover:border-matte-black/30 transition-colors duration-300"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="ml-auto w-8 h-8 flex items-center justify-center text-matte-black/35 hover:text-matte-black transition-colors duration-300"
              aria-label="Eliminar producto"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
