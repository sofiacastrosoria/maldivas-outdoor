import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { MaldivasAssistant } from "@/components/layout/MaldivasAssistant";
import { SplashScreen } from "@/components/layout/SplashScreen";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <CartProvider>
          <SplashScreen />
          <Header />
          <CartDrawer />
          <main>{children}</main>
          <GlobalFooter />
          <MaldivasAssistant />
        </CartProvider>
      </body>
    </html>
  );
}
