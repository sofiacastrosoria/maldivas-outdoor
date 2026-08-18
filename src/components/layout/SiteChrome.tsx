"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { MaldivasAssistant } from "@/components/layout/MaldivasAssistant";
import { SplashScreen } from "@/components/layout/SplashScreen";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <SplashScreen />
      <Header />
      <CartDrawer />
      <main>{children}</main>
      <GlobalFooter />
      <MaldivasAssistant />
    </CartProvider>
  );
}
