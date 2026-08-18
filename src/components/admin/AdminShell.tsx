"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Precios" },
  { href: "/admin/descuentos", label: "Descuentos" },
  { href: "/admin/productos", label: "Productos" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-matte-black">
      <header className="sticky top-0 z-40 border-b border-stone/20 bg-[#F8F6F2]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
              className="group flex flex-col gap-[5px] p-2 -ml-2"
            >
              <span className="block h-[1.5px] w-5 bg-matte-black transition-all duration-300 group-hover:w-6" />
              <span className="block h-[1.5px] w-5 bg-matte-black" />
              <span className="block h-[1.5px] w-5 bg-matte-black transition-all duration-300 group-hover:w-6" />
            </button>
            <p className="text-[10px] tracking-[0.25em] uppercase text-matte-black/45">
              Administración
            </p>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-lg bg-matte-black px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white"
          >
            Salir
          </button>
        </div>
      </header>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50 bg-matte-black/30"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-white px-6 py-8 shadow-xl">
            <p className="text-[10px] tracking-[0.25em] uppercase text-matte-black/40">
              Maldivas Outdoor
            </p>
            <nav className="mt-10 flex flex-col gap-1">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-3 text-sm tracking-wide transition-colors ${
                      active
                        ? "bg-matte-black text-white"
                        : "text-matte-black/70 hover:bg-sand/40 hover:text-matte-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      ) : null}

      {children}
    </div>
  );
}
