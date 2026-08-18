import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { StoreProvider } from "@/context/StoreProvider";
import { setRuntimeCatalog } from "@/lib/catalog/runtime";
import { setRuntimeAvailability } from "@/lib/catalog/availability";
import { setRuntimeDiscounts } from "@/lib/discounts/runtime";
import { loadServerPriceCatalog } from "@/lib/prices/loadServer";
import { getCachedCatalogBundle, getCachedDiscountBundle } from "@/lib/store/loadServer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maldivas Outdoor | Lujo silencioso. Diseño atemporal.",
    template: "%s | Maldivas Outdoor",
  },
  description:
    "Muebles de exterior premium inspirados en hoteles boutique y arquitectura contemporánea. Córdoba, Argentina.",
  keywords: [
    "muebles outdoor",
    "reposeras premium",
    "living exterior",
    "Maldivas Outdoor",
    "Córdoba",
  ],
  openGraph: {
    title: "Maldivas Outdoor",
    description: "Lujo silencioso. Diseño atemporal.",
    locale: "es_AR",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [priceCatalog, discounts, catalog] = await Promise.all([
    loadServerPriceCatalog(),
    getCachedDiscountBundle(),
    getCachedCatalogBundle(),
  ]);
  setRuntimeDiscounts(discounts.global, discounts.overrides);
  setRuntimeCatalog(catalog.statuses, catalog.customs);
  setRuntimeAvailability(catalog.availability);

  return (
    <html lang="es" className={inter.variable}>
      <body>
        <StoreProvider prices={priceCatalog} discounts={discounts} catalog={catalog}>
          <SiteChrome>{children}</SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
