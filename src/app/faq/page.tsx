"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";

const placeholders = [
  {
    id: "1",
    question: "¿Cuáles son los tiempos de entrega?",
    answer: "",
  },
  {
    id: "2",
    question: "¿Ofrecen garantía en los productos?",
    answer: "",
  },
  {
    id: "3",
    question: "¿Puedo visitar el showroom?",
    answer: "",
  },
  {
    id: "4",
    question: "¿Realizan envíos al interior del país?",
    answer: "",
  },
  {
    id: "5",
    question: "¿Cómo funciona la personalización?",
    answer: "",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-3xl mx-auto">
      <FadeIn className="text-center mb-20">
        <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-4">
          Preguntas Frecuentes
        </p>
        <h1 className="text-4xl md:text-6xl font-extralight tracking-tight">
          FAQ
        </h1>
        <p className="text-sm text-matte-black/45 mt-6">
          Sección preparada para contenido futuro.
        </p>
      </FadeIn>

      <div className="divide-y divide-stone/20 border-t border-b border-stone/20">
        {placeholders.map((item) => (
          <div key={item.id}>
            <button
              type="button"
              onClick={() =>
                setOpenId(openId === item.id ? null : item.id)
              }
              className="w-full flex items-center justify-between py-6 text-left group"
            >
              <span className="text-sm md:text-base font-light pr-8 group-hover:opacity-60 transition-opacity">
                {item.question}
              </span>
              <span className="text-matte-black/30 text-xl flex-shrink-0">
                {openId === item.id ? "−" : "+"}
              </span>
            </button>
            <AnimatePresence>
              {openId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-sm text-matte-black/40 italic">
                    {item.answer || "Contenido próximamente."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
