"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CartItemImage } from "@/components/product/CartItemImage";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/pricing";
import { cartToWhatsApp } from "@/lib/whatsapp";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    total,
  } = useCart();

  const handleQuote = () => {
    if (items.length === 0) return;
    cartToWhatsApp(items, total);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-matte-black/30 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[90] flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone/20 px-8 py-6">
              <h2 className="text-sm font-medium tracking-luxury uppercase">
                Carrito
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="text-sm text-matte-black/50 hover:text-matte-black transition-colors duration-300"
              >
                Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              {items.length === 0 ? (
                <p className="text-center text-sm text-matte-black/40 py-20">
                  Su carrito está vacío.
                </p>
              ) : (
                <ul className="space-y-8">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-sand/30">
                        <CartItemImage
                          src={item.image}
                          alt={item.productName}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-matte-black/50 mt-1 capitalize">
                          {item.category}
                        </p>
                        <ul className="mt-2 space-y-0.5">
                          {item.configSummary.map((line) => (
                            <li
                              key={line}
                              className="text-[11px] text-matte-black/45 leading-relaxed"
                            >
                              {line}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 border border-stone/30 text-xs hover:bg-sand/30 transition-colors duration-300"
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <span className="text-xs w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 border border-stone/30 text-xs hover:bg-sand/30 transition-colors duration-300"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-medium">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="mt-2 text-[11px] text-matte-black/40 hover:text-matte-black underline-offset-2 hover:underline transition-colors duration-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-stone/20 px-8 py-6 space-y-3">
                <div className="flex justify-between text-sm text-matte-black/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base font-medium">
                  <span>Total estimado</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuote}
                  className="w-full mt-4 bg-matte-black text-white py-4 text-xs tracking-luxury uppercase hover:bg-matte-black/90 transition-colors duration-500"
                >
                  Solicitar cotización
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
