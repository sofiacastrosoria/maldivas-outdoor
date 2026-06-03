"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { BrandMark } from "./BrandMark";

const menuItems = [
  { label: "About Us", href: "/" },
  {
    label: "Productos",
    href: "/productos",
    children: [
      { label: "Reposeras", href: "/productos/reposeras" },
      { label: "Juegos de Living", href: "/productos/living" },
      { label: "Comedor", href: "/productos/comedor" },
    ],
  },
  { label: "Materiales", href: "/materiales" },
  { label: "Contacto", href: "/contacto" },
  { label: "Preguntas Frecuentes", href: "/faq" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[76px] sm:h-[80px] md:h-[84px]">
        <div className="relative mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 sm:px-8 md:px-12">
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
            className="group relative z-10 flex flex-col gap-[5px] p-2 -ml-2"
          >
            <span className="block h-[1.5px] w-5 bg-matte-black transition-all duration-500 ease-luxury group-hover:w-6 group-hover:opacity-70" />
            <span className="block h-[1.5px] w-5 bg-matte-black transition-all duration-500 ease-luxury group-hover:opacity-70" />
            <span className="block h-[1.5px] w-5 bg-matte-black transition-all duration-500 ease-luxury group-hover:w-6 group-hover:opacity-70" />
          </button>

          <BrandMark />

          <button
            type="button"
            aria-label="Carrito"
            onClick={toggleCart}
            className="group relative z-10 p-2 -mr-2 text-matte-black transition-opacity duration-500 hover:opacity-50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="transition-transform duration-500 ease-luxury group-hover:scale-[1.02]"
            >
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M6 6L5 3H2" />
            </svg>
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-matte-black px-1 text-[9px] font-medium text-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[60] bg-matte-black/40 backdrop-blur-xl"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-full max-w-sm bg-matte-black/95 backdrop-blur-2xl text-white"
            >
              <div className="flex h-full flex-col px-10 py-16">
                <button
                  type="button"
                  aria-label="Cerrar menú"
                  onClick={() => setMenuOpen(false)}
                  className="self-start mb-16 text-white/60 hover:text-white text-sm tracking-wide transition-colors duration-300"
                >
                  Cerrar
                </button>
                <ul className="flex flex-col gap-1">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-3 text-2xl font-light tracking-tight hover:text-sand transition-colors duration-300"
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <ul className="ml-4 mb-4 border-l border-white/10 pl-4">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setMenuOpen(false)}
                                className="block py-2 text-sm text-white/50 hover:text-sand transition-colors duration-300"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
