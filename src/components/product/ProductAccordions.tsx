"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

function AccordionPanel({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-premium-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-sm tracking-wide text-matte-black hover:text-premium-gray transition-colors"
      >
        <span>{title}</span>
        <span
          className={`text-lg font-light text-premium-gray transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-premium-gray">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductAccordions({ product }: { product: Product }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const dimensions = product.sizes
    .map((s) => `${s.label}: ${s.dimensions}`)
    .join(" · ");

  const items: AccordionItem[] = [
    {
      id: "desc",
      title: "Descripción",
      content: product.description,
    },
    {
      id: "materials",
      title: "Materiales",
      content: (
        <>
          Aluminio Aluar con terminaciones premium. Textiles acrílicos importados
          (Sunbrella, Agora, Bliss). Goma espuma Piero Soft de alta densidad.
        </>
      ),
    },
    {
      id: "dims",
      title: "Medidas",
      content: dimensions || "Consultar medidas disponibles.",
    },
    {
      id: "shipping",
      title: "Envíos y tiempos",
      content:
        "Envíos a todo el país. Los tiempos de fabricación varían según configuración y volumen del pedido. Consultanos para una estimación precisa.",
    },
    {
      id: "warranty",
      title: "Garantía",
      content:
        "Garantía de 3 años en estructura y terminaciones bajo uso residencial normal en exteriores.",
    },
  ];

  return (
    <div className="mt-6 border-t border-premium-border">
      {items.map((item) => (
        <AccordionPanel
          key={item.id}
          title={item.title}
          open={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        >
          {item.content}
        </AccordionPanel>
      ))}
    </div>
  );
}
